<!-- src/lib/components/Violations.svelte -->

<script>
    import { fly, fade } from 'svelte/transition';
  
    // The `href` properties have been removed.
    const legalViolations = [
      {
        id: 'conduct',
        heading: 'Code of Conduct for Law Enforcement Officials (1979)',
        content: [
          'According to the <a href="https://www.ohchr.org/en/instruments-mechanisms/instruments/code-conduct-law-enforcement-officials" target="_blank" rel="noopener noreferrer">Code of Conduct for Law Enforcement Officials (1979)</a>, lethal force may only be used when strictly necessary to protect human life and to the extent necessary to fulfill their duty.',
          'The <a href="https://www.ohchr.org/en/instruments-mechanisms/instruments/basic-principles-use-force-and-firearms-law-enforcement" target="_blank" rel="noopener noreferrer">United Nations Basic Principles on the Use of Force and Firearms by Law Enforcement Officials (1990)</a> further states that firearms must not be used to disperse assemblies unless safer options are not available and individuals are posing an imminent threat of death or serious injury. The cases of victims such as Ramzan, as documented in visual records, do not reflect such threats at the time they were shot.'
        ]
      },
      {
        id: 'covenant',
        heading: 'International Covenant on Civil and Political Rights (1966)',
        content: [
          "The <a href='https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-civil-and-political-rights' target='_blank' rel='noopener noreferrer'>International Covenant on Civil and Political Rights (1966)</a>, ratified by Bangladesh in 2000, guarantees every individual's right to life (Article 6(1)) and the right to peaceful assembly (Article 21). The actions captured in Rampura raise serious doubts about whether these protections were upheld during the operation."
        ]
      },
      {
        id: 'child_rights',
        heading: 'Convention on the Rights of the Child (1979)',
        content: [
          "Since 1990, Bangladesh is bound by the <a href='https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-child' target='_blank' rel='noopener noreferrer'>Convention on the Rights of the Child (1979)</a>, which recognises each child’s inherent right to life and mandates actions to ensure their survival and development(Article 6).",
          "The deaths of Ashiqul and 17-year-old Somudra, both students and both unarmed, raise serious questions about compliance with these protections."
        ]
      },
      {
        id: 'rome_statute',
        heading: 'Rome Statute of the International Criminal Court (1998)',
        content: [
          "The most serious implications may arise under the <a href='https://www.icc-cpi.int/resource-library/documents/rs-eng.pdf' target='_blank' rel='noopener noreferrer'>Rome Statute of the International Criminal Court (1998)</a>, which <a href='https://www.loc.gov/item/global-legal-monitor/2010-04-16/bangladesh-rome-statute-for-the-international-criminal-court-ratified/#:~:text=(Apr.,the%20International%20Criminal%20Court%20Ratified' target='_blank' rel='noopener noreferrer'>Bangladesh ratified in 2010</a>. Article 7 of the Rome Statute defines crimes against humanity as acts committed as part of a widespread or systematic attack against a civilian population. Relevant provisions include murder, persecution on political grounds, and other inhumane acts that cause serious injury or suffering.",
          'The UN report echoes this conclusion, stating that the use of force by Border Guard Bangladesh (BGB) "systematically failed to adhere to legal principles" and that "a large percentage of killings and injuries... violated international human rights law." It calls for an "independent and fair vetting process" of all BGB officers and recommends that until an effective human rights screening mechanism is established, the government should refrain from nominating for UN peacekeeping missions any personnel from the BGB Battalions deployed to the 2024 protests.'
        ]
      }
    ];
  
    let activeModal = null;
  </script>
  
  <div class="violations-section">
    <h2>A Catalogue of Violations of International Law.</h2>
    <p class="subtitle">
      Bangladesh is bound by a number of international treaties that set clear limits on the use of force by state authorities. 
    </p>
  
    <div class="info-grid">
      {#each legalViolations as violation (violation.id)}
        <button class="info-card" on:click={() => (activeModal = violation)}>
          <h3>{violation.heading}</h3>
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Modal Popup -->
  {#if activeModal}
    <div
      class="modal-overlay"
      on:click={() => (activeModal = null)}
      transition:fade={{ duration: 200 }}
    >
      <div
        class="modal-content"
        on:click|stopPropagation
        transition:fly={{ y: 20, duration: 300 }}
      >
        <button class="modal-close" on:click={() => (activeModal = null)} title="Close">&times;</button>
        <h2>{activeModal.heading}</h2>
        
        {#each activeModal.content as paragraph}
          <p>{@html paragraph}</p>
        {/each}
      </div>
    </div>
  {/if}
  
  <style>
    /* Styling for the inline links within the modal paragraphs */
    :global(.modal-content p a) {
      color: #b71c1c; /* A darker red to match the theme */
      text-decoration: underline;
      font-weight: 600;
    }
    :global(.modal-content p a:hover) {
      text-decoration: none;
    }
  
    .violations-section {
      padding: 2.5rem 0;
      border-top: 1px solid #e0e0e0;
      margin-top: 2.5rem;
    }
    
    /* MODIFIED: Increased font size and added margin */
    .violations-section h2 {
      font-family: 'Georgia', serif;
      font-size: 2.2rem;
      text-align: center;
      margin-bottom: 0.75rem;
    }

    /* MODIFIED: Increased bottom margin for more space */
    .violations-section .subtitle {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 3.5rem auto; /* More space before the grid */
      font-size: 1.1rem;
      color: #555;
    }
  
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  
    .info-card {
      background-color: #ffebee;
      border: 1px solid #f5c6cb;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      min-height: 180px;
    }
  
    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    }
  
    .info-card h3 {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 1.15rem;
      line-height: 1.4;
      font-weight: 600;
      color: #222;
      margin: 0;
    }
  
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 10, 10, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
  
    .modal-content {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      max-width: 680px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }
    
    .modal-content h2,
    .modal-content p {
      font-family: 'Georgia', serif;
    }
  
    .modal-close {
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 2.5rem;
      font-weight: 200;
      color: #888;
      line-height: 1;
      cursor: pointer;
    }
    
    @media (max-width: 700px) {
      .info-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  </style>