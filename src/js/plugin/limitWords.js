;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;

        this.defaults = {
            limitLength:140
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            this.$elem.keyup(function(){
                var len = $(this).val().length;
                if(len > self.opts.limitLength -1){
                    $(this).val($(this).val().substring(0,self.opts.limitLength));
                    len = $(this).val().length;
                }
                var num = self.opts.limitLength - len;
                $("#word").text(num);
            });
        }
    };
    $.fn.limitWord = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document);