import { createRouter, createWebHistory } from 'vue-router'
const Login = ()=>import('common/Login')

const Home = () =>import('views/home/Home')

const Person =()=>import('views/person/Person')
const Article =()=>import('views/person/child/Articles')
const Album = () => import('views/person/child/Albums')

const Social = () => import('views/social/Social')
const Complaint = () => import('views/social/child/Complaint')
const Comment = () => import('views/social/child/Comment')

const Chat = () => import('views/chat/Chat')

const Star = () =>import('views/star/Star')
const RoomDetail = () => import('views/star/child/RoomDetail')

const Member = () => import('views/member/Member')


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
        redirect: '/star',
      },
      {
        name:'star',
        path: '/star',
        component:Star
      },
      {
        name:'person',
        path: '/person',
        component: Person,
        children: [
          {
            name:'article',
            path: '/article',

            component:Article
          },
          {
            name:'album',
            path: '/album',
            component:Album
          }
        ]
      },
      {
        name:'social',
        path: '/social',
        component:Social
      },
      {
        name:'chat',
        path: '/chat',
        component:Chat
      },
    ]
  },
  {
    name:'complaint',
    path: '/complaint',
    component:Complaint
  },
  {
    name: 'comment',
    path: '/comment',
    component:Comment
  },
  {
    name: 'member',
    path: '/member',
    component:Member
  },
  {
    name: 'room',
    path: '/room',
    component:RoomDetail
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
