
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
