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
    <p>Meanwhile over at NTMC...</p>
    <p>While Rab and the police were focusing on specific target-based surveillance, NTMC dedicated its efforts to building an Integrated Lawful Interception System, the ultimate manifestation of a surveillance state.</p>
    <p>By 2022, they had purchased all the components necessary to monitor and intercept the everyday communications of citizens, store that data centrally, and ensure access by various law enforcement agencies.</p>
    <p>The NTMC imported Tk 115 crores worth of surveillance equipment (1,154,214,166). The supplier which aided the NTMC in setting up the surveillance machine was US-based Yaana Technologies.</p>
  </div>
  
  <!-- Bar Chart Component -->

  <!-- Continue text after Bar Chart -->
  <div class="nyt-text">
    <p>The Daily Star shared the list of components purchased by the NTMC between 2018 and 2022 with its in-house network specialists and using information about the components, they reconstructed the ILIS network.</p>
    <p>The first step of interception was recording and analysing data packets that travelled over a computer network. This involved gaining access to internet infrastructure, tapping undersea fibre optic cables, accessing satellite landing systems, intercepting core routes of Internet Service Providers, and forcing telecom companies to cooperate and share data.</p>
    <p>They purchased two units of Copper Tap Modules (10/100/1000), which were used to clone unencrypted ethernet traffic. The Tap module separated the incoming and outgoing traffic into two distinct streams and sent them to two separate monitoring ports.</p>
    <p>They also purchased a Passive Fibre Tap, which is a hardware that mirrors fiber optic traffic and captures high-speed data invisibly. This is then redirected to monitoring ports. For monitoring ports, they purchased six of the Yaana DeepProbe series. These DeepProbes receive internet traffic intercepted from taps and prepare it for inspection.</p>
    <p>The second step is the decryption of the encrypted traffic. For this, they purchased an SSL (secure sockets layer) decryption platform. SSL is a way to keep data safe when it travels between a browser and a website by locking it with encryption. This device intercepts SSL connections between devices and positions itself in the middle of the connection. When a sender sends traffic to a receiver, it intercepts the incoming traffic halfway, decrypts it, inspects it, reencrypts it, and passes it along to the unsuspecting receiver.</p>
  </div>
  
  <!-- This is the final paragraph before <ExplainerScrolly /> -->
   <!-- <div class="nyt-text scrolly-step"> /> -->
  <div class="nyt-text">
    <p>The second step is the decryption of the encrypted traffic. For this, they purchased an SSL (secure sockets layer) decryption platform. SSL is a way to keep data safe when it travels between a browser and a website by locking it with encryption. This device intercepts SSL connections between devices and positions itself in the middle of the connection. When a sender sends traffic to a receiver, it intercepts the incoming traffic halfway, decrypts it, inspects it, reencrypts it, and passes it along to the unsuspecting receiver.</p>
  </div>
  
  <!-- Scrollytelling Component -->
  <BdrMap />
  
  <div class="nyt-text">
    <p>The Daily Star shared the list of components purchased by the NTMC between 2018 and 2022 with its in-house network specialists and using information about the components, they reconstructed the ILIS network.</p>
    <p>The first step of interception was recording and analysing data packets that travelled over a computer network. This involved gaining access to internet infrastructure, tapping undersea fibre optic cables, accessing satellite landing systems, intercepting core routes of Internet Service Providers, and forcing telecom companies to cooperate and share data.</p>
    <p>They purchased two units of Copper Tap Modules (10/100/1000), which were used to clone unencrypted ethernet traffic. The Tap module separated the incoming and outgoing traffic into two distinct streams and sent them to two separate monitoring ports.</p>
    <p>They also purchased a Passive Fibre Tap, which is a hardware that mirrors fiber optic traffic and captures high-speed data invisibly. This is then redirected to monitoring ports. For monitoring ports, they purchased six of the Yaana DeepProbe series. These DeepProbes receive internet traffic intercepted from taps and prepare it for inspection.</p>
    <p>The second step is the decryption of the encrypted traffic. For this, they purchased an SSL (secure sockets layer) decryption platform. SSL is a way to keep data safe when it travels between a browser and a website by locking it with encryption. This device intercepts SSL connections between devices and positions itself in the middle of the connection. When a sender sends traffic to a receiver, it intercepts the incoming traffic halfway, decrypts it, inspects it, reencrypts it, and passes it along to the unsuspecting receiver.</p>
  </div>
  

  
  <!-- Text below the scrolly -->
  <div class="nyt-text">
    <p>The third step is routing content to NTMC, and for this, they purchased two specialised ethernet switches and a networking device called an aggregation router.</p>
    <p>The fourth step is deep packet inspection, which involves examining the content and user behaviour. To do that NTMC purchased five DeepProbe monitor ports, which would perform content inspection and identify data like which app is being used for sending the internet traffic (such as Signal, WhatsApp, or Messenger), the time when the traffic are being sent, how much data is being transferred, who is communicating with whom, their IP (internet protocol) addresses, whether the communication is a voice or video call, file transfer, or chat, and the frequency and duration of those interactions.</p>
  </div>
  

  
  <!-- Final text section -->
  <div class="nyt-text">
    <p>It can not, however, breach end-to-end encryption, which is what apps like Signal use, so it could not peek into the messages themselves, unless the device itself had spyware like Pegasus installed.</p>
  </div>