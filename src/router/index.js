import { createRouter, createWebHistory } from 'vue-router'
const Login = ()=>import('common/Login')

const Home =()=>import('views/home/Home')
const Person =()=>import('views/person/Person')
const Article =()=>import('views/person/child/Articles')
const Album = () => import('views/person/child/Albums')

const Social =()=>import('views/social/Social')
const Chat =()=>import('views/chat/Chat')

const routes = [
  {
    path: '/',
    redirect:'/home'
  },
  {
    path: '/login',
    component:Login,
  },
  {
    path: '/home',
    component:Home,
    children: [
      {
        path:'/home',
        redirect: '/social',
      },
      {
        path: '/person',
        component: Person,
        children: [
          {
            path: '/article',
            name:'article',
            component:Article
          },
          {
            path: '/album',
            component:Album
          }
        ]
      },
      {
        path: '/social',
        component:Social
      },
      {
        path: '/chat',
        component:Chat
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let user = sessionStorage.getItem('user');
    user ? next() : next('/login');
  }
})
export default router
