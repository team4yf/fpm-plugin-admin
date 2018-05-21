import _ from 'lodash'
import os from 'os'
import dayjs from 'dayjs'
import fpmc from 'yf-fpm-client-nodejs'

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

    admin.get('/admin/test', async (ctx, next) => {
        await ctx.render('admin/test.html', {
            env: ctx.fpm._env,
            version: ctx.fpm.getVersion(),
            currentlink: ctx.currentlink,
        })
    })

    admin.get('/admin/config', async (ctx, next) => {
        await ctx.render('admin/config.html', {
            config: JSON.stringify(ctx.fpm.getConfig(), null, 2),
            version: ctx.fpm.getVersion(),
            currentlink: ctx.currentlink,
        })
    })

    admin.post('/admin/rpc', async (ctx, next) => {
        // get body
        const { method, args } = ctx.request.body
        try{
            const data = await new fpmc.Func(method).invoke(args)
            ctx.body = { errno: 0, data }
        }catch(e){
            ctx.body = e
        }
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
        const { user, pass, error} = _.assign({user: 'admin', pass: '741235896'}, ctx.fpm.getConfig('admin'))
        if (loginInfo.name === user && loginInfo.pass === pass) {
            // init fpmc
            const { port, domain } = ctx.fpm.getConfig('server')
            fpmc.init({ appkey: '123123', masterkey: '123123', endpoint: `http://${ domain || 'localhost'}:${port}/api`})
            // fpmc.ping().then(console.info).catch(console.error)
            ctx.session.admin = loginInfo
            ctx.body = { code: 0 }
        } else {
            ctx.body = { code: -99, error: error || '用户名或密码错误' }
        }
    })

    return admin
      
}