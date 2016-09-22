function Preview() {
  var self, _params, _hbTemplate, _hbObject, _data;
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

  function _init(params) {
    _params = params;
    if (!_params) {
      _params = {
        rawUrlString: '',
        $insertInto: $('#js-frame-1'),
        $hbTemplate: $('#js-preview-template')
      }
    }
    _data = _getUrls(_params.rawUrlString);
    _hbTemplate = _hbTemplate || _params.$hbTemplate.html();
    _hbObject = Handlebars.compile(_hbTemplate); 
  }
  function _render() {
    _params.$insertInto.html(_hbObject(_data));
    //$(_hbObject(_data)).appendTo(_params.$insertInto);
  }
  function _edit() {
    var comment, index;
    index = $(this).data('preview-number');
    comment = $(this).val();
    $(_data)[index].comment = comment;
    self.render();
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
    return urlArray;
    };

  return self; 
}