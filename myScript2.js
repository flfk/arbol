var height = '40px';
var iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('toolbar.html');
iframe.style.height = height;
iframe.style.width = '100%';
iframe.style.position = 'fixed';
iframe.style.bottom = '0';
iframe.style.left = '0';
iframe.style.zIndex = '938089';
iframe.style.backgroundColor = "grey";
document.documentElement.appendChild(iframe);﻿

document.body.style.margin = '0px 0px '+height;
