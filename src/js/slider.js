function Slider(previewObject, sliderTemplate){
  self = this;
  var slider, sliderWrapper, sliderImages;
  self = {
    generateSlider : _generateSlider,
    toggleSlideByButton : _toggleSlideByButton,
    toggleSlideByBullet : _toggleSlideByBullet,
    data : _getSliderData(previewObject)
  }
  
  function _getSliderData(previewObject){
    var arrayToChange, readyData;
    arrayToChange = Array.from(previewObject.data.previews);
    readyData = jQuery.grep(arrayToChange, function(cur){return !cur.deleted;})
    return readyData;
  }
  
  function _generateSlider(appendTo){
    var template, slideShow, sliderHtml;
    template = $('#'+sliderTemplate).html();
    slideShow = Handlebars.compile(template);
    sliderHtml = slideShow(self);
    $(appendTo).append(sliderHtml);
    _initializeSliderVars(appendTo);
    _prepareSlider();
  }
  
  function _prepareSlider(){
    $(self.sliderImages).find('div:last-child').clone().prependTo(self.sliderImages);
    $(self.sliderImages).find('div').eq(1).clone().appendTo(self.sliderImages);
    $(self.sliderNav).bind('click', self.toggleSlideByButton);
    $(self.sliderBullets).find('li').bind('click', self.toggleSlideByBullet);
    $(self.sliderBullets).find('li').eq(0).addClass('active');
  }
  
  function _initializeSliderVars(appendTo){
    self.sliderFrame = $(appendTo);
    self.sliderWrapper = $(self.sliderFrame).find('.js-slider-wrapper');
    self.sliderImages = $(self.sliderFrame).find('.js-slider-images');
    self.sliderBullets = $(self.sliderFrame).find('.js-slider-bullets');
    self.sliderNav = $(self.sliderFrame).find('.js-slider-nav');
    self.currentSlide = 0;
    self.direction = -1;
    self.slideWidth = $(self.sliderWrapper).width();
    self.slideCount = $(self.sliderImages).find('div').length;
    self.currentMargin = -(self.slideWidth);
  }
  
  function _toggleSlideByButton(){
    var currentButton, direction, nextMargin;
    currentButton = this;
    self.direction = parseInt($(currentButton).attr('data-direction'));
    
    self.currentMargin = self.currentMargin + (self.direction * self.slideWidth); 
    
    //Переключаем слайд
    $(self.sliderImages).css('margin-left', self.currentMargin);
    
    // Текущий слайд
    self.currentSlide = self.currentSlide - +self.direction;
    
    // Случаи, когда слайд последний или первый
    if (self.currentSlide > self.slideCount-1){
      self.currentSlide = 0;
      _moveTo('first');
    } else if (self.currentSlide < 0) {
      self.currentSlide = self.slideCount-1;
      _moveTo('last');
    }
    
    // Подсветим нужный буллет
    $(self.sliderBullets).find('li').removeClass('active');
    $(self.sliderBullets).find('li').eq(self.currentSlide).addClass('active');
  }
  
  // Переключение через буллеты
  function _toggleSlideByBullet(){
    var currentBullet, slideNumber, slideMargin;
    currentBullet = this;
    slideNumber =  $(currentBullet).attr('data-slide-number');
    slideMargin = -(self.slideWidth * slideNumber);
    self.currentMargin = slideMargin;
    $(self.sliderImages).css('margin-left', self.currentMargin);    
    self.currentSlide = slideNumber;
    $(self.sliderBullets).find('li').removeClass('active');
    $(self.sliderBullets).find('li').eq(+slideNumber).addClass('active');
  }
  
  // Функция перемещающая слайды на начало или на конец, если мы нажали мы попытались переместиться за границы wrapper'a слайдов
  function _moveTo(where){
    var neededMargin, currentTransition;
    currentTransition = $(self.sliderImages).css('transition');
    $(self.sliderImages).removeClass('.slides');
    switch(where){
      case ('first'): { 
        neededMargin = -self.slideWidth;
        $(self.sliderImages).css('margin-left', neededMargin);
        self.currentMargin = neededMargin;
        self.currentSlide = 0;
        break; };
      case ('last'): { 
        neededMargin = -self.slideWidth*(self.slideCount-1);
        $(self.sliderImages).css('margin-left', neededMargin); 
        self.currentMargin = neededMargin;
        self.currentSlide = self.slideCount-1;
        break; };
    }
    $(self.sliderImages).addClass('.slides');
  }
  
  return self;
}