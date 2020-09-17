// ==UserScript==
// @name         YouTube Subscriptions Better-er
// @namespace    http://www.eatdirtshit.rocks/
// @version      0.01
// @downloadURL  http://eatdirtshit.rocks/userscripts/YouTube-Subscriptions-Better-er.user.js
// @description  Adds some helpful functionality to the YouTube Subscriptions page.
// @author       Brian Donovan
// @match       https://www.youtube.com/feed/subscriptions
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var ndlstPaperBtns = document.getElementsByTagName('paper-button');
  for (var i=0; i<ndlstPaperBtns.length; i++) {
      var ndHtmlElHilite = ndlstPaperBtns[i].parentNode.parentNode.parentNode.parentNode;
      if ( (typeof(ndHtmlElHilite) != 'undefined' && ndHtmlElHilite != null) ) {
          if (ndHtmlElHilite.textContent.trim().toLowerCase().indexOf('reminder') >= 0) {
              ndHtmlElHilite.style.filter = "grayscale(100%) opacity(0.15)";
              ndHtmlElHilite.style.backgroundColor = "rgb(205,205,205";
          }
      }
  }
})();

