<!-- src/lib/components/CustomVideoPlayer.svelte -->
<script>
    // Props
    export let videoId;
    export let title = "YouTube video player";
    export let orientation = 'horizontal'; // New prop! Can be 'horizontal' or 'vertical'.
  
    let showVideo = false;
  
    function playVideo() {
      showVideo = true;
    }
  
    // Use the highest quality thumbnail available
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  </script>
  
  <!-- The main div now uses Svelte's class directive to apply the correct aspect ratio -->
  <div class="video-container" class:horizontal={orientation === 'horizontal'} class:vertical={orientation === 'vertical'}>
    {#if !showVideo}
      <button on:click={playVideo} class="video-facade" style="background-image: url({thumbnailUrl});" aria-label="Play video: {title}">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="white" style="filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));">
          <path d="M3 22v-20l18 10-18 10z"/>
        </svg>
      </button>
    {:else}
      <iframe
        class="video-iframe"
        src="https://www.youtube.com/embed/{videoId}?autoplay=1&rel=0"
        {title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    {/if}
  </div>
  
  <style>
    .video-container {
      width: 100%;
      margin: 1.5em 0;
      position: relative;
      overflow: hidden; /* Ensures facade stays within rounded corners if you add them */
    }
    
    /* --- NEW: Aspect Ratio Classes --- */
    .horizontal {
      aspect-ratio: 16 / 9;
    }
    .vertical {
      aspect-ratio: 9 / 16;
    }
  
    .video-facade {
      width: 100%;
      height: 100%;
      border: none;
      padding: 0;
      cursor: pointer;
      background-size: cover;
      background-position: center;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.2s ease-out;
    }
    
    .video-facade:hover {
      transform: scale(1.02);
    }
  
    .video-facade svg {
      transition: transform 0.2s ease;
    }
  
    .video-facade:hover svg {
      transform: scale(1.1);
    }
  
    .video-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>