import path from 'path'
import process from 'process'
import _ from 'lodash'

const LOCAL = path.join(__dirname, '..')
const CWD = process.cwd()
const DEV_MODE = LOCAL == CWD
let VIEW_ROOT_DIR = ''
if(!DEV_MODE){
    VIEW_ROOT_DIR = 'node_modules/fpm-plugin-admin/'
}

export default async (ctx, next) => {
  let req = ctx.request
  let url = req.url
  if(_.startsWith(url, '/admin')){
    _.extend(ctx.state, { 
      env: ctx.fpm._env,
      currentlink: url,
      version: ctx.fpm.getVersion(),
      view_root_dir: VIEW_ROOT_DIR,
    } )
    if (url === '/admin' || url === '/admin/login') {
      await next()
      return
    }
    let admin = ctx.session.admin
    
    //TODO RBAC
    if (!admin) {
      ctx.redirect('/admin/login')
    } else {
      await next()
    }
  }else{
    await next()
  }
}