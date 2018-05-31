<template>
  <div id="app">
 <div  v-loading.fullscreen.lock="$store.state.fullscreenLoading" element-loading-text="加载中"></div>
  	<header>
     <div class='LeftImg'>
     	<!-- <img src="/ETLManager/static/image/logo.png"/> -->
      <!-- <img src="static/image/logo-w.png"/> -->
      <img src="/ETLManager/static/image/logo-w.png"/>
      <span>ETL数据采集</span>
     </div>
	 <ul>
         <li v-for="(item,index) in liData" :class="{active:$route.matched[0].path==item.label}" ><router-link :to="item.label">{{item.name}}</router-link></li>
     </ul>
  	</header>
    <div class="content">
       <router-view></router-view>
     </div>
  </div>
</template>
<!-- /ETLManager -->
<script>

import url from './url/urls.js';

//resetTabClickIndex

 export default {
  data(){
    return {
      // active:0,
      liData:[
        {name:"首页",label:"/home"},
        {name:"设计器",label:"/designer"},
        {name:"任务管理",label:"/taskmanger"},
        {name:"节点管理",label:"/node"}
      ],
      timer:null
    }
  },

 created(){ 
   // let urlArr = window.location.href.split("/");
   // window.location.href=urlArr[0]+"//"+urlArr[2]+"/ETLManager";
 //初始化超时处理   
       // this.timeout();
  },
  mounted(){
     let urlArr = window.location.href.split("/");
   //window.location.href=urlArr[0]+"//"+urlArr[2]+"/ETLManager";
    // let url = window.location.href.split("/");
    // let lastParam = url[url.length - 1];

    // let index=0;

    // this.liData.filter((v,i) => {

    //   let label = v.label.split("/");
    //   let lastParamTable = label[label.length-1];
    //   if(lastParamTable == lastParam){
    //       index = i;
    //     }
    // });

    // this.currIndex = index; 


    //  taskmanger  designer  node   home
   // let topRouter = ["home","designer","taskmanger","node"];
   // let url = window.location.href;
   // let index=0;


   //  for(var i = 0; i < topRouter.length; i++){
   //    var reg = eval('/\\b(' + topRouter[i] + ')\\b/g');
   //    if(reg.test(url)){
   //       index = i;
   //       break;
   //    }
   //  }

   //  this.$store.dispatch('resetTabClickIndex',index);

    //this.currIndex = index; 
    
  },
  methods:{
    clickTable(index){
    // this.currIndex=index;
     this.$store.dispatch('resetTabClickIndex',index);
     //调用超时
    //  if(this.currIndex===0){
    //          clearTimeout(this.timer);
    //          this.timeout();
    // }else{
    //    clearTimeout(this.timer);
    // }
     // this.$store.dispatch('fullScreen',true);
     //  setTimeout(() => {
     //                        this.$store.dispatch('fullScreen',false);
     //                  },50);
    },
    //超时处理
    timeout(){
        this.timer=setInterval(()=>{
         this.$http.get(url.timeOut.istimeout).then(res=>{
          if(res.body.code===201){
            this.$alert(res.body.message, '提示', {
                     confirmButtonText: '确定',
                     type:'error',
                     beforeClose: (action, instance, done) =>{
                      let oldurl=window.location.href.split("#");
                      let newurl=oldurl[0]+"#/";
                       this.clickTable(0);
                      window.location.href=newurl;
                                   setTimeout(() => {
                                done();
                        },100)
                      }

                    });
            clearTimeout(this.timer);
           }
        });
      },5000);
    }
  }
 } 
</script>


