/*jslint browser: true, regexp: true */
/*global jQuery, $, console */
// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function () {
        "use strict";
        var noop = function () {},
            methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'],
            length = methods.length,
            console = window.console = {};
        while (length > 0) {
            length -= 1;
            console[methods[length]] = noop;
        }
    }());
}

// Place any jQuery/helper plugins in here.
