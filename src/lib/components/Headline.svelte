<script>
    // In a real-world app, you would pass these as props like so:
    // export let titleLines;
    // export let authors;

    /**
     * The date the article was originally published.
     * @type {Date}
     */
    export let publishedDate;

    /**
     * The date the article was last updated. This is optional.
     * @type {Date | undefined}
     */
    export let updatedDate;

    // A helper function to format dates into a readable string like "July 22, 2024"
    const formatDate = (date) => {
    if (!date) return '';

    // Add the 'weekday' option to the options object
    return date.toLocaleDateString('en-US', {
        weekday: 'long', // This is the new addition
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

    // Reactive declarations to automatically format dates when the props change
    $: formattedPublished = formatDate(publishedDate);
    $: formattedUpdated = formatDate(updatedDate);

</script>
  
<div class="headline-container">
    <h1 class="article-headline">
        <span class="line-1">July Uprising</span>
        <span class="line-2">Anatomy of BGB shootings in</span>
        <span class="line-3">Rampura</span>
    </h1>
    
    <p class="standfirst-text">
        A joint investigation by The Daily Star and Tech Global Institute reveals how a Dhaka neighbourhood became a hotspot of state-sanctioned killings on July 19, 2024
    </p>

    <!-- ADDED: Date information block -->
    <div class="date-info">
        {#if formattedPublished}
            <p>
                <span class="date-label">Published:</span>
                <!-- The <time> tag is semantically correct for dates and good for SEO/accessibility -->
                <time datetime={publishedDate.toISOString()}>
                    {formattedPublished}
                </time>
            </p>
        {/if}
        <!-- Only show the updated date if it exists and is different from the published date -->
        {#if formattedUpdated && formattedUpdated !== formattedPublished}
            <p>
                <span class="date-label">Updated:</span>
                <time datetime={updatedDate.toISOString()}>
                    {formattedUpdated}
                </time>
            </p>
        {/if}
    </div>

    <div class="byline">
        <p><span class="credit-label">Reporting:</span> Mashfiq Mizan and Naimur Rahman</p>
        <p><span class="credit-label">Research:</span> Keero Adhnan Ahmed, Ibrahim Khalil Ibu, Sharmin Sikder, Towhidul Islam Sakib</p>
        <p><span class="credit-label">Forensic Investigation</span> Sams Wahid and Mohammad Arafat, Tech Global Institute</p>
        <p><span class="credit-label">Visualisation and Map:</span> Muhammad Imran</p>
        <p><span class="credit-label">Photos:</span> Ibrahim Khalil Ibu, Collected</p>
        <p><span class="credit-label">Graphics:</span> Anwar Sohel</p>
        <p><span class="credit-label">Editing:</span> Martin Swapan Pandey</p>
    </div>
</div>
  
<style>
    :root {
      --headline-red: #B91C1C;
      --headline-dark: #1F2937;
      --byline-gray: #4B5563;
    }
  
    .headline-container {
  max-width: 680px; /* Changed from 720px to match article text */
  margin: 0 auto;
  padding: 4rem 26px 0 26px; /* Changed horizontal padding from 2rem to 26px */
  text-align: left;
}
  
    .article-headline {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-weight: 700;
      line-height: 1.1;
      margin: 0 0 2rem 0;
    }
  
    .article-headline span {
      display: block;
    }
    
    .line-1 {
      color: var(--headline-red);
      font-size: 3rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  
    .line-2, .line-3 {
      color: var(--headline-dark);
      font-size: 3.5rem;
      font-weight: 800;
    }

    .standfirst-text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 1.25rem;
      color: var(--headline-dark);
      line-height: 1.6;
      margin: 0 0 2rem 0;
    }

    /* --- NEW: Date Styles --- */
    .date-info {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 0.9rem;
      color: var(--byline-gray);
      margin-bottom: 2rem; /* Adds space between the dates and the byline */
      line-height: 1.6;
    }

    .date-info p {
      margin: 0 0 0.25em 0;
    }

    .date-label {
      font-weight: 600;
      color: var(--headline-dark);
      margin-right: 0.5em;
    }
    /* --- END: Date Styles --- */
  
    .byline {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 0.9rem;
      font-weight: 400;
      color: var(--byline-gray);
      line-height: 1.6;
      padding-bottom: 4rem;
    }
  
    .byline p {
      margin: 0 0 0.25em 0;
    }
  
    .credit-label {
      font-weight: 600;
      color: var(--headline-dark);
      margin-right: 0.5em;
    }

    /* --- MOBILE STYLES --- */
/* AFTER */
@media (max-width: 700px) { /* Matched breakpoint from page */
  .headline-container {
    /* Matched padding from .article-text on mobile */
    padding: 3rem 5vw 0 5vw; 
  }
  .byline {
    padding-bottom: 3rem;
  }

  .line-1 { font-size: 2rem; }
  .line-2, .line-3 { font-size: 2.5rem; }
  .standfirst-text { font-size: 1.1rem; }
}
</style>