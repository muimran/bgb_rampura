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
  
  let scrollySteps = [];

  let hasLineAnimationStarted = false;

  // MODIFIED: Add anchorOffset to the state object
  let gifOverlayState = {
    isActive: false,
    lngLat: null,
    gifSrc: '',
    anchorOffset: { x: 0, y: 0 } // Default offset
  };

  const POLYGON_SOURCE_ID = 'step-polygon-source';
  const POLYGON_LAYER_ID = 'step-polygon-layer';

  const DELTA_SOURCE_ID = 'delta-source';
  const DELTA_LAYER_ID = 'delta-layer';
  
  const LABEL_SOURCE_ID = 'extra-label-source';
  const LABEL_LAYER_ID = 'extra-label-layer';

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';

  const allCoordinates = [
    [90.43859112088921, 23.762459989380986], [90.43858965073144, 23.76244317033698],
    [90.43858818057373, 23.762420969194636], [90.43858671041602, 23.762404822907598],
    [90.4385852402583, 23.762385312808064], [90.43858450517945, 23.76235974784474],
    [90.43858229994288, 23.762334182877225], [90.43858082978517, 23.762309290666394],
    [90.4385786245486, 23.762283052926378], [90.43857641931203, 23.76225950623123],
    [90.43857568423317, 23.762238650584223], [90.43857421407546, 23.762215103881005],
    [90.4385727439178, 23.762192229937554], [90.43857200883889, 23.762169355989215],
    [90.43857127376009, 23.762145809274372], [90.43856906852346, 23.76212024426397],
    [90.4385668632869, 23.7620966975403], [90.43856612820804, 23.76207516910347],
    [90.43856465805038, 23.76204758578767], [90.43856392296954, 23.762024711814774],
    [90.43856245281182, 23.762004528893314], [90.43856245281182, 23.761983673205393]
  ];

  function resetMapToInitialState() {
    console.log('%cExecuting resetMapToInitialState...', 'color: orange; font-weight: bold;');
    
    if (!map || !map.isStyleLoaded()) return;

    if (activeIndex === -1) {
      console.log('...Map already in initial state. No reset needed.');
      return;
    }

    map.flyTo({
      center: allCoordinates[0],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      speed: 1.5,
      essential: true
    });

    activeMarkers.forEach(marker => marker.remove());
    activeMarkers.clear();

    if (map.getLayer(POLYGON_LAYER_ID)) map.removeLayer(POLYGON_LAYER_ID);
    if (map.getSource(POLYGON_SOURCE_ID)) map.removeSource(POLYGON_SOURCE_ID);
    
    if (map.getLayer(LABEL_LAYER_ID)) map.removeLayer(LABEL_LAYER_ID);
    if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);

    if (map.getLayer(DELTA_LAYER_ID)) map.removeLayer(DELTA_LAYER_ID);
    if (map.getSource(DELTA_SOURCE_ID)) map.removeSource(DELTA_SOURCE_ID);

    if (map.getSource('route')) {
      map.getSource('route').setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [] }
      });
    }

    hasLineAnimationStarted = false;
    activeIndex = -1;

    console.log('...Map reset complete. activeIndex is now -1.');
  }

  function animateLine() {
    return new Promise(resolve => {
      let index = 1;
      const interval = setInterval(() => {
        if (index > allCoordinates.length) {
          clearInterval(interval);
          resolve();
          return;
        }
        if (map && map.getSource('route')) {
          const coords = allCoordinates.slice(0, index);
          map.getSource('route').setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords }
          });
        }
        index++;
      }, 70);
    });
  }

  function getBounds(geojson) {
    const bounds = new mapboxgl.LngLatBounds();
    if (!geojson.features || !geojson.features.length) return bounds;
    const geometry = geojson.features[0].geometry;
    if (!geometry || !geometry.coordinates) return bounds;
    const processCoordinates = (coords) => {
      if (typeof coords[0] === 'number') { bounds.extend(coords); } 
      else { coords.forEach(processCoordinates); }
    };
    processCoordinates(geometry.coordinates);
    return bounds;
  }

  async function handleStepEnter(response) {
    console.log(`%cScrollama: Entering Step ${response.index}`, 'color: cyan;');
    
    const i = response.index;
    activeIndex = i;

    gifOverlayState.isActive = false;
    
    const noClearIndices = [1, 2, 3, 4, 5, 7, 10, 11];

    if (!noClearIndices.includes(i)) {
      activeMarkers.forEach(marker => marker.remove());
      activeMarkers.clear();
      
      if (map.getLayer(POLYGON_LAYER_ID)) map.removeLayer(POLYGON_LAYER_ID);
      if (map.getSource(POLYGON_SOURCE_ID)) map.removeSource(POLYGON_SOURCE_ID);
      
      if (map.getLayer(LABEL_LAYER_ID)) map.removeLayer(LABEL_LAYER_ID);
      if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);
      if (map.getLayer(DELTA_LAYER_ID)) map.removeLayer(DELTA_LAYER_ID);
      if (map.getSource(DELTA_SOURCE_ID)) map.removeSource(DELTA_SOURCE_ID);

      if (map.getSource('route')) {
        map.getSource('route').setData({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [] }
        });
      }
      hasLineAnimationStarted = false;
    }

    const currentStep = scrollySteps[i];
    if (!currentStep) return;

    if (i === 1) { 
      const targetMarkerData = allMarkerData.find(m => m.sl === 2);
      if (targetMarkerData) {
        // MODIFIED: We now also define the anchor offset
        gifOverlayState = {
          isActive: true,
          lngLat: [targetMarkerData.lon, targetMarkerData.lat],
          gifSrc: `${base}/images/2.gif`,
          // The marker is 26px high, and its anchor is at the bottom.
          // The center is 13px up, so we use a negative Y offset.
          anchorOffset: { x: 0, y: -13 }
        };
      }
    }

    const noPanIndices = [1, 5, 7, 10, 11];
    
    if (currentStep.show_all_markers) {
      const squareMarkerSLs = [4, 6, 8, 9, 10, 11];
      activeMarkers.forEach(marker => marker.remove());
      activeMarkers.clear();
      allMarkerData.forEach(marker => {
        const el = document.createElement('div');
        const markerClassName = squareMarkerSLs.includes(marker.sl) ? 'square-marker' : 'circle-marker';
        el.className = markerClassName;
        const anchorPoint = squareMarkerSLs.includes(marker.sl) ? 'center' : 'bottom';
        
        const newMarker = new mapboxgl.Marker({ element: el, anchor: anchorPoint })
          .setLngLat([marker.lon, marker.lat])
          .setPopup(new mapboxgl.Popup().setText(marker.popupText))
          .addTo(map);
        activeMarkers.set(marker.sl, newMarker);
      });
      if (allMarkerData.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        allMarkerData.forEach(marker => bounds.extend([marker.lon, marker.lat]));
        map.fitBounds(bounds, { padding: 40, speed: 0.8, maxZoom: 14 });
      }

    } else if (currentStep.geojson_path) {
      if (!map.getSource(POLYGON_SOURCE_ID)) {
        const polyData = await fetch(currentStep.geojson_path).then(r => r.json());
        map.addSource(POLYGON_SOURCE_ID, { type: 'geojson', data: polyData });
        map.addLayer({
          id: POLYGON_LAYER_ID, type: 'fill', source: POLYGON_SOURCE_ID,
          paint: { 'fill-color': '#ff0000', 'fill-opacity': 0.7 }
        });
      }
      if (!noPanIndices.includes(i)) {
          map.fitBounds(getBounds(await fetch(currentStep.geojson_path).then(r => r.json())), { padding: 40, speed: 0.8, maxZoom: 18 });
      }

    } else if (currentStep.marker_sl) {
      const slToShow = currentStep.marker_sl;
      const markerData = allMarkerData.find(m => m.sl === slToShow);

      if (markerData) {
        if (i === 11) {
          activeMarkers.forEach((marker, sl) => {
            if (sl !== 11) {
              marker.remove();
              activeMarkers.delete(sl);
            }
          });
        } else {
          activeMarkers.forEach(marker => marker.remove());
          activeMarkers.clear();
        }

        if (slToShow === 11 && !hasLineAnimationStarted) {
          hasLineAnimationStarted = true;
          await animateLine();
        }

        const squareMarkerSLs = [4, 6, 8, 9, 10, 11];
        
        const el = document.createElement('div');
        const markerClassName = squareMarkerSLs.includes(slToShow) ? 'square-marker' : 'circle-marker';
        el.className = markerClassName;
        
        const anchorPoint = squareMarkerSLs.includes(slToShow) ? 'center' : 'bottom';
        
        const newMarker = new mapboxgl.Marker({ element: el, anchor: anchorPoint })
          .setLngLat([markerData.lon, markerData.lat])
          .setPopup(new mapboxgl.Popup().setText(markerData.popupText))
          .addTo(map);
        activeMarkers.set(slToShow, newMarker);

        if (i === 9) {
            const targetStepForCamera = scrollySteps[10];
            const targetMarkerData = allMarkerData.find(m => m.sl === targetStepForCamera.marker_sl);
            if (targetMarkerData) {
                const originalLon = targetMarkerData.lon;
                const adjustedLon = originalLon + 0.0005; 
                map.flyTo({
                    center: [adjustedLon, targetMarkerData.lat],
                    zoom: 17,
                    speed: 0.5,
                    essential: true
                });
            }
        } else if (!noPanIndices.includes(i)) {
             map.flyTo({ center: [markerData.lon, markerData.lat], zoom: 18, speed: 0.5, essential: true });
        }
      }
    }

    if (currentStep.extra_geojson_path) {
        if (!map.getSource(DELTA_SOURCE_ID)) {
            const polygonData = await fetch(currentStep.extra_geojson_path).then(res => res.json());
            
            map.addSource(DELTA_SOURCE_ID, { type: 'geojson', data: polygonData });
            map.addLayer({
                id: DELTA_LAYER_ID, type: 'fill', source: DELTA_SOURCE_ID,
                paint: { 'fill-color': '#3366ff', 'fill-opacity': 0.4 }
            });

            if (currentStep.extra_geojson_label) {
                const centroid = turf.centroid(polygonData);
                centroid.properties.labelText = currentStep.extra_geojson_label;

                map.addSource(LABEL_SOURCE_ID, { type: 'geojson', data: centroid });
                map.addLayer({
                    id: LABEL_LAYER_ID,
                    type: 'symbol',
                    source: LABEL_SOURCE_ID,
                    layout: {
                        'text-field': ['get', 'labelText'],
                        'text-size': 14,
                        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                        'text-allow-overlap': true,
                        'text-ignore-placement': true
                    },
                    paint: {
                        'text-color': '#ffffff',
                        'text-halo-color': '#000000',
                        'text-halo-width': 1
                    }
                });
            }
        }
    }
  }

  function handleStepExit(response) { /* No changes needed */ }

  function setupScrollama() {
    setTimeout(() => {
      scroller = scrollama();
      scroller
        .setup({ step: '.scrolly-step', offset: 0.9, debug: false })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);
      const resize = () => scroller.resize();
      window.addEventListener('resize', resize);
      onDestroy(() => {
        window.removeEventListener('resize', resize);
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

    map.on('load', async () => {
      console.log('Mapbox style loaded.');
      map.addSource('route', { 
        type: 'geojson', 
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } } 
      });
      
      map.addLayer({ 
        id: 'route-line', type: 'line', source: 'route', 
        layout: { 'line-cap': 'round', 'line-join': 'round' }, 
        paint: { 'line-color': '#ff0000', 'line-width': 4 } 
      });
    });
  }

  onMount(async () => {
    console.log('Component Mounted. Fetching data...');
    
    const response = await fetch(`${base}/bgb.csv`);
    const csvText = await response.text();
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log('Data parsed. Initializing map and scrollama.');
        const parsedData = result.data
          .map(row => ({
            sl: parseInt(row['sl'], 10), lat: parseFloat(row['lat']), lon: parseFloat(row['lon']),
            popupText: row['identifier'] || `Incident #${row['sl']}`,
            stepTitle: `Incident #${row['sl']}`,
            stepText: row['textbox'] || 'No details provided for this incident.'
          }))
          .filter(({ sl, lat, lon }) => !isNaN(sl) && !isNaN(lat) && !isNaN(lon))
          .sort((a, b) => a.sl - b.sl);
        allMarkerData = parsedData.map(({ sl, lat, lon, popupText }) => ({ sl, lat, lon, popupText }));
        
        scrollySteps = parsedData.map((row) => {
          if (row.sl === 1) {
            return { id: `step-${row.sl}-polygon`, title: row.stepTitle, text: row.stepText, geojson_path: `${base}/ramjan.geojson` };
          } else if (row.sl === 7) {
            return { id: `step-${row.sl}-polygon-7`, title: row.stepTitle, text: row.stepText, geojson_path: `${base}/step7.geojson` };
          } else if (row.sl === 13) {
            return { id: `step-${row.sl}-polygon-14`, title: row.stepTitle, text: row.stepText, geojson_path: `${base}/step14.geojson` };
          } else if (row.sl === 3) {
             return { 
                id: row.sl, title: row.stepTitle, text: row.stepText, 
                marker_sl: row.sl, 
                extra_geojson_path: `${base}/delta.geojson`,
                extra_geojson_label: 'Delta Hospital'
            };
          } else if (row.sl === 4) {
            return { 
                id: row.sl, title: row.stepTitle, text: row.stepText, 
                marker_sl: row.sl, 
                extra_geojson_path: `${base}/agrani.geojson`,
                extra_geojson_label: 'Agrani Bank'
            };
          } else if (row.sl === 5) {
            return { 
                id: row.sl, title: row.stepTitle, text: row.stepText, 
                marker_sl: row.sl, 
                extra_geojson_path: `${base}/delta.geojson`,
                extra_geojson_label: 'Delta Hospital'
            };
          } else if (row.sl === 6) {
            return { 
                id: row.sl, title: row.stepTitle, text: row.stepText, 
                marker_sl: row.sl, 
                extra_geojson_path: `${base}/delta.geojson`,
                extra_geojson_label: 'Delta Hospital'
            };
          } else {
            return { id: row.sl, title: row.stepTitle, text: row.stepText, marker_sl: row.sl };
          }
        });

        scrollySteps.push({
          id: 'final-step-all-markers',
          title: 'All Incidents',
          text: 'This map shows all the reported incidents along the route.',
          show_all_markers: true
        });

        initMap();
        setupScrollama();

        const observerOptions = {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        };

        const observerCallback = (entries) => {
          entries.forEach(entry => {
            console.log(`Reset trigger intersecting: ${entry.isIntersecting}`);
            if (entry.isIntersecting) {
              resetMapToInitialState();
            }
          });
        };

        observer = new IntersectionObserver(observerCallback, observerOptions);
        if (resetTrigger) {
          console.log('Attaching IntersectionObserver to reset trigger.');
          observer.observe(resetTrigger);
        }
      }
    });
  });

  onDestroy(() => {
    activeMarkers.forEach(marker => marker.remove());
    if (map) map.remove();
    if (observer) {
      console.log('Component Destroyed. Disconnecting observer.');
      observer.disconnect();
    }
  });
