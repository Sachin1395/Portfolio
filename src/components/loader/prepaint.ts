/**
 * Runs inline in <head> before first paint. Marks the page so the loader never
 * flashes for direct links to the recruiter view. (Every other load plays the
 * intro; reduced-motion visitors skip it in CSS and in IntroLoader.)
 */
export const loaderPrepaintScript = `(function(){try{if(location.hash==="#recruiter"){document.documentElement.dataset.loader="skip"}}catch(e){}})();`;
