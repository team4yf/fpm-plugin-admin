var $ = window.$ = (function(ctx){
  function _miniJq(domId){
    if(domId !== undefined)
      this._dom = document.getElementById(domId);
  }
  var miniJq = function(domId){
    return new _miniJq(domId);
  }
  miniJq.post = function(url, data){
    return axios.post(url, data)
            .then(function(rsp){
              return rsp.data;
            });
  };
  _miniJq.prototype = {
    val: function(v){
      if(v === undefined){
        return this._dom.value;
      }
      this._dom.value = v;
      return this;
    },
    on: function(event, callback){
      this._dom.addEventListener(event, callback, false);
    },
    html: function(html){
      this._dom.innerHTML = html;
      return this;
    },
    show: function(){
      this._dom.style.display = 'block';
      return this;
    },
    hide: function(){
      this._dom.style.display = 'none';
      return this;
    }
  }
  ctx.$ = miniJq;
  return miniJq;
})(window)