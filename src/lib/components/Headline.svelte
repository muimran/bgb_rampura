<script>
    export let publishedDate;
    export let updatedDate;

    export let line1 = "নির্বাচন ২০২৬";
    export let title = "কথার বন্যায় নিরবতার রাজনীতি";
    export let standfirst = "দুই প্রধান দলের শীর্ষ নেতার নির্বাচনী জনসভাগুলোর বক্তব্য বিশ্লেষণ করে দেখেছে দ্য হুইসেল।";

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    $: formattedPublished = formatDate(publishedDate);
    $: formattedUpdated = formatDate(updatedDate);
</script>
  
<div class="headline-container">
    <h1 class="article-headline">
        <span class="line-1">{line1}</span>
        <span class="line-2">{title}</span>
    </h1>
    
    <p class="standfirst-text">
        {standfirst}
    </p>

    <div class="date-info">
        {#if formattedPublished}
            <p>
                <span class="date-label">Published:</span>
                <time datetime={publishedDate?.toISOString() || ''}>
                    {formattedPublished}
                </time>
            </p>
        {/if}
        {#if formattedUpdated && formattedUpdated !== formattedPublished}
            <p>
                <span class="date-label">Updated:</span>
                <time datetime={updatedDate?.toISOString() || ''}>
                    {formattedUpdated}
                </time>
            </p>
        {/if}
    </div>

    <div class="byline">
        <p><span class="credit-label">Reporting:</span> দ্য হুইসেল টিম</p>
        <p><span class="credit-label">Visualisation:</span> মোহাম্মদ ইমরান</p>
    </div>
</div>
  
<style>
    .headline-container {
        max-width: 680px; 
        margin: 0 auto;
        padding: 4rem 26px 0 26px; 
        text-align: left;
        font-family: 'Tiro Bangla', serif;
    }
  
    .article-headline {
      font-weight: bold;
      line-height: 1.1;
      margin: 0 0 2rem 0;
    }
  
    .article-headline span {
      display: block;
    }
    
    .line-1 {
      color: #b91c1b;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
  
    .line-2 {
      color: #1a1a1a;
      font-size: 3.5rem;
    }

    .standfirst-text {
      font-size: 1.3rem;
      color: #333;
      line-height: 1.6;
      margin: 0 0 2rem 0;
    }

    .date-info {
      font-size: 1rem;
      color: #666;
      margin-bottom: 2rem; 
      line-height: 1.6;
    }

    .date-label {
      font-weight: bold;
      color: #111;
      margin-right: 0.5em;
    }
  
    .byline {
      font-size: 1rem;
      color: #444;
      line-height: 1.6;
      padding-bottom: 4rem;
    }
  
    .credit-label {
      font-weight: bold;
      color: #111;
      margin-right: 0.5em;
    }

    @media (max-width: 700px) { 
      .headline-container { padding: 3rem 5vw 0 5vw; }
      .line-1 { font-size: 1.8rem; }
      .line-2 { font-size: 2.4rem; }
      .standfirst-text { font-size: 1.15rem; }
    }
</style>