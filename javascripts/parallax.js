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

  page.section(SECTIONS.HOME, function(section) {
    var nickname, scrollDownNotice, transitions;

    scrollDownNotice = document.querySelector("#scroll-down-notice");
    nickname = document.querySelector("#nickname");
    transitions = [];
    transitions.push({
      target: scrollDownNotice,
      start: 100,
      end: 150,
      key: 'opacity',
      from: 1,
      to: 0
    });
    transitions.push({
      target: nickname,
      start: 100,
      end: 150,
      key: 'opacity',
      from: 1,
      to: 0
    });
    section.transitions(transitions);
    return section.on("progress", function(progress) {
      if (progress > 150) {
        return scrollDownNotice.className = "hidden";
      }
      if (progress < 150) {
        return scrollDownNotice.className = "";
      }
    });
  });

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

  page.section(SECTIONS.WORKS, function(section) {
    var transitions, works;

    works = document.querySelector("#works");
    transitions = [];
    transitions.push({
      target: works,
      start: 0,
      end: 70,
      key: 'opacity',
      from: 0,
      to: 1
    });
    return section.transitions(transitions);
  });

  $(document).ready(function() {
    return page.init();
  });

}).call(this);
