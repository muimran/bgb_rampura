<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { base } from '$app/paths';
	import mapboxgl from 'mapbox-gl';
	import scrollama from 'scrollama';
	import { csvParse } from 'd3-dsv';
	import GifOverlay from './GifOverlay.svelte';

	mapboxgl.accessToken = 'pk.eyJ1IjoiaW1yYW5kYXRhIiwiYSI6ImNtMDRlaHh1YTA1aDEybHI1ZW12OGh4cDcifQ.fHLLFYQx7JKPUp2Sl1jtYg';
	const MAP_STYLE = 'mapbox://styles/imrandata/cme33sg5c00qn01sd0iz01lyy';

	let map;
	let mapContainer;
	let scroller;
	let chapters = [];
	let activeIndex = 0;
	let isT56ImageVisible = false;

	let graphicContainer;
	let isVisible = false;

	let activeMediaSrc = '';
	let activeMediaLngLat = null;
	let tableVisible = true;
	let displayedLayerData = [];
	let isInitialLoad = true;

	$: activeAmmoTypesInStep = [...new Set( displayedLayerData.flatMap(layer => Object.keys(layer.totals).filter(type => layer.totals[type] > 0)))];
	$: sortedTableData = [...displayedLayerData].map(layer => { const total = Object.values(layer.totals).reduce((sum, val) => sum + (val || 0), 0); return { ...layer, total }; }).filter(layer => layer.total > 0).sort((a, b) => b.total - a.total);
	$: isT56ImageVisible = activeIndex === 10 || activeIndex === 11;

	const AMMO_STYLES = { t56: { color: '#d7263d', label: 'Type 56' }, lethal: { color: '#f46a4e', label: 'Lethal' }, rubber_cartridge: { color: '#0077b6', label: 'Rubber Cartridge' }, shotgun_shell: { color: '#5e548e', label: 'Shotgun Shell' }, tear_gas_grenade: { color: '#80b918', label: 'Tear Gas' }, baton_rounds: { color: '#fca311', label: 'Baton Rounds' }, non_lethal: { color: '#48cae4', label: 'Non-Lethal' } };

	function handleStepEnter(response) { activeIndex = response.index; }

	function handleStepProgress(response) {
		const fadeInEnd = 0.3;
		const fadeOutStart = 0.7;
		let opacity = 1;
		if (response.progress < fadeInEnd) { opacity = response.progress / fadeInEnd; }
		else if (response.progress > fadeOutStart) { opacity = 1 - (response.progress - fadeOutStart) / (1 - fadeOutStart); }
		response.element.querySelector('.step-content').style.opacity = opacity;
	}

	function updateMap(stepIndex) {
		if (!chapters || !chapters[stepIndex] || !map.isStyleLoaded()) return;
		const chapter = chapters[stepIndex];
		map.flyTo({ ...chapter.view, duration: 1200, essential: true });
		if (chapter.media_src && chapter.media_lnglat) { activeMediaSrc = chapter.media_src; activeMediaLngLat = chapter.media_lnglat; } else { activeMediaSrc = ''; activeMediaLngLat = null; }
		const positionedLayers = addDynamicLabelPlacement(chapter.layers, map);
		const features = positionedLayers.map(layer => { const properties = { thana: layer.thana, highlight: layer.highlight || false, labelOffset: layer.placement.offset, labelAnchor: layer.placement.anchor }; Object.keys(AMMO_STYLES).forEach(ammoType => { properties[`${ammoType}_total`] = layer.totals[ammoType] || 0; }); properties.has_data = Object.values(layer.totals).some(total => total > 0); return { type: 'Feature', geometry: { type: 'Point', coordinates: layer.coords }, properties }; });
		const geojsonData = { type: 'FeatureCollection', features };
		const source = map.getSource('ammo_data_source');
		if (source) { source.setData(geojsonData); }
	}

	$: if (chapters.length > 0 && map?.isStyleLoaded()) {
		if (isInitialLoad) {
		} else {
			tableVisible = false;
			setTimeout(() => {
				displayedLayerData = chapters[activeIndex].layers;
				tableVisible = true;
			}, 250);
			updateMap(activeIndex);
		}
	}

	onMount(async () => {
		const observer = new IntersectionObserver(([entry]) => {
			isVisible = entry.isIntersecting;
		}, {
			rootMargin: "0px 0px -15% 0px",
			threshold: 0
		});

		if (graphicContainer) {
			observer.observe(graphicContainer);
		}

		const [scrollyRes, amoRes] = await Promise.all([ fetch(`${base}/scrolly.csv`), fetch(`${base}/amo_data.csv`) ]);
		const scrollyText = await scrollyRes.text();
		const amoText = await amoRes.text();
		const scrollyData = csvParse(scrollyText);
		const amoData = csvParse(amoText);

		const thanaCoords = amoData.reduce((acc, row) => { if (row.thana && !acc[row.thana]) { acc[row.thana] = { lat: +row.lat, lon: +row.lon }; } return acc; }, {});
		const allThanaNames = [...new Set(amoData.map(d => d.thana).filter(Boolean))];
		
        chapters = scrollyData.map(step => { 
            const chapter = { 
                sl: step.sl, 
                textbox: step.textbox, 
                displayDate: formatDateForRibbon(step.date),
                view: { center: [+step.lon, +step.lat], zoom: +step.zoom }, 
                media_src: step.media_src, 
                media_lnglat: (step.media_lng && step.media_lat) ? [+step.media_lng, +step.media_lat] : null, 
                layers: [] 
            }; 
            
            let thanasToProcess; 
            if (step.thana === "All") { 
                thanasToProcess = allThanaNames; 
            } else if (step.thana && step.thana !== "0") { 
                thanasToProcess = step.thana.split(',').map(t => t.trim()); 
            } else { 
                thanasToProcess = []; 
            } 
            
            const amoTypes = (step.amo_type && step.amo_type !== '0') ? step.amo_type.split(',').map(t => t.trim()) : []; 
            const stepDateNormalized = normalizeDate(step.date); 
            
            if (thanasToProcess.length > 0 && amoTypes.length > 0) { 
                thanasToProcess.forEach(thanaName => { 
                    if (!thanaCoords[thanaName]) { return; } 
                    const layerData = { thana: thanaName, coords: [thanaCoords[thanaName].lon, thanaCoords[thanaName].lat], totals: {} }; 
                    const filteredAmo = amoData.filter(d => d.thana === thanaName && normalizeDate(d.date) === stepDateNormalized); 
                    
                    amoTypes.forEach(type => {
                        layerData.totals[type] = filteredAmo.reduce((sum, row) => {
                            return sum + (Number(row[type]) || 0);
                        }, 0);
                    });
                    chapter.layers.push(layerData); 
                }); 
            } else if (thanasToProcess.length > 0) { 
                thanasToProcess.forEach(thanaName => { 
                    if (!thanaCoords[thanaName]) { return; } 
                    chapter.layers.push({ thana: thanaName, coords: [thanaCoords[thanaName].lon, thanaCoords[thanaName].lat], totals: {}, highlight: true }); 
                }); 
            } 
            return chapter; 
        });
		
        map = new mapboxgl.Map({ container: mapContainer, style: MAP_STYLE, center: [90.39159, 23.75466], zoom: 11, interactive: false });
		
        map.on('load', () => {
			map.addSource('ammo_data_source', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
			map.addLayer({ id: 'thana-label', type: 'symbol', source: 'ammo_data_source', layout: { 'text-field': ['case', ['any', ['get', 'has_data'], ['get', 'highlight']], ['get', 'thana'], ''], 'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], 'text-size': 14, 'text-offset': ['get', 'labelOffset'], 'text-anchor': ['get', 'labelAnchor'], 'text-allow-overlap': true, 'text-ignore-placement': true }, paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(0, 0, 0, 0.9)', 'text-halo-width': 2 } });
			Object.entries(AMMO_STYLES).forEach(([type, style]) => { map.addLayer({ id: `ammo-circle-${type}`, type: 'circle', source: 'ammo_data_source', paint: { 'circle-color': style.color, 'circle-radius': ['interpolate',['linear'],['sqrt', ['get', `${type}_total`]],0,0,1,8,100,30,1000,75,10000,225], 'circle-opacity': 0.7, 'circle-stroke-color': 'white', 'circle-stroke-width': 1, 'circle-stroke-opacity': ['case', ['>', ['get', `${type}_total`], 0], 1, 0] } }); });
			
            if (chapters.length > 0) {
                displayedLayerData = chapters[0].layers;
                isInitialLoad = false;
                updateMap(0);
            }

            map.on('moveend', () => { if (chapters[activeIndex]) { updateMap(activeIndex); } });
		});

		await tick();
		scroller = scrollama();
		scroller.setup({ step: '.scrolly-step', offset: 0.6, progress: true, debug: false }).onStepEnter(handleStepEnter).onStepProgress(handleStepProgress);
		window.addEventListener('resize', scroller.resize);
	});

	onDestroy(() => {
		if (map) map.remove();
		if (scroller) { window.removeEventListener('resize', scroller.resize); scroller.destroy(); }
	});

	function addDynamicLabelPlacement(layers, mapInstance) { if (!layers || layers.length === 0) return []; const COLLISION_THRESHOLD_PX = 60; const defaultPlacement = { anchor: 'right', offset: [-1.5, 0] }; const alternativePlacement = { anchor: 'left', offset: [1.5, 0] }; const points = layers.map(layer => ({ ...layer, screenCoords: mapInstance.project(layer.coords) })).sort((a, b) => a.screenCoords.x - b.screenCoords.x); for (let i = 0; i < points.length; i++) { points[i].placement = defaultPlacement; for (let j = 0; j < i; j++) { const dist = Math.sqrt(Math.pow(points[i].screenCoords.x - points[j].screenCoords.x, 2) + Math.pow(points[i].screenCoords.y - points[j].screenCoords.y, 2)); if (dist < COLLISION_THRESHOLD_PX) { points[i].placement = alternativePlacement; break; } } } return points; }
    function normalizeDate(dateString) { if (!dateString || typeof dateString !== 'string') return ''; const parts = dateString.split('/'); if (parts.length === 3) { const day = parts[0].padStart(2, '0'); const month = parts[1].padStart(2, '0'); let year = parts[2]; if (year.length === 2) year = `20${year}`; return `${day}/${month}/${year}`; } return dateString; }

    function formatDateForRibbon(dateString) {
        if (!dateString || typeof dateString !== 'string') return '';
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const day = parseInt(parts[0], 10);
            const monthIndex = parseInt(parts[1], 10) - 1;

            if (monthIndex >= 0 && monthIndex < 12) {
                const monthName = monthNames[monthIndex];
                return `${monthName} ${day}`;
            }
        }
        return '';
    }

