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
    // var myDate = new Date();
    // myDate.getYear(); //获取当前年份(2位)
    // myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    // myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    // myDate.getDate(); //获取当前日(1-31)
    // myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
    // myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    // myDate.getHours(); //获取当前小时数(0-23)
    // myDate.getMinutes(); //获取当前分钟数(0-59)
    // myDate.getSeconds(); //获取当前秒数(0-59)
    // myDate.getMilliseconds(); //获取当前毫秒数(0-999)
    // myDate.toLocaleDateString(); //获取当前日期
    // var mytime=myDate.toLocaleTimeString(); //获取当前时间
    // myDate.toLocaleString( ); //获取日期与时间


    //获取当前年、月、日、时、分
    let now = new Date();
    let nowYear = now.getFullYear();
    let nowDay =now.getDate();
    // let nowHour = now.getHours();
    // let nowMinute = now.getMinutes


    let date = new Date(value);
    let YY = date.getFullYear();
    let MM = date.getMonth() + 1;
    // MM = MM < 10 ? ('0' + MM) : MM;
    let DD = date.getDate();
    DD = DD < 10 ? ('0' + DD) : DD;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;

    if (nowYear == YY && nowDay == DD) {
      return h+':'+m;
    } else if (nowYear == YY) {
      return MM+'-'+DD+' '+h+':'+m;
    }
    return YY+'-'+MM+'-'+DD+' '+h+':'+m;
  },
  arrRemoval(arr) {
    let obj = {};
    let list = arr.reduce((item, next) => {
      obj[next.uid] ? "" : obj[next.uid] = true && item.push(next);
      return item;
    }, [])
    return list;
  }
}

app.use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
