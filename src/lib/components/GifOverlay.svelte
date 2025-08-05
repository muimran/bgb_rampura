<!-- src/lib/components/GifOverlay.svelte -->

<script>
    import { onMount, tick } from 'svelte';
  
    /** @type {import('mapbox-gl').Map | null} */
    export let map = null;
    /** @type {boolean} */
    export let isActive = false;
    /** @type {[number, number] | null} */
    export let lngLat = null;
    /** @type {string} */
    export let mediaSrc = ''; 
    /** @type {{x: number, y: number}} */
    export let anchorOffset = { x: 0, y: 0 };
    /** @type {string} */
    export let lineColor = 'white';
  
    let gifBoxElement;
    let boxPosition = { top: 0, left: 0 };
    let lineCoords = { x1: 0, y1: 0, x2: 0, y2: 0 };
  
    const updateLinePosition = async () => {
      // Wait for the DOM elements to exist before trying to measure them
      await tick();
      if (!isActive || !map || !lngLat || !gifBoxElement) return;
  
      const markerScreenPos = map.project(lngLat);
      const boxRect = gifBoxElement.getBoundingClientRect();
      
      // If the box has no size yet (image not loaded), we can't position it correctly.
      if (boxRect.width === 0 || boxRect.height === 0) {
        return;
      }
      
      const verticalOffset = 20;
  
      const targetPoint = {
        x: markerScreenPos.x + anchorOffset.x,
        y: markerScreenPos.y + anchorOffset.y
      };
  
      const newLeft = targetPoint.x - (boxRect.width / 2);
      const newTop = targetPoint.y - boxRect.height - verticalOffset;
      boxPosition = { top: newTop, left: newLeft };
  
      lineCoords = {
        x1: targetPoint.x,
        y1: targetPoint.y - verticalOffset,
        x2: targetPoint.x,
        y2: targetPoint.y
      };
    };
  
    // This function is called by the on:load event on the image tag.
    // It guarantees we only calculate the position after we know the image's dimensions.
    function handleImageLoad() {
      console.log(`Image loaded: ${mediaSrc}. Recalculating position.`);
      updateLinePosition();
    }
  
    // This reactive block handles the initial appearance when props change
    // and when the map is panned or zoomed.
    $: if (map && isActive && lngLat) {
      updateLinePosition();
    }
  
    onMount(() => {
      if (map) {
        map.on('move', updateLinePosition);
      }
      return () => {
        if (map) {
          map.off('move', updateLinePosition);
        }
      };
    });
  </script>
  
  {#if isActive && mediaSrc}
    <svg class="leader-line-svg">
      <line
        x1={lineCoords.x1}
        y1={lineCoords.y1}
        x2={lineCoords.x2}
        y2={lineCoords.y2}
        stroke={lineColor}
        stroke-width="1.5"
      />
    </svg>
  
    <div 
      class="gif-box-container" 
      bind:this={gifBoxElement}
      style="top: {boxPosition.top}px; left: {boxPosition.left}px;"
    >
      <div class="gif-box">
        <img src={mediaSrc} alt="Contextual Media" class="gif-content" on:load={handleImageLoad} />
      </div>
    </div>
  {/if}
  
  <style>
    .leader-line-svg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10;
    }
  
    .gif-box-container {
      position: absolute;
      z-index: 11;
      /* The CSS transition is removed to prevent the "running" effect. 
         The component will now snap into the correct position. */
    }
  
    .gif-box {
      width: 250px;
      height: 140px;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      padding: 4px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .gif-content {
      max-width: 100%;
      max-height: 100%;
      display: block;
    }
  </style>