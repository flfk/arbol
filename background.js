//Adapted from Page Counter extension by alberto.moratilla@gmail.com  January 2011 and revised on December 2014
//http://about.me/alberto.moratilla

        // config declarations
        const PAGES_PER_TREE = 100;
        var snooze_minutes = 1;

        // script variables
        var trees_planted;
        var pages_left;
        var last_snoozed;
        var currently_snoozed;
        var snooze_duration = snooze_minutes * 60 * 1000;


        //Event when the extension is loaded: whether it is chrome who start or the user who enables the extension
        window.onload = function() {
            chrome.alarms.clearAll();
            loadStatistics();
            updateBadge();
        };


        //Event when extension closes.
        window.onunload = function () {
            saveStatistics();
        };


        //Listen for the new page load message from the content script (main.js).
        chrome.runtime.onMessage.addListener(function(message_received, sender, sendResponse){
            switch (message_received.message) {
                case "new page":
                    decrement_pages_left(); //store new pages left to storage

                    //send message to all tabs with updated stats
                    var updated_stats = {
                        trees_planted: trees_planted,
                        pages_left: pages_left,
                        currently_snoozed: currently_snoozed
                    }
                    messageAllTabs (updated_stats);

                    // sendResponse({});
                    break;


                case "snooze":
                    setSnooze();
                    break;


                case "unsnooze":
                    removeSnooze();
                    break;


                default:
                    error('background.js onMessage.addListener error');
                    break;
            }
        });


        // set up alarm listener
        chrome.alarms.onAlarm.addListener(function(alarm){
            switch (alarm.name) {
                case 'countdown':
                    var snooze_remaining = last_snoozed.getTime() + snooze_duration - Date.now();
                    chrome.browserAction.setBadgeText({text: formatTime(snooze_remaining)});
                    break;

                case 'snooze_done':
                    removeSnooze();
                    break;

                default:
                    error(alarm.name+' arbol snooze error');
                    break;
            }
        });

//================ FUNCTIONS ================//

        //When extension ends, saves the counter and the time.
        function saveStatistics() {
            // var saveObject = {
            //     trees_planted: trees_planted,
            //     pages_left: pages_left,
            //     last_snoozed: last_snoozed.getTime(),
            //     currently_snoozed: currently_snoozed
            // }
            // chrome.storage.sync.set(saveObject);

            localStorage.PC_trees_planted_save = JSON.stringify(trees_planted);
            localStorage.PC_pages_left_save  = JSON.stringify(pages_left);
            localStorage.PC_last_snoozed = JSON.stringify(last_snoozed.getTime());
            localStorage.PC_currently_snoozed = JSON.stringify(currently_snoozed);

            // localStorage.PC_first_initialized =  JSON.stringify( first_initialized.getTime() ) ;
            //
            // //Not sure if this block is necessary WIP
            // if (!localStorage.PC_time_acumulated)
            // {
            //     localStorage.PC_time_acumulated = 0;
            // }
            //
            // var now = new Date();	//current time
            // localStorage.PC_time_acumulated = JSON.stringify(time_acumulated+(now.getTime()-session_start.getTime()));
        }


        //Load the number of pages visited from the last time
        function loadStatistics() {
            // var loadKeys = [
            //     'trees_planted',
            //     'pages_left',
            //     'last_snoozed',
            //     'currently_snoozed'
            // ]
            // chrome.storage.sync.get(loadKeys, function(items) {
            //     if (chrome.runtime.lastError) {
            //         trees_planted = 0;
            //         pages_left = PAGES_PER_TREE;
            //         last_snoozed = new Date(0);
            //         currently_snoozed = false;
            //     } else {
            //         trees_planted = items['trees_planted'];
            //         pages_left = items['pages_left'];
            //         last_snoozed = items['last_snoozed'];
            //         currently_snoozed = items["currently_snoozed"];
            //     }
            // });




            if (!localStorage.PC_trees_planted_save)   //If no data found
            {
                trees_planted = 0;
                pages_left = PAGES_PER_TREE;
                last_snoozed = new Date(0);
                currently_snoozed = false;
                // first_initialized = new Date();
                // time_acumulated = 0
            }
            else  //There are data in localstorage
            {
                trees_planted = JSON.parse(localStorage.PC_trees_planted_save);
                pages_left = JSON.parse(localStorage.PC_pages_left_save);
                last_snoozed = new Date((Number(JSON.parse(localStorage.PC_last_snoozed))));
                currently_snoozed = false;
                // first_initialized = new Date((Number(JSON.parse(localStorage.PC_first_initialized))));
                // time_acumulated = (Number(JSON.parse(localStorage.PC_time_acumulated)));
            }
        }



        //increases the counter and calls badge's refresh function
        function decrement_pages_left() {
            if (pages_left == 1) {
              trees_planted++;
              pages_left = PAGES_PER_TREE;
            } else {
              pages_left--;
            }

            saveStatistics();
            updateBadge();
        }



        // Display latest page count on the extension badge next to omnibar
        function updateBadge() {
            if (currently_snoozed) {

            } else {
                var texto = String(trees_planted);
                if(trees_planted>1000)
                {
                    texto = String(Math.floor(trees_planted/1000) + "K")
                }
                chrome.browserAction.setBadgeText({text:texto});
                chrome.browserAction.setBadgeBackgroundColor({color:[0,151,151,151]});
            }
        }


        function setSnooze() {
            chrome.alarms.create('snooze_done', {when: Date.now() + snooze_duration});
            chrome.alarms.create('countdown', {when: Date.now(), periodInMinutes: 0.005});
            last_snoozed = new Date();
            currently_snoozed = true;
            saveStatistics();

            var updated_stats = {
                trees_planted: trees_planted,
                pages_left: pages_left,
                currently_snoozed: currently_snoozed
            }
            messageAllTabs (updated_stats);
        }


        function removeSnooze() {
            chrome.alarms.clearAll();
            last_snoozed = new Date(0);
            currently_snoozed = false;
            saveStatistics();
            updateBadge();

            var updated_stats = {
                trees_planted: trees_planted,
                pages_left: pages_left,
                currently_snoozed: currently_snoozed
            }
            messageAllTabs (updated_stats);
        }


        //send a message to (main.js in) all tabs
        function messageAllTabs (message) {
          // message should be a JSON object
          chrome.tabs.query({}, function(tabs) { // {} means no tab conditions/restrictions
              for (i=0; i<tabs.length; i++) {
                  chrome.tabs.sendMessage(tabs[i].id, message, function(response){});
              }
          });
        }


        //Transforms from ms to d:hh:mm:ss format
        function formatTime(ms)
        {
            var days = Math.floor(ms / (1000*60*60*24));
            ms = ms - days*(1000*60*60*24);

            var hours = Math.floor(ms / (1000*60*60));
            ms = ms - hours*(1000*60*60);

            var minutes = Math.floor(ms / (1000*60));
            minutes=(minutes <=9)?"0"+minutes:minutes;
            ms = ms - minutes*(1000*60);


            var seconds = Math.floor(ms / (1000));
            seconds=(seconds <=9)?"0"+seconds:seconds;
            ms = ms%(1000);

            var badgeText = "";

            if (days>0) {
                badgeText = days+"d";
            } else if (hours>0) {
                badgeText = hours+"h";
            } else if (minutes>0) {
                badgeText = minutes+"m";
            } else {
                badgeText = seconds+"s";
            }

            // return hours+"h "+minutes+"m "+seconds+"s";
            return badgeText;
        }


        function error(error_message) {
            alert(error_message);
        }
