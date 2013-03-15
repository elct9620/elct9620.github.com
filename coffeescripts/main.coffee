
$(document).ready ->

  $(".fancybox").fancybox({
    padding: 0,
    closeClick: true
  })

  # Portfolio Filter
  $("#portfolio").find(".filter").on "click", "a", (e) ->
    e.preventDefault();
    self = $(this)
    tag = self.data('type')

    if _gaq != "undefined" and _gaq
      if self.hasClass('active')
        _gaq.push(['_trackEvent', 'Portfolio', 'Hide', tag])
      else
        _gaq.push(['_trackEvent', 'Portfolio', 'Show', tag])
    self.toggleClass('active')

    works = $("#portfolio .works article")
    targets = works.filter(".tag-#{tag}").toggleClass('hide')

  # Menu Handler
  $("#main-menu").on "click", "a", (e)->
    self = $(this)
    type = self.data('type')
    target = self.attr('href')

    if type  == "page"
      e.preventDefault();
      $('html, body').animate({scrollTop: $(target).offset().top})

    if _gaq != "undefined" and _gaq
      if type == "page"
        _gaq.push(['_trackPageview', "/#{target}"])
