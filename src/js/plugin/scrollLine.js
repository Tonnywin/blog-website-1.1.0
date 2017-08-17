;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;
        this.$target = $(this.$elem.attr("data-target"));
        this.$targetParent = this.$target.closest(".adviceList");

        this.iScale = 0;
        this.listBoxHeight = this.$target.height();
        this.boxLimitHeight = this.$targetParent.height();
        this.$target.get(0).adListBoxHeight = this.listBoxHeight;

        this.defaults = {
            scrollBtnHeight:null,
            scrollLineHeight:null
        };
        this.opts = $.extend({},this.defaults,options);
    };

    Plugin.prototype = {
        initial:function () {
            var self = this;
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
                self.dragPhone();
            }else{
                self.dragPC();
            }
        },
        dragPhone:function () {
            var maxTop,disY,moveY,T;
            var self = this;

            this.$elem.get(0).addEventListener('touchstart',function(ev){
                ev.preventDefault();//阻止触摸时页面的滚动，缩放
                disY = ev.touches[0].clientY - self.$elem.get(0).offsetTop;
                maxTop = self.opts.scrollLineHeight - self.opts.scrollBtnHeight;

            });
            this.$elem.get(0).addEventListener('touchmove',function(ev){
                T = ev.touches[0].clientY - disY ;
                if(T<0){
                    T = 0;
                }else if(T > maxTop){
                    T = maxTop;
                }
                moveY = T + 'px';
                this.style.top = moveY;
                self.iScale = T/maxTop;
                self.adListMove();
            });
        },
        dragPC:function () {
            var self = this;
            this.$elem.on('mousedown',function (ev) {
                var offsetY = ev.pageY - self.$elem.position().top;
                var maxTop = self.opts.scrollLineHeight - self.opts.scrollBtnHeight;
                $(document).on('mousemove.adScroll',function (ev) {
                    var disY = ev.pageY - offsetY;
                    if(disY<0){
                        disY = 0;
                    }else if(disY > maxTop){
                        disY = maxTop;
                    }
                    self.$elem.css("top",disY);
                    self.iScale = disY/maxTop;
                    self.adListMove();
                });
                $(document).on('mouseup.adScroll',function () {
                    $(document).off(".adScroll");
                });
                return false;
            });
        },
        resetDrag:function () {
            this.$elem.css("top",0);
            this.iScale = 0;
            this.adListMove();
        },
        adListMove:function () {
            this.$target.css("top",(this.boxLimitHeight-this.$target.get(0).adListBoxHeight)*this.iScale);
        }
    };
    $.fn.scrollLine = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            if(plugin[options]){
                return plugin[options].call(plugin);
            }else if(typeof options === "object"||!options){
                plugin.initial();
            }
        });
    }
})(window.jQuery,window,document);