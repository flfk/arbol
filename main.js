//Resize document body to make room for iframe
const HEIGHT = '80px';
document.body.style.padding = '0px 0px '+HEIGHT; //set padding height
// const frameURL = 'https://flfk.github.io';
const frameURL = 'https://mikey-yang.github.io';

//initialize iframe
var iframe_parent, iframe, kill, treesPlantedNum, treesPlantedText, pagesLeftNum, pagesLeftText;
populateElements();


//Send message to background.js on new page load
chrome.runtime.sendMessage({message: "new page"}, function(response) {});

//Listen for the response from background.js even if this isn't the active tab
// Note: IF THERE ARE X TABS OPEN IT WILL RUN X TIMES ON EACH TAB
chrome.runtime.onMessage.addListener(function(message_received, sender, sendResponse){
    if (message_received.currently_snoozed) {
        iframe_parent.classList.add('arbol_hide');
    } else {
        iframe_parent.classList.remove('arbol_hide');
    }

    displayStats(message_received);
});

//Click to kill functionality
kill.addEventListener('click', () => {
    iframe_parent.classList.add('arbol_hide');
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
    iframe.style.height = HEIGHT;
    document.getElementById('iframe_parent').appendChild(iframe);﻿

    //Add a close/snooze button
    kill = createElement('img', ['iframe_element', 'kill']);
    kill.src = chrome.extension.getURL('images/cross.png');
    document.getElementById('iframe_parent').appendChild(kill);﻿

    //Add icon for Trees Planted
    treesPlantedIcon = createElement('img',['iframe_element', 'treesPlantedIcon']);
    treesPlantedIcon.src = chrome.extension.getURL('images/TreesPlantedIcon.png');
    document.getElementById('iframe_parent').appendChild(treesPlantedIcon);

    //Add empty div to display Trees Planted Number
    treesPlantedNum = createElement('div', ['iframe_element', 'arbol_test', 'treesPlantedNum']);
    document.getElementById('iframe_parent').appendChild(treesPlantedNum);

    //Add empty div to display Trees Planted Text
    treesPlantedText = createElement('div', ['iframe_element', 'arbol_test', 'treesPlantedText']);
    document.getElementById('iframe_parent').appendChild(treesPlantedText);

    //Add icon for Pages Left
    pagesLeftIcon = createElement('img',['iframe_element', 'pagesLeftIcon']);
    // pagesLeftIcon.src = chrome.extension.getURL('images/Animation1.png');
    document.getElementById('iframe_parent').appendChild(pagesLeftIcon);

    //Add empty div to display Pages Left Number
    pagesLeftNum = createElement('div', ['iframe_element', 'arbol_test', 'pagesLeftNum']);
    document.getElementById('iframe_parent').appendChild(pagesLeftNum);

    //Add empty div to display Trees Planted Text
    pagesLeftText = createElement('div', ['iframe_element', 'arbol_test', 'pagesLeftText']);
    document.getElementById('iframe_parent').appendChild(pagesLeftText);
}

function createElement(tag, classes) {
    var newElement = document.createElement(tag);
    for (i=0; i<classes.length; i++) {
        newElement.classList.add(classes[i]);
    }
    return newElement;
}

function displayStats(message) {
    treesPlantedNum.innerHTML = message.trees_planted;
    pagesLeftNum.innerHTML = message.pages_left;
    treesPlantedText.innerHTML = pluralize(message.trees_planted, "", "planted");
    pagesLeftText.innerHTML = pluralize(message.pages_left, "pages", "to go");
    pagesLeftIcon.src = selectPagesLeftIcon(message.pages_left)
}

// formats strings correctly according to plurality i.e. 0 trees, 1 tree, 2 trees
function pluralize (number, units, end) {
    if (number == 1) {
        units = units.slice(0, -1); // slice off the s at the end of the word
    }
    return units+" "+end;
}

function selectPagesLeftIcon (pagesLeftNum) {
  var progressImgURL = pagesLeftIcon.src;
  if (pagesLeftNum > 93){
    progressImgURL = chrome.extension.getURL('images/Animation1.png');
  } else if (pagesLeftNum > 87){
    progressImgURL = chrome.extension.getURL('images/Animation2.png');
  } else if (pagesLeftNum > 81){
    progressImgURL = chrome.extension.getURL('images/Animation3.png');
  } else if (pagesLeftNum > 75){
    progressImgURL = chrome.extension.getURL('images/Animation4.png');
  } else if (pagesLeftNum > 68){
    progressImgURL = chrome.extension.getURL('images/Animation5.png');
  } else if (pagesLeftNum > 62){
    progressImgURL = chrome.extension.getURL('images/Animation6.png');
  } else if (pagesLeftNum > 56){
    progressImgURL = chrome.extension.getURL('images/Animation7.png');
  } else if (pagesLeftNum > 50){
    progressImgURL = chrome.extension.getURL('images/Animation8.png');
  } else if (pagesLeftNum > 44){
    progressImgURL = chrome.extension.getURL('images/Animation9.png');
  } else if (pagesLeftNum > 37){
    progressImgURL = chrome.extension.getURL('images/Animation10.png');
  } else if (pagesLeftNum > 31){
    progressImgURL = chrome.extension.getURL('images/Animation11.png');
  } else if (pagesLeftNum > 25){
    progressImgURL = chrome.extension.getURL('images/Animation12.png');
  } else if (pagesLeftNum > 19){
    progressImgURL = chrome.extension.getURL('images/Animation13.png');
  } else if (pagesLeftNum > 13){
    progressImgURL = chrome.extension.getURL('images/Animation14.png');
  } else if (pagesLeftNum > 7){
    progressImgURL = chrome.extension.getURL('images/Animation15.png');
  } else if (pagesLeftNum > 1){
    progressImgURL = chrome.extension.getURL('images/Animation16.png');
  } else {
    progressImgURL = chrome.extension.getURL('images/Animation17.png');
  }
  return progressImgURL;
}
