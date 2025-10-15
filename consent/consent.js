// Minimaler Consent-Loader
// Fügt GA4 (gtag) und AdSense Skript dynamisch ein, nachdem Nutzer zugestimmt hat.
(function(){
  const GA_ID = "G-K409QD2YSJ";
  const CA_PUB = "ca-pub-1712273263687132";

  function loadGtag(){
    if(window.gtagLoaded) return;
    window.gtagLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'update', { 'ad_storage': 'granted', 'analytics_storage': 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { 'anonymize_ip': true });
  }

  function loadAdsense(){
    if(window.adsenseLoaded) return;
    window.adsenseLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.setAttribute('data-ad-client', CA_PUB);
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    document.head.appendChild(s);
  }

  function acceptAll(){
    localStorage.setItem('ads_consent','1');
    document.getElementById('consent').classList.add('hidden');
    loadGtag();
    loadAdsense();
  }

  function declineAll(){
    localStorage.setItem('ads_consent','0');
    document.getElementById('consent').classList.add('hidden');
    // Set consent to denied
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'update', { 'ad_storage': 'denied', 'analytics_storage': 'denied' });
  }

  // Expose for inline use
  window.stopclockConsent = { acceptAll, declineAll, loadGtag, loadAdsense };

  // Auto-check stored preference
  document.addEventListener('DOMContentLoaded', ()=>{
    const accepted = localStorage.getItem('ads_consent');
    if(accepted === '1'){ loadGtag(); loadAdsense(); }
  });
})();
