<!-- src/lib/components/Accordion.svelte -->

<script>
    // This state is LOCAL and INDEPENDENT for each instance of the component.
    let isOpen = false;
    let accordionContainer;
  
    // These props allow you to set custom button text for each accordion.
    export let openText = 'Read More';
    export let closeText = 'Show Less';
  
    function toggleAccordion() {
      if (isOpen) {
        // We only scroll into view if the element exists.
        if (accordionContainer) {
          accordionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      isOpen = !isOpen;
    }
  </script>
  
  <div class="accordion-container" bind:this={accordionContainer}>
    <!-- Content for the always-visible part will go here -->
    <slot name="visible-content" />
  
    <!-- Content for the collapsible part will go here -->
    <div class="accordion-collapsible-content" class:open={isOpen}>
      <slot name="collapsible-content" />
    </div>
  
    <!-- The button uses the props for its text -->
    <button class="accordion-toggle" on:click={toggleAccordion} aria-expanded={isOpen}>
      <span>{isOpen ? closeText : openText}</span>
      <svg class="icon" class:rotated={isOpen} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </button>
  </div>
  
  <style>
    /* All the accordion-related CSS now lives inside the component, where it is scoped. */
    .accordion-container {
      background-color: #f5c6cb;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2.5rem 0;
      border: 1px solid #e5e5e5;
    }
  
    .accordion-collapsible-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.6s ease-in-out;
    }
  
    .accordion-collapsible-content.open {
      max-height: 5000px; /* Adjust if needed for very long content */
      padding-top: 0.5rem;
    }
  
    .accordion-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
      background-color: transparent;
      border: 1px solid #ccc;
      border-radius: 20px;
      padding: 0.5rem 1rem;
      margin-top: 1.5rem;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
  
    .accordion-toggle:hover {
      background-color: #f0f0f0;
      border-color: #bbb;
    }
  
    .accordion-toggle .icon {
      transition: transform 0.3s ease-in-out;
    }
  
    .accordion-toggle .icon.rotated {
      transform: rotate(180deg);
    }
  </style>