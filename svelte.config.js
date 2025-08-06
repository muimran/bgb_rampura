// Import the static adapter
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Use the static adapter
		adapter: adapter({
			// default options are fine
		}),

		// This is the crucial part for the subfolder
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/bgb' : ''
		}
	}
};

export default config;