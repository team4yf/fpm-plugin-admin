'use strict';
import { Fpm } from 'yf-fpm-server'
import plugin from '../src'
let app = new Fpm()
plugin.bind(app)

let biz = app.createBiz('0.0.1');

biz.addSubModules('test',{
	foo: args => {
		return Promise.reject({errno: -3001})
	}
})
app.addBizModules(biz);

// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.run()
