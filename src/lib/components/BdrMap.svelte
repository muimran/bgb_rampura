<script>
  import { onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import Papa from 'papaparse';
  import scrollama from 'scrollama';
  import * as turf from '@turf/turf';
  import { base } from '$app/paths';
  import GifOverlay from '$lib/components/GifOverlay.svelte';

  let map;
  let mapContainer;
  let resetTrigger;
  let observer;

  let allMarkerData = [];
  let activeMarkers = new Map();
  let activeIndex = -1;
  let scroller;
  let scrollySteps = []; // This will be populated by our new processing function
  let hasLineAnimationStarted = false;

  let gifOverlayState = {
    isActive: false,
    lngLat: null,
    gifSrc: '',
    anchorOffset: { x: 0, y: 0 }
  };

  const POLYGON_SOURCE_ID = 'step-polygon-source';
  const POLYGON_LAYER_ID = 'step-polygon-layer';
  const DELTA_SOURCE_ID = 'delta-source';
  const DELTA_LAYER_ID = 'delta-layer';
  const LABEL_SOURCE_ID = 'extra-label-source';
  const LABEL_LAYER_ID = 'extra-label-layer';

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtZHoxMjZvOTA1czkybXF2ZWJ6Y3A1bXAifQ.uTA76-51yxqOn9qlM0KQ1Q';

  // --- HELPER FUNCTIONS ---

  function getBounds(geojson) {
    const b = new mapboxgl.LngLatBounds();
    function proc(c) {
      if (typeof c[0] === 'number') b.extend(c);
      else c.forEach(proc);
    }
    proc(geojson.features?.[0]?.geometry?.coordinates || []);
    return b;
  }

  function animateLine() {
    return new Promise(resolve => {
      let idx = 1;
      const iv = setInterval(() => {
        if (idx > allCoordinates.length) {
          clearInterval(iv);
          resolve();
        } else if (map && map.getSource('route')) {
          map.getSource('route').setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: allCoordinates.slice(0, idx) }
          });
        }
        idx++;
      }, 70);
    });
  }

  // ======================== START OF CHANGE: NEW HELPER FUNCTION ========================
  /**
   * Intelligently adds, updates, or removes a GeoJSON layer to avoid flickering.
   * @param {string} sourceId - The ID for the Mapbox source.
   * @param {string} layerId - The ID for the Mapbox layer.
   * @param {string|null} geojsonPath - The path to the GeoJSON file to display, or null to remove the layer.
   * @param {object} paintOptions - The `paint` properties for the layer.
   * @param {object|null} labelInfo - Optional info to add a text label at the centroid.
   */
  async function updateGeoJSONLayer(sourceId, layerId, geojsonPath, paintOptions, labelInfo = null) {
    const source = map.getSource(sourceId);

    if (geojsonPath) {
      // A polygon should be visible for this step.
      const geojsonData = await fetch(geojsonPath).then(r => r.json());
      
      if (source) {
        // Source already exists, just update its data. This is the key to preventing flicker.
        source.setData(geojsonData);
      } else {
        // Source doesn't exist, so we need to add it and the layer for the first time.
        map.addSource(sourceId, { type: 'geojson', data: geojsonData });
        map.addLayer({ id: layerId, type: 'fill', source: sourceId, paint: paintOptions });
      }

      // Handle the associated label if it exists
      if (labelInfo) {
        updateGeoJSONLayer(LABEL_SOURCE_ID, LABEL_LAYER_ID, null); // Clear previous label first
        const centroid = turf.centroid(geojsonData);
        centroid.properties.labelText = labelInfo.text;
        map.addSource(LABEL_SOURCE_ID, { type: 'geojson', data: centroid });
        map.addLayer({
            id: LABEL_LAYER_ID,
            type: 'symbol',
            source: LABEL_SOURCE_ID,
            layout: { 'text-field': ['get','labelText'], 'text-size': 14, 'text-font': ['Open Sans Bold','Arial Unicode MS Bold'], 'text-allow-overlap': true, 'text-ignore-placement': true },
            paint: { 'text-color':'#ffffff', 'text-halo-color':'#000000', 'text-halo-width':1 }
        });
      }

    } else {
      // No polygon should be visible. If one exists, remove it.
      if (source) {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        map.removeSource(sourceId);
        // Also remove any associated label layer
        if (labelInfo && map.getLayer(LABEL_LAYER_ID)) {
            map.removeLayer(LABEL_LAYER_ID);
            if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);
        }
      }
    }
  }
  // ======================== END OF CHANGE: NEW HELPER FUNCTION ========================

  // --- MAP AND SCROLL LOGIC ---

  function resetMapToInitialState() {
    if (!map || !map.isStyleLoaded() || allMarkerData.length === 0) return;

    const overallBounds = allMarkerData.reduce(
      (b, m) => b.extend([m.lon, m.lat]),
      new mapboxgl.LngLatBounds()
    );

    map.fitBounds(overallBounds, {
      padding: 50,
      duration: 1000 
    });

    // Clear all transient markers and overlays
    activeMarkers.forEach(m => m.remove());
    activeMarkers.clear();
    gifOverlayState = { ...gifOverlayState, isActive: false };
    
    // Use our new helper to cleanly remove any existing polygons
    updateGeoJSONLayer(POLYGON_SOURCE_ID, POLYGON_LAYER_ID, null);
    updateGeoJSONLayer(DELTA_SOURCE_ID, DELTA_LAYER_ID, null, null, { removeLabel: true });


    // Reset animated line
    if (map.getSource('route')) {
      map.getSource('route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
    }
    hasLineAnimationStarted = false;
  }

  // ======================== START OF CHANGE: REFACTORED handleStepEnter ========================
  async function handleStepEnter({ index }) {
    if (index < 0 || index >= scrollySteps.length || !map.isStyleLoaded()) return;

    activeIndex = index;
    const step = scrollySteps[index];

    // 1. EXECUTE CAMERA ACTION
    if (step.camera) {
      if (step.camera.type === 'flyTo') {
        map.flyTo(step.camera.options);
      } else if (step.camera.type === 'fitBounds') {
        const bounds = mapboxgl.LngLatBounds.convert(step.camera.bounds);
        map.fitBounds(bounds, step.camera.options);
      }
    }

    // 2. CLEAR PREVIOUS TRANSIENT STATE (Markers and GIFs)
    activeMarkers.forEach(marker => marker.remove());
    activeMarkers.clear();
    gifOverlayState = { ...gifOverlayState, isActive: false };
    // NOTE: We no longer remove polygon layers here. The new helper function handles it.

    // 3. DETERMINE THE STATE OF POLYGONS FOR THIS STEP
    
    // --- Main Polygon Logic ---
    let mainPolygonPath = null;
    if (step.geojson_path) {
        mainPolygonPath = step.geojson_path;
    }
    // Handle cases where a polygon should persist from a previous step
    if (index === 1 && scrollySteps[0]?.geojson_path) {
        mainPolygonPath = scrollySteps[0].geojson_path;
    } else if (index === 7 && scrollySteps[6]?.geojson_path) {
        mainPolygonPath = scrollySteps[6].geojson_path;
    }

    // --- Extra Polygon (Delta/Agrani) Logic ---
    let extraPolygonPath = null;
    let extraPolygonLabel = null;
    const stepForExtraPolygon = (index === 5) ? scrollySteps[4] : step;
    if (stepForExtraPolygon?.extra_geojson_path) {
        extraPolygonPath = stepForExtraPolygon.extra_geojson_path;
        extraPolygonLabel = stepForExtraPolygon.extra_geojson_label;
    }

    // 4. UPDATE MAP LAYERS USING THE HELPER
    await Promise.all([
      updateGeoJSONLayer(POLYGON_SOURCE_ID, POLYGON_LAYER_ID, mainPolygonPath, { 'fill-color':'#ff0000', 'fill-opacity':0.7 }),
      updateGeoJSONLayer(DELTA_SOURCE_ID, DELTA_LAYER_ID, extraPolygonPath, { 'fill-color':'#000000', 'fill-opacity':0.7 }, extraPolygonLabel ? { text: extraPolygonLabel } : null)
    ]);


    // 5. ADD VISUALS FOR CURRENT STEP (Markers, GIFs etc.)

    // Special GIF case for step index 1 (sl=2)
    if (index === 1) {
      const m = allMarkerData.find(m => m.sl === 2);
      if (m) {
        gifOverlayState = { isActive: true, lngLat: [m.lon, m.lat], gifSrc: `${base}/images/2.gif`, anchorOffset: { x: 0, y: -13 } };
      }
    }
    
    // Show all markers on final step
    if (step.show_all_markers) {
      allMarkerData.forEach(m => {
        const el = document.createElement('div');
        const squareSLs = [4,6,8,9,10,11];
        el.className = squareSLs.includes(m.sl) ? 'square-marker' : 'circle-marker';
        const popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false }).setHTML(`<strong>${m.popupText}</strong>`);
        const marker = new mapboxgl.Marker({ element: el, anchor: squareSLs.includes(m.sl) ? 'center' : 'bottom' })
          .setLngLat([m.lon, m.lat])
          .setPopup(popup)
          .addTo(map);
        activeMarkers.set(m.sl, marker);
      });
    }

    // Add individual markers for specific steps
    const markerSLsToAdd = [];
    if (step.marker_sl && !step.show_all_markers) {
        markerSLsToAdd.push(step.marker_sl);
    }
    if (index === 5) markerSLsToAdd.push(5);
    if (index === 11) markerSLsToAdd.push(11);

    for (const sl of markerSLsToAdd) {
        const mData = allMarkerData.find(m => m.sl === sl);
        if (mData) {
            if (index === 10 && sl === 11 && !hasLineAnimationStarted) {
                hasLineAnimationStarted = true;
                await animateLine();
            }
            const squareSLs = [4,6,8,9,10,11];
            const el = document.createElement('div');
            el.className = squareSLs.includes(mData.sl) ? 'square-marker' : 'circle-marker';
            const mk = new mapboxgl.Marker({ element: el, anchor: squareSLs.includes(mData.sl) ? 'center' : 'bottom' })
              .setLngLat([mData.lon, mData.lat])
              .setPopup(new mapboxgl.Popup({ offset: 25, closeOnClick: false }).setHTML(`<strong>${mData.popupText}</strong>`))
              .addTo(map);
            activeMarkers.set(mData.sl, mk);
        }
    }
  }
  // ======================== END OF CHANGE: REFACTORED handleStepEnter ========================


  // --- INITIALIZATION LOGIC ---

  function setupScrollama() {
    setTimeout(() => {
      scroller = scrollama()
        .setup({ step: '.scrolly-step', offset: 0.9, debug: false })
        .onStepEnter(handleStepEnter);
      
      window.addEventListener('resize', scroller.resize);
      
      onDestroy(() => {
        window.removeEventListener('resize', scroller.resize);
        if (scroller) scroller.destroy();
      });
    }, 100);
  }

  async function initMap() {
    const initialBounds = allMarkerData.reduce(
        (b, m) => b.extend([m.lon, m.lat]),
        new mapboxgl.LngLatBounds()
    );

    map = new mapboxgl.Map({ 
      container: mapContainer, 
      style: 'mapbox://styles/imrandata/cmdott4fc001e01sgeux191ty', 
      bounds: initialBounds,
      fitBoundsOptions: { padding: 50, duration: 0 }
    });
    
    map.on('load', () => {
      map.addSource('route', { type: 'geojson', data: { type:'Feature', geometry:{ type:'LineString', coordinates:[] } } });
      map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap':'round','line-join':'round' }, paint: { 'line-color':'#ff0000','line-width':4 } });
      
      setupScrollama();
      observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && activeIndex !== -1) {
            resetMapToInitialState();
            activeIndex = -1;
          }
        });
      }, { root:null, rootMargin:'0px', threshold:0.1 });
      if (resetTrigger) observer.observe(resetTrigger);
    });
  }

  async function buildAndProcessSteps() {
    const res = await fetch(`${base}/bgb.csv`);
    const txt = await res.text();
    
    const parsed = await new Promise(resolve => {
      Papa.parse(txt, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => {
          resolve(data
            .map(r => ({
              sl: parseInt(r.sl, 10), lat: parseFloat(r.lat), lon: parseFloat(r.lon),
              popupText: r.identifier || 'No identifier provided',
              stepTitle: r.identifier || `Incident #${r.sl}`,
              stepText: r.textbox || 'No details provided for this incident.'
            }))
            .filter(d => !isNaN(d.sl) && !isNaN(d.lat) && !isNaN(d.lon))
            .sort((a,b) => a.sl - b.sl)
          );
        }
      });
    });

    allMarkerData = parsed.map(({ sl, lat, lon, popupText }) => ({ sl, lat, lon, popupText }));

    let tempSteps = parsed.map(row => {
      if (row.sl === 1) return { id:`step-${row.sl}-polygon`, title:row.stepTitle, text:row.stepText, geojson_path:`${base}/ramjan.geojson` };
      if (row.sl === 7) return { id:`step-${row.sl}-polygon-7`, title:row.stepTitle, text:row.stepText, geojson_path:`${base}/step7.geojson` };
      if (row.sl === 13) return { id:`step-${row.sl}-polygon-14`, title:row.stepTitle, text:row.stepText, geojson_path:`${base}/step14.geojson` };
      if (row.sl === 3) return { id:row.sl, title:row.stepTitle, text:row.stepText, marker_sl:row.sl, extra_geojson_path:`${base}/delta.geojson`, extra_geojson_label:'Delta Hospital' };
      if (row.sl === 4) return { id:row.sl, title:row.stepTitle, text:row.stepText, marker_sl:row.sl, extra_geojson_path:`${base}/agrani.geojson`, extra_geojson_label:'Agrani Bank' };
      if ([5,6].includes(row.sl)) return { id:row.sl, title:row.stepTitle, text:row.stepText, marker_sl:row.sl, extra_geojson_path:`${base}/delta.geojson`, extra_geojson_label:'Delta Hospital' };
      return { id:row.sl, title:row.stepTitle, text:row.stepText, marker_sl:row.sl };
    });
    tempSteps.push({ id: 'final-step-all-markers', title: 'All Incidents', text: 'This map shows all the reported incidents along the route.', show_all_markers: true });

    const geojsonCache = new Map();
    const geojsonFetches = tempSteps
        .filter(s => s.geojson_path && !geojsonCache.has(s.geojson_path))
        .map(s => fetch(s.geojson_path).then(r => r.json()).then(data => geojsonCache.set(s.geojson_path, data)));
    await Promise.all(geojsonFetches);
    
    let lastCamera = {
      type: 'flyTo',
      options: { center: allCoordinates[0], zoom: 14, pitch: 0, bearing: 0, speed: 1.5, essential: true }
    };

    scrollySteps = tempSteps.map((step, i) => {
      if (step.show_all_markers) {
        const bounds = allMarkerData.reduce((b, m) => b.extend([m.lon, m.lat]), new mapboxgl.LngLatBounds());
        lastCamera = { type: 'fitBounds', bounds: bounds.toArray(), options: { padding: 80, speed: 0.8, maxZoom: 15 } };
      } else if (step.geojson_path && ![1,5,7,10,11].includes(i)) {
        const data = geojsonCache.get(step.geojson_path);
        const bounds = getBounds(data);
        lastCamera = { type: 'fitBounds', bounds: bounds.toArray(), options: { padding: 120, speed: 0.8, maxZoom: 17 } };
      } else if (step.marker_sl) {
        const mData = allMarkerData.find(m => m.sl === step.marker_sl);
        if (mData) {
          if (i === 9) { 
            const nextStep = tempSteps[10];
            const t = allMarkerData.find(m => m.sl === nextStep.marker_sl);
            if (t) {
              lastCamera = { type: 'flyTo', options: { center: [t.lon + 0.0005, t.lat], zoom: 16, speed:0.5, essential:true } };
            }
          } else if (![1,5,7,10,11].includes(i)) {
            lastCamera = { type: 'flyTo', options: { center: [mData.lon, mData.lat], zoom: 16.5, speed:0.5, essential:true } };
          }
        }
      }
      return { ...step, camera: lastCamera };
    });
  }

  onMount(async () => {
    await buildAndProcessSteps();
    initMap();
  });

  onDestroy(() => {
    activeMarkers.forEach(m => m.remove());
    if (map) map.remove();
    if (observer) observer.disconnect();
  });

  const allCoordinates = [
    [90.43858851470035, 23.76241668791048], [90.43858590851148, 23.762373386440002], [90.43858330232262, 23.76233008496951],
    [90.43858069613375, 23.76228678349902], [90.43857808994488, 23.76224348202853], [90.43857548375601, 23.76220018055804],
    [90.43857287756714, 23.76215687908755], [90.43857027137827, 23.76211357761706], [90.4385676651894, 23.76207027614657],
    [90.43856505900054, 23.76202697467608]
  ];

