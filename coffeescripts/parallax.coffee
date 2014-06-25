###
# Parallax
###

page = sections.create {
  className: "section"
  autoSectionHeight: false
}

# Sections
SECTIONS = {
  HOME: 0
  ABOUT: 1
  SKILL: 2
  WORKS: 3
  CONTACT: 4
}

# Parallax

enabledAbout = false
page.section SECTIONS.HOME, (section) ->
  scrollDownNotice = document.querySelector("#scroll-down-notice")
  nickname = document.querySelector("#nickname")

  transitions = []

  transitions.push {
    target: scrollDownNotice
    start:100
    end: 150
    key: 'opacity'
    from: 1
    to: 0
  }

  transitions.push {
    target: nickname
    start: 100
    end: 150
    key: 'opacity'
    from: 1
    to: 0
  }

  section.transitions(transitions)

  section.on "progress", (progress) ->
    return scrollDownNotice.className = "hidden" if progress > 150
    return scrollDownNotice.className = "" if progress < 150

page.section SECTIONS.ABOUT, (section) ->
  section.on "progress", (progress) ->
    return if enabledAbout
    return if progress < 50
    $("#about-me").removeClass "transparent"

enabledScore = false

page.section SECTIONS.SKILL, (section) ->
  section.on "progress", (progress)->
    return if enabledScore # Prevent run everytimes
    return if progress < 50
    $("#skills .score").each (index, element) ->
      element = $(element)
      element.addClass("score-" + element.data("score"))
    enabledScore = true

page.section SECTIONS.WORKS, (section) ->
  works = document.querySelector("#works")

  transitions = []

  transitions.push {
    target: works
    start: 0
    end: 70
    key: 'opacity'
    from: 0
    to: 1
  }

  section.transitions(transitions)

$(document).ready ->
  page.init()
