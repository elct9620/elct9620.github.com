(function() {

  $(document).ready(function() {
    $(".fancybox").fancybox({
      padding: 0,
      closeClick: true
    });
    $("#portfolio").find(".filter").on("click", "a", function(e) {
      var self, tag, targets, works;
      e.preventDefault();
      self = $(this);
      tag = self.data('type');
      if (_gaq !== "undefined" && _gaq) {
        if (self.hasClass('active')) {
          _gaq.push(['_trackEvent', 'Portfolio', 'Hide', tag]);
        } else {
          _gaq.push(['_trackEvent', 'Portfolio', 'Show', tag]);
        }
      }
      self.toggleClass('active');
      works = $("#portfolio .works article");
      return targets = works.filter(".tag-" + tag).toggleClass('hide');
    });
    return $("#main-menu").on("click", "a", function(e) {
      var self, target, type;
      self = $(this);
      type = self.data('type');
      target = self.attr('href');
      if (type === "page") {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: $(target).offset().top
        });
      }
      if (_gaq !== "undefined" && _gaq) {
        if (type === "page") {
          return _gaq.push(['_trackPageview', "/" + target]);
        }
      }
    });
  });

}).call(this);
