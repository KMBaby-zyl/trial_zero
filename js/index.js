window.onload = function(){
  var pluginName = "archer",
      defaults = {
      };
  function archer(element, options){
    this.element = element;
    this.options = $.extend({},defaults,options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }
  function has3d() {
    var el = document.createElement('p'),
        has3d,
        transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
        };
    document.body.insertBefore(el, null);

    for (var t in transforms) {
        if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
    }

    document.body.removeChild(el);

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }
  archer.prototype.init = function(){

      var touchsurface = this.element[0];
      var touchmove, touched, startX, startY, lastTouch, moved,cur,height;

      var translate3d = has3d(),
          orientation = 'vertical';

      touchsurface.scrollTo2 = function (x, y) {
        orientation === 'vertical' ? (y = y ? (y + 'px') : 0, x = 0) : (x = x ? (x + 'px') : 0, y = 0);
        $(touchsurface).css('-webkit-transform', 'translate' + (translate3d ? '3d' : '') + '(' + x + ',' + y + (translate3d ? ',0' : '') + ')');
        touchsurface.style['webkitTransition'] = '';
      };

      touchsurface.scrollTo = function (x, y) {
        orientation === 'vertical' ? (y = y ? (y + 'px') : 0, x = 0) : (x = x ? (x + 'px') : 0, y = 0);
        $(touchsurface).css('-webkit-transform', 'translate' + (translate3d ? '3d' : '') + '(' + x + ',' + y + (translate3d ? ',0' : '') + ')');
        touchsurface.style['webkitTransition'] = '-webkit-transform ease-out 0.3s';
      };

      touchsurface.swipe = function (swipedir){
         cur = parseInt($('.homeWrp >ul')[0].className.slice(-1));
         height = $(window).height();

        if(swipedir == "up"){
          var className = 'kmN_animate'+(cur+1);
          $('.homeWrp > ul')[0].className = 'clearfix';
          $('.homeWrp > ul').addClass(className);
          touchsurface.scrollTo(0,-(cur+1)*height);
          location.hash = cur+1;
        }else if(swipedir == "down"){
          var className = 'kmN_animate_up'+(cur-1);
          $('.homeWrp > ul')[0].className = 'clearfix';
          $('.homeWrp > ul').addClass(className);
          touchsurface.scrollTo(0,-(cur-1)*height);
          location.hash = cur-1;
        }
      }

      touchsurface.back = function(){
        cur = parseInt($('.homeWrp >ul')[0].className.slice(-1));
        height = $(window).height();
        touchsurface.scrollTo(0, -height * cur);
      }
      touchsurface.addEventListener('touchstart', function(e){
        cur = parseInt($('.homeWrp >ul')[0].className.slice(-1));
        height = $(window).height();
        var t;
        if (t = e.touches) { t = t[0]; } else { t = e; }
        touchmove = moved = 0;
        touched = 1;
        startX = t.pageX;
        startY = t.pageY;
        lastTouch = t;
      }, false);

      touchsurface.addEventListener('touchmove', function(e){
        if(touched){
          var t, v, x, y,left,top;
          height = $(window).height();
          moved = 1;
          if (t = e.touches) { t = t[0]; } else { t = e; }
          left = touchsurface.left = t.pageX - startX;
          top = touchsurface.top = t.pageY - startY;
          if(cur==0&&top>0){

          }else if(cur ==3&&top < 0){

          }else{
            touchsurface.scrollTo2(left ,top - (cur*height));
          }
          lastTouch = t;
          e.preventDefault();
        }
      },false);

      touchsurface.addEventListener('touchCancel',function(e) {

      },false);

      touchsurface.addEventListener('touchend', function(e){
        var t, x, y, v;
        if (touched && moved) {
          if (t = e.touches) { t = t[0]; } else { t = e; }
          t = lastTouch;
          x = t.pageX - startX; y = t.pageY - startY;
          v = orientation === 'vertical' ? y : x;
          if (v > 20) {
            if(cur == 0){ touchsurface.scrollTo(0,0); return;}
            touchsurface.swipe('down');
          }else if (v < -20) {
            if(cur == 3){ touchsurface.scrollTo(0,-3*height); return;}
            touchsurface.swipe('up');
          }else {
            touchsurface.back();
          }
          touchmove = 1;
        }
        touched = 0; moved = 0;
        if (touchmove)
          e.preventDefault();

      }, false);

  }
  $.fn.archer = function(options){
    return new archer(this,options)
  }

  $('.homeWrp ul li').height($(window).height());
  $(window).scrollTop(0);
  $('.km_loding').remove();

  if(location.hash){
    var translate3d = has3d();
    var y = location.hash.slice(1) * $(window).height();
    $('.homeWrp').css('-webkit-transform', 'translate' + (translate3d ? '3d' : '') + '(' + 0 + ',' + -y + 'px' + (translate3d ? ',0' : '') + ')');
    $('.homeWrp > ul')[0].className = 'clearfix';
    $('.homeWrp > ul').addClass('kmN_animate'+(location.hash.slice(1)));
  }
  $(window).resize(function(){
    $(window).scrollTop(0);
    $('.homeWrp ul li').css('height',$(window).height());
  });
  // 图片延迟加载
  $('.homeBg2').find('img').each(function(){
    $(this).attr('src',$(this).attr('delay'));
  })
  $('.homeBg3').find('img').each(function(){
    $(this).attr('src',$(this).attr('delay'));
  })
  $('.homeBg4').find('img').each(function(){
    $(this).attr('src',$(this).attr('delay'));
  })
  // $('.homeWrp').swipeDown(function(e){
  // });

  // swipedetect($('.homeWrp'));
  $('.homeWrp').archer();

  $('.km_hover_up').each(function(){
    $(this)[0].addEventListener('touchstart',function(){
      $('.homeWrp')[0].swipe('down');
    },false);
  });

  $('.km_hover_down').each(function(){
    $(this)[0].addEventListener('touchstart',function(){
      $('.homeWrp')[0].swipe('up');
    },false);
  });

  $('.scene').each(function(){
    var imgurl = 'url(images/'  + $(this).data('image') + ')';
    $(this).css('background-image',imgurl);
    console.log($(this)[0]);
  });






};