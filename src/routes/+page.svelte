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
    .nyt-text {
      max-width: 680px;
      margin: 2.5rem auto;
      font-family: 'Georgia', serif;
      font-size: 1.16rem;
      line-height: 1.5;
      color: #222;
      padding: 0 25px;
    }
  
    @media (max-width: 700px) {
      .nyt-text {
        padding: 0 5vw;
      }
    }
  
    .nyt-text p {
      margin: 1.2em 0;
    }
  </style>
  
  <!-- Text above the Bar Chart -->
  <div class="nyt-text">
    <p>It was 6:14pm on Friday, July 19, 2024. Two Border Guard Bangladesh (BGB) personnel were advancing into Bansree G Block in Dhaka.

      One, a taller man in a red helmet, carried a shield and a stick. The other, shorter and wearing a tactical vest with “BGB” stamped in bold white letters, carried a 7.62mm Type 56 submachine gun, the Chinese version of the AK variant, according to a verified footage and assessment by weapons experts.
      
      Nine seconds into the footage, the shorter officer, later identified as Lieutenant Colonel Redwanul Islam of BGB’s 26th Battalion, opens fire. He fires once to his left, then pivots, takes a few steps forward and takes another shot to his right.
      
      Moments later, another picture reveals, a man lying motionless in front of a shop on the G Block avenue, exactly where Lt Col Redwan had fired the second shot. 
      </p>
  </div>
  
  <!-- Bar Chart Component -->

  <!-- Continue text after Bar Chart -->
  <div class="nyt-text">
  </div>
  
  <!-- This is the final paragraph before <ExplainerScrolly /> -->
   <!-- <div class="nyt-text scrolly-step"> /> -->
  <div class="nyt-text">
    <p>The second step is the decryption of the encrypted traffic. For this, they purchased an SSL (secure sockets layer) decryption platform. SSL is a way to keep data safe when it travels between a browser and a website by locking it with encryption. This device intercepts SSL connections between devices and positions itself in the middle of the connection. When a sender sends traffic to a receiver, it intercepts the incoming traffic halfway, decrypts it, inspects it, reencrypts it, and passes it along to the unsuspecting receiver.</p>
  </div>
  
  <!-- Scrollytelling Component -->
  <BdrMap />
  
  <div class="nyt-text">
    <p>In addition to these, 35 instances were identified where officers carried shotguns or gas guns which are used to launch tear gas or sound grenades. Only five instances were documented where a police officer was seen carrying a 7.62mm Chinese rifle. In three other instances, a single officer was observed with a holstered pistol. 

      These observations are based solely on confirmed visual evidence and do not account for the total number of personnel deployed on the ground.
      
      
      BGB personnel were repeatedly observed in firing positions of live ammunition. Several BGB members were documented in postures such as kneeling, sitting, or crouching, which are commonly used to stabilize aim during shooting. 
      
      At least ten such instances were recorded, including visual files labeled IMG_0313, IMG_0331, and IMG_0356. These firing stances are typically associated with deliberate targeting, not warning shots or crowd dispersal, according to two weapon experts we contacted.
      
      
      At least 13 documented incidents show BGB personnel firing their Type 56 SMGs or other 7.62mm Chinese rifles. 
      
      Meanwhile, a police First Information Report (FIR) submitted on July 20, 2024 states that police fired 180 rounds of rubber cartridges and 250 rounds of lead cartridges from shotguns, along with 126 rounds from lethal Chinese rifles. The FIR mentions the time of the firing as 1:40 pm on July 19, and places the incident near the Rampura Police Post. 
      </p>
   
  </div>
  

  
  <!-- Text below the scrolly -->
  <div class="nyt-text">
  </div>
  

  
  <!-- Final text section -->
  <div class="nyt-text">
  </div>