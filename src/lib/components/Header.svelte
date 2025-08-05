<script>
  import { base } from '$app/paths';
</script>

<!-- 
  MODIFIED MARKUP:
  - The container now holds the image and the text overlay as direct children.
  - The image acts as a background layer.
  - The text-overlay sits on top.
-->
<div class="header-container">
    <!-- Image is the background layer -->
    <img src="{base}/images/header.jpeg" alt="An illustration of an eye made of circuitry." class="header-image" />
  
    <!-- All text content is inside a single "overlay" wrapper -->
    <div class="text-overlay">
      <div class="content-wrapper">
        <a href="{base}/" rel="noopener noreferrer">
          <img src="{base}/images/ds_logo.svg" alt="The Daily Star Logo" class="logo-image" />
        </a>
        
        <div class="embellishment">
          <hr class="separator-line" />
        </div>

        <h1 class="article-headline">
          <span class="line-1">SURVEILLANCE</span>
          <span class="line-2">REPUBLIC</span>
        </h1>

        <div class="byline">
          <p>Zyma Islam, Mohammad Suman and Mahmudul Hasan</p>
        </div>
      </div>
    </div>
</div>
  
<style>
/* --- BASE DESKTOP STYLES (for large screens) --- */
.header-container {
  /* Set up as a positioning context for the layers inside */
  position: relative; 
  /* Use flexbox to easily center the text-overlay child */
  display: flex; 
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  text-align: center;
}

.header-image {
  /* Position it as a background layer, stretched to fill the container */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 'cover' ensures the image fills the screen without distortion, cropping if necessary */
  object-fit: cover; 
  /* Push it behind the text content */
  z-index: -1; 
}

/* This is the div that sits on top of the image */
.text-overlay {
  position: relative; /* Stays in the normal document flow */
  z-index: 1; /* Ensures it's above the background image */
  /* Add a semi-transparent dark overlay to make text more readable */
  background-color: rgba(0, 0, 0, 0.3);
  padding: 2rem;
  border-radius: 8px; /* Optional: soften the edges */
  max-width: 90%; /* Prevent it from getting too wide on huge screens */
}

.content-wrapper {
  /* This wrapper now just holds the content, no special positioning needed */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
}

.logo-image {
  width: 200px;
  height: auto;
}

.embellishment {
  margin: 2rem 0;
  width: 100%;
  text-align: center;
}

.separator-line {
  border: none;
  height: 1px;
  /* A semi-transparent white line looks good on dark overlays */
  background-color: rgba(255, 255, 255, 0.35);
  width: 60px;
  margin: 0 auto;
}

.article-headline {
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 700;
  /* White text for better contrast on a dark/image background */
  color: #ffffff; 
  line-height: 1.1;
  margin: 0;
  width: 100%;
}

.article-headline span {
  display: block;
}

.line-1 {
  font-size: 5rem;
  /* A brighter red often works better for contrast on a dark background */
  color: #ff5252;
  margin-bottom: 0.05em;
  letter-spacing: -0.01em;
}

.line-2 {
  font-size: 5rem;
  letter-spacing: -0.01em;
}

.byline {
  margin-top: 2.5rem;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1rem;
  font-weight: 400;
  /* A light gray for the byline text */
  color: #e0e0e0;
  line-height: 1.6;
}

.byline p {
  margin: 0;
}


/* --- MOBILE STYLES --- */
@media (max-width: 768px) {
  .header-container {
    min-height: 100vh;
  }
  
  .text-overlay {
    padding: 1.5rem;
    /* A slightly darker overlay can help readability on small, bright screens */
    background-color: rgba(0, 0, 0, 0.5);
    max-width: 95%;
  }

  .content-wrapper {
    padding: 0;
  }

  .logo-image {
    width: 150px;
  }

  .line-1,
  .line-2 {
    font-size: 10vw; /* Responsive font size based on viewport width */
    letter-spacing: 0.02em;
  }

  .byline {
    margin-top: 2rem;
  }
}
</style>