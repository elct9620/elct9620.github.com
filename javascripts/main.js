(function() {

  $(document).ready(function() {
    $("#mainFrame, #header").hide();
    $("#loadingBar").animate({
      width: "100%"
    }, 1000, function() {
      $(this).children(".innerBG").show();
      return $(this).animate({
        height: "50%",
        top: 0
      }, 1000, function() {
        return $("#mainFrame, #header").fadeIn('slow');
      });
    });
    $(".fancybox").fancybox();
    $("#mainMenu a").click(function(e) {
      $("html, body").animate({
        scrollTop: $($(this).attr("href")).offset().top
      }, 'slow');
      return e.preventDefault();
    });
    $("#backTop").click(function(e) {
      return $("html, body").animate({
        scrollTop: 0
      }, 'slow');
    });
    return $(window).scroll(function(e) {
      var pageHeight, scrollTop;
      scrollTop = $(this).scrollTop();
      pageHeight = $(window).height() / 2;
      if (scrollTop > pageHeight) {
        return $("#backTop").fadeIn();
      } else {
        return $("#backTop").fadeOut();
      }
    });
  });

}).call(this);
