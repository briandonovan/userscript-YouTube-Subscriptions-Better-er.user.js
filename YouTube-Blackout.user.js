// ==UserScript==
// @name         YouTube Subscriptions Blackout
// @namespace    http://www.eatdirtshit.rocks/
// @version      0.01
// @downloadURL  http://eatdirtshit.rocks/userscripts/YouTube-Subscriptions-Blackout.user.js
// @description  Blacks out content, nukes vid duratios, etc.
// @author       Brian Donovan
// @match        https://www.youtube.com/feed/subscriptions
// @grant        none
// @run-at       context-menu
// ==/UserScript==

'use strict';
var ndStyleElement = document.createElement('style');
document.head.appendChild(ndStyleElement);
var ndStylesheet = ndStyleElement.sheet;

var arrRules = [`div#meta > * > * {
    filter: brightness(0%) !important;
    background-color: black !important;
}`, `img#img {
    filter: brightness(0%) !important;
    background-color: black !important;
}`, `span#country-code {
    display:none;
}`, `ytd-guide-section-renderer.style-scope.ytd-guide-renderer:nth-of-type(2) div#items > * {
    filter: brightness(0%) !important;
}`, `ytd-guide-section-renderer.style-scope.ytd-guide-renderer:nth-of-type(2) div#items yt-formatted-string {
    background-color:black !important;
}`, `img.yt-core-image--fill-parent-height.yt-core-image--fill-parent-width.yt-core-image.yt-core-image--content-mode-scale-aspect-fill.yt-core-image--loaded {
    filter: brightness(0%) !important;
}`];

for (var i=0; i<arrRules.length; i++) {
  ndStylesheet.insertRule(arrRules[i], ndStylesheet.cssRules.length);
}

function XOutVidDurations() {
  var ndlstVidDurationHolder = document.querySelectorAll('span#text.ytd-thumbnail-overlay-time-status-renderer');
  for (var i=0; i<ndlstVidDurationHolder.length; i++) {
    var strContentVidDur = ndlstVidDurationHolder[i].textContent;
    var intIndexColonChar = strContentVidDur.indexOf(':');
    if (intIndexColonChar > 0){
      if (!isNaN(strContentVidDur[intIndexColonChar+1])){
        ndlstVidDurationHolder[i].textContent = 'XX:XX';
      }
    }
  }
}

XOutVidDurations();

(function() {
  var mutationObserver = new MutationObserver(function(mutations) {
    XOutVidDurations();
  });
  mutationObserver.observe(document.documentElement, {childList: true, subtree: true});
})();

