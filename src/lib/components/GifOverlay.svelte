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
    export let gifSrc = '';
    /** @type {{x: number, y: number}} */ // <<< NEW: Define the new prop
    export let anchorOffset = { x: 0, y: 0 }; // Default to no offset
  
    let gifBoxElement;
    let boxPosition = { top: 0, left: 0 };
    let lineCoords = { x1: 0, y1: 0, x2: 0, y2: 0 };
  
    const updateLinePosition = async () => {
      await tick();
      if (!isActive || !map || !lngLat || !gifBoxElement) return;
  
      const markerScreenPos = map.project(lngLat);
      const boxRect = gifBoxElement.getBoundingClientRect();
      const verticalOffset = 220;
  
      // <<< MODIFIED: Define the true anchor point by applying the offset
      const targetPoint = {
        x: markerScreenPos.x + anchorOffset.x,
        y: markerScreenPos.y + anchorOffset.y
      };
  
      // Calculate box position based on the *new* targetPoint
      const newLeft = targetPoint.x - (boxRect.width / 2);
      const newTop = targetPoint.y - boxRect.height - verticalOffset;
      boxPosition = { top: newTop, left: newLeft };
  
      // Draw the line to and from the *new* targetPoint
      lineCoords = {
        x1: targetPoint.x,
        y1: targetPoint.y - verticalOffset,
        x2: targetPoint.x,
        y2: targetPoint.y
      };
    };
  
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
  
  <!-- The template and styles below are unchanged -->
  
  {#if isActive && gifSrc}
    <svg class="leader-line-svg">
      <line
        x1={lineCoords.x1}
        y1={lineCoords.y1}
        x2={lineCoords.x2}
        y2={lineCoords.y2}
        stroke="white"
        stroke-width="1.5"
      />
    </svg>
  
    <div 
      class="gif-box-container" 
      bind:this={gifBoxElement}
      style="top: {boxPosition.top}px; left: {boxPosition.left}px;"
    >
      <div class="gif-box">
        <img src={gifSrc} alt="Contextual GIF" class="gif-content" />
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
      transition: top 0.1s linear, left 0.1s linear;
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