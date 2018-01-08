//get url of toolbar.html file using chrome api
var url = chrome.extension.getURL('toolbar.html');
//height created dynamically in the iframe because it needs to be used in iframe and XX
var height = '35px';
var iframe = "<iframe src='"+url+"' id='myOwnCustomFirstToolbar1234' style='height:'"+height+"></iframe>";

$('html').append(iframe);

$('body').css({
  'webkit-transform': 'translateY('+height')'
})