</script>

<style>
  /* Your existing styles remain unchanged */
  @import 'mapbox-gl/dist/mapbox-gl.css';

  .scrolly-container { position: relative; width: 100%; display: flex; flex-direction: column; margin: 0 auto; }
  .graphic-container { position: sticky; top: 0; height: 100vh; width: 100%; z-index: 0; }
  #map { width: 100%; height: 100%; }
  .scrolly-steps { position: relative; z-index:1; margin-top:-100vh; padding-top:100vh; }
  .scrolly-step { margin:0 auto 80vh auto; padding:2rem; background:rgba(255,255,255,0.85); box-shadow:0 4px 20px rgba(0,0,0,0.05); opacity:0.4; transform:translateY(10px); transition:all 0.3s ease; max-width:600px; border-radius:8px; }
  .scrolly-step.active { opacity:1; transform:translateY(0); }
  .reset-trigger-element { height:1px; width:100%; position:absolute; top:0; left:0; pointer-events:none; }
  
  .scrolly-step h3 {
    text-align: center;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  :global(.mapboxgl-popup-content) {
    padding: 10px 15px;
    font-family: sans-serif;
    font-size: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-radius: 4px;
  }
  
  :global(.circle-marker) { background-image:url('/custom-marker.png'); width:26px; height:26px; background-size:contain; background-repeat:no-repeat; cursor:pointer; }
  :global(.square-marker) { width:17px; height:17px; background-color:#ff0000; border:1px solid #ffffff; cursor:pointer; }

  .gradient-top,
  .gradient-bottom {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 5; 
    pointer-events: none; 
  }

  .gradient-top {
    top: 0;
    height: 7%;
    background: linear-gradient(to bottom, white 0%, transparent 100%);
  }

  .gradient-bottom {
    bottom: 0;
    height: 7%;
    background: linear-gradient(to top, white 0%, transparent 100%);
  }

</style>

<div class="scrolly-container">
  <div class="graphic-container">
    <div class="gradient-top"></div>
    <div class="gradient-bottom"></div>
    <div bind:this={mapContainer} id="map"></div>
    <GifOverlay map={map} isActive={gifOverlayState.isActive} lngLat={gifOverlayState.lngLat} gifSrc={gifOverlayState.gifSrc} anchorOffset={gifOverlayState.anchorOffset} />
  </div>
  <div class="scrolly-steps">
    <div bind:this={resetTrigger} class="reset-trigger-element"></div>
    {#each scrollySteps as step, i (step.id)}
      <div class="scrolly-step" class:active={activeIndex === i}>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
    {/each}
  </div>
</div>