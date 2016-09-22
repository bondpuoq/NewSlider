function Slider(params){
  var interval, _params, _data, _hbObject, _$sliderImages, _$sliderBullets, _slideWidth, _currentSlide, _slideCount;
  var self = this;

  self = {
    init : _init,
    render : _render,
    move : _move,
    autoSlide : _autoSlide,
    stopAutoSlide : _stopAutoSlide
  }

  _params = params;

  function _init() {
    _data = _params.data;
    _currentSlide = 0;
    _hbObject = Handlebars.compile(_params.$hbTemplate.html());
  }

  function _render() {
    _params.$insertInto.html(_hbObject(_data));
    _$sliderImages = $('.js-slider-images').eq(0);
    _slideWidth = _$sliderImages.children('div').width();
    _$sliderBullets = $('.js-slider-bullets>li');
    _slideCount = $('.js-slider-images>div').length;
  }
  
  function _move() {
    var srcData, $sender, nextSlide;
    $sender = $(this);
    srcData = $sender.data();
    // Куда нажали? 
    // LI - тогда нам не нужно направление листания, 
    // Если не LI, тогда возможно это сработала автопрокрутка, - значит надо направление указать, куда мотать, 
    // Либо нажата кнопка вперед/назад, тогда напавление само сработает
    nextSlide = $sender.prop('nodeName') == 'LI' ? srcData.slideNumber : (_currentSlide + (parseInt(srcData.navDirection) || 1));
    if (nextSlide == _slideCount) {
      _$sliderImages.css({ transition:0 });
      nextSlide = 0;
    } else if (nextSlide == -1) {
      _$sliderImages.css({ transition:0 });
      nextSlide = _slideCount - 1;
    }
    _$sliderImages.css({ marginLeft: -_slideWidth * nextSlide });
    _currentSlide = nextSlide;
    _$sliderBullets.removeClass('active').eq(_currentSlide).addClass('active');
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