;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;


        this.defaults = {
            isSorp:false,
            sorpRange:null
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                self.dragPhone();
            } else {
                self.dragPC();
            }

        },
        dragPhone:function () {
            var disX,disY,moveX,moveY,L,T,starX,starY,starXEnd,starYEnd;

            this.$elem.addEventListener('touchstart',function(ev){
                ev.preventDefault();//阻止触摸时页面的滚动，缩放

                disX = ev.touches[0].clientX - this.offsetLeft;
                disY = ev.touches[0].clientY - this.offsetTop;
                //手指按下时的坐标
                starX = ev.touches[0].clientX;
                starY = ev.touches[0].clientY;
                //console.log(disX);
            });
            this.$elem.addEventListener('touchmove',function(ev){
                L = ev.touches[0].clientX - disX ;
                T = ev.touches[0].clientY - disY ;
                //移动时 当前位置与起始位置之间的差值
                starXEnd = ev.touches[0].clientX - starX;
                starYEnd = ev.touches[0].clientY - starY;
                //console.log(L);
                if(L<0){//限制拖拽的X范围，不能拖出屏幕
                    L = 0;
                }else if(L > document.documentElement.clientWidth - this.offsetWidth){
                    L=document.documentElement.clientWidth - this.offsetWidth;
                }

                if(T<0){//限制拖拽的Y范围，不能拖出屏幕
                    T=0;
                }else if(T>document.documentElement.clientHeight - this.offsetHeight){
                    T = document.documentElement.clientHeight - this.offsetHeight;
                }
                moveX = L + 'px';
                moveY = T + 'px';
                //console.log(moveX);
                this.style.left = moveX;
                this.style.top = moveY;
            });
            window.addEventListener('touchend',function(e){
                //alert(parseInt(moveX))
                //判断滑动方向

            });
        },
        dragPC:function () {
            var self = this;
            this.$elem.on("mousedown",function (ev) {
                var offsetLeft = ev.pageX - self.$elem.offset().left;
                var offsetTop = ev.pageY - self.$elem.offset().top;
                $(document).on("mousemove.drag",function (ev) {
                    var disX = ev.pageX - offsetLeft;
                    var disY = ev.pageY - offsetTop;
                    if(self.opts.isSorp){
                        if(disX<self.opts.sorpRange){
                            disX = 0;
                        }else if(disX>($(window).width()-self.$elem.width()-self.opts.sorpRange)){
                            disX = $(window).width()-self.$elem.width();
                        }
                        if(disY<self.opts.sorpRange+$(window).scrollTop()){
                            disY = $(window).scrollTop();
                        }else if(disY>($(window).height()-self.$elem.height()+$(window).scrollTop()-self.opts.sorpRange)){
                            disY = $(window).height()-self.$elem.height()+$(window).scrollTop();
                        }
                    }
                    self.$elem.css({
                        "left":disX,
                        "top":disY
                    });
                });
                $(document).on("mouseup.drag",function () {
                    $(document).off(".drag");
                });
                return false;
            });
        }
    };
    $.fn.drag = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document);