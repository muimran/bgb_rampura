<!-- +page.svelte -->

<script>
  import { fly, fade } from 'svelte/transition';
  import BdrMap from '$lib/components/BdrMap.svelte';
  import { base } from '$app/paths'; 
  import CustomVideoPlayer from '$lib/components/CustomVideoPlayer.svelte';
  import Violations from '$lib/components/Violations.svelte';
  import Accordion from '$lib/components/Accordion.svelte';
  import HeroCollage from '$lib/components/HeroCollage.svelte';
  import Navbar from '$lib/components/NavBar.svelte';
  import Headline from '$lib/components/Headline.svelte'; // Your new component


  // --- NEW DATA AND LOGIC FOR VICTIM POPUPS ---

  // 1. Data for each victim is organized here
  const victimsData = [
    {
      id: 'ramzan',
      image: 'ramjan.jpg',
      name: 'Ramzan, 24',
      meta: 'Shot at 9:46am on July 19. DIT Road, Rampura. Fatal gunshot to the neck.',
      quote: '“Around 10:00am on July 19, our relatives called us and said Ramzan had been shot. I asked, “Will he survive?" They replied, ‘He is already dead.’ A bullet struck his neck. Later, witnesses told me the BGB shot him.”',
      cite: '– Liton Mia, Ramzan’s father.'
    },
    {
      id: 'ashiqul',
      image: 'ashiqul.jpeg',
      name: 'Ashiqul Islam, 14',
      meta: 'Shot at 6:14pm on July 19. Banasree, G Block, Road 1. Fatal gunshot to the head.',
      quote: '“I raised him with tears, sweat, and blood as a single mother. My world revolved around him. Seeing his body, I fainted. Will we ever get justice?”',
      cite: '– Alisha Afroze, mother.'
    },
    {
      id: 'samudra',
      image: 'samudra.jpeg',
      name: 'Mostofa Zaman Samudra, 17',
      meta: 'Shot around 3:30pm on July 19. Near Rampura TV Centre. Fatal gunshot to the torso.',
      quote: '“He replied, ‘Ma, don’t worry, I’ll be back in two minutes.’ That was the last time I heard his voice.”',
      cite: '– Masuda Zaman, mother.'
    },
    {
      id: 'ismail',
      image: 'ismail.jpg',
      name: 'Ismail, 46',
      meta: 'Shot around 4:50pm on July 19. In front of Delta Hospital, Rampura. Fatal gunshot to the head & chest.',
      quote: '"The ambulance carrying his body was intercepted by BGB personnel twice... They let us go after we told them he died in a rickshaw accident."',
      cite: '– Lucky Begum, wife.'
    },
    {
      id: 'kamrul',
      image: 'kamrul.jpg',
      name: 'Md Kamrul, 21',
      meta: 'Shot around 3:30pm on July 19. Banasree end of Rampura canal. Leg amputated.',
      quote: '"Police stopped the ambulance that was carrying me... they wanted to arrest me... Following two operations, my leg had to be amputated."',
      cite: '– Md Kamrul'
    },
    {
      id: 'nadim',
      image: 'nadim.png',
      name: 'Nadim, 38',
      meta: 'Shot after Juma prayers on July 19. Near Rampura Police Station. Fatal gunshot to the abdomen.',
      quote: '“In the evening, some young people brought his body to our home. A bullet had hit him in the stomach and exited through his back.”',
      cite: '– Ms Sneha, Nadim’s Wife.'
    }
  ];

  // 2. This variable controls which victim's modal is open
  let activeVictim = null;
</script>

<svelte:head>
  <!-- STEP 1: ADD THE GOOGLE FONT IMPORT HERE -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "Lethal vs Nonlethal Ammunition Visualisation",
      "description": "An interactive visualisation built using SvelteKit.",
      "datePublished": "2025-08-02",
      "author": [
        { "@type": "Person", "name": "Muhammad Imran", "url": "https://muhammadimran.com" },
        { "@type": "Person", "name": "Zyma Islam" }
      ],
      "keywords": ["Bangladesh", "data journalism"]
    })}
  </script>
</svelte:head>

<style>
  .article-text {
    max-width: 680px;
    margin: 2.5rem auto;
    font-family: 'Georgia', serif;
    font-size: 1.16rem;
    line-height: 1.5;
    color: #222;
    padding: 0 26px;
  }

  .article-text h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .accordion-heading {
    margin-top: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #1a1a1a;
  }


/* --- NEW: Hyperlink Styles --- */
.article-text a {
  color: #007bff; /* A clear, standard blue */
  text-decoration: underline; /* Underlines make links obvious */
  transition: color 0.2s ease; /* Adds a smooth transition for the hover effect */
}

/* Style for when a user hovers over a link */
.article-text a:hover {
  color: #0056b3; /* A darker blue for the hover effect */
}

