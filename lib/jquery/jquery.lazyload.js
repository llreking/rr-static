(function($) {
    $.fn.lazyload = function(options) {
        var settings = {
            threshold: 0,
            failurelimit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            forbg:0
        };
        if (options) {
            $.extend(settings, options);
        }
        var elements = this;
        if ("scroll" == settings.event) {
            $(settings.container).bind("scroll", function(event) {
                var counter = 0;
                elements.each(function() {
                    if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                        $(this).trigger("appear");
                    } else {
                        if (counter++ > settings.failurelimit) {
                            return false;
                        }
                    }
                });
                var temp = $.grep(elements, function(element) {
                    return !element.loaded;
                });
                elements = $(temp);
            });
        }
        return this.each(function() {
            var self = this;
            var $self=$(self);
            if ("scroll" != settings.event || $.belowthefold(self, settings) || $.rightoffold(self, settings)) {
                self.loaded = false;
            } else {
                $("<img />").bind("load", function() {
                        if(!settings.forbg){
                            $self.hide().attr("src", $self.attr("img"))[settings.effect](settings.effectspeed);
                        }else{
                            $self.hide().css("background-image", "url("+$self.attr("img")+")")[settings.effect](settings.effectspeed);
                        }
                    }).attr("src", $self.attr("img"));
                self.loaded = true;
            }
            $self.one("appear", function() {
                if (!this.loaded) {
                    self.loaded = true;
                    $("<img />").bind("load", function() {
                        if(!settings.forbg){
                            $self.hide().attr("src",$self.attr("img"))[settings.effect](settings.effectspeed);
                        }else{
                            $self.hide().css("background-image", "url("+$self.attr("img")+")")[settings.effect](settings.effectspeed);
                        }
                    }).attr("src", $self.attr("img"));
                }
            });
            if ("scroll" != settings.event) {
                $self.bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });
    };
    $.belowthefold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).height() + $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.rightoffold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).width() + $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.extend($.expr[":"], {
        "below-the-fold": "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold": "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold": "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold": "!$.rightoffold(a, {threshold : 0, container: window})"
    });
})(jQuery);