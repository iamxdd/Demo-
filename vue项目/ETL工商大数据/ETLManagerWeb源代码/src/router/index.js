import Vue from 'vue';
import Router from 'vue-router';
import home from '../components/home/home';
import designer from '../components/designer/designer';
import taskmanger from '../components/taskManagement/taskmanger';
import node from '../components/node/node';

/*taskManger*/
import strategy from '../components/taskManagement/strponent/strategy';
import manger from '../components/taskManagement/mangerponent/manger';
import history from '../components/taskManagement/historyponent/history';

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [	
  	{
      path: '/',
      redirect: '/home',
   	},{
      path: '/home',
      component: home
    },{
       path: '/designer',
      component: designer
    },{
      path: '/taskmanger',
      redirect:'/taskmanger/strategy'
    },{
      path: '/taskmanger',
      component: taskmanger,
      children: [
        {
          path: 'strategy',
          component: strategy
        },
        {
          path: 'manger',
          component: manger
        },
        {
          path: 'history',
          component: history
        }
      ]
    },{
       path: '/node',
       component: node
    },{
      path:'*',
      redirect:'/ETLManager'
    }
  ]
})


