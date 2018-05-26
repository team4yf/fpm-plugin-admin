var $ = window.$ = (function(ctx){
  function _miniJq(selector){
    if(selector !== undefined){
      switch(typeof selector){
        case 'string':
          this._nodes = document.querySelectorAll(selector); 
          break;
        case 'object':
          this._nodes = [ selector ]
          break;
      } 
        
      this.length = this._nodes.length;
      if(this.length === 1){
        this._dom = this._nodes[0]
      }
    }
  }
  var miniJq = function(selector){
    return new _miniJq(selector);
  }
  miniJq.post = function(url, data){
    return axios.post(url, data)
            .then(function(rsp){
              return rsp.data;
            });
  };
  miniJq.get = function(url, data){
    return axios.get(url, data);
  };
  _miniJq.prototype = {
    val: function(v){
      if(v === undefined){
        return this._dom.value;
      }
      this._dom.value = v;
      return this;
    },
    attr: function(k, v){
      if(v === undefined){
        return this._dom.getAttribute(k);
      }
      this._dom.setAttribute(k, v);
      return this;
    },
    on: function(event, callback){
      _.map(this._nodes, function(node){
        node.addEventListener(event, callback, false);
      });
    },
    hasClass: function(clz){
      return !!this._dom.className.match( new RegExp( "(\\s|^)" + clz + "(\\s|$)") );
    },
    addClass: function(clz){
      this._dom.className += ' ' + clz;
      return this;
    },
    removeClass: function(clz){
      if(this.hasClass(clz)){
        this._dom.className = this._dom.className.replace( new RegExp( "(\\s|^)" + clz + "(\\s|$)" ), " " );
      }
      return this;
    },
    html: function(html){
      this._dom.innerHTML = html;
      return this;
    },
    show: function(){
      _.map(this._nodes, function(node){
        node.style.display = 'block';
      });      
      return this;
    },
    hide: function(){
      _.map(this._nodes, function(node){
        node.style.display = 'none';
      });
      return this;
    }
  }
  ctx.$ = miniJq;
  return miniJq;
})(window)