'use strict';
(function(){
  $('#btn_prev').bind('click', navigation);
  $('#btn_next').bind('click', navigation);
  
  var preview, slider;
  // Навигация по кнопкам "Вперед" и "Назад"
  function navigation(){
    var nextFrame, currentFrame, hiddenClass;
    hiddenClass = 'js-hidden';
    nextFrame = $(this).attr('data-next-frame');
    currentFrame = $(this).attr('data-current-frame');
    $('#frame_'+nextFrame).removeClass(hiddenClass);
    $('#frame_'+currentFrame).addClass(hiddenClass);
    if (+nextFrame==0) { $('#btn_prev').addClass(hiddenClass); }
    else { $('#btn_prev').removeClass(hiddenClass); }
    if (+nextFrame==2) { $('#btn_next').addClass(hiddenClass); }
    else $('#btn_next').removeClass(hiddenClass);

    if (currentFrame < nextFrame){
      $('#btn_next').attr('data-next-frame', +nextFrame + 1);
      $('#btn_next').attr('data-current-frame', +nextFrame);
      $('#btn_prev').attr('data-next-frame', currentFrame);
      $('#btn_prev').attr('data-current-frame', nextFrame);
    } else if (currentFrame > nextFrame){
      $('#btn_prev').attr('data-next-frame', +nextFrame-1);
      $('#btn_prev').attr('data-current-frame', nextFrame);
      $('#btn_next').attr('data-next-frame', currentFrame);
      $('#btn_next').attr('data-current-frame', nextFrame);
    }
    selectAction(nextFrame);
  }
  
  // Функция решает какое действие делать при клике на кнопку навигации
  function selectAction(nextFrame){
    switch (nextFrame){
      // Первое окно, ввод массива url
      case "0": break ;
      // Второе окно, вывод превью
      case "1": renderPreview(); break ;
      // Третье окно, вывод готового слайдера
      case "2": createSlider(); break;
    }
  }
  
  function renderPreview(){
    var inputString, hasGeneratedPreview;
    inputString = $('#urls').val();
    hasGeneratedPreview = !!($('#frame_1 div').length);
    if (hasGeneratedPreview){$('#frame_1 div').remove();}
    preview = new Preview(inputString);
    $('#frame_1').append(preview.generatePreview());
    $('.js-comment-input').change(function(){ inputChange(this, preview); });
    $('.js-slide-delete').click(function(){ toggleDeletedState(this, preview); });
  }
  
  // Изменение текста в textarea слайда, номер слайда через родителя, потом в объект Preview приделываем этот коммент
  function inputChange(currentInput, preview){
    var previewNumber, inputValue;
    previewNumber = $(currentInput.parentNode.parentNode).attr('data-preview-number');
    inputValue = $(currentInput).val();
    preview.data.previews[previewNumber].comment = inputValue;
  }
  
  // Удаление/восстановление слайдов
  function toggleDeletedState(currentLink, preview)
  {
    var previewToDelete, number, isDeleted; 
    previewToDelete = currentLink.parentNode;
    previewNumber = $(previewToDelete).attr('data-preview-number');
    
    isDeleted = !!preview.data.previews[previewNumber].deleted;
    if (isDeleted){
      delete preview.data.previews[previewNumber].deleted;
    }
    else {
      preview.data.previews[previewNumber].deleted = true;
    }
    
    if (previewToDelete.classList.contains('disabled') == false){
      if(confirm("вы действительно хотите удалить слайд?")){
        previewToDelete.classList.add('disabled');
        currentLink.textContent = 'Восстановить слайд';
      }
    }
    else{
      previewToDelete.classList.remove('disabled');
      currentLink.textContent = 'Удалить';
    }
  }
  
  function createSlider(){
    var appendTo;
    if ($('.slider div').length > 0)
      $('.slider').remove();
      
    slider = new Slider(preview, 'slider1');
    appendTo = '#frame_2';
    slider.generateSlider(appendTo);
    slider.autoSlide();
  }
})();