/*jslint browser: true*/
/*global jQuery,console*/

/**
 * FROST
 *
 * @author 蒼時弦也
 * @version 1.0.0
 */

(function ($) {
    "use strict";

    // Container Fitter
    function fitWindowHeight(container) {
        var windowHeight = $(window).height();

        $(container).children().each(function (index, item) {
            $(item).height(windowHeight);
        });
    }

    function toggleNav() {
        $('#header .main-nav').children().each(function (index, item) {
            if (index > 0) {
                $(item).toggle();
            }
        });
    }

    $(document).ready(function () {
        // Set to full height
        fitWindowHeight($('#container'));

        // Hidden Header when at home
        $('#header').hide().width($(window).width());

        // Scroll When Click
        $('.main-nav a').click(function (event) {
            var pageElements = $('#container').children(),
                target = $(this).attr('href'),
                index = $(pageElements).index($(target)),
                pageHeight = $(window).height();

            if (target !== '#') {
                $('body').animate({
                    scrollTop: index * pageHeight
                });
            }

            event.preventDefault();
        });

        /* Nav for Mobile */
        $('.nav-open').click(function () {
            toggleNav();
        });

        $('#header .main-nav a').click(function () {
            if (!$(this).hasClass('nav-open')) {
                toggleNav();
            }
        });

        /**
         * Home Page
         */

        $('#home .horizontal-bar').width($(window).width()).css('margin-top', -($('#home .horizontal-bar').height() / 2));

        /**
         * Tooltips
         */

        $(document).tooltips();

    });

    // Track window height and change item height
    $(window).resize(function () {
        fitWindowHeight($('#container'));
        $('#home .horizontal-bar').width($(window).width()).css('margin-top', -($('#home .horizontal-bar').height() / 2));
        $('#header').width($(window).width());
    });

    // Track Scroll
    $(window).scroll(function (event) {
        var scrollTop = $(this).scrollTop(),
            pageHeight = $(window).height() - 25;

        $('#header').hide();
        if (scrollTop >= pageHeight) {
            $('#header').css('top', scrollTop).fadeIn('slow');
        } else {
            $('#header').fadeOut();
        }
    });

}(jQuery));
