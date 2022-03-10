import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//初始化样式
import "./assets/css/base.css"
//字体图标
import "./assets/iconfont/iconfont.css"
//elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as icon from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";

const app = createApp(App)
//注册图标
Object.keys(icon).forEach(key => {
  app.component(key,icon[key])
})
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$filters = {
  formatDate(value) {
    //复杂业务可以使用moment.js
    let date = new Date(value);
    let YY = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let DD = date.getDay();
    DD = DD < 10 ? ('0' + DD) : DD;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;

    return YY+'-'+MM+'-'+MM+' '+h+':'+m+':'+s;
  }
}

app.use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
