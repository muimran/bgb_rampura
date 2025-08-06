<script>
  import BdrMap from '$lib/components/BdrMap.svelte';
  import { base } from '$app/paths'; 
  import CustomVideoPlayer from '$lib/components/CustomVideoPlayer.svelte';
  
  let isOpen = false;
  let accordionContainer;

  // This function handles both toggling the state and fixing the scroll position.
  function toggleAccordion() {
    // If the accordion is currently open (meaning this click will close it)...
    if (isOpen) {
      // ...then scroll the top of the accordion container into view smoothly.
      accordionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Finally, toggle the open/closed state.
    isOpen = !isOpen;
  }
</script>

<svelte:head>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "Lethal vs Nonlethal Ammunition Visualisation",
      "description": "An interactive visualisation built using SvelteKit.",
      "datePublished": "2025-08-02",
      "author": [
        {
          "@type": "Person",
          "name": "Muhammad Imran",
          "url": "https://muhammadimran.com"
        },
        {
          "@type": "Person",
          "name": "Zyma Islam"
        }
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

    h2 {
  font-size: 1.5rem;  /* or 24px or whatever size you prefer */
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
  }

  @media (max-width: 700px) {
    .article-text {
      padding: 0 5vw;
    }
  }

  .article-text p {
    margin: 1.2em 0;
  }
  /* Add this to your <style> block */


/* Common styles applied to BOTH video types */
.video-embed, .video-embed-horizontal {
  width: 100%;
  border: none;
  margin: 1.5em 0;
}

/* Specific style ONLY for VERTICAL videos */
.video-embed {
  aspect-ratio: 9 / 16;
}

/* Specific style ONLY for HORIZONTAL videos */
.video-embed-horizontal {
  aspect-ratio: 16 / 9;
}

.article-image {
    width: 100%; /* Make the image fill the container's width */
    height: auto; /* Maintain the aspect ratio */
    display: block; /* Prevents extra space below the image */
    /* REMOVE the margin from here */
  }
  
  /* ADD these new styles for figure and figcaption */
  figure {
    margin: 1.5em 0; /* Apply the vertical margin to the figure element */
    padding: 0;
  }

  figcaption {
    margin-top: 0.75em; /* Space between image and caption */
    padding: 0 1em; /* Optional: adds a little horizontal space */
    font-size: 0.9rem;
    line-height: 1.4;
    color: #555; /* A slightly lighter color for the caption text */
    text-align: center; /* Or 'left' if you prefer */
  }




  /* Main container for the component */
.accordion-container {
  background-color: #f9f9f9; /* Light background color */
  border-radius: 8px;          /* Soft rounded corners */
  padding: 1.5rem;             /* More spacious padding */
  margin: 2.5rem 0;            /* Keeps original vertical spacing */
  border: 1px solid #e5e5e5;   /* A subtle border instead of top/bottom lines */
}

/* Make the heading inside the accordion stand out with a modern font */
.accordion-container h2 {
  margin-top: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
}

/* The div for the content that collapses */
.accordion-collapsible-content {
  max-height: 0;
  overflow: hidden;
  /* Smoother and slightly longer transition */
  transition: max-height 0.6s ease-in-out;
}

/* When the 'open' class is added, the content expands */
.accordion-collapsible-content.open {
  max-height: 5000px; /* A large value to ensure all content fits */
  padding-top: 0.5rem; /* Add a little space when it opens */
}

/* The button that triggers the accordion */
.accordion-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 0.95rem; /* Slightly smaller for a refined look */
  font-weight: 600;
  color: #333; /* Dark gray for better contrast on the light bg */
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 20px; /* Pill shape */
  padding: 0.5rem 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.accordion-toggle:hover {
  background-color: #f0f0f0; /* Subtle hover effect */
  border-color: #bbb;
}

/* The little arrow icon */
.accordion-toggle .icon {
  transition: transform 0.3s ease-in-out;
}

/* Rotates the icon when the section is open */
.accordion-toggle .icon.rotated {
  transform: rotate(180deg);
}
</style>

<div class="article-text">

  <!-- ... a large portion of your article text ... -->
  <p>It was 6:14pm on Friday, July 19, 2024. Two Border Guard Bangladesh (BGB) personnel were advancing into Bansree G Block in Dhaka.</p>

  <p>One, a taller man in a red helmet, carried a shield and a stick. The other, shorter and wearing a tactical vest with "BGB" stamped in bold white letters, carried a 7.62mm Type 56 rifle, the Chinese version of the AK variant, according to independently verified footage, and supporting assessment by weapons experts.</p>
  
  <p>Nine seconds into the footage, the shorter officer opens fire. He fires once to his left, then pivots, takes a few steps forward, and takes another shot to his right.&nbsp;</p>
  
<!-- This is the container DIV -->

<CustomVideoPlayer 
  videoId="AZG9-nUgRXY" 
  title="BGB officer opens fire in Banasree 1"
  orientation="vertical"
/>

  <p>Another picture <strong>captured moments later</strong> reveals a man lying motionless in front of a shop on the G Block avenue, exactly where the officer had fired the second shot.&nbsp;</p>
  

  
<figure>
  <img
    class="article-image"
    src="{base}/images/redwan_g_block_Banasree_3.jpg"
    alt="A man lies motionless on the pavement in Banasree G Block after the shooting."
    loading="lazy"
  />
  <figcaption></figcaption>
</figure>


  <p>In the next footage, the officer repositions himself, first taking a firing stance on G Block avenue to shoot towards Road 1 of F Block. He then moves again, aiming and firing his rifle down Road 1 of G Block.</p>
  

  <CustomVideoPlayer 
  videoId="D3P9DEmtXLE" 
  title="BGB officer opens fire in Banasree 1"
  orientation="vertical"
/>

  
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
  
  <p><strong>&lt;&lt;BGB movement throughout 19th July, 2024&nbsp;</strong></p>
</div>

<BdrMap />


<div class="article-text">

  <h2>Turning point in killing spree</h2>

  <!-- ... more article text ... -->
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
  
  <p>"Bullets were dropping down on us like rain," the UN report quotes him.&nbsp;</p>
  
  <p>The UN report also documents how hospitals in the area were overwhelmed, with one receiving over 600 injured patients and 20 dead bodies that day.</p>
  
  <p>The Daily Star saw 13 bodies in three hospitals of Rampura-Banasree in one hour from 4:00-5:00pm that day.&nbsp;</p>
  
  <p>Separately, a TGI &amp; ITJP investigation documented at least 23 killings in Rampura-Banasree area on July 19, according to <a href="https://techglobalinstitute.com/wp-content/uploads/2025/01/Bloodshed_In_Bangladesh_V6.pdf">a report published in January 2025</a>.&nbsp;</p>
  
  <p>In a report sent to the UN, BGB claimed they only fired warning shots and caused no casualties.&nbsp;</p>
  
  <p>However, this directly contradicts evidence and reports from other government intelligence agencies such as the NSI. The NSI report sent to the UN mentions three killings by the BGB on July 19 in and around Rampura-Banasree.</p>
  
  
  <!-- MODIFICATION HERE: bind:this added -->
  <div class="accordion-container" bind:this={accordionContainer}>
    <!-- This part is always visible -->
    <div class="accordion-visible-content">
      <h2>Identifying A Potential Shooter</h2>
      <p>Multiple eyewitnesses in Rampura said they saw BGB personnel wearing vests, particularly a small-statured officer, shooting at unarmed protesters. To verify the direction of movement, and the role of BGB personnel that fired shots towards Ashiqul were achieved through a multi-step forensic analysis of 15 different videos and images during a joint investigation by The Daily Star and Tech Global Institute (TGI), a technology nonprofit whose forensics investigation arm has been documenting digital evidence related to the Monsoon Revolution.&nbsp;</p>
      <p>While TGI's forensic analysis confirmed a match by comparing the Banasree and Rampura footage, indicative that the same individual was likely present in both locations on that day, The Daily Star independently verified his name and identity by speaking with sources in intelligence agencies, the International Crimes Tribunal, and journalists who were present on the ground.</p>
    </div>
  
    <!-- This is the content that will be revealed -->
    <div class="accordion-collapsible-content" class:open={isOpen}>
      <p>The forensic analysis was based on two primary methods: chronolocation and reconstruction, and pattern configuration. The premise of the latter is based on identifying similar or the same patch configurations on uniforms at a given time, allowing us to distinguish an individual's uniform from others.&nbsp;</p>
      <p>Using multiple images of BGB officers from the day and location, TGI's forensics investigators identified a unique combination of patches and shapes on specific areas of their uniform: the upper chest, chest, right wrist, and right and left thighs.&nbsp;</p>
  

      <figure>
        <img
          class="article-image"
          src="{base}/images/redwan_dit_road.png"
          alt="A man lies motionless on the pavement in Banasree G Block after the shooting."
          loading="lazy"
        />
        <figcaption></figcaption>
      </figure>


      <figure>
        <img
          class="article-image"
          src="{base}/images/redwan_dit_road_2.png"
          alt="A man lies motionless on the pavement in Banasree G Block after the shooting."
          loading="lazy"
        />
        <figcaption></figcaption>
      </figure>


      
      <p>This distinct pattern was then compared to footage of soldiers filmed shooting in Banasree, where Ashiqul was killed on the same day and time. The analysis of the uniform's camouflage pattern confirmed an exact match with the patch configuration for one individual's uniform. We consistently found the same patch configuration on one uniformed BGB officer of small stature, who appeared in multiple footage recorded on the same day in Rampura-Banasree, indicating they are likely the same individual.&nbsp;&nbsp;</p>
      <p>To confirm the distinctiveness of the camouflage patches, it was compared against the camouflage patterns on uniforms of other BGB soldiers at the scene on the same day. None of the other uniforms shared this specific combination of patches.</p>
      <p>This analysis was further supported by observing that the small-statured BGB officer was consistently accompanied by an accomplice wearing a red helmet, and hand gloves in multiple footage from Rampura and Banasree on that day.&nbsp;</p>
  
      <img
        class="article-image"
        src="{base}/images/redwan_accomplice.png"
        alt="The identified BGB officer seen with his accomplice in a red helmet."
        loading="lazy"
      />
  
      <p>To further corroborate, this investigation used facial reconstruction and matching techniques to assess whether the distinct facial features for the suspect could be matched throughout different footage using open‑source tools.&nbsp;</p>
      <p>We used three different facial recognition and matching models that generate high‑dimensional embeddings of unique facial features. All three models produced positive matches for the suspect.</p>
      <p>To reduce risks of false positives, the analyses were replicated with facial features of other BGB soldiers present at the scene. It consistently returned a negative match for all other personnel.</p>
      <p>While facial reconstruction, recognition and matching shows promise, the method has several limitations, including the quality of images or footage available, restricted negative testing, and environmental factors. To address ethical and privacy considerations, the analysis only used publicly available materials used for journalistic or public awareness purposes, and strictly limited data collection, processing and retention throughout the process.&nbsp;</p>
      <p>The Daily Star shared clear footage of the small-statured officer with three high-level sources who confirmed the person in question is Lt Col Redwan. One photojournalist present at the scene on July 19 said he also saw the name plaque, which read: Redwan.</p>
    </div>
  
    <!-- MODIFICATION HERE: on:click changed to call the new function -->
    <button class="accordion-toggle" on:click={toggleAccordion} aria-expanded={isOpen}>
      <span>{isOpen ? 'Show Less' : 'Read the Full Analysis'}</span>
      <svg class="icon" class:rotated={isOpen} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </button>
  </div>

  <h2>Morning showed the day</h2>
  
  <!-- ... rest of your article ... -->
  <p>The day's bloodshed began early. Verified footage shows Ramzan, a 24-year-old in an orange T-shirt, standing among protesters at the entrance of Rampura Wapda Road around 9:46am on July 19.</p>
  
  <iframe
  class="video-embed-horizontal" 
  src="https://www.youtube.com/embed/pCBiuSl1-dY"
  title="YouTube video: Verified footage shows Ramzan among protesters"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
  loading="lazy">
</iframe>
  
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
  


  <CustomVideoPlayer 
    videoId="pCBiuSl1-dY" 
    title="BGB officer leading contingent near Delta Hospital"
  />
  
  <p>Our journalist, while slowly moving behind the&nbsp; BGB-police contingent, suddenly turned right and saw the blood-soaked body of Ismail. Before that, he took a photograph of the BGB officer in question in a firing position a little past Delta Hospital. The photo was taken from behind, so the officer's face was not visible.&nbsp;&nbsp;</p>
  
  <p>Md Nazim Uddin, a security guard of the hospital who witnessed the killing, said Ismail was shot in the back of the head as he tried to flee from bullets coming from the direction of Rampura TV centre around 5:00pm.&nbsp;</p>
  
  <p>This matches the description of our journalist. Photographs he took from the scene document a catastrophic exit wound that shattered the back of his skull, leaving brain matter visible in the pool of blood on the pavement.&nbsp;</p>
  
  <p>In addition, the images reveal at least one distinct bullet entry wound on his right chest, the dark puncture mark stark against his blood-soaked shirt. The bullet wound on his chest was still fresh with blood oozing out, suggesting he was shot a second time.&nbsp;</p>
  
  <figure>
    <img
      class="article-image"
      src="{base}/images/ismail_body.jpg"
      alt="A man lies motionless on the pavement in Banasree G Block after the shooting."
      loading="lazy"
    />
    <figcaption>Rickshaw puller Md Ismail lies in a pool of blood in front of Delta Hospital after being shot.</figcaption>
  </figure>
  
  <p>According to the guard, hospital staff and protesters twice attempted to retrieve Ismail's body but were forced back as shots were fired in their direction.</p>
  
  <p>As proof of the indiscriminate shooting, the guard pointed to bullet holes still visible on the hospital's front walls.&nbsp;</p>
  

<figure>
  <img
    class="article-image"
    src="{base}/images/delta_bullet.png"
    alt="A man lies motionless on the pavement in Banasree G Block after the shooting."
    loading="lazy"
  />
  <figcaption></figcaption>
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
  
  <h2>Shield of lies</h2>
  
  <p>The legal framework for the use of lethal force by security forces against civilian assemblies in Bangladesh is strictly defined in Chapter IX of the Code of Criminal Procedure, 1898 (CrPC).</p>
  
  <p>It mandates that a force like the BGB can only use force to disperse a crowd after a verbal command from an executive magistrate or a police commissioner.&nbsp;</p>
  
  <p>The use of military-grade force is a final resort, permissible only when an assembly cannot otherwise be dispersed and only upon the explicit order of the highest-ranking magistrate present. Even then, the force used must be minimal, aiming to "do as little injury to person and property" as possible.</p>
  
  <p>Recently, the deputy commissioner's office in Dhaka sent a document detailing the deployment of executive magistrates alongside BGB units to the International Crimes Tribunal. The Daily Star has obtained a copy.</p>
  
  <p>On July 19 in Rampura, it recorded the firing of at least 972 rounds from military-grade weapons like SMGs [Type-56] and rifles. It details a morning shift (8:00am-1:00pm) where 693 rounds were fired, and an afternoon shift (1:00pm-8:00pm) that saw another 279 rounds discharged.&nbsp;</p>
  
  <p>According to this log, Lt Col Redwan fired 17 shots on July 19 under the supervision of a magistrate.&nbsp;</p>
  
  <p>However, our extensive investigation and video footage from the scenes of the shootings in Rampura on July 19 shows BGB forces operating independently, without the presence of any executive magistrates as required by law.</p>
  
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
  
  <p>He repeatedly said that the order to deploy did not come from a single source but from "the country's highest, numerous former ministers" and "many senior figures." He said he was operating "from within pressure".</p>
  
  <p>He, however, acknowledged that "one or two incidents happened," singling out a specific officer, but without naming him.</p>
  
  <p>"We identified one officer, a lieutenant colonel who is also a battalion commander, who opened fire directly at protesters," he said.&nbsp;</p>
  
  <p>"We immediately removed him from his post the next day. After an inquiry, he was returned to the army, his parent force, and we have recommended the highest possible punishment for him."</p>
  
  <p>"The punishment will be executed by the army," he added.</p>
  
  <p>Two high-level sources confirmed that the "antedate seniority of Redwan has been receded for six months in a summary court martial" after he returned to his main force: Bangladesh Army.&nbsp;</p>
  
  <p>On August 2, 2025, an ISPR spokesperson declined to comment on the current status of Lt Col Redwan, citing the matter sub judice.&nbsp;&nbsp;</p>
  
  <p>Lt Col Faisal, the Judge Advocate General of BGB, declined to comment on our findings, directing us to Shariful Islam, the public relations officer of BGB.</p>
  
  <p>The Daily Star contacted him via phone and email and, as requested, sent him questions in writing. On August 3, 2025, he said they would not comment on our findings.</p>
  

</div>


<!-- Text below the scrolly -->
<div class="article-text">
</div>

<!-- Final text section -->
<div class="article-text">
</div>