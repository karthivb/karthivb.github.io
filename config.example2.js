// Copy to config2.js if you like. No secret keys here: put keys in a serverless proxy (e.g. Cloudflare Workers free tier).
window.CONFIG={
 dataEndpoint:"", // URL returning {source,delayed:true|false,prevClose,bars:[{t:ms,o,h,l,c,v}]} for today's 5-min SPX bars
 newsEndpoint:"", // URL returning [{title,source,url,publishedAt}] from your proxy
 refreshSeconds:30
};
