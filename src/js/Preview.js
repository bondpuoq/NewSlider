function Preview(params) {
  var self, _params, _hbObject, _data;
  // params содержит в себе: 
  // 1) .rawUrlString - введенные пользователем url
  // 2) .$insertInto - куда должен в итоге вставиться элемент в методе render()
  // 3) .$hbTemplate - указание на то, какой кусок handlebars надо использовать в качестве шаблона

  self = this;
  self = {
    init : _init,
    render : _render,
    edit : _edit,
    remove : _remove,
    save : _save
  }

  _params = params;

  function _init() {
    if (!_params) {
      _params = {
        rawUrlString: '',
        $insertInto: $('#js-frame-1'),
        $hbTemplate: $('#js-preview-template')
      }
    }

    _data = _getUrls(_params.rawUrlString);
    _hbObject = Handlebars.compile(_params.$hbTemplate.html()); 
  }
  function _render() {
    _params.$insertInto.html(_hbObject(_data));
  }
  function _edit() {
    var comment, index;
    index = $(this).data('preview-number');
    comment = $(this).val();
    $(_data)[index].comment = comment;
  }
  function _remove() {
    var index;
    index = $(this).data('preview-number');
    _data.splice(index,1);
    self.render();
  }
  function _save() {
    return _data;
  }


  // Делаем массив url'ов из введенной пользователем строки
  function _getUrls(rawUrlString) {
    var i = 0, urlArray;
    urlArray = rawUrlString.split(",")
      .map(function(current) {
        return {number: i++, src: current.trim().replace("\"","")}
      });
    // Выбрасывание ошибки, если пользователь ввел битые Url
    if (urlArray.length === 1) {
      var img = new Image();
      img.src = urlArray[0];
      img.onerror = (function(){throw {name:'fuck', message: 'shit'}})();
    }
    return urlArray;
    };

  return self; 
}