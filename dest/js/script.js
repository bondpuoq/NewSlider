const PREVIEW_CLASS = 'preview__block'; // Класс контейнера под превьюху
const PREVIEW_IMAGE_PART_CLASS = 'preview__image-block'; // Класс div'ки для картинки внутри превьюхи
const PREVIEW_IMAGE_WRAP_CLASS = 'preview__image-wrap' // Класс обертки для картинки в превьюхе
const PREVIEW_IMAGE_CLASS = 'preview__image'; // Класс для самого изображения внутри превьюхи
const PREVIEW_COMMENT_PART_CLASS = 'preview__comment-block'; // Класс div'ки для комментария
const PREVIEW_COMMENT_CAPTION_CLASS = 'preview__comment-caption'; // Класс заголовка блока комментария
const PREVIEW_COMMENT_INPUT_CLASS = 'preview__comment-input'; // Класс input'a блока комментария
const PREVIEW_DELETE_LINK_CLASS = 'preview__slide-delete'; // Класс ссылки удаления превьюхи слайда
const ACTION_SEQUENCE = ['renderPreview','createSlider'];

btn_next.addEventListener("click", frameToggle);
btn_prev.addEventListener("click", frameToggle);

// Тут мы контролируем что выполнять, исходя из значения аттрибута data-action
function frameToggle(){
  var event;
  var elem;
  var action;
  var curFrame;
  event = event || window.event;
  elem = this || event.srcElement;
  action = elem.getAttribute('data-action');
  curFrame = elem.getAttribute('data-cur-frame');
   
  switch (action){
    case "renderPreview" : { preview = renderPreview(elem);  break; }
    case "createSlider" : { createSlider(preview); break; }
  }
  navigationLogic(elem);
}
// Здесь хранится логика кнопок вперед - назад
function navigationLogic(elem)
{
  curFrame = elem.getAttribute('data-cur-frame');
  nextFrame = +curFrame + 1;
  prevFrame = +curFrame - 1;
  switch (elem.getAttribute('id')){
    case 'btn_next': {
      document.getElementById('frame_'+curFrame).classList.add('hidden');
      if (curFrame == 2) { return; }
      document.getElementById('frame_'+nextFrame).classList.remove('hidden');
      elem.setAttribute('data-action', ACTION_SEQUENCE[nextFrame]);
      elem.setAttribute('data-cur-frame', nextFrame);
      document.getElementById('btn_prev').setAttribute('data-cur-frame', nextFrame);
      document.getElementById('btn_prev').setAttribute('data-action', ACTION_SEQUENCE[prevFrame]);
      if (nextFrame >= 1) {
        document.getElementById('btn_prev').classList.remove('hidden');
      }
      break;
    }
    case 'btn_prev': {
      if (prevFrame == -1){
        elem.classList.add('hiddden')  
        return;
      }
      document.getElementById('frame_'+curFrame).classList.add('hidden');
      document.getElementById('frame_'+prevFrame).classList.remove('hidden');
      if (prevFrame == 0){
        document.getElementById('btn_prev').classList.add('hidden');
      }
      elem.setAttribute('data-action', ACTION_SEQUENCE[prevFrame]);
      elem.setAttribute('data-cur-frame', prevFrame);
      document.getElementById('btn_next').setAttribute('data-cur-frame', prevFrame);
      document.getElementById('btn_next').setAttribute('data-action', ACTION_SEQUENCE[prevFrame]);  
    }
  }
}

// Это блок рендеринга плиточек превью
function renderPreview(srcElem) {
  var rawUrls;
  var preview;
  var rawUrls = urls.value;
  if (!rawUrls || rawUrls == undefined || rawUrls == ''){
    error_line.classList.remove("hidden");
    error_line.textContent = "Вы ввели некорректный массив ссылок";
    return;
  }
  preview = new Preview(rawUrls);
  return preview;
}

