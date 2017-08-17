;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;
        this.$target = $(this.$elem.attr("data-target"));
        this.defaults = {
            toggleNum:4,
            btnName:null,
            btnToggleName:null
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            if(this.$target.children("li").length <= self.opts.toggleNum){
                self.$elem.hide();
            }else{
                self.$elem.show();
                self.toggleInit();
                self.$elem.click(function () {
                    self.toggleSlideTo();
                    if(self.$elem.html() === self.opts.btnName){
                        self.$elem.html(self.opts.btnToggleName);
                    }else{
                        self.$elem.html(self.opts.btnName);
                    }
                });
            }
        },
        toggleSlideTo:function () {
            var self = this;
            this.$target.children("li").each(function () {
                if($(this).index()>self.opts.toggleNum-1){
                    $(this).slideToggle();
                }
            });
        },
        toggleInit:function () {
            var self = this;
            this.$target.children("li").each(function () {
                if($(this).index()>self.opts.toggleNum-1){
                    $(this).hide();
                }
            });
        }
    };
    $.fn.toggleShowMore = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document,undefined);