'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function FacebookSDK() {
  useEffect(() => {
    // Facebook SDK initialization
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1978667392867839',
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
      
      window.FB.AppEvents.logPageView();
    };

    // Load Facebook SDK script
    (function(d, s, id) {
      var js: HTMLScriptElement, fjs = d.getElementsByTagName(s)[0] as HTMLScriptElement;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  return null; // This component doesn't render anything
}