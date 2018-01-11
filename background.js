//Adapted from Page Counter extension by alberto.moratilla@gmail.com  January 2011 and revised on December 2014
//http://about.me/alberto.moratilla

        var pages_per_tree = 100;

        // initialize variables
        var page_count = 0;
        var trees_planted = 0;
        var pages_left = pages_per_tree;
        // var session_start = new Date();	    //To save the amount of time browsing this session
        // var first_initialized = new Date();	    //Check the time when chrome loads
        // var time_acumulated = 0

        // // localStorage.PC_uses counts the number of times script has run
        // // localStorage.PC_stored_page_count
        // // localStorage.PC_first_initialized stores the date first initialized
        // // localStorage.PC_time_acumulated

        //Initializes statistics - not sure if necessary WIP
        // if (!localStorage.PC_uses)
        //     localStorage.PC_uses = 1;
        // else
        //     localStorage.PC_uses = (parseInt(localStorage.PC_uses))+1;


        //Event when the extension is loaded: whether it is chrome who start or the user who enables the extension
        window.onload = function() {
            loadStatistics();
            badge();
        };


        //Event when extension closes.
        window.onunload = function () {
            saveStatistics();
        };


        //Listen for the new page load message from the content script (main.js).
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
            increment_page_count(); // to store new page count to localStorage

            chrome.tabs.query({}, function(tabs) { //query all tabs
              // obsolete testing code WIP
              // var number = 0;
              // var text = 'length '+tabs.length;
              // for (i=0; i<tabs.length; i++) {
              //     text = text + ' id'+i+" "+tabs[i].id;
              // }
              // alert(JSON.stringify(text));

              // send updated page count to all tabs
              var message = {trees_planted: trees_planted, pages_left: pages_left, page_count: page_count};
              for (i=0; i<tabs.length; i++) {
                  chrome.tabs.sendMessage(tabs[i].id, message, function(response){});
              }
            });
        });



//================ FUNCTIONS ================//

        // Display latest page count on the extension badge next to omnibar
        function badge() {
            var texto = String(trees_planted);
            if(trees_planted>1000)
            {
                texto = String(Math.floor(trees_planted/1000) + "K")
            }

            chrome.browserAction.setBadgeText({text:texto});
            chrome.browserAction.setBadgeBackgroundColor({color:[0,151,151,151]});
        }


        //When extension ends, saves the counter and the time.
        function saveStatistics() {
            localStorage.PC_stored_page_count =  JSON.stringify(page_count);
            localStorage.PC_trees_planted_save = JSON.stringify(trees_planted);
            localStorage.PC_pages_left_save = JSON.stringify(pages_left);
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

            if (!localStorage.PC_stored_page_count)   //If no data found
            {
                page_count = 0;
                trees_planted = 0;
                pages_left = pages_per_tree;
                // first_initialized = new Date();
                // time_acumulated = 0
            }
            else  //There are data in localstorage
            {
                page_count = JSON.parse(localStorage.PC_stored_page_count);
                trees_planted = JSON.parse(localStorage.PC_trees_planted_save);
                pages_left = JSON.parse(localStorage.PC_pages_left_save);
                // first_initialized = new Date((Number(JSON.parse(localStorage.PC_first_initialized))));
                // time_acumulated = (Number(JSON.parse(localStorage.PC_time_acumulated))); //WIP delete outer brackets?
            }
        }


        //increases the counter and calls badge's refresh function
        function increment_page_count() {
            if (pages_left == 1) {
              trees_planted++;
              pages_left = pages_per_tree;
            } else {
              pages_left--;
            }

            page_count++;
            badge();
            saveStatistics();
        }



//================ UNUSED FUNCTIONS ================//

        //Time object
        function tiempo (inicio, fin)
        {
            this.inicio = inicio;
            this.fin = fin;
        }

        //Returns the time has been accumulated since the start of the program
        function getAcumulado()
        {
            var now = new Date();
            return (now.getTime() - session_start.getTime()) + time_acumulated;

        }


        //Transforms from ms to d:hh:mm:ss format
        function formatTime(ms)
        {
            var dias = Math.floor(ms / (1000*60*60*24));
            ms = ms - dias*(1000*60*60*24);

            var horas = Math.floor(ms / (1000*60*60));
            ms = ms - horas*(1000*60*60);

            var minutos = Math.floor(ms / (1000*60));
            minutos=(minutos <=9)?"0"+minutos:minutos;
            ms = ms - minutos*(1000*60);


            var segundos = Math.floor(ms / (1000));
            segundos=(segundos <=9)?"0"+segundos:segundos;
            ms = ms%(1000);

            return (dias +"d " + horas + ":" + minutos + ":" + segundos);
        }
