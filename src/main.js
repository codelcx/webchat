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


app.use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
