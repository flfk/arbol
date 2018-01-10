//Create container for bottom bar
var height = '70px';
var iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('toolbar.html');
iframe.id = 'iframe';
iframe.name = 'iframe';
iframe.style.height = height;
document.documentElement.appendChild(iframe);﻿

//Resize document body
document.body.style.padding = '0px 0px '+height; //set margin height

//Add a close/snooze button
var kill = document.createElement('img');
kill.classList.add('kill');
kill.name = 'kill';
kill.src = chrome.extension.getURL('images/cross.png');
document.documentElement.appendChild(kill);﻿

//Click to kill functionality on click
kill.addEventListener('click', () => {
  kill.style.display = 'none';
  iframe.style.display = 'none';
  document.body.style.padding = '0';
});

//Mouseover effects
kill.addEventListener('mouseover', () => {
  kill.classList.add("mouseOver");
});
kill.addEventListener('mouseleave', () => {
  kill.classList.remove("mouseOver");
});


//UNUSED CODE BELOW
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  }
);