/* Style for links that have already been visited */
.article-text a:visited {
  color: #663399; /* A standard purple for visited links */
}

  @media (max-width: 700px) {
    .article-text {
      padding: 0 5vw;
    }
  }

  .article-text p { margin: 1.2em 0; }
  .video-embed, .video-embed-horizontal { width: 100%; border: none; margin: 1.5em 0; }
  .video-embed { aspect-ratio: 9 / 16; }
  .video-embed-horizontal { aspect-ratio: 16 / 9; }
  .article-image { width: 100%; height: auto; display: block; }
  figure { margin: 1.5em 0; padding: 0; }
  figcaption { margin-top: 0.75em; padding: 0 1em; font-size: 0.9rem; line-height: 1.4; color: #555; text-align: center; }

  /* --- NEW STYLES FOR INTERACTIVE VICTIM GRID AND MODAL --- */
  .victim-photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .victim-photo-button {
    padding: 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: none;
    cursor: pointer;
    display: block;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .victim-photo-button:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }

  .victim-photo-button img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    display: block;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .victim-modal-content {
    background: #fff;
    border-radius: 8px;
    max-width: 550px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
  }
  
  .victim-modal-content img {
  width: 100%;
  aspect-ratio: 4 / 3; /* <--- NEW: Sets a 4:3 aspect ratio */
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

  .victim-modal-text {
    padding: 1.5rem 2rem 2rem 2rem;
  }

  .victim-modal-text h2 {
    font-family: 'Georgia', serif;
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
  }
  
  .victim-modal-text .meta {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-style: italic;
    color: #666;
    margin-bottom: 1.5rem;
    display: block;
  }

  .victim-modal-text blockquote {
    font-family: 'Georgia', serif;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
    padding-left: 1rem;
    border-left: 3px solid #eee;
  }

  .victim-modal-text cite {
    display: block;
    text-align: right;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    color: #555;
    margin-top: 1rem;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 15px;
    background: rgba(0,0,0,0.3);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 1.5rem;
    color: #fff;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .modal-close:hover {
    background: rgba(0,0,0,0.6);
  }

  @media (max-width: 600px) {
  .victim-photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .victim-modal-content img {
    /* The height: 200px; rule was here. It's no longer needed because
       aspect-ratio will handle it automatically. You can remove the
       entire rule if it's empty, or just ensure the height is gone. */
  }
}

  /* --- NEW STYLES FOR WEAPONS ANALYSIS BOX --- */
  .analysis-box {
    background-color: #f8f9fa;
    border-left: 5px solid #f5c6cb; /* A distinct color for the border */
    padding: 1.5rem 2rem;
    margin: 2.5rem 0;
    border-radius: 0 8px 8px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1rem;
    line-height: 1.6;
  }

  .analysis-box h3 {
    margin-top: 0;
    font-size: 1.4rem;
    color: #1a1a1a;
  }
  
  .analysis-box h4 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #333;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
  }

  .analysis-box table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  .analysis-box th, .analysis-box td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
  }

  .analysis-box th {
    background-color: #e9ecef;
    font-weight: 600;
  }

  .analysis-box td:not(:first-child) {
    text-align: center; /* Center-align the numbers for readability */
  }

  .analysis-box .table-note {
    font-size: 0.85rem;
    color: #666;
    margin-top: 1rem;
    font-style: italic;
    line-height: 1.4;
  }

  /* --- STEP 2: ADD THESE NEW STYLES FOR THE PULL QUOTE --- */
  .pull-quote {
    position: relative; /* Needed for the decorative quote mark */
    font-family: 'Playfair Display', serif; /* Use our new font */
    font-size: 1.4rem;
    font-weight: 300;
    font-style: italic;
    line-height: 1.5;
    text-align: center;
    color: #1a1a1a;
    max-width: 600px;
    margin: 4rem auto; /* Add space above and below */
    padding: 1rem;
  }

  /* Optional: Add a large decorative quotation mark in the background */
  .pull-quote::before {
    content: '“';
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8rem;
    color: #e9ecef; /* A very light gray */
    z-index: -1; /* Puts it behind the text */
  }

  /* Style for the quote's source/citation */
  .pull-quote cite {
    display: block; /* Puts it on its own line */
    text-align: center;
    margin-top: 1rem;
    font-family: 'Georgia', serif; /* Match the main article font */
    font-size: 1.1rem;
    font-style: normal;
    font-weight: normal;
    color: #555;
  }

  .click-info {
  text-align: center;
  font-style: italic;
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem; /* Adds space between the text and the photos */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
<HeroCollage />

<!-- 2. The headline for THIS page -->
<Headline     publishedDate={new Date('2025-08-07')}
/>
<!-- Article Content ... (all the existing text, images, videos etc.) -->
<!-- ... I am omitting the large block of article text for brevity, but it should remain here ... -->

<div class="article-text">
  <p>It was 6:14pm on Friday, July 19, 2024. Two Border Guard Bangladesh (BGB) personnel were advancing into Banasree G Block in Dhaka.</p>
  <p>One, a taller man in a red helmet, carried a shield and a stick. The other, shorter and wearing a tactical vest with "BGB" stamped in bold white letters, carried a 7.62mm Type 56 rifle, the Chinese version of the AK variant, according to independently verified footage, and supporting assessment by weapons experts.</p>
  <p>Nine seconds into the footage, the shorter officer opens fire. He fires once to his left, then pivots, takes a few steps forward, and takes another shot to his right.&nbsp;</p>
  <CustomVideoPlayer videoId="AZG9-nUgRXY" title="BGB officer opens fire in Banasree 1" orientation="vertical"/>
  <p>Another picture <strong>captured moments later</strong> reveals a man lying motionless in front of a shop on the G Block avenue, exactly where the officer had fired the second shot.&nbsp;</p>
  <figure>
    <img class="article-image" src="{base}/images/redwan_g_block_Banasree_3.jpg" alt="A man lies motionless on the pavement in Banasree G Block after the shooting." loading="lazy" />
    <figcaption></figcaption>
  </figure>
  <p>In a second footage, the officer repositions himself, first taking a firing stance on G Block avenue to shoot towards Road 1 of F Block. He then moves again, aiming and firing his rifle down Road 1 of G Block.</p>
  <CustomVideoPlayer videoId="D3P9DEmtXLE" title="BGB officer opens fire in Banasree 1" orientation="vertical" />
  <p>That bullet most likely took the life of 14-year-old Ashiqul Islam, as narrated by two eyewitnesses, and is indicative through photographs and videos from the day.</p>
  <p>A single round, most likely from a Type 56 rifle, like the one the officer and other BGB members were carrying, entered below his left ear and tore through the other side of his head.</p>
  <p>While in-depth forensic analyses confirmed a match by comparing footage from Banasree and Rampura, indicating that the same suspected shooter was present in both locations, The Daily Star independently verified his name and identity. Sources in intelligence agencies, the International Crimes Tribunal, and journalists who were present on the ground identified him as Lt Col Redwanul Islam.&nbsp;</p>
  <p>Shah Alam, a young businessman from Banasree, was with Ashiqul when he was shot.</p>
  <p>"The incident happened between Asr and Maghrib prayers," Alam said.&nbsp;</p>
  <p>This timeline matches with the metadata of the video, which records a short-statured BGB officer opening fire in their direction at 6:14pm.</p>
  <p>"I met Ashiqul sometime after I joined the protest in Banasree following Juma prayers on July 19," Shah Alam recalled. "Though just a kid, he was the most courageous among us. Braving live bullets, he often used to run around, have a peep, and provide information on police and BGB movement to us."</p>
  <p>He said a BGB Armored Personnel Carrier (APC) stopped near the entrance of G Block after protesters created a barricade with tree logs and other items on the main road. By then, most protesters had abandoned the main road and retreated into the residential blocks of Banasree.</p>
  <p>At one point, while other BGB personnel were clearing the road, two soldiers, one visibly armed, entered Banasree, Alam added. Footage we verified also confirmed his account.&nbsp;</p>
  <p>"I saw a man fall right beside a shop in G Block," he said.&nbsp;</p>
  <p>He, along with Ashiqul and about 15 others, ran for cover down Road 1 of G Block.</p>
  <p>"The gates of all the buildings were closed, but an aunty from a nearby house opened their residence for us. We were all rushing towards the garage of that building. Ashiqul was just behind me. I entered, and then I saw Ashiqul... I don't know what got hold of him; probably he wanted to have another look at where the BGB personnel were.&nbsp;</p>
  <p>"He ran a few steps back, took a glance towards where the two officers were, and then tried to return to the building. As far as I can remember, I heard one shot, and I looked back and saw Ashiqul falling with blood pouring from his head, face, and mouth," Alam said.</p>
  <p>This newspaper also spoke with Mahbuba Kayes Lucky, the woman Shah Alam referred to, who shared a similar account.</p>
  <p>With Lt Col Redwan positioned on the main road to Ashiqul's left, a distance of just 84 metres, and Ashiqul turning to glance back before trying to re-enter the building, the boy was caught in a fatal perpendicular line of fire. The bullet striking him below his left ear suggests he was moving laterally at the exact moment the shot was fired.</p>
  <p>The death certificate issued by Banasree's Advanced Hospital shows he died from a "gunshot wound".</p>
  <p>Recalling the last time she saw her son, Ashiqul's mother, Alisha Afroze, said Ashiqul joined the protests after 3:00pm that day. She was worried that he was not coming home, but she could not step outside to find him as the sounds of gunfire kept rocking the Banasree area till about 9:30pm.&nbsp;&nbsp;</p>
  <p>"After 10:00pm, a protester came to our house and showed me footage of a body lying unclaimed at the hospital. I immediately recognised it was my Ashiqul. I raised him with tears, sweat and blood as a single mother. My world revolved around him. Seeing his body, I fainted."</p>
  <p>She collected the body from the hospital around 11:00pm, hired an ambulance, and set out for Dinajpur, their ancestral home, to bury her son.&nbsp;</p>

</div>

<BdrMap />

<div class="article-text">
  <h2>Turning point in killing spree</h2>
  <p>From July 16 till August 5, the BGB deployed nearly 4,000 members to 58 locations across the country, according to the UN fact-finding report published in February 2025.&nbsp;</p>
  <p><a href="https://www.thedailystar.net/news/investigative-stories/news/shoot-directly-hasinas-order-and-deadly-aftermath-3946896">An investigation by The Daily Star</a> found that on the evening of July 18, ousted prime minister Sheikh Hasina gave a "shoot-on-sight" order that the UN report confirms was part of a broader government directive to use lethal force. From the following day, BGB, Rab, and police acted on these orders, carrying out extrajudicial killings in different parts of the country, the UN report said.</p>
  <p>In Rampura, our reporters witnessed the BTV building being vandalised around 1:00pm on July 18. The first BGB unit arrived at the scene around 4:30pm, but they were significantly outnumbered by thousands of protesters.</p>
  <p>Video footage from this period shows protesters chanting slogans while standing on top of a BGB armored carrier. At one point, the BGB unit had to fall back.</p>
  <p>As evening fell, things took a fatal turn.</p>
  <p>Around 7:30pm, our reporters saw a second, heavily armed BGB unit arriving at Rampura via Hatirjheel. First, they seized control of the Rampura bridge area by firing blank shots to disperse the crowds. Then, around 8:00pm, they advanced on the BTV building, clearing the area with live ammunition. By 9:00pm, the BGB had secured the Rampura TV centre area.</p>
  <p>This sequence of events matches with information from two high-level official sources who are investigating the Rampura killings. The first unit was the BGB's 5th Battalion, they said.&nbsp;</p>
  <p>The second unit, called in as reinforcement, was the 26th Battalion, commanded by Lt Col Redwaul Islam, sources in the International Crimes Tribunal said.</p>
  <p>The Daily Star also spotted an Armoured Personnel Carrier (APC) from the 62nd (Narayanganj) battalion at Aftabnagar Gate at 5:00pm on July 19, suggesting that the government ordered a large-scale BGB deployment in the area.&nbsp;</p>
  <p><a href="https://www.ohchr.org/en/documents/country-reports/ohchr-fact-finding-report-human-rights-violations-and-abuses-related">The UN fact-finding team</a> found that after the attack on BTV station, the BGB was used as a "strike force" to reinforce orders to use lethal force. The instruction was issued by both the Prime Minister's Office and home ministry on the evening of July 18 and again on July 19, leading to a near-tripling of reported deaths.&nbsp;</p>
  <p>Thr UN report gives an overview of the violence in this area, classifying "Rampura and Badda (19 July)" as a specific case of indiscriminate shooting. The UN found that BGB and police shot lethal ammunition directly into crowds.&nbsp;</p>
  <p>One witness recalled how security forces "cornered protesters from three sides and fired simultaneously.</p>
  


  <p>The UN report also documents how hospitals in the area were overwhelmed, with one receiving over 600 injured patients and 20 dead bodies that day.</p>
  <p>The Daily Star saw 13 bodies in three hospitals of Rampura-Banasree in one hour from around 4:00-5:00pm that day.&nbsp;</p>
  <p>Separately, a TGI &amp; ITJP investigation documented at least 23 killings in Rampura-Banasree area on July 19, according to <a href="https://techglobalinstitute.com/wp-content/uploads/2025/01/Bloodshed_In_Bangladesh_V6.pdf">a report published in January 2025</a>.&nbsp;</p>
  <p>In a report sent to the UN, BGB claimed they only fired warning shots and caused no casualties.&nbsp;</p>
  <p>However, this directly contradicts evidence and reports from other government intelligence agencies such as the NSI. The NSI report sent to the UN mentions three killings by the BGB on July 19 in and around Rampura-Banasree.</p>
</div>

<div class="article-text">
  <!-- FIRST ACCORDION INSTANCE -->
  <Accordion openText="Read the Full Analysis" closeText="Show Less">
    <div slot="visible-content">
      <h2 class="accordion-heading">Identifying A Potential Shooter</h2>
      <p>Multiple eyewitnesses in Rampura said they saw BGB personnel wearing vests, particularly a small-statured officer, shooting at unarmed protesters. To verify the direction of movement, and the role of BGB personnel that fired shots towards Ashiqul were achieved through a multi-step forensic analysis of 15 different videos and images during a joint investigation by The Daily Star and Tech Global Institute (TGI), a technology nonprofit whose forensics investigation arm has been documenting digital evidence related to the Monsoon Revolution.&nbsp;</p>
      <p>While TGI's forensic analysis confirmed a match by comparing the Banasree and Rampura footage, indicative that the same individual was likely present in both locations on that day, The Daily Star independently verified his name and identity by speaking with sources in intelligence agencies, the International Crimes Tribunal, and journalists who were present on the ground.</p>
    </div>
    <div slot="collapsible-content">
      <p>The forensic analysis was based on two primary methods: chronolocation and reconstruction, and pattern configuration. The premise of the latter is based on identifying similar or the same patch configurations on uniforms at a given time, allowing us to distinguish an individual's uniform from others.&nbsp;</p>
      <p>Using multiple images of BGB officers from the day and location, TGI's forensics investigators identified a unique combination of patches and shapes on specific areas of their uniform: the upper chest, chest, right wrist, and right and left thighs.&nbsp;</p>
      <figure>
        <img class="article-image" src="{base}/images/redwan_dit_road.png" alt="Forensic analysis of a BGB officer on DIT road" loading="lazy"/>
        <figcaption></figcaption>
      </figure>
      <figure>
        <img class="article-image" src="{base}/images/redwan_dit_road_2.png" alt="Further forensic analysis of a BGB officer" loading="lazy"/>
        <figcaption></figcaption>
      </figure>
      <p>This distinct pattern was then compared to footage of soldiers filmed shooting in Banasree, where Ashiqul was killed on the same day and time. The analysis of the uniform's camouflage pattern confirmed an exact match with the patch configuration for one individual's uniform. We consistently found the same patch configuration on one uniformed BGB officer of small stature, who appeared in multiple footage recorded on the same day in Rampura-Banasree, indicating they are likely the same individual.&nbsp;&nbsp;</p>
      <p>To confirm the distinctiveness of the camouflage patches, it was compared against the camouflage patterns on uniforms of other BGB soldiers at the scene on the same day. None of the other uniforms shared this specific combination of patches.</p>
      <p>This analysis was further supported by observing that the small-statured BGB officer was consistently accompanied by an accomplice wearing a red helmet, and hand gloves in multiple footage from Rampura and Banasree on that day.&nbsp;</p>
      <img class="article-image" src="{base}/images/redwan_accomplice.png" alt="The identified BGB officer seen with his accomplice in a red helmet." loading="lazy" />
      <p>To further corroborate, this investigation used facial reconstruction and matching techniques to assess whether the distinct facial features for the suspect could be matched throughout different footage using open‑source tools.&nbsp;</p>
      <p>We used three different facial recognition and matching models that generate high‑dimensional embeddings of unique facial features. All three models produced positive matches for the suspect.</p>
      <p>To reduce risks of false positives, the analyses were replicated with facial features of other BGB soldiers present at the scene. It consistently returned a negative match for all other personnel.</p>
      <p>While facial reconstruction, recognition and matching shows promise, the method has several limitations, including the quality of images or footage available, restricted negative testing, and environmental factors. To address ethical and privacy considerations, the analysis only used publicly available materials used for journalistic or public awareness purposes, and strictly limited data collection, processing and retention throughout the process.&nbsp;</p>
      <p>The Daily Star shared clear footage of the small-statured officer with three high-level sources who confirmed the person in question is Lt Col Redwan. One photojournalist present at the scene on July 19 said he also saw the name plaque, which read: Redwan.</p>
    </div>
  </Accordion>
</div>

<!-- ... Rest of your article content ... -->
<!-- The rest of your file remains exactly the same as before. -->
<!-- I am omitting the rest for brevity. -->

<div class="article-text">
  <h2>Morning showed the day</h2>
  <p>The day's bloodshed began early. Verified footage shows Ramzan, a 24-year-old in an orange T-shirt, standing among protesters at the entrance of Rampura Wapda Road around 9:46am on July 19.</p>
  <CustomVideoPlayer videoId="pCBiuSl1-dY" title="BGB officer leading contingent near Delta Hospital" />

  <p>Just about 2:38 minutes later, Ramzan collapses, as a single bullet pierces his neck. He was shot from the front, where a contingent of 27 BGB personnel was positioned. At least 11 of them were carrying assault rifles, our forensic analysis finds.</p>
  <p>In contrast, 35 police personnel were nearby, but only six carried weapons, mostly non-lethal (shotguns and gas guns). Twenty-one police officers carried only shields and sticks.</p>
  <p>The shooter is not visible, but the distance and wound are consistent with a shot from a high-velocity rifle.&nbsp;</p>
  <p>According to an eyewitness, who watched the events unfold from a window nearby, protesters began congregating on the streets from 6:00am. An initial police advance around 7:00am led to a cat-and-mouse dynamic.&nbsp;</p>
  <p>"When the police came up the main road, the protesters went inside the lane to hide," he said. "Then the police went away... the protesters came back into the street."</p>
  <p>This pattern repeated until a joint BGB and police force advanced from the Rampura Bridge road.&nbsp;</p>
  <p>He described how the police advanced as far as the Al Kadiya restaurant and then began to pull back. "When they started going back, people came out from the alleyways. They thought the police had gone," he recalled.&nbsp;</p>
  <p>"At that point, there was a gunshot by the BGB. The boy just fell," he added.</p>
  
  <h2>Who killed Ismail?</h2>
  <p>An image of rickshaw puller, Md Ismail, lying in a pool of blood in front of Delta Hospital in Banasree, went viral after the July protest. A journalist of The Daily Star who was on the ground tracking the BGB's movements and the unfolding bloodshed on July 19 in the area also took his photos and videos.&nbsp;</p>
  <p>The eyewitness account of our journalist and the photographs provide a direct trail of evidence.</p>
  <p>He said a BGB unit, armed with Type-56 SMGs, was advancing from the BTV Centre towards the Abul Hotel area around 4:50pm.</p>
  <p>They were accompanied by police, who were mostly equipped with less-lethal shotguns and tear gas canisters. The journalist, who was positioned just behind the BGB contingent, said that the unit was "firing live rounds while advancing."</p>
  <p>In multiple footage, we see a BGB officer leading the pack. He was holding an assault rifle. It was about 47 metres from Delta Hospital.&nbsp;</p>
  <CustomVideoPlayer videoId="2KjN5MWVDFg" title="BGB officer leading contingent near Delta Hospital" />
  <p>Our journalist, while slowly moving behind the&nbsp; BGB-police contingent, suddenly turned right and saw the blood-soaked body of Ismail. Before that, he took a photograph of the BGB officer in question in a firing position a little past Delta Hospital. The photo was taken from behind, so the officer's face was not visible.&nbsp;&nbsp;</p>
  <p>Md Nazim Uddin, a security guard of the hospital who witnessed the killing, said Ismail was shot in the back of the head as he tried to flee from bullets coming from the direction of Rampura TV centre around 5:00pm.&nbsp;</p>
  <p>This matches the description of our journalist. Photographs he took from the scene document a catastrophic exit wound that shattered the back of his skull, leaving brain matter visible in the pool of blood on the pavement.&nbsp;</p>
  <p>In addition, the images reveal at least one distinct bullet entry wound on his right chest, the dark puncture mark stark against his blood-soaked shirt. The bullet wound on his chest was still fresh with blood oozing out, suggesting he was shot a second time.&nbsp;</p>
  <figure>
    <img class="article-image" src="{base}/images/ismail_body.jpg" alt="Body of Md Ismail" loading="lazy" />
    <figcaption>Rickshaw puller Md Ismail lies in a pool of blood in front of Delta Hospital after being shot.</figcaption>
  </figure>
  <p>According to the guard, hospital staff and protesters twice attempted to retrieve Ismail's body but were forced back as shots were fired in their direction.</p>
  <p>As proof of the indiscriminate shooting, the guard pointed to bullet holes still visible on the hospital's front walls.&nbsp;</p>
  <figure>
    <img class="article-image" src="{base}/images/delta_bullet.png" alt="Bullet hole on Delta Hospital wall" loading="lazy" />
    <figcaption>A bullet hole on the outside wall of Delta Hospital.</figcaption>
  </figure>
  <p>The indiscriminate nature of the shooting is highlighted in another video, which shows hospital staff rushing back into the building as shots ring out just feet from where Ismail lay dead.</p>
  <p>According to Ismail's wife Lucky Begum, the ambulance carrying his body to Brahmanbaria for burial was intercepted twice by BGB later that night, once in Meradia and then right after crossing Trimohoni bridge, about 1km from Meradia and the exit point of Dhaka towards Kachpur.&nbsp;&nbsp;</p>
  <p>"They asked us how he [Ismail] died and many other questions related to the protests. They let us pass only after we told them that Ismail died in a rickshaw accident and did not participate in the protests," Lucky added.</p>
  
  <h2>The unseen killings</h2>
  <p>"Maa, don't worry, I will be back in two minutes."</p>
  <p>It was 2:30pm on July 19 when Masuda Jaman heard those final, reassuring words from her son Mostofa Zaman Samudra, 17. Worried about the escalating violence on the streets of Rampura, she had called to tell him to come home.</p>
  <p>But for the mother, the two minutes stretched into an agonising eternity of unanswered phone calls. After 4:00pm, a message arrived from one of Samudra's friends: he had been shot.&nbsp;</p>
  <p>The family rushed to Delta Hospital, but their son was already unresponsive. A single bullet had torn through his left hand and lodged near his left lung.</p>
  <p>Eyewitnesses told his mother that Samudra was shot near the TV Centre road sometime between 3:00 and 4:00pm. While no direct footage of Samudra being shot has surfaced, the time and location of his death place him squarely in a zone of intense BGB activity.</p>
  <p>Our investigation tracked BGB personnel, armed with lethal weapons, operating throughout the Rampura-Banasree corridor that afternoon.&nbsp;</p>
  <p>Lt Col Redwan, the officer who was seen shooting in the direction where Ashiqul's body was found, was also filmed firing his rifle at protesters beside an APC and below a footover bridge near the Rampura TV Branch of Agrani Bank, the same area where Samudra was fatally wounded.</p>
  <p>An eyewitness told this newspaper that he saw Samudra's body lying on top of a road divider opposite Delta Hospital.&nbsp;</p>
  
  <!-- SECOND, MODIFIED ACCORDION FOR VICTIMS -->
  <Accordion openText="View Victims" closeText="Hide Victims">
    <div slot="visible-content">
      <h2 class="accordion-heading">Victim Profiles</h2>
    </div>
    <div slot="collapsible-content">
      
      <!-- ADD THIS NEW LINE OF TEXT HERE -->
      <p class="click-info">Click on a photo to read the victim's story.</p>
  
      <div class="victim-photo-grid">
        {#each victimsData as victim (victim.id)}
          <button class="victim-photo-button" on:click={() => (activeVictim = victim)}>
            <img src="{base}/images/{victim.image}" alt="Portrait of {victim.name}" loading="lazy" />
          </button>
        {/each}
      </div>
    </div>
  </Accordion>


  <h2>Shield of lies</h2>
  <p>The legal framework for the use of lethal force by security forces against civilian assemblies in Bangladesh is strictly defined in Chapter IX of the Code of Criminal Procedure, 1898 (CrPC).</p>
  <p>It mandates that a force like the BGB can only use force to disperse a crowd after a verbal command from an executive magistrate or a police commissioner.&nbsp;</p>
  <p>The use of military-grade force is a final resort, permissible only when an assembly cannot otherwise be dispersed and only upon the explicit order of the highest-ranking magistrate present. Even then, the force used must be minimal, aiming to "do as little injury to person and property" as possible.</p>
  <p>Recently, the deputy commissioner's office in Dhaka sent a document detailing the deployment of executive magistrates alongside BGB units to the International Crimes Tribunal. The Daily Star has obtained a copy.</p>
  <p>On July 19 in Rampura, it recorded the firing of at least 972 rounds from military-grade weapons like SMGs [Type-56] and rifles. It details a morning shift (8:00am-1:00pm) where 693 rounds were fired, and an afternoon shift (1:00pm-8:00pm) that saw another 279 rounds discharged.&nbsp;</p>
  <p>According to this log, Lt Col Redwan fired 17 shots on July 19 under the supervision of a magistrate.&nbsp;</p>
  <p>However, our extensive investigation and video footage from the scenes of the shootings in Rampura on July 19 shows BGB forces operating independently, without the presence of any executive magistrates as required by law.</p>
  
  <blockquote class="pull-quote">
    The use of force by Border Guard Bangladesh (BGB) systematically failed to adhere to legal principles and that a large percentage of killings and injuries... violated international human rights law.
    <cite>— The UN Fact-Finding Report</cite>
  </blockquote>

  
  <p>Multiple magistrates we contacted confirmed the list was prepared by the BGB and was submitted to the Dhaka Deputy Commissioner's office. They claim they were pressured to sign the documents on July 26-28, days after the killings, and that their signatures were backdated to July 18 and 19.&nbsp;</p>
  <p>They claimed BGB officials coerced them into signing the papers by claiming that only "blank shots" had been fired and that "no casualties occurred."</p>
  <p>"The day we had to sign the papers, there was a heavy presence of the BGB on the premises of the DC office and inside our superior's room. Although the military did not talk with us directly, our superiors threatened us with consequences if we did not sign the documents," one magistrate said.</p>
  <p>Multiple others we talked to separately echoed the same.</p>
  <p>According to the Border Guard Bangladesh Act, 2010, BGB falls under the control of the home ministry.</p>
  <p>"The force shall be under the overall superintendence of the Government and the Director General... shall direct and control the force per the general orders and instructions given by the Government from time to time," according to section 10(1).&nbsp;</p>
  <p>All other BGB personnel operate under the command of the director general.</p>
  <p>During the July uprising, a "Core Committee" operated as the central command-and-control hub for the violent crackdown. This committee, led by then home minister Asaduzzaman Khan Kamal, brought together the chiefs of all major security and intelligence agencies to devise and direct the suppression, the UN fact-finding report found.</p>
  <p>The report says BGB director general, Major General Mohammad Ashrafuzzaman Siddiqui, as a regular attendee of these meetings where the operational decisions to commit "systematic and widespread extrajudicial killings" were made.</p>
  <p>According to the report, on July 18, the day before the killings in Rampura intensified, "The home minister instructed the BGB, armed with military-grade 7.62mm rifles…. to use more lethal force to suppress the protests."&nbsp;</p>
  <p>Meanwhile, in a recent documentary aired on Al Jazeera, Siddiqui is seen consulting with Lt Col Redwan in Rampura. Two journalists we talked to said the BGB chief visited the Rampura area for a brief period on July 19 shortly after Juma prayers. The Daily Star could not independently verify this.&nbsp;</p>
  <p>A year after the uprising, most key members of the "core committee" are either in hiding or have been sacked. Maj Gen Siddiqui remains in his post.</p>
  <p>In a press conference after the fall of the Awami League government, he said he ordered his troops to show restraint, particularly on August 5.</p>
  

  <blockquote class="pull-quote">
    We identified one officer, a lieutenant colonel who is also a battalion commander, who opened fire directly at protesters… We immediately removed him from his post the next day. After an inquiry, he was returned to the army, his parent force, and we have recommended the highest possible punishment for him.
    <cite>— Maj Gen Mohammad Ashrafuzzaman Siddiqui
      Director General, BGB</cite>
  </blockquote>

  <p>He repeatedly said that the order to deploy did not come from a single source but from "the country's highest, numerous former ministers" and "many senior figures." He said he was operating "from within pressure".</p>
  <p>He, however, acknowledged that "one or two incidents happened," singling out a specific officer, but without naming him.</p>
  <p>"We identified one officer, a lieutenant colonel who is also a battalion commander, who opened fire directly at protesters," he said.&nbsp;</p>
  <p>"We immediately removed him from his post the next day. After an inquiry, he was returned to the army, his parent force, and we have recommended the highest possible punishment for him."</p>
  <p>"The punishment will be executed by the army," he added.</p>
  <p>Two high-level sources confirmed that the "antedate seniority of Redwan has been receded for six months in a summary court martial" after he returned to his main force: Bangladesh Army.&nbsp;</p>
  <p>On August 2, 2025, an ISPR spokesperson declined to comment on the current status of Lt Col Redwan, citing the matter sub judice.&nbsp;&nbsp;</p>
  <p>The Judge Advocate General of BGB, declined to comment on our findings, directing us to Shariful Islam, the public relations officer of BGB.</p>
  <p>The Daily Star contacted him via phone and email and, as requested, sent him questions in writing. On August 3, 2025, he said they would not comment on our findings.</p>
</div>

<!-- Text below the scrolly -->
<div class="article-text">
</div>

<!-- Final text section -->
<div class="article-text">

  <!-- ============================================== -->
  <!-- ===== NEW WEAPONS ANALYSIS BOX STARTS HERE ===== -->
  <!-- ============================================== -->

  <div class="analysis-box">
    <h3>Weapons Analysis</h3>
    <p>
      The Type 56 is a Chinese-manufactured assault rifle based on the design of the Soviet AK-47. It is the standard-issue service rifle of the Border Guard Bangladesh and is widely used in military contexts across the world. The weapon fires 7.62x39mm cartridges, which are high-velocity military rounds. The effective combat range of the Type 56 is between 300 and 400 meters.
    </p>
    <p>
      This makes it highly dangerous in densely populated areas. The Type 56 is not intended for crowd control, three weapon experts we talked to said. It is a battlefield weapon designed to incapacitate or kill enemy combatants, three weapon experts said. Any use of this firearm in a civilian setting introduces the risk of fatal or life-altering injury and is not consistent with protocols for managing public protests.
    </p>
    <p>
      In at least one of the photographs reviewed, a BGB personnel is seen aiming his assault rifle without using its folding stock (the part pressed against the shoulder for stability). A firearms expert explained that this demonstrates poor marksmanship because this means the soldier had little control over where his live rounds would end up.
    </p>

    <h4>Summary Table: Weapon Distribution by Force<br/><small>In Rampura on July 19, 2024</small></h4>
    <table>
      <thead>
        <tr>
          <th>Weapon Category</th>
          <th>BGB</th>
          <th>Police</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Lethal (Primary)<br/>(Type 56 Assault Rifles)</td>
          <td>91</td>
          <td>5</td>
        </tr>
        <tr>
          <td>Lethal (Sidearm)<br/>(Pistols)</td>
          <td>0</td>
          <td>3</td>
        </tr>
        <tr>
          <td>Less-Lethal (Impact)<br/>(Shotguns, Tear-shell Guns)</td>
          <td>0</td>
          <td>35</td>
        </tr>
        <tr>
          <td>Less-Lethal (Defensive)<br/>(Shields & Sticks)</td>
          <td>15</td>
          <td>105</td>
        </tr>
      </tbody>
    </table>
    <p class="table-note">
      Note: Counts are based on documented instances in the provided visual evidence and represent the number of times personnel were visibly identified with specific equipment, not a total census of all officers present.
    </p>
  </div>

  <!-- ============================================ -->
  <!-- ===== NEW WEAPONS ANALYSIS BOX ENDS HERE ===== -->
  <!-- ============================================ -->

  <Violations />
</div>

<!-- 3. This is the new modal that appears when a victim is selected -->
{#if activeVictim}
<div
  class="modal-overlay"
  on:click={() => (activeVictim = null)}
  transition:fade={{ duration: 200 }}
>
  <div
    class="victim-modal-content"
    on:click|stopPropagation
    transition:fly={{ y: 20, duration: 300 }}
  >
    <button class="modal-close" on:click={() => (activeVictim = null)} title="Close">&times;</button>
    <img src="{base}/images/{activeVictim.image}" alt="Portrait of {activeVictim.name}" />
    <div class="victim-modal-text">
      <h2>{activeVictim.name}</h2>
      <span class="meta">{activeVictim.meta}</span>
      <blockquote>{activeVictim.quote}</blockquote>
      <cite>{activeVictim.cite}</cite>
    </div>
  </div>
</div>
{/if}