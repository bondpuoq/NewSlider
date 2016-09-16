function Preview(rawUrlString) {
  var rawUrls = rawUrlString;
  this.data = {};
  this.urlArray = [];
  getUrls();
  
  // Делаем массив url'ов из введенной пользователем строки
  function getUrls(){
    var i = 0;
    urlArray = rawUrlString.split(",")
      .map(function(current){
        return {number: i++, src: current.trim().replace("\"","")}
      });
    };
  Preview.prototype.generatePreview = generatePreview;
  
  // Генерим превью и возвращаем разметку
  function generatePreview(){
    var previewHtml, previewTemplate;
    previewHtml = $('#preview-template').html();
    previewTemplate = Handlebars.compile(previewHtml);
    this.data = { previews : urlArray };
    return previewTemplate(this.data);
    //$('#frame_1').append(previewTemplate(this.data));
  }  
}