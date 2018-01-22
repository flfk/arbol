//Resize document body to make room for iframe
var height = '80px';
document.body.style.padding = '0px 0px '+height; //set padding height

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
    iframe.src = 'https://flfk.github.io';
    iframe.id = 'iframe';
    iframe.style.height = height;
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
    pagesLeftIcon.src = chrome.extension.getURL('images/ProgressIcon1.png');
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
}

// formats strings correctly according to plurality i.e. 0 trees, 1 tree, 2 trees
function pluralize (number, units, end) {
    if (number == 1) {
        units = units.slice(0, -1); // slice off the s at the end of the word
    }
    return units+" "+end;
}
