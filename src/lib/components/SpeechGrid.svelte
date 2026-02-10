<script>
  import { showComparison } from '$lib/stores.js';
  export let leader = "tarique"; 
  export let hideButton = false;

  const dataMap = {
    tarique: [
      { t: "প্রতিপক্ষের প্রতি আক্রমন", p: 11.67 }, { t: "কৃষি", p: 10.61 }, { t: "শেখ হাসিনার আমল", p: 8.31 },
      { t: "কর্মসংস্থান / বেকারত্ব", p: 5.89 }, { t: "নারী", p: 5.60 }, { t: "স্বাস্থ্য", p: 2.84 },
      { t: "দুর্নীতি", p: 2.29 }, { t: "দ্রব্যমূল ও অর্থনীতি", p: 2.20 }, { t: "সংখ্যালঘু অধিকার", p: 2.14 },
      { t: "আইনশৃঙ্খলা পরিস্থিতি", p: 1.50 }, { t: "অন্যান্য", p: 44.95 }, { t: "ধর্ম", p: 0.96 },
      { t: "শিক্ষা", p: 0.71 }, { t: "গুম, খুন ও মানবাধিকার", p: 0.15 }, { t: "ভারত বাংলাদেশ সম্পর্ক", p: 0.13 },
      { t: "মত প্রকাশের স্বাধীনতা", p: 0.05 }, { t: "(পররাষ্ট্রনীতি)", p: 0 }, { t: "জুলাই হত্যাকান্ডের বিচার", p: 0 }
    ],
    shafique: [
      { t: "অন্যান্য", p: 55.76 }, { t: "প্রতিপক্ষের প্রতি আক্রমন", p: 11.10 }, { t: "শেখ হাসিনার আমল", p: 6.09 },
      { t: "নারী", p: 5.14 }, { t: "দুর্নীতি", p: 4.53 }, { t: "ধর্ম", p: 3.22 },
      { t: "কর্মসংস্থান / বেকারত্ব", p: 2.97 }, { t: "গুম, খুন ও মানবাধিকার", p: 2.71 }, { t: "শিক্ষা", p: 1.90 },
      { t: "সংখ্যালঘু অধিকার", p: 1.75 }, { t: "আইনশৃঙ্খলা পরিস্থিতি", p: 1.71 }, { t: "দ্রব্যমূল ও অর্থনীতি", p: 1.21 },
      { t: "মত প্রকাশের স্বাধীনতা", p: 0.66 }, { t: "কৃষি", p: 0.63 }, { t: "স্বাস্থ্য", p: 0.46 },
      { t: "(পররাষ্ট্রনীতি)", p: 0.15 }, { t: "ভারত বাংলাদেশ সম্পর্ক", p: 0 }, { t: "জুলাই হত্যাকান্ডের বিচার", p: 0 }
    ]
  };

  $: sortedData = [...dataMap[leader]].sort((a, b) => b.p - a.p);

  const otherLeaderName = leader === "tarique" ? "শফিকুর রহমান" : "তারেক রহমান";

  function getSolidColor(pct) {
    if (pct === 0) return "background-color: #ffffff;";
    const maxScalePct = 12; 
    const ratio = Math.min(pct / maxScalePct, 1);
    const r = Math.round(255 - (255 - 185) * ratio);
    const g = Math.round(255 - (255 - 28) * ratio);
    const b = Math.round(255 - (255 - 27) * ratio);
    return `background-color: rgb(${r}, ${g}, ${b});`;
  }
</script>

<div class="viz-card">
  <div class="grid-container">
    {#each sortedData as item}
      <div class="cell" style={getSolidColor(item.p)}>
        <div class="topic">{item.t}</div>
        {#if item.p > 0}
          <div class="pct">{item.p.toFixed(1)}%</div>
        {/if}
      </div>
    {/each}
  </div>

  {#if !hideButton}
    <button class="compare-btn" on:click={() => showComparison.set(true)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
      </svg>
      {otherLeaderName}-এর সাথে তুলনা করুন
    </button>
  {/if}
</div>

<style>
  .viz-card { max-width: 550px; margin: 2rem auto; padding: 15px; background: #fff; }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: repeat(6, 1fr);    
    background-color: #000; 
    gap: 3px;               
    border: 3px solid #000; 
  }

  .cell {
    aspect-ratio: 1.5 / 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 8px;
    background-color: #fff;
    font-family: 'Tiro Bangla', serif;
  }

  .topic { font-size: 0.9rem; font-weight: bold; color: #000; line-height: 1.1; }
  .pct { font-size: 0.8rem; color: #000; margin-top: 4px; font-weight: bold; }

  .compare-btn {
    width: 100%; margin-top: 15px; padding: 12px; background: #000; color: #fff;
    border: none; border-radius: 4px; font-family: 'Tiro Bangla', serif;
    font-weight: bold; font-size: 1.1rem; cursor: pointer; display: flex;
    align-items: center; justify-content: center; gap: 10px; transition: all 0.2s ease;
  }

  .compare-btn:hover { background: #b91c1b; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(185, 28, 27, 0.3); }

  @media (max-width: 500px) {
    .topic { font-size: 0.75rem; }
    .pct { font-size: 0.65rem; }
    .grid-container { gap: 2px; border-width: 2px; }
  }
</style>