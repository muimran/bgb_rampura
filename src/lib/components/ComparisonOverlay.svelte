<script>
  import { fade, fly } from 'svelte/transition';
  import { showComparison } from '$lib/stores.js';
  import SpeechGrid from './SpeechGrid.svelte';
</script>

{#if $showComparison}
<div class="overlay" transition:fade={{duration: 200}} on:click={() => showComparison.set(false)}>
  <div class="modal" transition:fly={{y: 40, duration: 400}} on:click|stopPropagation>
    <div class="modal-header">
      <h2>নির্বাচনী অগ্রাধিকার: তারেক বনাম শফিক</h2>
      <button class="close-btn" on:click={() => showComparison.set(false)}>✕</button>
    </div>
    
    <div class="comparison-grid">
      <div class="leader-section">
        <h3>তারেক রহমান</h3>
        <SpeechGrid leader="tarique" hideButton={true} />
      </div>
      <div class="leader-section">
        <h3>শফিকুর রহমান</h3>
        <SpeechGrid leader="shafique" hideButton={true} />
      </div>
    </div>
    <p class="footer-note">এই বিশ্লেষণটি ২০টি প্রধান নির্বাচনী জনসভার ওপর ভিত্তি করে করা হয়েছে।</p>
  </div>
</div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.92);
    z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .modal {
    background: white;
    width: 100%; max-width: 1200px;
    max-height: 95vh;
    padding: 30px; border-radius: 8px;
    overflow-y: auto;
  }
  .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; margin-bottom: 25px; padding-bottom: 10px; }
  .modal-header h2 { font-size: 1.5rem; margin: 0; }
  .close-btn { background: black; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; }
  
  .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .leader-section h3 { text-align: center; font-size: 1.3rem; margin-bottom: 5px; color: #e0115f; }
  
  .footer-note { text-align: center; color: #666; font-size: 0.85rem; margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px; }

  @media (max-width: 950px) {
    .comparison-grid { grid-template-columns: 1fr; }
    .modal { padding: 15px; }
  }
</style>