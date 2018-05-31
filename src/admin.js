import _ from 'lodash'
import os from 'os'
import path from 'path'
import process from 'process'
import dayjs from 'dayjs'
import fpmc from 'yf-fpm-client-js'
import axios from 'axios'

const LOCAL = path.join(__dirname, '..')
const CWD = process.cwd()
const DEV_MODE = LOCAL == CWD
let VIEW_ROOT_DIR = ''
if(!DEV_MODE){
    VIEW_ROOT_DIR = 'node_modules/fpm-plugin-admin/'
}

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
    admin.get('/admin', async (ctx) => {
        await ctx.render('admin/login.html')
    })
    
    admin.get('/admin/login', async (ctx) => {
        await ctx.render('admin/login.html')
    })
    
    admin.get('/admin/main', async (ctx) => {
        const startTime = dayjs(ctx.fpm._start_time).format('YYYY-MM-DD HH:mm:ss')
        await ctx.render('admin/main.html', {
            online: '24H',
            status: _.assign(SERVER_STATUS, {
                startTime,
                counter: ctx.fpm._counter,
            }),
        })
    })

    admin.get('/admin/test', async (ctx) => {
        await ctx.render('admin/test.html')
    })

    admin.get('/admin/config', async (ctx) => {
        await ctx.render('admin/config.html', {
            config: JSON.stringify(ctx.fpm.getConfig(), null, 2),
        })
    })

    admin.post('/admin/rpc', async (ctx) => {
        // get body
        const { method, args } = ctx.request.body
        try{
            const data = await new fpmc.Func(method).invoke(args)
            ctx.body = { errno: 0, data }
        }catch(e){
            ctx.body = e
        }
    })

    admin.post('/admin/registry', async (ctx) => {
        const { name } = ctx.request.body
        try{
            const data = await axios.get(`http://registry.npmjs.org/${name}`)
            const latest = data.data['dist-tags'].latest
            ctx.body = { errno: 0, data: { latest } }
        }catch(e){
            ctx.body = e
        }
    })

    admin.get('/admin/setting/:menu', async (ctx) => {
        await ctx.render('admin/setting/' + ctx.params.menu + '.html', {})
    })
    admin.get('/admin/about', async (ctx) => {
        await ctx.render('admin/about.html')
    })
    admin.get('/admin/plugin', async (ctx) => {
        // console.info(ctx.fpm.getPlugins())
        await ctx.render('admin/plugin.html', {
            plugins: ctx.fpm.getPlugins(),
        })
    })
    admin.get('/admin/logout', async (ctx) => {
        ctx.session.admin = undefined
        await ctx.redirect('/admin/login')
    })
    
    admin.post('/admin/login', async (ctx) => {
        //check pass
        let loginInfo = ctx.request.body
        const { user, pass, error} = _.assign({user: 'admin', pass: '741235896'}, ctx.fpm.getConfig('admin'))
        if (loginInfo.name === user && loginInfo.pass === pass) {
            // init fpmc
            const { port, domain } = ctx.fpm.getConfig('server')
            fpmc.init({ appkey: '123123', masterkey: '123123', domain: `http://${ domain || 'localhost'}:${port}`})
            // fpmc.ping().then(console.info).catch(console.error)
            ctx.session.admin = loginInfo
            ctx.body = { code: 0 }
        } else {
            ctx.body = { code: -99, error: error || '用户名或密码错误' }
        }
    })

    return admin
      
}