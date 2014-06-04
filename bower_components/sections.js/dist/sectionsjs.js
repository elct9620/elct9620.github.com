/*! sectionsjs - v0.1.3 - 2014-01-17 | Copyright (c) 2013 Po-Ying Chen <poying.me@gmail.com> */

(function(window, document) {
    "use strict";
    var sections = window.sections = {};
    sections.config = {
        className: "section",
        containerClassName: "section__container",
        marginTop: 0,
        autoSectionHeight: true,
        magnet: false
    };
    sections.utils = {};
    sections.utils.getInlineCSS = function(element) {
        if (element.__style) {
            return element.__style;
        }
        var style = element.getAttribute("style") || "";
        var regexp = /([^:\s]+)\s*:\s*([^;]+)/g;
        var data = {};
        style.replace(regexp, function(origin, key, value) {
            data[key] = value.trim();
        });
        element.__style = data;
        return data;
    };
    sections.utils.setInlineCSS = function(element, style) {
        var oldStyle = sections.utils.getInlineCSS(element);
        var newStyle = [];
        var i;
        for (i in style) {
            if (style.hasOwnProperty(i)) {
                oldStyle[i] = style[i];
            }
        }
        for (i in oldStyle) {
            if (oldStyle.hasOwnProperty(i)) {
                newStyle.push(i + ": " + oldStyle[i]);
            }
        }
        element.setAttribute("style", newStyle.join("; "));
        return oldStyle;
    };
    sections.utils.forEach = function(array, callback) {
        array || (array = []);
        callback || (callback = function() {});
        var i, val;
        var len = array.length;
        for (i = 0; i < len; i += 1) {
            val = array[i];
            if (callback(val, i) === false) {
                break;
            }
        }
    };
    sections.utils.getVendorPrefix = function() {
        var getStyle = window.getComputedStyle;
        var prefix;
        if (getStyle) {
            var style = getStyle(document.documentElement, "");
            var match;
            style = Array.prototype.join.call(style, "");
            match = style.match(/-(?:O|Moz|webkit|ms)-/i);
            if (match) {
                prefix = match[0];
            }
        }
        return prefix;
    };
    sections.utils.needPrefix = function(key) {
        var getStyle = window.getComputedStyle;
        if (getStyle) {
            var r = new RegExp("^-\\w+-" + (key || ""), "m");
            return r.test(Array.prototype.join.call(getStyle(document.body), "\n"));
        }
        return false;
    };
    sections.utils.clone = function(obj) {
        var newObj = {};
        var prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    };
    sections.events = {};
    sections.events.EventEmitter = function() {
        var EventEmitter = function() {
            this.events = {};
        };
        var on = EventEmitter.prototype.on = function(eventName, handler, isOnce) {
            var events = this.events;
            if (typeof handler === "function") {
                handler.once = !!isOnce;
                if (!events[eventName]) {
                    events[eventName] = [];
                }
                events[eventName].push(handler);
            }
            return this;
        };
        var addEventListener = EventEmitter.prototype.addEventListener = on;
        var once = EventEmitter.prototype.once = function(eventName, handler) {
            return this.on(eventName, handler, true);
        };
        var off = EventEmitter.prototype.off = function(eventName, handler) {
            var events = this.events;
            if (typeof handler === "function") {
                var handlers = events[eventName] || [];
                var len = handlers.length;
                while (len--) {
                    if (handlers[len] === handler) {
                        handlers.splice(len, 1);
                    }
                }
            } else {
                delete events[eventName];
            }
            return this;
        };
        var removeEventListener = EventEmitter.prototype.removeEventListener = off;
        var emit = EventEmitter.prototype.emit = function(eventName) {
            var args = Array.prototype.slice.call(arguments, 1);
            var handlers = this.events[eventName] || [];
            var len = handlers.length;
            while (len--) {
                handlers[len].apply(this, args);
                if (handlers[len].once) {
                    handlers.splice(len, 1);
                }
            }
            return this;
        };
        var trigger = EventEmitter.prototype.trigger = emit;
        return EventEmitter;
    }();
    sections.Transition = function() {
        var Transition = function(options) {
            this.__options = Transition.getOptions(options);
            this.values = [];
        };
        Transition.prototype.update = function(progress) {
            var values;
            var easing = this.__options.easing;
            var after = this.__options.afterCalculate;
            progress = this.getProgress(progress);
            if (easing) {
                if (this.__options.values) {
                    values = [];
                    sections.utils.forEach(this.__options.values, function(value) {
                        values.push(after(easing(progress, value.from, value.to)));
                    });
                } else {
                    values = [ after(easing(progress, this.__options.from, this.__options.to)) ];
                }
            } else {
                values = this.getValue(progress);
            }
            return Transition.format(this.__options.format, values);
        };
        Transition.prototype.getProgress = function(sectionProgress) {
            var progress;
            switch (true) {
              case sectionProgress <= this.__options.start:
                progress = 0;
                break;

              case sectionProgress >= this.__options.end:
                progress = 100;
                break;

              default:
                var range = this.__options.end - this.__options.start;
                var current = sectionProgress - this.__options.start;
                progress = current / range * 100;
            }
            return progress;
        };
        Transition.prototype.getValue = function(progress) {
            var cssValue;
            var values = this.__options.values;
            var after = this.__options.afterCalculate;
            if (values) {
                var value;
                var i, len = values.length;
                cssValue = [];
                for (i = 0; i < len; i += 1) {
                    value = values[i];
                    cssValue.push(after(this.calcValue(value, progress)));
                }
            } else {
                cssValue = [ after(this.calcValue(this.__options, progress)) ];
            }
            return cssValue;
        };
        Transition.prototype.calcValue = function(value, progress) {
            var from = value.from;
            var to = value.to;
            return (to - from) / 100 * progress + from;
        };
        Transition.prototype.getKey = function(prefix) {
            var key = this.__options.key;
            if (prefix) {
                key = prefix + key[0].toUpperCase() + key.slice(1);
            }
            return key;
        };
        Transition.prototype.getTarget = function() {
            return this.__options.target;
        };
        Transition.getOptions = function(options) {
            options || (options = {});
            var defOptions = Transition.defaultOptions;
            var prop;
            for (prop in defOptions) {
                if (defOptions.hasOwnProperty(prop) && !options.hasOwnProperty(prop)) {
                    options[prop] = defOptions[prop];
                }
            }
            return options;
        }, Transition.defaultOptions = {
            key: null,
            start: 0,
            end: 100,
            from: 0,
            to: 0,
            values: null,
            format: "%s",
            easing: null,
            target: null,
            prefix: false,
            afterCalculate: function(val) {
                return val;
            }
        };
        Transition.format = function(format, values) {
            var index = 0;
            return format.replace(/\\%s/g, "￿").replace(/%s/g, function() {
                return values[index++];
            }).replace(/￿/g, "%s");
        };
        return Transition;
    }();
    sections.Section = function() {
        var Section = function(element, container, sections_) {
            sections.events.EventEmitter.call(this);
            this.sections = sections_;
            this.element = element;
            this.container = container || {
                style: {}
            };
            this.updatePosition();
            this.progress = 0;
            this.visible = true;
            this.__transitions = [];
            this.__transitionTargets = [];
        };
        Section.prototype = new sections.events.EventEmitter();
        Section.prototype.updatePosition = function() {
            var offset = this.getOffset();
            this.top = offset.top;
            return this;
        };
        Section.prototype.getOffset = function() {
            var el = this.element;
            var x = 0;
            var y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                x += el.offsetLeft;
                y += el.offsetTop;
                el = el.offsetParent;
            }
            return {
                top: y,
                left: x
            };
        };
        Section.prototype.show = function() {
            if (!this.visible) {
                this.container.style.display = "block";
                this.visible = true;
                this.emit("show");
            }
        };
        Section.prototype.hide = function() {
            if (this.visible) {
                this.container.style.display = "none";
                this.visible = false;
                this.emit("hide");
            }
        };
        Section.prototype.getCSS = function(key) {
            var css = sections.utils.getInlineCSS(this.element);
            return key ? css[key] : css;
        };
        Section.prototype.setCSS = function(css) {
            sections.utils.setInlineCSS(this.element, css);
            return this;
        };
        Section.prototype.updateProgress = function(pageTop, pageHeight) {
            var height = this.getHeight();
            var progress;
            if (pageTop + pageHeight > this.top && pageTop <= this.top + height) {
                var pos = this.top - pageTop;
                progress = pos / (pos > 0 ? pageHeight : height) * 100;
                progress = progress > 0 ? 100 - progress : progress * -1 + 100;
            } else {
                progress = this.top - pageTop > 0 ? 0 : 200;
            }
            if (this.progress !== progress) {
                this.runTransition(progress);
                this.progress = progress;
                this.emit("progress", progress);
            }
            return this;
        };
        Section.prototype.getHeight = function() {
            var el = this.element;
            return el.offsetHeight || el.clientHeight || el.scrollHeight;
        };
        Section.prototype.transitions = function(transitions) {
            var newTransitions = this.__transitions;
            sections.utils.forEach(transitions, function(transition, i) {
                transition.target = transition.target || transition.targets || [];
                transition.prefix === undefined && (transition.prefix = sections.utils.needPrefix(transition.key));
                var targets = transition.target instanceof Array ? transition.target : [ transition.target ];
                sections.utils.forEach(targets, function(target, i) {
                    var data = sections.utils.clone(transition);
                    data.target = this.setTarget(transition.target);
                    newTransitions.push(new sections.Transition(data));
                }.bind(this));
            }.bind(this));
            return this;
        };
        Section.prototype.setTarget = function(target) {
            var targets = this.__transitionTargets;
            var id = targets.indexOf(target);
            if (!~id) {
                targets.push(target);
                id = targets.length - 1;
            }
            return id;
        };
        Section.prototype.runTransition = function(progress) {
            var transitions = this.__transitions;
            var targets = this.__transitionTargets;
            var forEach = sections.utils.forEach;
            forEach(transitions, function(transition, i) {
                var target = transition.getTarget();
                var values = targets[target].style;
                values[transition.getKey(transition.__options.prefix ? this.sections.__prefix : null)] = transition.update(progress);
            }.bind(this));
        };
        return Section;
    }();
    sections.Animate = function() {
        function Animate(fn, speed, easing) {
            this.id = 0;
            this.startTime = 0;
            this.started = false;
            this.speed = speed || 300;
            this.fn = fn;
            this.easing = easing;
        }
        Animate.prototype = new sections.events.EventEmitter();
        Animate.prototype.loop = function() {
            this.id = sections.requestAnimationFrame(function() {
                var progress = (Date.now() - this.startTime) / this.speed;
                this.easing && (progress = this.easing(progress));
                if (progress >= 1) {
                    this.fn(1);
                    this.emit("done");
                } else {
                    this.fn(progress);
                    this.loop();
                }
            }.bind(this));
        };
        Animate.prototype.stop = function() {
            this.started && sections.cancelAnimationFrame(this.id);
            this.started = false;
            this.emit("stopped");
            return this;
        };
        Animate.prototype.start = function() {
            if (!this.started) {
                this.startTime = Date.now();
                this.started = true;
                this.emit("started");
                this.loop();
            }
            return this;
        };
        return Animate;
    }();
    sections.proto = new sections.events.EventEmitter();
    sections.proto.init = function() {
        this.__started = false;
        this.__init = true;
        this.__running = false;
        this.__prefix = null;
        this.__magneticTimer = null;
        this.__magneticAnimation = null;
        this.detectCSSPrefix();
        this.getSections();
        this.updateWindowSize();
        this.getScrollHeight();
        this.addWindowResizeHandler();
        this.addScrollHandler();
        this.updateProgress();
        this.lazyApply();
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.loop = this.loop.bind(this);
        this.onScrollHandler();
        return this;
    };
    sections.proto.detectCSSPrefix = function() {
        var map = {
            "-webkit-": "webkit",
            "-moz-": "Moz",
            "-ms-": "ms",
            "-o-": "O"
        };
        this.__prefix = map[sections.utils.getVendorPrefix()];
    };
    sections.proto.getScrollHeight = function() {
        var body = document.body;
        var documentElement = document.documentElement;
        this.scrollHeight = body.scrollHeight || documentElement.scrollHeight || 0;
        return this;
    };
    sections.proto.getSections = function() {
        this.sections = [];
        var elements = document.getElementsByClassName(this.config.className);
        sections.utils.forEach(elements, function(element) {
            var container = element.querySelector("." + this.config.containerClassName);
            this.sections.push(new sections.Section(element, container, this));
        }.bind(this));
        return this;
    };
    sections.proto.start = function() {
        this.onScrollHandler();
        if (this.__init && !this.__started) {
            window.addEventListener("scroll", this.onScrollHandler);
            this.__started = true;
            this.emit("started");
        }
        return this;
    };
    sections.proto.stop = function() {
        if (this.__started) {
            window.removeEventListener("scroll", this.onScrollHandler);
            this.__started = false;
            this.emit("stopped");
        }
    };
    sections.proto.onScrollHandler = function(e) {
        if (this.__running) {
            return;
        }
        if (this.__magneticAnimation && this.__magneticAnimation.scrollTop !== document.documentElement.scrollTop) {
            this.__magneticAnimation.stop();
        }
        this.__running = true;
        this.__intervalID = this.requestAnimationFrame(this.loop);
    };
    sections.proto.loop = function() {
        this.config.magnet && this.__magneticAnimation === null && this.magnet();
        var scrollOffset = {
            x: 0,
            y: 0
        };
        if (window.pageYOffset) {
            scrollOffset.y = window.pageYOffset;
            scrollOffset.x = window.pageXOffset;
        } else if (document.body && document.documentElement.scrollLeft) {
            scrollOffset.y = document.documentElement.scrollTop;
            scrollOffset.x = document.documentElement.scrollLeft;
        } else if (document.documentElement && document.documentElement.scrollLeft) {
            scrollOffset.y = document.documentElement.scrollTop;
            scrollOffset.x = document.documentElement.scrollLeft;
        }
        this.top = scrollOffset.y;
        this.left = scrollOffset.x;
        this.checkCurrentSection();
        this.updateProgress();
        this.__running = false;
    };
    sections.proto.requestAnimationFrame = function() {
        return (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout).bind(window);
    }();
    sections.proto.cancelAnimationFrame = function() {
        return (window.cancelAnimationFrame || window.mozcancelAnimationFrame || window.webkitcancelAnimationFrame || window.mscancelAnimationFrame || setInterval).bind(window);
    }();
    sections.proto.updateWindowSize = function() {
        var documentElement = document.documentElement;
        var body = document.body;
        var width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
        var height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
        this.width = width;
        this.height = height;
        if (this.config.autoSectionHeight) {
            this.each(function(index, section) {
                section.setCSS({
                    height: height + "px"
                });
                section.updatePosition();
            });
        }
        return this;
    };
    sections.proto.addWindowResizeHandler = function() {
        var onResize = function() {
            this.updateWindowSize();
        }.bind(this);
        window.addEventListener("resize", onResize);
        onResize();
        return this;
    };
    sections.proto.addScrollHandler = function() {
        window.addEventListener("scroll", function() {
            this.start();
        }.bind(this));
    };
    sections.proto.checkCurrentSection = function() {
        var prevIndex = this.__currentIndex;
        var done = false;
        var thisBottom = this.top + this.height;
        this.each(function(index, section) {
            var sectionBottom = section.top + section.getHeight();
            if (!done && this.top >= section.top && this.top < sectionBottom && index !== prevIndex) {
                this.__currentIndex = index;
                var prev = this.get(prevIndex);
                this.emit("changed", section, prev);
                if (prev) {
                    prev.emit("scrollOut", prevIndex < index ? 1 : -1);
                }
                section.emit("scrollIn", prevIndex > index ? 1 : -1);
                done = true;
            }
            if (this.top > sectionBottom || section.top > thisBottom) {
                section.hide();
            } else {
                section.show();
            }
        }.bind(this));
        return this;
    };
    sections.proto.updateProgress = function() {
        var last = this.last();
        var progress = this.top / (this.scrollHeight - last.getHeight()) * 100;
        if (this.progress !== progress) {
            this.progress = progress;
            this.emit("progress", progress);
            this.each(function(index, section) {
                section.updateProgress(this.top, this.height);
            }.bind(this));
        }
        return this;
    };
    sections.proto.lazyApply = function() {
        var allfn = this.__lazyApply;
        var len = allfn.length;
        while (len--) {
            allfn[len]();
        }
        return this;
    };
    sections.proto.current = function() {
        return this.get(this.currentIndex());
    };
    sections.proto.last = function() {
        return this.get(this.sections.length - 1);
    };
    sections.proto.first = function() {
        return this.get(0);
    };
    sections.proto.currentIndex = function() {
        return this.__currentIndex | 0;
    };
    sections.proto.get = function(index) {
        return this.sections[index] || null;
    };
    sections.proto.getCurrentSection = function() {
        return this.get(this.currentIndex());
    };
    sections.proto.section = function(index, fn) {
        if (!this.__init) {
            this.__lazyApply.push(function() {
                this.section(index, fn);
            }.bind(this));
        } else {
            if (typeof fn === "function") {
                switch (index) {
                  case "first":
                    index = 0;
                    break;

                  case "last":
                    index = this.sections.length - 1;
                    break;

                  default:
                    index = index | 0;
                }
                var section = this.get(index);
                if (section) {
                    fn.call(section, section);
                }
            }
        }
        return this;
    };
    sections.proto.each = function(fn) {
        sections.utils.forEach(this.sections, function(val, i) {
            if (fn.call(val, i, val) === false) {
                return false;
            }
        });
        return this;
    };
    sections.proto.magnet = function() {
        clearTimeout(this.__magneticTimer);
        this.__magneticAnimation && this.__magneticAnimation.stop();
        this.__magneticTimer = setTimeout(function() {
            this.__magneticAnimation = this.scrollTo(this.getCurrentSection(), 1e3);
            var done = this.magnetDone.bind(this);
            this.__magneticAnimation.once("done", done);
            this.__magneticAnimation.once("stopped", done);
            this.__magneticAnimation.start();
        }.bind(this), 500);
    };
    sections.proto.magnetDone = function() {
        this.__magneticAnimation = null;
    };
    sections.proto.scrollTo = function(section, speed, easing) {
        if (!(section instanceof sections.Section)) {
            section = this.get(section);
        }
        var total = section.top - this.top;
        var top_ = this.top;
        var animate = new sections.Animate(function(progress) {
            animate.scrollTop = document.documentElement.scrollTop = top_ + total * progress | 0;
        }.bind(this), speed, easing);
        return animate;
    };
    sections.Sections = function(config) {
        sections.events.EventEmitter.call(this);
        config = config || {};
        var defConfig = sections.config;
        var i;
        for (i in defConfig) {
            if (defConfig.hasOwnProperty(i) && !config.hasOwnProperty(i)) {
                config[i] = defConfig[i];
            }
        }
        this.__started = false;
        this.__currentIndex = -1;
        this.config = config;
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.__lazyApply = [];
    };
    sections.Sections.prototype = sections.proto;
    sections.requestAnimationFrame = sections.proto.requestAnimationFrame;
    sections.cancelAnimationFrame = sections.proto.cancelAnimationFrame;
    sections.create = function(config) {
        return new sections.Sections(config);
    };
})(this, this.document);