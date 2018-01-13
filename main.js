//Resize document body to make room for bottom bar
var height = '110px';
document.body.style.padding = '0px 0px '+height; //set margin height

var iframe, kill, treesPlantedNum, treesPlantedText, pagesLeftNum, pagesLeftText;
populateElements();


//Send message to background.js to count new page load
chrome.runtime.sendMessage({message: "new page"}, function(response) {});

//Listen for the updated tree stats from background.js even if this isn't the active tab
chrome.runtime.onMessage.addListener(function(message_received, sender, sendResponse){
    // alert('snooze? '+message_received.currentlySnoozed)
    // if (message_received.currentlySnoozed) {
    //     hideIframe();
    // } else {
    //     showIframe();
    // }


    treesPlantedNum.innerHTML = message_received.trees_planted;
    pagesLeftNum.innerHTML = message_received.pages_left;
    treesPlantedText.innerHTML = pluralize(message_received.trees_planted, "trees", "planted");
    pagesLeftText.innerHTML = pluralize(message_received.pages_left, "pages", "to next tree");

});

//Click to kill functionality
kill.addEventListener('click', () => {
    hideIframe();
    //Send message to background.js for snooze start
    chrome.runtime.sendMessage({message: "snooze"}, function(response) {});
});






//================ FUNCTIONS ================//

function populateElements() {
    //Create and add container for bottom bar
    iframe = createElement('iframe', ['iframe_element']);
    iframe.src = 'https://flfk.github.io';
    iframe.id = 'iframe';
    iframe.style.height = height;
    document.documentElement.appendChild(iframe);﻿

    //Add a close/snooze button
    kill = createElement('img', ['iframe_element', 'kill']);
    kill.src = chrome.extension.getURL('images/cross.png');
    document.documentElement.appendChild(kill);﻿

    //Add empty div to display Trees Planted Number
    treesPlantedNum = createElement('div', ['iframe_element', 'arbol_test', 'treesPlantedNum']);
    document.documentElement.appendChild(treesPlantedNum);

    //Add empty div to display Trees Planted Text
    treesPlantedText = createElement('div', ['iframe_element', 'arbol_test', 'treesPlantedText']);
    document.documentElement.appendChild(treesPlantedText);

    //Add empty div to display Pages Left Number
    pagesLeftNum = createElement('div', ['iframe_element', 'arbol_test', 'pagesLeftNum']);
    document.documentElement.appendChild(pagesLeftNum);

    //Add empty div to display Trees Planted Text
    pagesLeftText = createElement('div', ['iframe_element', 'arbol_test', 'pagesLeftText']);
    document.documentElement.appendChild(pagesLeftText);
}


function createElement(tag, classes) {
    var newElement = document.createElement(tag);
    for (i=0; i<classes.length; i++) {
        newElement.classList.add(classes[i]);
    }
    return newElement;
}


function appendIframe() {
    // var iframe_elements = document.getElementsByClassName('iframe_element');
    // for (i=0; i<iframe_elements.length; i++) {
    //     document.documentElement.appendChild(iframe_elements[i]);
    // }
    // document.body.style.padding = '0';
}


function hideIframe() {
    var iframe_elements = document.getElementsByClassName('iframe_element');
    for (i=0; i<iframe_elements.length; i++) {
        iframe_elements[i].classList.add('arbol_hide');
    }
    document.body.style.padding = '0';
}

function showIframe() {
    var iframe_elements = document.getElementsByClassName('iframe_element');
    for (i=0; i<iframe_elements.length; i++) {
        iframe_elements[i].classList.remove('arbol_hide');
    }
    document.body.style.padding = height;
}


// formats strings correctly according to plurality i.e. 0 trees, 1 tree, 2 trees
function pluralize (number, units, end) {
    if (number == 1) {
        units = units.slice(0, -1); // slice off the s at the end of the word
    }
    return units+" "+end;
}
