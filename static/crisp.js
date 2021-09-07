window.$crisp = [];
window.CRISP_WEBSITE_ID =
  window.document.currentScript.getAttribute('crisp-website-id') || null;

if (!!window.CRISP_WEBSITE_ID) {
  (function () {
    d = document;
    s = d.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = 1;
    d.getElementsByTagName('head')[0].appendChild(s);
  })();
}
