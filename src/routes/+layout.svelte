<!-- src/routes/+layout.svelte -->
<script>
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
	import 'mapbox-gl/dist/mapbox-gl.css';

	let { children } = $props();
</script>

<!-- The Header will now appear on every page -->
<Header />

<!-- 
  It's a best practice to wrap your page content in a <main> tag 
  for accessibility and semantic HTML.
-->
<main>
	{@render children()}
</main>

<!-- You could also add a shared Footer component here -->
<!-- <Footer /> -->