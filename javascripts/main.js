/*
# Main Script
*/


(function() {
  var $window, fullPage;

  $window = $(window);

  fullPage = $(".full-page");

  fullPage.height($window.height());

  $(window).on("resize", function(e) {
    return fullPage.height($window.height());
  });

}).call(this);
