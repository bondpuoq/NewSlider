function Slider(params){
  var interval, _params, _data, _hbTemplate, _hbObject, _$sliderImages, _$sliderBullets, _slideWidth, _currentSlide, _slideCount, self;
  self = this;

  self = {
    init : _init,
    render : _render,
    move : _move,
    autoSlide : _autoSlide,
    stopAutoSlide : _stopAutoSlide
  }  

  function _init(params) {
    _params = params;
    _data = _params.data;
    _currentSlide = 0;
    _hbTemplate = _hbTemplate || _params.$hbTemplate.html();
    _hbObject = Handlebars.compile(_hbTemplate);
  }

  function _render() {
    _params.$insertInto.html(_hbObject(_data));
    //$(_hbObject(_data)).appendTo(_params.$insertInto);
    _$sliderImages = $('.js-slider-images');
    _slideWidth = _$sliderImages.children('div').width();
    _$sliderBullets = $('.js-slider-bullets>li');
    _slideCount = $('.js-slider-images>div').length;
    _$sliderImages.children().last().clone().prependTo(_$sliderImages);
    _$sliderImages.children().eq(1).clone().appendTo(_$sliderImages);
  }
  
  function _move() {
    var srcData, $sender, nextSlide, propertyObject;
    $sender = $(this);
    srcData = $sender.data();
    // Куда нажали? 
    // LI - тогда нам не нужно направление листания, 
    // Если не LI, тогда возможно это сработала автопрокрутка, - значит надо направление указать, куда мотать, 
    // Либо нажата кнопка вперед/назад, тогда напавление само сработает
    nextSlide = srcData.slideNumber || (_currentSlide + (parseInt(srcData.navDirection) || 1));
    _$sliderImages.css({ marginLeft: -_slideWidth+(-_slideWidth * nextSlide) });

    if (nextSlide == _slideCount) {
      propertyObject = { marginLeft: -_slideWidth }; 
      _$sliderImages.on('transitionend', function() {
        _resetTransition(_$sliderImages, propertyObject); 
        _$sliderImages.off('transitionend'); 
      });
      nextSlide = 0;
      _currentSlide = 0;
    } else if (nextSlide == -1) {
      propertyObject = { marginLeft: (-_slideWidth * _slideCount) };
      _$sliderImages.on('transitionend', function() {
        _resetTransition(_$sliderImages, propertyObject); 
        _$sliderImages.off('transitionend'); 
      });
      nextSlide = _slideCount - 1;
      _currentSlide = _slideCount - 1;
    } else {
      _currentSlide = nextSlide;
    }
    _$sliderBullets.removeClass('active').eq(_currentSlide).addClass('active');
  }
  
  // Эта несуразность помогает отрендерить css при переключении крайних слайдов, иначе transition не отключается
  function _resetTransition($objectToReset, propertyObject) {
    $objectToReset.addClass('no-transition');
    $objectToReset.css(propertyObject);
    $objectToReset[0].offsetHeight;
    $objectToReset.removeClass('no-transition');
  }

  // Автопрокрутка слайдера
  function _autoSlide() {
    interval = setInterval(function(){ _move() }, 5000);
  }

  // Остановим autoslide когда у нас hover
  function _stopAutoSlide() {
    window.clearInterval(interval);
  }

  return self;
}