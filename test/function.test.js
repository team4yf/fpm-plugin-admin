var should = require("chai").should();
var YF = require("yf-fpm-client-nodejs").default;

YF.init({appkey: '123123', masterKey: '123123', endpoint: 'http://localhost:9999/api'});


describe('Function', function(){
  beforeEach(done => {
    done()
  })
  

  afterEach(done => {
    done()
  })

  it('Function A', function(done){
    var func = new YF.Func('test.foo');
    func.invoke({})
      .then(function(data){
        console.log(data)
        done();
      }).catch(function(err){
        done(err);
      })
  })
})