</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div>
    <div class="scrolly-container">
        <div bind:this={graphicContainer} class="graphic-container">
            <div class="gradient-top"></div>
            <div class="gradient-bottom"></div>
            <div bind:this={mapContainer} id="map" />
            <div class="side-image-container" class:visible={isT56ImageVisible}>
                <img src="{base}/images/t56.png" alt="Type 56 Rifle" class="side-image"/>
            </div>
        </div>
        <GifOverlay map={map} isActive={!!activeMediaSrc} mediaSrc={activeMediaSrc} lngLat={activeMediaLngLat}/>
        <div class="scrolly-steps">
            {#each chapters as chapter, i}
                <div class="scrolly-step" data-index={i}>
                    <div class="step-content">
                        {#if chapter.displayDate}
                            <div class="step-header-ribbon">
                                <span>{chapter.displayDate}</span>
                            </div>
                        {/if}
                        {@html chapter.textbox}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="legend-container" class:visible={isVisible}>
        <div class="legend-table-wrapper" style="opacity: {tableVisible ? 1 : 0};">
            {#if activeAmmoTypesInStep.length > 0}
                <table class="legend-table">
                    <thead>
                        <tr>
                            <th class="thana-header">Thana</th>
                            {#each activeAmmoTypesInStep as type}
                                <th>
                                    <span class="color-swatch" style="background-color: {AMMO_STYLES[type].color};"></span>
                                    {AMMO_STYLES[type].label}
                                </th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each sortedTableData as layer}
                            <tr>
                                <td>{layer.thana}</td>
                                {#each activeAmmoTypesInStep as type}
                                    <td class="total-value">{layer.totals[type] || 0}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>
</div>

<style>
	/* --- Main page layout --- */
	.scrolly-container { position: relative; }
	.graphic-container { position: sticky; top: 0; height: 100vh; width: 100%; z-index: 1; }
	#map { width: 100%; height: 100%; }
	.scrolly-steps { position: relative; z-index: 2; max-width: 360px; margin-left: 5%; }
	.scrolly-step { min-height: 80vh; display: flex; align-items: center; }

    .step-content {
        width: 100%;
        padding: 1.5rem;
        background: white;
        color: #333;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        font-size: 14px;
    }

    .step-header-ribbon {
        background-color: #333;
        color: white;
        text-align: center;
        padding: 5px 1.5rem;
        margin: -1.5rem -1.5rem 1.5rem -1.5rem;
        border-radius: 6px 6px 0 0;
    }
    .step-header-ribbon span {
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 1.5px;
        font-family: 'Courier New', Courier, monospace;
    }

    .gradient-top, .gradient-bottom { position: absolute; left: 0; right: 0; z-index: 10; pointer-events: none; }
    .gradient-top { top: 0; height: 8%; background: linear-gradient(to bottom, white 0%, transparent 100%); }
    .gradient-bottom { bottom: 0; height: 8%; background: linear-gradient(to top, white 0%, transparent 100%); }

    /* --- Legend Styles --- */
    .legend-container {
        position: fixed;
        top: 3rem; 
        left: 5%; 
        z-index: 5;
        width: 360px;
        max-height: calc(100vh - 4rem);
        display: flex;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
    }

    .legend-container.visible {
        opacity: 1;
        pointer-events: auto;
    }

    .legend-table-wrapper {
        width: 100%;
        overflow: auto;
        background: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
        transition: opacity 0.25s ease-in-out;
    }
    
    .legend-table {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .legend-table th, .legend-table td {
        padding: 5px 8px;
        text-align: left;
        white-space: nowrap;
    }
    .legend-table th {
        border-top: 1px solid #333;
        border-bottom: 2px solid #333;
        background: white;
        color: #555;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: sticky;
        top: 0;
        z-index: 10;
    }

	.legend-table th:not(:first-child) {
		text-align: center;
	}

    .legend-table tbody tr { border-bottom: 1px solid #e5e5e5; }
	.legend-table tbody tr:last-child { border-bottom: none; }
	.legend-table td { 
		font-size: 12px;
		color: #333; 
	}
	.thana-header, .legend-table tbody td:first-child {
        position: sticky;
        left: 0;
        background: white;
        border-right: 1px solid #e5e5e5;
    }
	.legend-table tbody td:first-child { font-weight: 600; color: #000; }
    .legend-table td.total-value { text-align: center; font-family: 'Courier New', Courier, monospace; }
    .color-swatch {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #aaa;
        vertical-align: middle;
        margin-right: 6px;
    }

    /* --- Side Image --- */
    .side-image-container {
        position: absolute;
        top: 50%;
        right: 5%;
        transform: translateY(-50%);
        width: 320px;
        z-index: 15;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease-in-out;
    }

    .side-image-container.visible {
        opacity: 1;
        pointer-events: auto;
    }

    .side-image {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
    }

    /* --- CORRECTED Mobile Responsiveness --- */
    @media (max-width: 768px) {
        .graphic-container {
            position: relative; 
            height: 60vh;       
        }

        .scrolly-steps {
            position: relative;
            max-width: 90%;
            margin: 0 auto;  /* Center the container but remove top/bottom margin */
        }
        
        /* MODIFIED RULE */
        .scrolly-step {
            min-height: auto;
            align-items: flex-start;
            /* REMOVE the problematic margin-bottom from here */
        }
        
        /* NEW RULE */
        /* This is the key fix: Apply margin-top to every step EXCEPT the first one. */
        /* This creates the needed space between steps for scrollama to trigger correctly, */
        /* without adding a huge gap before the first step. */
        .scrolly-step:not(:first-of-type) {
            margin-top: 60vh; /* A bit more space can feel better on mobile */
        }

        /* Add some breathing room at the very end of the component */
        .scrolly-steps {
            padding-bottom: 30vh;
        }

        .legend-container {
            position: absolute; 
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-height: 25vh;
        }

        .side-image-container {
            display: none;
        }
    }
</style>