'use strict';
(function(){
  // Клик по кнопке навигации (вперед/назад)
  $('body').on('click','.js-btn', navigation);
  
  var frames, preview, slider;

  // Навигация по кнопкам "Вперед" и "Назад"
  function navigation() {
    var btnSender, curFrame, direction;
    btnSender = event.target || this;
    direction = (btnSender.id === 'js-btn-next') ? 1 : -1;
    curFrame = parseInt($(btnSender).data('current-frame'));
    nextFrame = parseInt(curFrame + direction);

    selectAction(nextFrame);

    $('.js-frame').addClass('hidden');
    $('.js-frame').eq(nextFrame).removeClass('hidden');
    $('.js-btn').data({currentFrame: nextFrame});
  }
  
  // Функция решает какое действие делать при клике на кнопку навигации
  function selectAction(nextFrame) {
    switch (nextFrame) {
      // Первое окно, ввод массива url
      case 0: break ;
      // Второе окно, вывод превью
      case 1: getPreview(); break ;
      // Третье окно, вывод готового слайдера
      case 2: getSlider(); break;
    }
  }
  
  function getPreview() {
    var inputString, hasGeneratedPreview, parameters;
    parameters = {
      rawUrlString: $('#urls').val(),
      $insertInto: $('#js-frame-1'),
      $hbTemplate: $('#js-preview-template')
    };
    preview = new Preview(parameters);
    preview.init();
    preview.render();
    // Клик по кнопке удалить на слайде внутри превью
    $('#js-frame-1').on('click', '.js-slide-delete', preview.remove);
    // Изменение текста внутри input'а слайда в превью
    $('#js-frame-1').on('change', '.js-comment-input', preview.edit);
  }
  
  function getSlider() {
    //if ($('.js-slider-wrapper div').length > 0){ $('.js-slider-wrapper').remove(); }

    parameters = {
      data: preview.save(),
      $insertInto: $('#js-frame-2'),
      $hbTemplate: $('#js-slider-template')
    }
    
    slider = new Slider(parameters);
    slider.init();
    slider.render();
    slider.autoSlide();

    // Клик по кнопке удалить на слайде внутри превью
    $('#js-frame-2').on('click', '.js-slider-nav', slider.move);
    $('#js-frame-2').on('click', '.js-slider-bullets li', slider.move);
    $('#js-frame-2').on('mouseenter', '.js-slider-nav', slider.stopAutoSlide);
    $('#js-frame-2').on('mouseleave', '.js-slider-nav', slider.autoSlide);
    $('#js-frame-2').on('mouseenter', '.js-slider-bullets', slider.stopAutoSlide);
    $('#js-frame-2').on('mouseleave', '.js-slider-bullets', slider.autoSlide);
  }
})();