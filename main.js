
//Create container for bottom bar
var height = '70px';
var iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('toolbar.html');
iframe.id = 'myOwnCustomFirstToolbar1234'
iframe.style.height = height;
/*iframe.style.width = '100%';
iframe.style.position = 'fixed';
iframe.style.bottom = '0';
iframe.style.left = '0';
iframe.style.zIndex = '938089';
iframe.style.backgroundColor = '#F4F4F4';
iframe.style.border = 'thin solid #CCCCCC'
*/document.documentElement.appendChild(iframe);﻿
document.body.style.padding = '0px 0px '+height; //set margin height


//Insert text b


//Insert banner into bottom bar
// var banner1 = document.createElement('img');
// banner1.src = chrome.extension.getURL('images/banner_468x60.png');
// banner1.style.height = '60px';
// banner1.style.width = '468px';
// banner1.style.position = 'fixed'
// banner1.style.bottom = '5px';
// banner1.style.left = '255px';
// document.documentElement.iframe.appendChild(banner1);
