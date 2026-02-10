<script>
  import { base } from '$app/paths';
</script>

<div class="hero-container">
  <!-- 1. The Image - Using height: auto to preserve natural position -->
  <img src="{base}/images/header.jpeg" alt="Election Story Header" class="hero-image" />
  
  <!-- 2. The Gradient Overlay - Absolute so it doesn't push the image -->
  <div class="fade-overlay"></div>
</div>

<style>
  .hero-container {
    position: relative;
    width: 100%;
    /* Remove fixed VH height to let the image breathe naturally */
    overflow: hidden;
    background-color: #fff; 
  }

  .hero-image {
    width: 100%;
    height: auto; /* Natural height prevents "pushing" or cropping */
    display: block;
  }

  .fade-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    /* Covers the bottom 10% for a subtle transition */
    height: 12%; 
    
    /* Fade from transparent to solid white */
    background: linear-gradient(
      to bottom, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 1) 100%
    );
    
    pointer-events: none;
    z-index: 2;
  }
</style>