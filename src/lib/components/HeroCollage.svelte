<!-- src/lib/components/HeroImage.svelte (or whatever you name it) -->
<script>
  import { base } from '$app/paths';
</script>

<!--
  This component is now ONLY the 100vh hero image.
  The logo ribbon has been removed and will be handled by the Navbar in +layout.svelte.
-->
<div class="header-container">
  <!-- The logo ribbon has been removed from here -->

  <!-- Full-screen background image -->
  <img src="{base}/images/header.jpeg" alt="An illustration of an eye made of circuitry." class="header-image" />
</div>
  
<style>
  .header-container {
    position: relative; 
    width: 100%;
    height: 100vh; /* This makes it take up the full screen height */
    overflow: hidden;
  }

  /* The .top-ribbon and .ribbon-logo styles have been removed */

  .header-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; 
    /* z-index is no longer needed as there's nothing to layer */
  }

  /* Mobile styles for ribbon are also removed */
</style>