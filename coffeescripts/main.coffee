###
# Main Script
###

# Global
$window = $(window)

# Full Page (Auto Height)
fullPage = $(".full-page")
fullPage.height($window.height())

$(window).on "resize", (e)->
  fullPage.height($window.height())
