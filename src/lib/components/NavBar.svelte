<script>
    import { base } from '$app/paths';
  </script>
  
  <div class="top-ribbon">
    <a href="https://www.thedailystar.net" rel="noopener noreferrer" target="_blank">
      <img src="{base}/images/ds_logo.svg" alt="The Daily Star Logo" class="ribbon-logo" />
    </a>
  </div>
  
  <style>
    :root {
      --red-accent: #0e0d0d;
    }
    
    .top-ribbon {
      /* --- THE ONLY CHANGE IS HERE --- */
      position: absolute;   /* CHANGED: Was 'fixed', now 'absolute' */
      /* --- Everything else remains the same --- */
  
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 0;
      background-color: #f5f5f5;
      border-bottom: 2px solid var(--red-accent);
    }
  
    .ribbon-logo {
      height: 40px;
      width: auto;
    }
  
    @media (max-width: 768px) {
      .ribbon-logo {
        height: 30px;
      }
    }
  </style>