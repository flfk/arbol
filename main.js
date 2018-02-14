//Resize document body to make room for iframe
const HEIGHT = 80;
const viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const resized_height = viewport_height - HEIGHT;
const frameURL = 'https://flfk.github.io';

//initialize iframe
var iframe_parent, iframe, kill;
populateElements();

//Send message to background.js on new page load
chrome.runtime.sendMessage({message: "new page"}, function(response) {});

// Correctly resize elements that are exactly viewport height
// Note: DOMContentLoaded event fires too early for pages such as Facebook messenger
window.addEventListener('load', function() {
  document.documentElement.style.padding = '0px 0px '+HEIGHT+'px'; //set padding height
  // Downsize full height elements to allow room for the iframe
  resizeHeight(viewport_height, resized_height);
});

//Listen for the response from background.js even if this isn't the active tab
// Note: IF THERE ARE X TABS OPEN IT WILL RUN X TIMES ON EACH TAB
chrome.runtime.onMessage.addListener(function(message_received, sender, sendResponse){
    if (message_received.currently_snoozed) {
        iframe_parent.classList.add('arbol_hide');
        document.documentElement.style.padding = 0;
        resizeHeight(resized_height, viewport_height);
    } else {
        iframe_parent.classList.remove('arbol_hide');
        document.documentElement.style.padding = '0px 0px '+HEIGHT+'px'; //set padding height
        resizeHeight(viewport_height, resized_height);
    }
});

//Click to kill functionality
kill.addEventListener('click', () => {
    iframe_parent.classList.add('arbol_hide');
    document.documentElement.style.padding = 0;
    //Send message to background.js for snooze start
    chrome.runtime.sendMessage({message: "snooze"}, function(response) {});
});

//================ FUNCTIONS ================//

function populateElements() {
    //Create and add container for bottom bar
    iframe_parent = createElement('div', ['iframe_element']);
    iframe_parent.id = 'iframe_parent';
    document.documentElement.appendChild(iframe_parent);

    iframe = createElement('iframe', ['iframe_element']);
    iframe.src = frameURL;
    iframe.id = 'iframe';
    iframe.style.height = HEIGHT+'px';
    document.getElementById('iframe_parent').appendChild(iframe);﻿

    //Add a close/snooze button
    kill = createElement('img', ['iframe_element', 'kill']);
    kill.src = chrome.extension.getURL('images/cross.png');
    document.getElementById('iframe_parent').appendChild(kill);﻿
}

function createElement(tag, classes) {
    var newElement = document.createElement(tag);
    for (i=0; i<classes.length; i++) {
        newElement.classList.add(classes[i]);
    }
    return newElement;
}

/**
 * Resizes all elements in the DOM with a specific height to another specific
 * height. Note this is a slow running function as every element in the DOM
 * is queried and made into a jQuery object
 * @param  {Number} input_height  Select elements with this height value
 * @param  {Number} output_height Set their height to this value
 */
function resizeHeight(input_height, output_height) {
  $('*').filter(function() {
    return $(this).height() == input_height;
  }).css({
    'min-height': 0,
    'height': output_height+'px'
  });
}