// Функция которая по-идее должна возвращать готовый слайдер из плиточек превью
function createSlider(previewObject){
  var frame_2;
  var slidesToProcess;
  var aggregator;
  var readySlideData;
  var slider;
  var slidesHtml;
  
  frame_2 =  document.createElement('div');
  frame_2.id = 'frame_2';
  document.querySelector('#btn_prev').insertAdjacentElement("beforeBegin",frame_2);
  slidesToProcess = previewObject.getSlidesArray();
  
  aggregator = new AggregatorSlideAndPreview('Новый слайдер');
  // Пока все круто, тут возвращается массив объектов вида { href: "blablabla", comment: "blablabla"}
  readySlideData = aggregator.processPreview(slidesToProcess);
  slidesHtml = aggregator.generateSliderHtml();
  frame_2.insertAdjacentElement('afterBegin',slidesHtml);
  var slider = new Slider();
  slider.slide();
}

function Preview(urlArray)
{
  var imagesArray;
  if (urlArray == "")
	{
		alert("Вы не ввели массив картинок");
		return [];
	}
  // Тут у нас будет хранится массив со ссылками на картинки
	imagesArray = urlArray.split(",")
    .map(function(current){
      return current.trim().replace("\"","")
    });
  	
	generatePreviewElement(imagesArray);

	function generatePreviewElement(urlArray){
    var frame_1 = document.getElementById('frame_1');
    var imagesEditor; 
    // Последствия наличия кнопок назад-вперед, необходимость удалять старую превью и рендерить новую
    if (!!frame_1){
      frame_1.parentNode.removeChild(frame_1);
    }
    imagesEditor = document.createElement('div');
    imagesEditor.id = 'frame_1';
    imagesEditor.classList.add('frame');
    imagesEditor.classList.add('hidden');
    for (var i=0; i < urlArray.length; i++){
      imagesEditor.appendChild(createPreviewItem(urlArray[i],i));
    };
    document.querySelector('#btn_prev').insertAdjacentElement("beforeBegin",imagesEditor);
  };
  // Создаем каркас одного элемента в превью
  // Табуляция как бы намекает на иерархия вложенности элементов друг в друга
  function createPreviewItem(href, number) {
    var carcass;
    var previewBlock;
    var previewImagePart;
    var previewImageWrap;
    var previewImage;
    var previewCommentPart;
    var previewCommentCaption;
    var previewCommentInput;
    var previewDeleteLinkPart;
    
    carcass = document.createDocumentFragment();
    
    previewBlock = document.createElement('div');
    previewBlock.classList.add(PREVIEW_CLASS);
    previewBlock.id = 'preview_' + number;
    
    previewImagePart = document.createElement('div');
    previewImagePart.classList.add(PREVIEW_IMAGE_PART_CLASS);
    
    previewImageWrap = document.createElement('div');
    previewImageWrap.classList.add(PREVIEW_IMAGE_WRAP_CLASS);
    
    previewImage = document.createElement('img');
    previewImage.classList.add(PREVIEW_IMAGE_CLASS);
    previewImage.src = href;
    
    previewCommentPart = document.createElement('div');
    previewCommentPart.classList.add(PREVIEW_COMMENT_PART_CLASS);
    
    previewCommentCaption = document.createElement('div');
    previewCommentCaption.classList.add(PREVIEW_COMMENT_CAPTION_CLASS);
    previewCommentCaption.textContent = 'Надпись к слайду';
    
    previewCommentInput = document.createElement('textarea');
    previewCommentInput.classList.add(PREVIEW_COMMENT_INPUT_CLASS);
    
    previewDeleteLinkPart = document.createElement('div');
    previewDeleteLinkPart.classList.add(PREVIEW_DELETE_LINK_CLASS);
    previewDeleteLinkPart.textContent = 'удалить слайд';
    // Тут мы пробрасываем this, чтобы метод содержал элемент на котором был клик
    previewDeleteLinkPart.addEventListener('click', function() {toggleState.call(this,number)});
    
    previewImageWrap.insertAdjacentElement('afterBegin', previewImage);
    previewImagePart.insertAdjacentElement('afterBegin', previewImageWrap);
    
    previewCommentPart.insertAdjacentElement('afterBegin', previewCommentCaption);
    previewCommentPart.insertAdjacentElement('beforeEnd', previewCommentInput);
    
    previewBlock.appendChild(previewImagePart);
    previewBlock.appendChild(previewCommentPart);
    previewBlock.appendChild(previewDeleteLinkPart);
    
    carcass.appendChild(previewBlock); // Добавили главный контейнер для превью
    
    return carcass;
  }

  
  function toggleState(number){
    var event = event || window.event;
    var elem = this || event.srcElement;
    currentSlide = document.querySelector('#preview_'+number);
    // Просто проверяем, стоит ли класс удаленности у слайда, если да, удаляем, если нет добавляем
    
    if (currentSlide.classList.contains('disabled') == false){
      if(confirm("вы действительно хотите удалить слайд?")){
        currentSlide.classList.add('disabled');
        elem.textContent = 'восстановить слайд';
      }
    }
    else{
      currentSlide.classList.remove('disabled');
      elem.textContent = 'удалить слайд';
    }  
  }
	this.generateElement = generatePreviewElement;
  //Получаем массив слайдов, элементов не помеченных на удаление
  this.getSlidesArray = function() {
    var previewsNodeList;
    var previewsArray;
    var readyArray;
    previewsNodeList = document.getElementById('frame_1').querySelectorAll('.preview__block');
    // Конвертируем в NodeList в Array для большей простоты работы
    previewsArray = Array.prototype.slice.call(previewsNodeList);
    readyArray = previewsArray.filter(function(item){ 
      return (!item.classList.contains('disabled')) 
      });
    return readyArray;
  };
}

