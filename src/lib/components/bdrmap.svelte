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

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';

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

  // --- MAP AND SCROLL LOGIC ---

  function resetMapToInitialState() {
    if (!map || !map.isStyleLoaded() || scrollySteps.length === 0) return;

    // Use the camera defined for the very first step
    const initialCamera = scrollySteps[0]?.camera;
    if (initialCamera) {
      if (initialCamera.type === 'flyTo') {
        map.flyTo(initialCamera.options);
      } else if (initialCamera.type === 'fitBounds') {
        map.fitBounds(mapboxgl.LngLatBounds.convert(initialCamera.bounds), initialCamera.options);
      }
    }

    // Clear all transient markers and layers
    activeMarkers.forEach(m => m.remove());
    activeMarkers.clear();
    [POLYGON_LAYER_ID, LABEL_LAYER_ID, DELTA_LAYER_ID].forEach(layerId => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      const src = layerId.replace('-layer', '-source');
      if (map.getSource(src)) map.removeSource(src);
    });

    // Reset animated line
    if (map.getSource('route')) {
      map.getSource('route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
    }
    hasLineAnimationStarted = false;
  }

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

    // 2. CLEAR PREVIOUS TRANSIENT STATE
    activeMarkers.forEach(marker => marker.remove());
    activeMarkers.clear();
    gifOverlayState = { ...gifOverlayState, isActive: false };
    
    ['polygon', 'delta', 'label'].forEach(type => {
        const layerId = `step-${type}-layer`;
        const sourceId = `step-${type}-source`;
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
    });


    // 3. ADD VISUALS FOR CURRENT STEP (Declarative Approach)

    // Special GIF case for step index 1 (sl=2)
    if (index === 1) {
      const m = allMarkerData.find(m => m.sl === 2);
      if (m) {
        gifOverlayState = { isActive: true, lngLat: [m.lon, m.lat], gifSrc: `${base}/images/2.gif`, anchorOffset: { x: 0, y: -13 } };
      }
    }
    
    // Show all markers
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

    // Show a primary GeoJSON polygon (Handles step 1 and its carry-over to step 2)
    const stepForMainPolygon = (index === 1) ? scrollySteps[0] : step;
    if (stepForMainPolygon?.geojson_path) {
      const data = await fetch(stepForMainPolygon.geojson_path).then(r => r.json());
      map.addSource(POLYGON_SOURCE_ID, { type: 'geojson', data });
      map.addLayer({ id: POLYGON_LAYER_ID, type: 'fill', source: POLYGON_SOURCE_ID, paint: { 'fill-color':'#ff0000','fill-opacity':0.7 } });
    }

    // ======================== START OF CHANGE ========================
    // This block replaces the previous "Show a single marker" logic.
    // It creates a list of markers to show, allowing multiple markers on one step.

    const markerSLsToAdd = [];
    if (step.marker_sl && !step.show_all_markers) {
        // Add the marker primarily associated with this step
        markerSLsToAdd.push(step.marker_sl);
    }

    // For step 6 (which is at index 5), also add the marker from step 5 (which has sl=5).
    if (index === 5) {
        markerSLsToAdd.push(5);
    }

    // Animate line and add all markers scheduled for this step
    for (const sl of markerSLsToAdd) {
        const mData = allMarkerData.find(m => m.sl === sl);
        if (mData) {
            // The line animation is triggered for marker sl=11, which appears at index 10
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
    // ========================= END OF CHANGE =========================

    // Show an extra GeoJSON layer (Handles step 5 and its carry-over to step 6)
    // The step for sl=6 (index 5) should show the polygon from sl=5 (index 4).
    const stepForExtraPolygon = (index === 5) ? scrollySteps[4] : step;
    if (stepForExtraPolygon?.extra_geojson_path) {
      const data = await fetch(stepForExtraPolygon.extra_geojson_path).then(r => r.json());
      map.addSource(DELTA_SOURCE_ID, { type: 'geojson', data });
      map.addLayer({ id: DELTA_LAYER_ID, type: 'fill', source: DELTA_SOURCE_ID, paint: { 'fill-color':'#3366ff','fill-opacity':0.4 } });
      if (stepForExtraPolygon.extra_geojson_label) {
        const cent = turf.centroid(data);
        cent.properties.labelText = stepForExtraPolygon.extra_geojson_label;
        map.addSource(LABEL_SOURCE_ID, { type:'geojson', data: cent });
        map.addLayer({ id: LABEL_LAYER_ID, type: 'symbol', source: LABEL_SOURCE_ID, layout: { 'text-field': ['get','labelText'], 'text-size': 14, 'text-font': ['Open Sans Bold','Arial Unicode MS Bold'], 'text-allow-overlap': true, 'text-ignore-placement': true }, paint: { 'text-color':'#ffffff', 'text-halo-color':'#000000', 'text-halo-width':1 } });
      }
    }
  }

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
    map = new mapboxgl.Map({ 
      container: mapContainer, 
      style: 'mapbox://styles/imrandata/cmdott4fc001e01sgeux191ty', 
      center: allCoordinates[0], 
      zoom: 14 
    });
    
    map.on('load', () => {
      map.addSource('route', { type: 'geojson', data: { type:'Feature', geometry:{ type:'LineString', coordinates:[] } } });
      map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap':'round','line-join':'round' }, paint: { 'line-color':'#ff0000','line-width':4 } });
      
      setupScrollama();
      observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
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
        lastCamera = { type: 'fitBounds', bounds: bounds.toArray(), options: { padding: 40, speed: 0.8, maxZoom: 15 } };
      } else if (step.geojson_path && ![1,5,7,10,11].includes(i)) {
        const data = geojsonCache.get(step.geojson_path);
        const bounds = getBounds(data);
        lastCamera = { type: 'fitBounds', bounds: bounds.toArray(), options: { padding:40, speed:0.8, maxZoom:18 } };
      } else if (step.marker_sl) {
        const mData = allMarkerData.find(m => m.sl === step.marker_sl);
        if (mData) {
          if (i === 9) { 
            const nextStep = tempSteps[10];
            const t = allMarkerData.find(m => m.sl === nextStep.marker_sl);
            if (t) {
              lastCamera = { type: 'flyTo', options: { center: [t.lon + 0.0005, t.lat], zoom:17, speed:0.5, essential:true } };
            }
          } else if (![1,5,7,10,11].includes(i)) {
            lastCamera = { type: 'flyTo', options: { center: [mData.lon, mData.lat], zoom:18, speed:0.5, essential:true } };
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
    [90.43859112088921,23.762459989380986], [90.4385921868494,23.76241185011707], [90.4386221430491,23.762295696803274], [90.4386348483163,23.76224345244589], [90.4386408544959,23.762211566459364], [90.438618454799,23.76212130096695], [90.4385848803403,23.76202419409848], [90.43856245281182,23.761983673205393]
  ];

</script>

<style>
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
</style>

<div class="scrolly-container">
  <div class="graphic-container">
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