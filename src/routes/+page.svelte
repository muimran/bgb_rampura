<script>
  import BdrMap from '$lib/components/bdrmap.svelte';
  export let data;
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
    padding: 0 25px;
  }

  @media (max-width: 700px) {
    .article-text {
      padding: 0 5vw;
    }
  }

  .article-text p {
    margin: 1.2em 0;
  }
</style>

<div class="article-text">

  <p><strong>A TDS X TGI Joint Investigation</strong></p>

  <p>It was 6:14pm on Friday, July 19, 2024. Two Border Guard Bangladesh (BGB) personnel were advancing into Bansree G Block in Dhaka.</p>

  <p>One, a taller man in a red helmet, carried a shield and a stick. The other, shorter and wearing a tactical vest with “BGB” stamped in bold white letters, carried a 7.62mm Type 56 submachine gun, the Chinese version of the AK variant, according to a verified footage and assessment by weapons experts.</p>

  <p>Nine seconds into the footage, the shorter officer, later identified as Lieutenant Colonel Redwanul Islam of BGB’s 26th Battalion, opens fire. He fires once to his left, then pivots, takes a few steps forward and takes another shot to his right.</p>

  <p>Moments later, another picture reveals, a man lying motionless in front of a shop on the G Block avenue, exactly where Lt Col Redwan had fired the second shot.</p>

  <p>In the next footage, the officer repositions himself, first taking a firing stance on G Block avenue to shoot towards Road 1 of F Block. He then moves again, aiming his rifle down Road 1 of G Block. That final shot was most likely for 14-year-old Ashiqul Islam, as two eyewitness accounts, one more footage and two photographs indicate.</p>

  <p>A single round, most likely from a Type 56 assault rifle, like the one Redwan was carrying, entered below his left ear and tore through the other side of his head, a joint investigation by <em>The Daily Star</em> and Tech Global Institute has found.</p>

  <p>Shah Alam, a young businessman from Banasree, was with Ashiqul the moment he was shot.</p>

  <p>At least one photograph shows Shah Alam helping to place Ashiqul’s body into a rickshaw.</p>

  <p>“The incident happened between Asr and Maghrib prayers,” he said.</p>

  <p>This timeline coincides with the metadata of the video we have which records Redwan opening fire in their direction around 6:14pm.</p>

  <p>“I met Ashiqul sometime after I joined the protests in Banasree following Juma prayers on July 19," Shah Alam recalled. "Though just a kid, he was the most courageous among us. Braving live bullets, he often used to run around, have a peep and provide information on police and BGB movement to us.”</p>

  <p>He said a BGB Armoured Personnel Carrier (APC) stopped near the entrance of G Block after protesters created a barricade with tree logs and similar things on the main road. By then, most protesters had abandoned the main road and retreated into the residential avenues of Banasree.</p>

  <p>At one point, while other BGB personnel were clearing the road, two of them, one with a gun in hand, entered Banasree while shooting, Alam said, which was also confirmed by photos and videos verified by this investigation.</p>

  <p>“I saw a man fall right beside a shop in G block,” he said.</p>

  <p>He, Ashiqul, and about 15 others ran for cover down Road 1 of G Block.</p>

  <p>“Gates of all the buildings were closed, but an aunty from house number 11 opened their residence for us. We were all rushing towards the garage of that building. Ashiqul was just behind me. I entered, and then I saw Ashiqul... I don’t know what got hold of him, probably he wanted to have another look at where the BGB personnel were. He ran a few steps back, took a glance towards where the two officers were, and then tried to return to the building. A few shots were heard, and I looked back and saw Ashiqul falling with blood pouring from his head, face and mouth,” Alam said.</p>

  <p>This newspaper also spoke to another eyewitness, Mahbuba Kayes Lucky, the woman Shah Alam referred to, who shared a similar account.</p>

  <p>With Lt. Col. Redwan positioned on the main road to Ashiqul’s left, a distance of just 84 metres, and Ashiqul turning to glance back before trying to re-enter the building, the boy was caught in a fatal perpendicular line of fire. The bullet striking him below his left ear suggests he was moving laterally at the exact moment the shot was fired.</p>

  <p>The death certificate issued by Banasree’s Advanced Hospital shows he died from a “gunshot wound”.</p>

  <p>“Ashiqul joined the protests after 3:00pm that day. When he was still not returning after sunset, I got worried. But I could not step outside to find him as sounds of gunfire kept rocking the Banasree area till 9-9:30pm,” Ashiqul’s mother Alisha Afroze told <em>The Daily Star</em>.</p>

  <p>“After 10:00pm, a protester came to our house and showed me footage of a body lying unclaimed at the hospital. I immediately recognised it was my Ashiqul. I raised him with tears, sweat and blood as a single mother. My world revolved around him. Seeing his body, I fainted.”</p>

  <p><strong>A Potential Shooter</strong></p>

  <p>The direction of movement, and the role of the BGB officer who fired shots towards Ashiqul was achieved through a multi-step forensic analysis of 15 different videos and images in this joint investigation by <em>The Daily Star</em> and Tech Global Institute, a technology nonprofit whose forensics investigation arm has been documenting digital evidence related to the July uprising.</p>

  <p>The investigation was based on two primary methods: chronolocation and reconstruction, and camouflage pattern analysis. The premise of this method is that camouflage patches on uniforms have unique, non-repeating patterns. By mapping these patterns, an individual's uniform can be distinguished from others.</p>

  <p>A key reference was a video showing a BGB officer of small stature at rest in Rampura, providing a clear view of his uniform. TGI’s forensics investigators identified a unique combination of patches and shapes on specific areas of their uniform: the upper chest, chest, right wrist, and right thigh. [use image]</p>

  <p>This distinct pattern was then compared to the uniform of the soldier filmed shooting in Banasree where Ashiqul was killed. The analysis confirmed an exact match of the patch configuration.</p>

  <p>To confirm this pattern was not standard-issue, it was compared against the uniforms of other BGB soldiers at the scene. None of the other uniforms shared this specific combination of patches, confirming it was a unique identifier for this individual.</p>

  <p>While BGB uniforms share similar patterns, the exact placement of camouflage patches varies across individuals. This randomness in digital printing makes identical patch arrangements extremely rare, reinforcing the uniqueness of his uniform.</p>

  <p>This analysis was further supported by observing that the small-statured BGB officer was consistently accompanied by the same accomplice (distinguished by a red helmet and a shield) in footage from both Rampura and the Banasree shooting scene, linking the identified individual directly to the time and place of Ashiqul's death. [use image]</p>

  <p>This investigation also conducted a facial recognition test using advanced AI models, primarily ArcFace. This was done by comparing eight clear images of the small-statured BGB officer with five frames of the shooter taken from the video footage. The system reported a positive match with Lt Col Redwan.</p>

  <p>To prevent a false positive, the system was also tested with images of other BGB soldiers. It correctly rejected these non-matches, demonstrating the accuracy and specificity of the identification.</p>

  <p><em>The Daily Star</em> also shared the clear footage of Lt Col Redwan with three high-level sources within the army, BGB and an intelligence agency, who confirmed the person in question is indeed him. [might get a photo with his nameplate by today.]</p>

