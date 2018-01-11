//Create and add container for bottom bar
var height = '70px';
var iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('toolbar.html');
iframe.id = 'iframe';
iframe.style.height = height;
document.documentElement.appendChild(iframe);﻿

//Resize document body
document.body.style.padding = '0px 0px '+height; //set margin height

//Add a close/snooze button
var kill = document.createElement('img');
kill.classList.add('kill');
kill.src = chrome.extension.getURL('images/cross.png');
document.documentElement.appendChild(kill);﻿

//Click to kill functionality on click
kill.addEventListener('click', () => {
    kill.style.display = 'none';
    iframe.style.display = 'none';
    document.body.style.padding = '0';
});

//Add div to display pages left
var pages_left = document.createElement('div');
pages_left.classList.add('arbol_test');
document.documentElement.appendChild(pages_left);﻿

//Send message to background.js to count new page load
chrome.runtime.sendMessage({message: "new page"}, function(response) {});

//Listen for the updated page count from background.js even if this isn't the active tab
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    pages_left.innerHTML = 'page count is '+message.page_count;
    // sendResponse({}); // no need to send response
});
