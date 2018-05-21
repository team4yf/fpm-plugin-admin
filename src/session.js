import _ from 'lodash'

export default async (ctx, next) => {
  let req = ctx.request
  let url = req.url
  if(_.startsWith(url, '/admin')){
    if (url === '/admin' || url === '/admin/login') {
      await next()
      return
    }
    let admin = ctx.session.admin
    
    //TODO RBAC
    if (!admin) {
      ctx.redirect('/admin/login')
    } else {
      // ignore post ajax
      if('GET' === ctx.method){
        ctx.currentlink = url
      }
      await next()
    }
  }else{
    await next()
  }
}