</div>

<BdrMap />

<div class="article-text">

  <p><strong>Turning Point in Killing Spree</strong></p>

  <p>Ashiqul’s death was the brutal climax of a day that saw the Rampura-Banasree area of Dhaka being turned into a killing field.</p>

  <p>From July 16 till August 5, the BGB deployed nearly 4,000 guards to 58 locations across the country, according to the UN fact-finding report published in February 2025.</p>

  <p>A Daily Star investigation <a href="#">[hyperlink]</a> found that on the evening of July 18, former prime minister Sheikh Hasina gave a 'shoot-on-sight' order, which the UN report confirms was part of a broader government directive to use lethal force. From the next day, BGB, Rab, and police acted on these orders, carrying out extrajudicial killings in different parts of the country.</p>

  <p>In Rampura, our reporters witnessed the BTV building being vandalised around 1:00pm on July 18. The first BGB unit arrived at the scene around 4:30pm, but they were significantly outnumbered by thousands of protesters.</p>

  <p>Video footage from this period shows demonstrators chanting slogans while standing on top of a BGB armored carrier. At one point, the BGB unit had to fall back, but hundreds of protesters were still waiting outside.</p>

  <p>As evening fell, things took a fatal turn.</p>

  <p>Around 7:30pm, our reporters saw a second, heavily armed BGB unit arriving at Rampura via Hatirjheel. First, they seized control of the Rampura bridge area by firing blank shots to disperse the crowds. Then, around 8:00pm, they advanced on the BTV building, clearing the area with live ammunition.</p>

  <p>By 9:00pm, the BGB had secured the Rampura TV centre area.</p>

  <p>This sequence of events matches with information from two high-level sources. The first unit was the BGB’s 5th Battalion, under the command of Lt Col Imran [full name]. The second, called in as reinforcement, was the 26th Battalion, commanded by Lt Col Redwaul Islam.</p>

  <p><em>The Daily Star</em> also spotted an Armoured Personnel Carrier (APC) from the 62nd Battalion (Narayanganj) at Aftabnagar Gate at 5:00pm on July 19.</p>

  <p>The UN fact-finding report found that after the attack on BTV station, the BGB was used as a "strike force" and that reinforced orders to use lethal force were issued by the Prime Minister’s Office and Home Ministry on the evening of July 18 and again on July 19, leading to a near-tripling of reported deaths.</p>

</div>


<!-- Text below the scrolly -->
<div class="article-text">
</div>

<!-- Final text section -->
<div class="article-text">
</div>
