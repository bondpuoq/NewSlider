function Preview(rawUrlString) {
  var self;
  
  self = this;
  self = {
    generatePreview : _generatePreview,
    data : {previews : _getUrls(rawUrlString) }
  }


  // Делаем массив url'ов из введенной пользователем строки
  function _getUrls(rawUrlString){
    var i = 0, urlArray;
    urlArray = rawUrlString.split(",")
      .map(function(current){
        return {number: i++, src: current.trim().replace("\"","")}
      });
    return urlArray;
    };
  
  // Генерим превью и возвращаем разметку
  function _generatePreview(){
    var previewHtml, previewTemplate;
    previewHtml = $('#preview-template').html();
    previewTemplate = Handlebars.compile(previewHtml);
    return previewTemplate(self.data);
    //$('#frame_1').append(previewTemplate(this.data));
  } 
  return self; 
}