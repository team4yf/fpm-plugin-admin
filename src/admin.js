import _ from 'lodash'
import os from 'os'
import dayjs from 'dayjs'

const SERVER_STATUS = {
    arch: os.arch(),
    cpus: os.cpus().length,
    hostname: os.hostname(),
    platform: os.platform(),
    type: os.type(),
    release: os.release(),
    freemem: Math.ceil(os.freemem() / 1024 / 1024 / 1024),
    totalmem: Math.ceil(os.totalmem() / 1024 / 1024 / 1024),
    uptime: os.uptime(),
}

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
        const startTime = dayjs(ctx.fpm._start_time).format('YYYY-MM-DD HH:mm:ss')
        await ctx.render('admin/main.html', {
            version: ctx.fpm.getVersion(),
            online: '24H',
            status: _.assign(SERVER_STATUS, {
                startTime,
                counter: ctx.fpm._counter,
            }),
            currentlink: ctx.currentlink,
        })
    })
    admin.get('/admin/setting/:menu', async (ctx, next) => {
        await ctx.render('admin/setting/' + ctx.params.menu + '.html', {})
    })
    admin.get('/admin/about', async (ctx, next) => {
        await ctx.render('admin/about.html', {
            version: ctx.fpm.getVersion(),
            currentlink: ctx.currentlink,
        })
    })
    admin.get('/admin/plugin', async (ctx, next) => {
        await ctx.render('admin/plugin.html', {
            version: ctx.fpm.getVersion(),
            plugins: ctx.fpm.getPlugins(),
            currentlink: ctx.currentlink,
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