function AggregatorSlideAndPreview(slider){
  var _slideArray = [];
  function extractRefAndText(item){
    return { href: item.querySelector('img.'+PREVIEW_IMAGE_CLASS).src, 
      comment: item.querySelector('textarea.'+PREVIEW_COMMENT_INPUT_CLASS).value };
  }
	this.getSlider = function() {
	}
  this.processPreview = function(preview) {
    for (i=0; i<preview.length; i++){
      var readyRefAndText = extractRefAndText(preview[i]);
      console.log(readyRefAndText);
      _slideArray.push(readyRefAndText);
    }
    return _slideArray;
  }
  
  this.generateSliderHtml = function(){
    var sliderContainer;
    var imagesContainer;
    var navigationHTML;
    
    sliderContainer = document.createElement('div');
    sliderContainer.classList.add('slider-container');
    
    imagesContainer = document.createElement('div');
    imagesContainer.classList.add('slider');
    
    for (var i=0; i<_slideArray.length; i++){
      var newSlide; 
      var img;
      var comment;
      newSlide = document.createElement('div');
      img = document.createElement('img');
      img.src = _slideArray[i].href;
      
      if (_slideArray[i].comment){
      comment = document.createElement('div');
      comment.textContent = slideArray[i].comment;
      newSlide.insertAdjacentElement('beforeEnd',comment);
      }
      newSlide.insertAdjacentElement('afterBegin',img);
      imagesContainer.insertAdjacentElement('beforeEnd',newSlide);
    }
    sliderContainer.insertAdjacentElement('afterBegin',imagesContainer);
    navigationHTML = '<ul class="bullets"></ul><div class="prev"></div><div class="next"></div>';
    sliderContainer.insertAdjacentHTML('beforeEnd', navigationHTML);
    
    return sliderContainer;
  }
  this.slideArray = _slideArray;
}

