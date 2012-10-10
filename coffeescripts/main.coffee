# FROST // JavaScript

$(document).ready ->
  $("#mainFrame, #header").hide(); # Hide Main Frame before loading

  headerBG = $("<img/>")
  headerBG.attr('src', 'images/header_bg.jpg')

  headerBG.load ->
    $("#loadingBar").animate {width: "100%"}, 1000, ->
      $(this).children(".innerBG").show();
      $(this).animate {
        height: "50%",
        top: 0
      }, 1000, ->
        $("#mainFrame, #header").fadeIn('slow');

  $(".fancybox").fancybox();

  $("#mainMenu a").click (e)->
    $("html, body").animate {
      scrollTop: $($(this).attr("href")).offset().top
    }, 'slow'
    e.preventDefault()

  $("#backTop").click (e)->
    $("html, body").animate {
      scrollTop: 0
    }, 'slow'

  $(window).scroll (e)->
    scrollTop = $(this).scrollTop()
    pageHeight = $(window).height() / 2

    if scrollTop > pageHeight
      $("#backTop").fadeIn()
    else
      $("#backTop").fadeOut()


