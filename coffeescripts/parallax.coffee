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
}

# Parallax

enabledScore = false
page.section SECTIONS.SKILL, (section) ->
  section.on "scrollIn", ->
    return if enabledScore # Prevent run everytimes
    $("#skills .score").each (index, element) ->
      element = $(element)
      element.addClass("score-" + element.data("score"))
    enabledScore = true

$(document).ready ->
  page.init()
