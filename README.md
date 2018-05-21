## FPM-PLUGIN-ADMIN
用于显示后台管理页面的插件

### Install
```bash
yarn add fpm-plugin-admin
```

### Useage

default user
admin
741235896

可以在 config.json 中添加 admin 节点
```javascript
{
    //...
    "admin":{
        "user":"admin",
        "pass":"123123",
        "error":"用户名或密码错误"
    }
    //...
}
```