</script>

<style>
  @import 'mapbox-gl/dist/mapbox-gl.css';

  .scrolly-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  .graphic-container {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    z-index: 0;
  }

  #map {
    width: 100%;
    height: 100%;
  }

  .scrolly-steps {
    position: relative;
    z-index: 1;
    margin-top: -100vh;
    padding-top: 100vh;
  }

  .scrolly-step {
    margin: 0 auto 80vh auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    opacity: 0.4;
    transform: translateY(10px);
    transition: all 0.3s ease;
    max-width: 600px;
    border-radius: 8px;
  }

  .scrolly-step.active {
    opacity: 1;
    transform: translateY(0);
  }

  .reset-trigger-element {
    height: 1px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  :global(.circle-marker) {
    background-image: url('/custom-marker.png');
    width: 26px; 
    height: 26px;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  
  :global(.square-marker) {
    width: 17px;
    height: 17px;
    background-color: #ff0000;
    border: 1px solid #ffffff;
    cursor: pointer;
  }
</style>

<div class="scrolly-container">
  <div class="graphic-container">
    <div bind:this={mapContainer} id="map"></div>
    
    <!-- MODIFIED: Pass the new anchorOffset prop -->
    <GifOverlay 
      map={map} 
      isActive={gifOverlayState.isActive}
      lngLat={gifOverlayState.lngLat}
      gifSrc={gifOverlayState.gifSrc}
      anchorOffset={gifOverlayState.anchorOffset}
    />
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