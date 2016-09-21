function Slider(previewObject, sliderTemplate){
  var interval;
  var self = this;
  _initializeSliderVars();
  _prepareSlider();
  //var slider, sliderWrapper, sliderImages;
  self = {
    generateSlider : _generateSlider,
    toggleSlide : _toggleSlide,
    toggleSlideByBullet : _toggleSlideByBullet,
    data : _getSliderData(previewObject),
    autoSlide : _autoSlide
  }
  
  function _getSliderData(previewObject){
    var arrayToChange, readyData;
    arrayToChange = Array.from(previewObject.data.previews);
    readyData = $.grep(arrayToChange, function(cur){return !cur.deleted;})
    return readyData;
  }
  
  function _generateSlider(appendTo){
    var template, slideShow, sliderHtml;
    template = $(sliderTemplate).html();
    slideShow = Handlebars.compile(template);
    sliderHtml = slideShow(self);
    $(appendTo).append(sliderHtml);
  }
  
  function _prepareSlider(){
    $(self.$sliderNav).click(self.toggleSlide);
    self.$sliderNav.hover(function() { _stopAutoSlide(); }, _autoSlide);
    $(self.$sliderBullets).click(self.toggleSlide);
    self.$sliderBullets.eq(0).addClass('active');
    self.$sliderBullets.hover(function() { _stopAutoSlide(); }, _autoSlide);
  }
  
  function _initializeSliderVars(){
    self.$sliderFrame = $('#js-frame-2');
    self.$sliderWrapper = self.$sliderFrame.find('.js-slider-wrapper');
    self.$sliderImages = self.$sliderFrame.find('.js-slider-images');
    self.$sliderBullets = self.$sliderFrame.find('.js-slider-bullets').children('li');
    self.$sliderNav = self.$sliderFrame.find('.js-slider-nav');
    self.currentSlide = 0;
    self.direction = -1;
    self.slideWidth = self.$sliderWrapper.width();
    self.slideCount = self.$sliderImages.children('div').length;
    self.currentMargin = 0;
  }
  
  function _toggleSlide(){
    
    self.currentMargin = self.currentMargin + (self.direction * self.slideWidth); 

    //Переключаем слайд
    $(self.$sliderImages).css('margin-left', self.currentMargin);

    // Текущий слайд
    self.currentSlide = self.currentSlide - +self.direction;

    // Подсветим нужный буллет
    self.$sliderBullets.removeClass('active');
    self.$sliderBullets.eq(self.currentSlide).addClass('active');  
  }
  
  // Переключение через буллеты
  function _toggleSlideByBullet(){
    var currentBullet, slideNumber, slideMargin;
    currentBullet = this;
    console.log(typeof(this));
    slideNumber =  $(currentBullet).data('slide-number');
    slideMargin = -(self.slideWidth * slideNumber);
    self.currentMargin = slideMargin;
    self.$sliderImages.css('margin-left', self.currentMargin);    
    self.currentSlide = slideNumber;
    self.$sliderBullets.removeClass('active');
    self.$sliderBullets.eq(+slideNumber).addClass('active');
  }
  
  // Автопрокрутка слайдера
  function _autoSlide(){
    interval = setInterval(function(){ self.direction = -1 ; _toggleSlide(); }, 5000);
  }
  // Остановим autoslide когда у нас hover
  function _stopAutoSlide(){      
    window.clearInterval(interval);
  }
  
  // Функция перемещающая слайды на начало или на конец, если мы нажали мы попытались переместиться за границы wrapper'a слайдов
  function _circleIt(){
    neededMargin = -(self.slideWidth * self.currentSlide);
    self.$sliderImages.css('margin-left', neededMargin);
    self.currentMargin = neededMargin;
  }

  
  return self;
}