<script context="module">
  export const ssr = false;
</script>

<script>
  import { onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import Papa from 'papaparse';
  import scrollama from 'scrollama';

  let map;
  let mapContainer;
  
  let allMarkerData = []; 
  let activeMarkers = new Map(); 

  let activeIndex = -1;
  let scroller;

  // This variable will hold our dynamically generated steps.
  let scrollySteps = [];

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';

  const allCoordinates = [
    [90.44275857913989, 23.762151498627887],
    [90.44246782926804, 23.76217069572667],
    [90.4421770793962, 23.76218989282545],
    [90.44188632952435, 23.762209089924233],
    [90.44159557965252, 23.762228287023015],
    [90.44130482978067, 23.7622474841218],
    [90.44101407990883, 23.76226668122058],
    [90.44072333003699, 23.762285878319362],
    [90.44043258016515, 23.762305075418144],
    [90.4401418302933, 23.76232427251693],
    [90.43985108042146, 23.76234346961571],
    [90.43956033054961, 23.762362666714492],
    [90.43926958067777, 23.762381863813274],
    [90.43897883080593, 23.762401060912056],
    [90.43868808093409, 23.76242025801084],
    [90.43839733106225, 23.762439455109622],
    [90.4381065811904, 23.762458652208404],
    [90.43781583131856, 23.76247784930719],
    [90.43752508144672, 23.76249704640597],
    [90.43723433157488, 23.762516243504753],
    [90.43694358170304, 23.762535440603535]
  ];

  function animateLine() {
    let index = 1;
    const interval = setInterval(() => {
      if (index > allCoordinates.length) {
        clearInterval(interval);
        return;
      }
      if (map && map.getSource('route')) {
        const coords = allCoordinates.slice(0, index);
        map.getSource('route').setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        });
      }
      index++;
    }, 70);
  }

  function handleStepEnter(response) {
    const i = response.index;
    activeIndex = i;
    
    activeMarkers.forEach(marker => marker.remove());
    activeMarkers.clear();

    const currentStep = scrollySteps[i];
    if (currentStep && currentStep.marker_sl) {
      const slToShow = currentStep.marker_sl;
      const markerData = allMarkerData.find(m => m.sl === slToShow);

      if (markerData) {
        const newMarker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([markerData.lon, markerData.lat])
          .setPopup(new mapboxgl.Popup().setText(markerData.popupText))
          .addTo(map);

        activeMarkers.set(slToShow, newMarker);

        map.flyTo({
          center: [markerData.lon, markerData.lat],
          zoom: 15,
          essential: true
        });
      }
    }
  }

  function handleStepExit(response) {
    // Logic handled in handleStepEnter for smoother transitions
  }

  function setupScrollama() {
    setTimeout(() => {
      scroller = scrollama();
      scroller
        .setup({
          step: '.scrolly-step',
          offset: 0.6,
          debug: false
        })
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
      style: 'mapbox://styles/imrandata/cm0fmeq48000e01pb9z5c7jez',
      center: allCoordinates[0],
      zoom: 14
    });

    map.on('load', async () => {
      const polyData = await fetch('/poly.geojson').then(r => r.json());
      map.addSource('polygon', { type: 'geojson', data: polyData });
      map.addLayer({ id: 'polygon-fill', type: 'fill', source: 'polygon', paint: { 'fill-color': '#0033aa', 'fill-opacity': 0.0 } });
      map.addLayer({ id: 'polygon-outline', type: 'line', source: 'polygon', paint: { 'line-color': '#0033aa', 'line-width': 2 } });
      let opacity = 0;
      function animatePolygon() {
        if (opacity < 0.8) {
          opacity += 0.02;
          map.setPaintProperty('polygon-fill', 'fill-opacity', opacity);
          requestAnimationFrame(animatePolygon);
        }
      }
      animatePolygon();
      map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [allCoordinates[0]] } } });
      map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ff0000', 'line-width': 4 } });
      animateLine();
    });
  }

  onMount(async () => {
    const response = await fetch('/bgb.csv');
    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data
          .map(row => {
            const sl = parseInt(row['sl'], 10);
            const lat = parseFloat(row['lat']);
            const lon = parseFloat(row['lon']);
            
            // --- MODIFIED SECTION START ---

            // Pop-up on map marker shows a short title (identifier)
            const popupText = row['identifier'] || `Incident #${sl}`;
            
            // Step box shows a generic title and the full text from the 'textbox' column
            const stepTitle = `Incident #${sl}`;
            const stepText = row['textbox'] || 'No details provided for this incident.';
            
            // --- MODIFIED SECTION END ---

            return { sl, lat, lon, popupText, stepTitle, stepText };
          })
          .filter(({ sl, lat, lon }) => !isNaN(sl) && !isNaN(lat) && !isNaN(lon))
          .sort((a, b) => a.sl - b.sl); // Ensure data is sorted by 'sl'

        // 1. Populate the data for the map markers
        allMarkerData = parsedData.map(({ sl, lat, lon, popupText }) => ({ sl, lat, lon, popupText }));

        // 2. Populate the data for the scrolling steps
        scrollySteps = parsedData.map(({ sl, stepTitle, stepText }) => ({
            id: sl,
            title: stepTitle,
            text: stepText,
            marker_sl: sl
        }));

        initMap();
        setupScrollama();
      }
    });
  });

  onDestroy(() => {
    activeMarkers.forEach(marker => marker.remove());
    if (map) map.remove();
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
</style>

<div class="scrolly-container">
  <div class="graphic-container">
    <div bind:this={mapContainer} id="map"></div>
  </div>

  <div class="scrolly-steps">
    <!-- Loop over the new dynamic scrollySteps array -->
    {#each scrollySteps as step, i (step.id)}
      <div class="scrolly-step" class:active={activeIndex === i}>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
    {/each}
  </div>
</div>