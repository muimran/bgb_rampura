<script>
	// Use the new Navbar component
	  import Navbar from '$lib/components/NavBar.svelte';
	  import '../app.css';
	  import 'mapbox-gl/dist/mapbox-gl.css';
  
	  let { children } = $props();
  </script>
  
  <!-- The Navbar will now appear on every page -->
  <Navbar />
  
  <main>
	  {@render children()}
  </main>