import _ from 'lodash'
import path from 'path'
import Views from 'koa-views'
import Session from 'koa-session2'
import Static from 'koa-static'
import AdminRouter from './admin.js'

import session from './session.js'

const LOCAL = path.join(__dirname, '../')
export default {
  bind: (fpm) => {
    // Run When Server Init
    fpm.registerAction('INIT', () => {
      fpm.logger.info(fpm.getVersion())
      const c = fpm.getConfig()
      fpm.logger.info('Run Init Actions: local path: ', LOCAL)
    })

    fpm.registerAction('ADMIN', () => {
      let admin = fpm.createRouter()
      admin = AdminRouter(admin)
      
      const app = fpm.app
      app.use(Views(path.join(LOCAL, 'views'), {
        extension: 'html',
        map: { html: 'nunjucks' },
      }))
      app.use(Static(path.join(LOCAL, 'public')))
      app.use(Session({ key: 'fpm-server-admin' }))
      app.use(session)
  
      fpm.bindRouter(admin)
    })

  }
}
