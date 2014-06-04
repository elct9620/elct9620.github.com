/*
# Parallax
*/


(function() {
  var SECTIONS, enabledAbout, enabledScore, page;

  page = sections.create({
    className: "section",
    autoSectionHeight: false
  });

  SECTIONS = {
    HOME: 0,
    ABOUT: 1,
    SKILL: 2,
    WORKS: 3,
    CONTACT: 4
  };

  enabledAbout = false;

  page.section(SECTIONS.ABOUT, function(section) {
    return section.on("progress", function(progress) {
      if (enabledAbout) {
        return;
      }
      if (progress < 50) {
        return;
      }
      return $("#about-me").removeClass("transparent");
    });
  });

  enabledScore = false;

  page.section(SECTIONS.SKILL, function(section) {
    return section.on("progress", function(progress) {
      if (enabledScore) {
        return;
      }
      if (progress < 50) {
        return;
      }
      $("#skills .score").each(function(index, element) {
        element = $(element);
        return element.addClass("score-" + element.data("score"));
      });
      return enabledScore = true;
    });
  });

  $(document).ready(function() {
    return page.init();
  });

}).call(this);