function Slider(){
  this.slide = function slide(){      
    var slider = $('.slider'),
    sliderContent = slider.html(),
    slideWidth = $('.slider-container').outerWidth(),
    slideCount = $('.slider div img').length,
    prev = $('.slider-container .prev'),
    next = $('.slider-container .next'),
    slideNum = 1,
    index =0,
    clickBullets=0,
    sliderInterval = 3300,
    animateTime = 1000,
    course = 1,
    margin = - slideWidth;
    // Цикл добавляет буллеты в блок .bullets
    for (var i=0; i<slideCount; i++){
      html=$('.bullets').html() + '<li></li>';
      $('.bullets').html(html);
    }
    var bullets = $('.slider-container .bullets li');

    $('.slider-container .bullets li:first').addClass('active');  
    // Последний слайд копируем в начало, для иллюзии бесконечной прокрутки
    $('.slider div:last').clone().prependTo('.slider');   
    // Копируем первый слайд в конец
    $('.slider div').eq(1).clone().appendTo('.slider');
    // Начальный сдвиг для контейнера со слайдами
    $('.slider').css('margin-left', -slideWidth);         
    
    // Двигаем слайды
    function nextSlide(){                                 
      interval = setInterval(animate, sliderInterval);
    }
   
    function animate(){
      // Если промотался до конца - возвращаем слайдер в начальное положение
      if (margin==-slideCount*slideWidth-slideWidth  && course==1){
        slider.css({'marginLeft':-slideWidth});
        margin=-slideWidth*2;
      }
      // Если у нас первый слайд и при этом нажата кнопка "Назад"
      else if(margin==0 && course==-1){
        slider.css({'marginLeft':-slideWidth*slideCount});// то блок .slider перемещается в конечное положение
        margin=-slideWidth*slideCount+slideWidth;
      }
      // Если слайд не первый и не последний, тогда просто меняем margin в нужном направлении
      else{
        margin = margin - slideWidth*(course);
      }
      slider.animate({'marginLeft':margin},animateTime);
      // Меняем активный буллет, при условии что изменяли его не через сам буллет
      if (clickBullets==0){
        bulletsActive();
      } 
      // Если слайд выбран буллетом - меняем номер активного слайда
      else{
        slideNum=index+1;
      }
    }
   
    function bulletsActive(){
      // Нажата кнопка "влево" + текущий слайд не последний
      if (course==1 && slideNum!=slideCount){        
      slideNum++;
        $('.bullets .active').removeClass('active').next('li').addClass('active');
      }
      // Кнопка "влево" +  слайд таки последний
      else if (course==1 && slideNum==slideCount){
        slideNum=1;
        $('.bullets li').removeClass('active').eq(0).addClass('active'); // 
      return false;
      }
      // "Вправо" + слайд не крайний
      else if (course==-1  && slideNum!=1){
        slideNum--;
        $('.bullets .active').removeClass('active').prev('li').addClass('active'); 
      return false;  
      }
      // "Вправо" + слайд крайний
      else if (course==-1  && slideNum==1){
        slideNum=slideCount;
        $('.bullets li').removeClass('active').eq(slideCount-1).addClass('active');
    }
    }
   
    function sliderStop(){    
      window.clearInterval(interval);
    }
    // Если слайдер мотают влево, то меняем временно значение стандартного направления (course = 1) 
    // на course = -1, потом восстанавливаем курс
    prev.click(function() {
      if (slider.is(':animated')) { return false; } 
      var course2 = course;
      course = -1;
      animate();
      course = course2; 
    });
    next.click(function() {                               
      if (slider.is(':animated')) { return false; }       
      var course2 = course;                               
      course = 1;                                         
      animate();                                          
      course = course2; 
    });
    // Тут фишка в том, что меняя выбранный буллет нам надо остановить анимацию, а во-вторых, на случай того, 
    // что после буллита будет нажаты "назад" или "вперед" нам надо сделать там, чтобы при нажатии на них margin 
    // поменялся правильно
    bullets.click(function() {                          
      if (slider.is(':animated')) { return false; }
      sliderStop();
      index = bullets.index(this);
      if (course==1){
        margin=-slideWidth*index;
      }
      else if (course==-1){
        margin=-slideWidth*index-2*slideWidth;
      }
    $('.bullets li').removeClass('active').eq(index).addClass('active');
    clickBullets=1;
    // Снова запускаем анимацию
    animate();
    clickBullets=0;
    });
   
    // Останавливаев слайдер если мышка над ним
    slider.add(next).add(prev).hover(function() {
      sliderStop(); 
    }, nextSlide);
    
    // Для автопрокрутки
    nextSlide();
  };
};