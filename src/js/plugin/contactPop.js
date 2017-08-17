;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;
        this.$pic = this.$elem.find(".contact_pic");
        this.$con = this.$elem.find(".contact_con");
        this.$close = this.$elem.find(".contact_close");
        this.isMove = false;

        this.defaults = {
            isSorp:false,
            sorpRange:null
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            this.$con.css("display","none");
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                self.dragPhone(self.$elem);
                self.$pic.on("touchend.pop",function () {
                    self.popup();

                });
                self.$close.on('touchend.pop',function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    self.closePop();
                });
            } else {
                self.dragPC(self.$elem);
                self.$pic.on("click.pop",function () {
                    self.popup();

                });
                self.$close.on("click.pop",function () {
                    self.closePop();
                });
            }
        },
        closePop:function () {
            var self = this;
            self.$pic.css("display","block").animate({
                "width":100+'%',
                "height":100+'%'
            });
            self.$con.animate({
                width:0,
                height:0
            },function () {
                self.$con.css("display","none")
            });

            return false;
        },
        popup:function () {
            var self = this;
            if(!self.isMove){
                self.$pic.animate({
                    width:0,
                    height:0
                },function () {
                    self.$pic.css("display","none")
                });
                self.$con.css("display","block").animate({
                    width:220,
                    height:240
                });
            }else{
                self.isMove = false;
            }

            return false;
        },
        dragPhone:function (ele) {
            var disX,disY,moveX,moveY,L,T;
            var self = this;

            ele.get(0).addEventListener('touchstart',function(ev){
                ev.preventDefault();//阻止触摸时页面的滚动，缩放

                disX = ev.touches[0].clientX - ele.get(0).offsetLeft;
                disY = ev.touches[0].clientY - ele.get(0).offsetTop;

            });
            ele.get(0).addEventListener('touchmove',function(ev){
                L = ev.touches[0].clientX - disX ;
                T = ev.touches[0].clientY - disY ;

                if(self.opts.isSorp){
                    if(L<self.opts.sorpRange){
                        L = 0;
                    }else if(L>($(window).width()-ele.width()-self.opts.sorpRange)){
                        L = $(window).width()-ele.width();
                    }
                    if(T<self.opts.sorpRange+$(window).scrollTop()){
                        T = $(window).scrollTop();
                    }else if(disY>($(window).height()-ele.height()+$(window).scrollTop()-self.opts.sorpRange)){
                        T = $(window).height()-ele.height()+$(window).scrollTop();
                    }
                }
                moveX = L + 'px';
                moveY = T + 'px';
                //console.log(moveX);
                this.style.left = moveX;
                this.style.top = moveY;
                self.isMove = true;
            });
        },
        dragPC:function (ele) {
            var self = this;
            ele.on("mousedown",function (ev) {
                var offsetLeft = ev.pageX - ele.offset().left;
                var offsetTop = ev.pageY - ele.offset().top;
                $(document).on("mousemove.drag",function (ev) {
                    var disX = ev.pageX - offsetLeft;
                    var disY = ev.pageY - offsetTop;

                    self.isMove = true;

                    if(self.opts.isSorp){
                        if(disX<self.opts.sorpRange){
                            disX = 0;
                        }else if(disX>($(window).width()-ele.width()-self.opts.sorpRange)){
                            disX = $(window).width()-ele.width();
                        }
                        if(disY<self.opts.sorpRange+$(window).scrollTop()){
                            disY = $(window).scrollTop();
                        }else if(disY>($(window).height()-ele.height()+$(window).scrollTop()-self.opts.sorpRange)){
                            disY = $(window).height()-ele.height()+$(window).scrollTop();
                        }
                    }
                    ele.css({
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
    $.fn.contactPop = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document,undefined);