export default (admin) => {
    admin.get('/admin', async (ctx, next) => {
        await ctx.render('admin/login.html', {
            version: ctx.fpm.getVersion()
        })
    })
    
    admin.get('/admin/login', async (ctx, next) => {
        await ctx.render('admin/login.html', {
            version: ctx.fpm.getVersion()
        })
    })
    
    admin.get('/admin/main', async (ctx, next) => {
        await ctx.render('admin/main.html', {
            version: ctx.fpm.getVersion(),
        })
    })
    admin.get('/admin/setting/:menu', async (ctx, next) => {
        await ctx.render('admin/setting/' + ctx.params.menu + '.html', {})
    })
    admin.get('/admin/about', async (ctx, next) => {
        await ctx.render('admin/about.html', {
            version: ctx.fpm.getVersion(),
        })
    })
    admin.get('/admin/logout', async (ctx, next) => {
        ctx.session.admin = undefined
        await ctx.redirect('/admin/login')
    })
    
    admin.post('/admin/login', async (ctx, next) => {
        //check pass
        let loginInfo = ctx.request.body
        if (loginInfo.name === 'admin' && loginInfo.pass === '741235896') {
            ctx.session.admin = loginInfo
            ctx.body = { code: 0 }
            // TODO: check premission
        } else {
            ctx.body = { code: -99, error: 'User Or Pass Error ' }
        }
    })

    return admin
      
}