;(function($,window,document,undefined) {
    return $.fn.animatext = function(options) {
      var animaText, settings;
      settings = $.extend({
        mode: "chars",
        initDelay: 1000,
        speed: 200,
        timeToRelaunch: 2000,
        infinite: false,
        onBegin: function() {},
        onSuccess: function() {}
      }, options);
      animaText = function(element) {
        var animatedElements, animatedElementsBuffer, animatedWords, animationInProgress, checkInView, cutText, doAnimation, j, paragraphs, randomIndex, randomIterations, ref, relaunchAnimation, scale;
        settings.onBegin();
        animatedElements = [];
        animationInProgress = false;
          paragraphs = "";
          cutText = element.html().split("<br>");
          $(cutText).each(function(i, item) {
            var cutParagraphs, words;
            words = "";
            cutParagraphs = item.split(" ");
            $(cutParagraphs).each(function(i, item) {
              var chars, cutWord;
                chars = "";
                cutWord = item.split("");
                $(cutWord).each(function(i, item) {
                  return chars += '<span class="char' + (i + 1) + '" aria-hidden="true" style="visibility:hidden; display:inline-block">' + item + '</span>';
                });
                return words += '<span class="word' + (i + 1) + '" aria-hidden="true" aria-label="' + item + '" style="display:inline-block">' + chars + '</span> ';
            });
            return paragraphs += '<span class="paragraph' + (i + 1) + '" aria-hidden="true" aria-label="' + item + '" style="display:inline-block">' + words + '</span><br>';
          });
          element.attr('aria-label', element.text());
          element.html(paragraphs);
          animatedWords = element.find("span[class^='word']");

            $(animatedWords).each(function(i, item) {
              var thisChars;
              thisChars = $(item).find("span[class^='char']");
              return $(thisChars).each(function(i, item) {
                return animatedElements.push(item);
              });
            });
        relaunchAnimation = function(element) {
            element.find("span").css('visibility', 'hidden');
            element.find("span").removeClass('animated');
            element.find("span").removeClass(settings.effect);
            return doAnimation();
        };
        doAnimation = function() {
          var animation, indexInterval;
          animationInProgress = true;
          indexInterval = 0;
          return animation = setInterval(function() {
            if (indexInterval >= animatedElements.length) {
              clearInterval(animation);
              settings.onSuccess();
              if (settings.infinite) {
                setTimeout(function() {
                  animationInProgress = false;
                  return relaunchAnimation(element);
                }, settings.timeToRelaunch);
              }
            }
            $(animatedElements[indexInterval]).css('visibility', 'visible');
            if (settings.effect) {
              $(animatedElements[indexInterval]).addClass('animated ' + settings.effect);
            }
            return indexInterval += 1;
          }, settings.speed);
        };
        return $(document).ready(function() {
          return setTimeout(function() {
                  doAnimation();
          }, settings.initDelay);
        });
      };
      if (this.length > 0) {
          return $(this).each(function(i, item) {
            return animaText($(item));
          });
      }
    };
  })(window.jQuery,window,document);
