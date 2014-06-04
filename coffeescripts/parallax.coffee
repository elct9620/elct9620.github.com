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

$(document).ready ->
  page.init()
