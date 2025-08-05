

<script>
	import '../app.css';
	
	// Import the global Mapbox CSS here.
	// This will load it once for your entire application.
	import 'mapbox-gl/dist/mapbox-gl.css';

	let { children } = $props();
</script>

{@render children()}