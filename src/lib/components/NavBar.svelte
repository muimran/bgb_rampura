<script>
    import { base } from '$app/paths';
</script>
  
<div class="top-ribbon">
    <a href="https://www.thewhistle.news/" rel="noopener noreferrer" target="_blank">
        <img src="{base}/images/logo.png" alt="The Whistle Logo" class="ribbon-logo" />
    </a>
</div>
  
<style>
    :root {
      --red-accent: #0e0d0d;
    }
    
    .top-ribbon {
      /* CHANGED: 'fixed' keeps it in one spot on the screen */
      position: fixed;   
      
      top: 0;
      left: 0;
      width: 100%;
      
      /* LOWERED: This allows page content with higher z-index to slide OVER it */
      z-index: 1; 
      
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 0;
      background-color: #f5f5f5;
      border-bottom: 2px solid var(--red-accent);
      
      /* Optional: height matches the padding + logo height (~72px) */
      height: 72px; 
      box-sizing: border-box;
    }
  
    .ribbon-logo {
      height: 40px;
      width: auto;
    }
  
    @media (max-width: 768px) {
      .top-ribbon { height: 62px; }
      .ribbon-logo { height: 30px; }
    }
</style>