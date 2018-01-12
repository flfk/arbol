//Resize document body to make room for bottom bar
var height = '70px';
document.body.style.padding = '0px 0px '+height; //set margin height



//Create and add container for bottom bar
var iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL('toolbar.html');
iframe.id = 'iframe';
iframe.classList.add('iframe_element');
iframe.style.height = height;
document.documentElement.appendChild(iframe);﻿



//Add a close/snooze button
var kill = document.createElement('img');
kill.classList.add('kill');
kill.classList.add('iframe_element');
kill.src = chrome.extension.getURL('images/cross.png');
document.documentElement.appendChild(kill);﻿

//Click to kill functionality
kill.addEventListener('click', () => {
    var iframe_elements = document.getElementsByClassName('iframe_element');
    for (i=0; i<iframe_elements.length; i++) {
        iframe_elements[i].style.display = 'none';
    }
    document.body.style.padding = '0';
    //Send message to background.js for snooze start
    chrome.runtime.sendMessage({message: "snooze"}, function(response) {});
});



//Add empty div to display pages left
var stats_div = document.createElement('div');
stats_div.classList.add('arbol_test');
stats_div.classList.add('iframe_element');
document.documentElement.appendChild(stats_div);﻿



//Send message to background.js to count new page load
chrome.runtime.sendMessage({message: "new page"}, function(response) {});

//Listen for the updated tree stats from background.js even if this isn't the active tab
chrome.runtime.onMessage.addListener(function(stats_received, sender, sendResponse){
    stats_div.innerHTML = treeStats(stats_received); // display stats in the stats_div
    // sendResponse({}); // no need to send response
});



// returns a string with the stats trees planted and pages left
function treeStats (stats) {
    var tree_string = pluralize(stats.trees_planted, "trees", "planted")
    var pages_left_string = pluralize(stats.pages_left, "pages", "until next tree")

    return tree_string+"<br>"+pages_left_string;
}

// formats strings correctly according to plurality i.e. 0 trees, 1 tree, 2 trees
function pluralize (number, units, end) {
    if (number == 1) {
        units = units.slice(0, -1); // slice off the s at the end of the word
    }
    return number+" "+units+" "+end;
}
