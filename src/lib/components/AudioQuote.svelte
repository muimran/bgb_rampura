<script>
  import { activeAudio } from '$lib/stores.js';
  import { base } from '$app/paths'; // Required for subdirectory hosting
  
  export let src; // Example: "/audio/01.wav"
  export let text; // The quote text

  let audio;
  let isPlaying = false;
  let progress = 0;

  // Stop this audio if another AudioQuote component starts playing
  $: if ($activeAudio !== src && isPlaying) {
    handleStop();
  }

  function togglePlay() {
    if (isPlaying) {
      handleStop();
      activeAudio.set(null);
    } else {
      activeAudio.set(src);
      audio.play();
      isPlaying = true;
    }
  }

  function handleStop() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    isPlaying = false;
    progress = 0;
  }

  function updateProgress() {
    if (audio.duration) {
      progress = (audio.currentTime / audio.duration) * 100;
    }
  }

  function handleEnded() {
    handleStop();
    activeAudio.set(null);
  }
</script>

<span class="audio-quote-root">
  <!-- We prepend {base} to the src so it works in subdirectories -->
  <audio 
    bind:this={audio} 
    src="{base}{src}" 
    on:timeupdate={updateProgress} 
    on:ended={handleEnded}
    preload="metadata">
  </audio>
  
  <span 
    class="text-body" 
    class:is-playing={isPlaying}
    style="--progress: {progress}%"
  >
    {text}
  </span>

  <button class="play-button" class:active={isPlaying} on:click={togglePlay}>
    <span class="icon-box">
      {#if isPlaying}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
        </svg>
      {:else}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {/if}
    </span>
    <span class="btn-text">{isPlaying ? 'থামান' : 'শুনুন'}</span>
  </button>
</span>

<style>
  .audio-quote-root {
    display: inline;
    position: relative;
    line-height: inherit;
  }

  .text-body {
    display: inline;
    padding-bottom: 4px;
    /* Base dashed line */
    background-image: linear-gradient(to right, #ccc 50%, rgba(255,255,255,0) 0%);
    background-position: 0 bottom;
    background-size: 8px 2px;
    background-repeat: repeat-x;
    transition: color 0.3s ease;
  }

  /* Progress Line overlay */
  .text-body.is-playing {
    background-image: 
      linear-gradient(to right, #b91c1b var(--progress), transparent var(--progress)), 
      linear-gradient(to right, #ccc 50%, rgba(255,255,255,0) 0%);
    background-size: 100% 2px, 8px 2px;
    background-repeat: no-repeat, repeat-x;
    color: #111;
  }

  .play-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1.5px solid #b91c1b;
    color: #b91c1b;
    padding: 2px 10px;
    margin-left: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Tiro Bangla', serif;
    font-size: 0.85rem;
    font-weight: bold;
    vertical-align: middle;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .play-button.active {
    background: #b91c1b;
    color: #fff;
  }

  .play-button:hover {
    background: #fdf2f2;
    transform: translateY(-1px);
  }
  
  .play-button.active:hover {
    background: #991717;
  }

  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-text {
    line-height: 1;
    padding-top: 2px;
  }
</style>