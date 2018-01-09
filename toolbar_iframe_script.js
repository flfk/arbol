function acceptXml(xml) {
    // Process XML
}

function sendXml(frameName, xml) {
    var frame = window.parent.frames[frameName];
    frame.acceptXml(xml);
}

$(document).ready(function() {
  // Populate stats
  var tree_count = 400;
  $('#treeCount').prepend(tree_count);
  var pages_left = 48;
  $('#pagesLeft').prepend(pages_left);
  pages_left--; // doesn't work this way

  // Snooze functionality
  $('.cross').hover(
    function(){
      $('.cross').addClass('mouseOver');
    },
    function(){
      $('.cross').removeClass('mouseOver');
    }
  );
  $('.cross').on('click', function(){
    //$('.bottomBar').hide();
    parent.document.getElementById(window.name).style.display = 'none';
    //console.log($('#iframe'));
    //iframe.contentWindow.postMessage(/*any variable or object here*/, '*');
  });
});
