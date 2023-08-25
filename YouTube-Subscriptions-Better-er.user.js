// ==UserScript==
// @name         YouTube Subscriptions Better-er
// @namespace    http://www.eatdirtshit.rocks/
// @version      0.05
// @downloadURL  http://eatdirtshit.rocks/userscripts/YouTube-Subscriptions-Better-er.user.js
// @description  Adds some helpful functionality to the YouTube Subscriptions page.
// @author       Brian Donovan
// @match        https://www.youtube.com/feed/subscriptions
// @match        https://www.youtube.com/*/videos
// @grant        none
// @run-at       document-idle
// ==/UserScript==

  'use strict';

// --- 0. Create STYLE element to which rules we need will be added later
var ndStyleElement = document.createElement('style');
document.head.appendChild(ndStyleElement);
var ndStylesheet = ndStyleElement.sheet;

// --- 3. Obscure shorts --- 3a create animation
var strHoverClassDef1 = `.hoverfadein { filter:opacity(10%); transition: 0.5s ease-out 100ms; }`;
var strHoverClassDef2 = `.hoverfadein:hover { filter:opacity(100%); }`;
ndStylesheet.insertRule(strHoverClassDef1, ndStylesheet.cssRules.length);
ndStylesheet.insertRule(strHoverClassDef2, ndStylesheet.cssRules.length);
// --- 5. Duration indicators --- 5a create styles
var strVidDurationShellClassDef = `.vid-duration-shell {
  height: 5px;
  width: 100%;
  position: absolute;
  top: 88%;
  left: 0px;
}`;
var strVidDurationBarHolderClassDef = `.vid-duration-bar-holder {
  background-color: rgb(0,0,0,0.75);
  width: 80%;
  height: 100%;
  border: 1px solid black;
  border-radius: 2px;
  margin: 5px auto;
}`;
var strVidDurationBarClassDef = `.vid-duration-bar {
  background-color: red;
  height: 100%;
  width: 0px;
  border: 1px solid white;
}`;
ndStylesheet.insertRule(strVidDurationShellClassDef, ndStylesheet.cssRules.length);
ndStylesheet.insertRule(strVidDurationBarHolderClassDef, ndStylesheet.cssRules.length);
ndStylesheet.insertRule(strVidDurationBarClassDef, ndStylesheet.cssRules.length);
// -----------------------------------------------------------------------------
function rtnNodeDurationIndicator(){
  var ndVidDurationIndicator = document.createElement('div');
  ndVidDurationIndicator.className = 'vid-duration-shell';
  var ndVidDurationIndicatorBarHolder = document.createElement('div');
  ndVidDurationIndicatorBarHolder.className = 'vid-duration-bar-holder';
  var ndVidDurationIndicatorBar = document.createElement('div');
  ndVidDurationIndicatorBar.className = 'vid-duration-bar';
  ndVidDurationIndicatorBarHolder.appendChild(ndVidDurationIndicatorBar);
  ndVidDurationIndicator.appendChild(ndVidDurationIndicatorBarHolder);
  return ndVidDurationIndicator;
}

(function() {
  var mutationObserver = new MutationObserver(function(mutations) {

    // --- 1. Get rid of numeric overlay above the bell icon
    var ndNumberOverBellIcon = document.querySelector('.yt-spec-icon-badge-shape__badge');
    if (ndNumberOverBellIcon !== null) {
      ndNumberOverBellIcon.remove();
    }

    // --- 2. Remove hover overlays
    var ndlstVideoHoverOverlays = document.querySelectorAll('#hover-overlays');
    for (var i=0; i<ndlstVideoHoverOverlays.length; i++) {
      ndlstVideoHoverOverlays[i].remove();
    }

    // --- Obscure shorts --- 3b. identify shorts and apply style changes
    var ndlstShortsOverlays = document.querySelectorAll('[overlay-style="SHORTS"]');
    for (var i=0; i<ndlstShortsOverlays.length; i++) {
      var ndOneVideoShort = ndlstShortsOverlays[i].closest('ytd-rich-grid-media');
      if (!ndOneVideoShort) { console.log('YT Subs Better-er problem: YT "shorts" markup may have changed. Skipping iteration #'+i); continue; }
      if (!ndOneVideoShort.classList.contains('hoverfadein')) {
        ndOneVideoShort.className += ' hoverfadein';
      }
    }

    // --- Remove shorts block --- 3c. [YT has begun inserting a block of shorts into subscriptions page]s
    var ndlstShortsContainerTitle = document.querySelectorAll('span#title');
    for(var i=0; i<ndlstShortsContainerTitle.length; i++){
      if(ndlstShortsContainerTitle[i].innerText.toLowerCase().includes('shorts')){
        var ndShortsPanel = ndlstShortsContainerTitle[i].closest('ytd-rich-shelf-renderer');
        if(ndShortsPanel){
          ndShortsPanel.remove();
        }
      }
    }

    // --- 4. Obscure 'upcoming' videos which can't yet be watched
    var ndlstTimeStatusUpcoming = document.querySelectorAll('[aria-label="Upcoming"]');
    for (var i=0; i<ndlstTimeStatusUpcoming.length; i++) {
      var ndOneVideoUpcoming = ndlstTimeStatusUpcoming[i].closest('ytd-rich-grid-media');
      if (!ndOneVideoUpcoming) { console.log('YT Subs Better-er problem: YT "upcoming" vids markup may have changed. Skipping iteration #'+i); continue; }
      if (!ndOneVideoUpcoming.classList.contains('hoverfadein')) {
        ndOneVideoUpcoming.className += ' hoverfadein';
      }
    }

    // --- 5. Duration indicators --- 5c figure out the duration of each video and insert their duration indicator
    var ndlstVideoDurations = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer');
    for (var i=0; i<ndlstVideoDurations.length; i++) {
      var ndThisVideoOverlays = ndlstVideoDurations[i].closest('#overlays');
      if (ndThisVideoOverlays.querySelectorAll('.vid-duration-shell').length > 0) {
        continue;
      }
      var strDuration = ndlstVideoDurations[i].textContent.trim();
      var arrDurationParts = strDuration.trim().split(':');
      if ( (arrDurationParts.length <= 1) ||
           !( arrDurationParts.every( (strPart) => !isNaN(strPart) ) )
         ){
        // Something not right (not a traditional style video duration)
        continue;
      }
      // -----------------------------------------------------------------------
      if (arrDurationParts.length === 2) {
        var intMinutes = parseInt(arrDurationParts[0]);
        if (intMinutes === 0) {
          // Duration has 2 parts but 1st is zero, so video is mere seconds long
          continue;
        } else {
          // Duration has 2 parts and 1st (minutes) is nonzero
          var intPercentOfHour = Math.round( (intMinutes/60)*100 );
          ndThisVideoOverlays.appendChild(rtnNodeDurationIndicator());
          var ndBar = ndThisVideoOverlays.querySelector('.vid-duration-bar');
          if (ndBar !== null) {
            ndBar.style.width = intPercentOfHour.toString()+'%'; // fractional bar
          }
        }
      } else {
        // Duration has 3 parts, so an hour-plus
        ndThisVideoOverlays.appendChild(rtnNodeDurationIndicator());
        var ndBar = ndThisVideoOverlays.querySelector('.vid-duration-bar');
        if (ndBar !== null) {
          ndBar.style.width = '100%'; // full-length bar
          ndBar.style.backgroundColor = 'orange';
          ndBar.style.border = '1px solid yellow';
        }
      }
      //-----------------------------------------------
    }
  });
  mutationObserver.observe(document.documentElement, {childList: true, subtree: true});
})();

