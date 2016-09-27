'use strict';
(function(){
  var preview, slider;
  // Клик по кнопке навигации (вперед/назад)
  $('body').on('click','.js-btn', navigation);

  // Навигация по кнопкам "Вперед" и "Назад"
  function navigation() {
    var btnSender, curFrame, direction;
    btnSender = event.target || this;
    direction = (btnSender.id === 'js-btn-next') ? 1 : -1;
    curFrame = parseInt($(btnSender).data('current-frame'));
    nextFrame = parseInt(curFrame + direction);

    $('.js-frame').addClass('hidden');
    $('.js-frame').eq(nextFrame).removeClass('hidden');
    $('.js-btn').data({currentFrame: nextFrame});

    selectAction(nextFrame);
  }
  
  // Функция решает какое действие делать при клике на кнопку навигации
  function selectAction(nextFrame) {
    switch (nextFrame) {
      // Первое окно, ввод массива url
      case 0: { break; }
      // Второе окно, вывод превью
      case 1: { getPreview(); break; }
      // Третье окно, вывод готового слайдера
      case 2: { getSlider(); break; }
    }
  }
  
  function getPreview() {
    var inputString, hasGeneratedPreview, parameters;
    parameters = {
      rawUrlString: $('#urls').val(),
      $insertInto: $('#js-frame-1'),
      $hbTemplate: $('#js-preview-template')
    };

    if (!preview) {
      preview = new Preview();
    }
    preview.init(parameters); 
    preview.render();

    $('#js-frame-1').off('click change');
    // Клик по кнопке удалить на слайде внутри превью
    $('#js-frame-1').on('click', '.js-slide-delete', preview.remove);
    // Изменение текста внутри input'а слайда в превью
    $('#js-frame-1').on('change', '.js-comment-input', preview.edit);
  }
  
  function getSlider() {
    parameters = {
      data: preview.save(),
      $insertInto: $('#js-frame-2'),
      $hbTemplate: $('#js-slider-template')
    }
    if (!slider) {
      slider = new Slider();
    }
    slider.init(parameters);
    slider.render();
    slider.autoSlide();

    // Клик по кнопке удалить на слайде внутри превью
    $('#js-frame-2').off('click mouseenter mouseleave');
    $('#js-frame-2').on('click', '.js-slider-nav', slider.move);
    $('#js-frame-2').on('click', '.js-slider-bullets li', slider.move);
    $('#js-frame-2').on('mouseenter', '.js-slider-nav', slider.stopAutoSlide);
    $('#js-frame-2').on('mouseleave', '.js-slider-nav', slider.autoSlide);
    $('#js-frame-2').on('mouseenter', '.js-slider-bullets', slider.stopAutoSlide);
    $('#js-frame-2').on('mouseleave', '.js-slider-bullets', slider.autoSlide);
  }
})();