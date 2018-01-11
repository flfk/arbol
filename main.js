//Resize document body to make room for bottom bar
document.body.style.padding = '0px 0px '+height; //set margin height



//Create and add container for bottom bar
var height = '70px';
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
    var plural_trees = "s";
    if (stats.trees_planted == 1) {
        var plural_trees = "";
    }
    var tree_string = stats.trees_planted+" tree"+plural_trees+" planted";

    var plural_pages = "s";
    if (stats.pages_left == 1) {
        var plural_pages = "";
    }
    var pages_left_string = stats.pages_left+" page"+plural_pages+" until next tree";

    return tree_string+"<br>"+pages_left_string;
}
