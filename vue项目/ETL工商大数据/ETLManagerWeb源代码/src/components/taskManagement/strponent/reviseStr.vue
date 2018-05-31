
<template>
  <div class="reviseStrDiv">
      <el-dialog title="修改策略" :visible.sync="$store.state.strRevise.layShow" size="tiny">
       <el-form :model="formMessage" ref="formMessage" class="dialogMinWidth" :rules="rules">
              <el-form-item label="策略名称：">
                <el-input v-model="formMessage.name" size="small" placeholder="请输入" :disabled="true" class="strInput"></el-input>
              </el-form-item>

              <el-form-item label="执行方式：" prop="execMode">
                <el-select v-model="formMessage.execMode" placeholder="请选择" size="small">
                  <el-option v-for="item in actionStyle" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="远程主机：" prop="execNodeId">
                <el-select v-model="formMessage.execNodeId" placeholder="请选择" size="small" :disabled="ifDistable">
                  <el-option v-for="item in langComp" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="将导出的文件发送到远程服务器" prop="isPassExport">
                <el-switch v-model="formMessage.isPassExport" on-text="" off-text="" :disabled="ifDistable"></el-switch>
              </el-form-item> -->

              <el-form-item label="级别：" prop="logLevel">
                <el-select v-model="formMessage.logLevel" placeholder="请选择" size="small">
                  <el-option v-for="item in stepLevel" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item class="sureorclose">
                <el-button type="primary" size="primary" @click="submitForm('formMessage')">
                  <i class="el-icon-loading" v-if="uploading"></i>
                  <span>{{confirmMg}}</span>
                </el-button>
                <el-button size="primary" @click="closeLayer" :plain="true">
                  取消
                </el-button>
              </el-form-item>
            </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import commonFun from '../common.js';
  import refreshStrFun from './strAjax.js';
  import url from '../../../url/urls.js';

  const urls = url.taskMange;
  const refreshStrdata = refreshStrFun.refreshStrdata;
  const getOnlineData = refreshStrFun.getOnlineData;
  const getLogLevelData = refreshStrFun.getLogLevelData;
  const getCurrentStrData = refreshStrFun.getCurrentStrData;

  const ObjCopy = commonFun.ObjCopy;
  const PostAjax = commonFun.PostAjax;
  const RequestError = commonFun.RequestError;

  const actionStyleObj = [
    // {value:'0', label: '本地执行'},
    {value:'1', label: '远程执行'}
  ];


  export default{
    props:['strId','strName',"searchText", "langComp", "stepLevel","formMessage"],
    data(){
      return {
        dialogTableVisible:true,
        currentPage:'',
        innerBoxShow:false,
        confirmMg:'保存',
        uploading:false,     //提交的图标
      //  stepLevel: [],   //stepLevelObj
        actionStyle: actionStyleObj,
      //  langComp: [],   //langCompObj  
        ifDistable:false,    //是否禁止
        orginExecNodeId:'',
        // formMessage:{
        //   name:'',        //策略名称
        //   execMode:'',    //执行模式 0：本地执行 1：远程执行
        //   isPassExport: false,  //远程下载
        //   logLevel:'',      //日志级别
        //   execNodeId:''    //执行节点id
        // },
        defaultSelectObj:{
          execMode: {value: '', label: ''},
          logLevel: {value: '', label: ''},
          execNodeId: {value: '', label: ''}
        },
        rules:{
          execNodeId:[
            {required:true, message:'至少选择一项',trigger:'change'}
          ]
        },
        leaveType:false,
        nodeName:''
      }
    },
    created(){

      this.formMessage.name = this.strName;
      //远程节点数据
      
     // getOnlineData(this,urls.online, this.closeLayer);    //获取远程日志

     // getLogLevelData(this, urls.logLevel, this.closeLayer);   //获取日志

    },
    mounted(){
      this.$nextTick(() => {

        //请求发送得到当前的信息
       // this.getStrData();

      })
    },
    watch:{
      /*监听是否选择远程连接 本地连接屏蔽*/
      // 'formMessage.execMode': function(newVal,oldVal){

      //   let _this = this;

      //   actionStyleObj.forEach((val,index) => {
      //     if(val.label === newVal){
      //       newVal = val.value;
      //     }
      //   })

      //   if(newVal === "1"){   //远程
      //     _this.ifDistable = false;   //取消禁止选择

      //     _this.rules.execNodeId[0].required = true;    //远程必选

      //     this.formMessage.execNodeId = this.orginExecNodeId;

      //   }else{  //本地
      //     _this.ifDistable = true;   //取消禁止选择

      //     this.formMessage.execNodeId = '';
      //     this.formMessage.isPassExport = false;

      //      _this.rules.execNodeId[0].required = false;    //远程必选

      //      _this.$refs['formMessage'].validateField("execNodeId", function(msg){
      //     });

      //   }
      // }
    },
    methods:{
       getStrData(){

          //弹出框需要在之前判断是否有数据，若没有则不弹出
          
       },
       //表单提交
       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.closeLayer();  //
            /*全部有效，确认按钮*/

            let execStrategy = ObjCopy(this.formMessage);

            this.noLeaveNodeAction(execStrategy);

                       
          }else {
            // console.warn('error!!');
            return false;
          }
        });
      },
      noLeaveNodeAction(execStrategy){

        if(isNaN(+execStrategy.logLevel)){
            for(var i = 0; i < this.stepLevel.length; i++){
              if(execStrategy.logLevel === this.stepLevel[i].label){
                execStrategy.logLevel = this.stepLevel[i].value;
                break;
              }
            }
         }

         //actionStyleObj
        if(isNaN(+execStrategy.execMode)){
            for(var i = 0; i < actionStyleObj.length; i++){
              if(execStrategy.execMode === actionStyleObj[i].label){
                execStrategy.execMode = actionStyleObj[i].value;
                 break;
              }
            }
         }
        //langComp  节点
        for(var i = 0; i < this.langComp.length; i++){
          if(execStrategy.execNodeId === this.langComp[i].label){
            execStrategy.execNodeId = this.langComp[i].value;
            break;
          }
         }
       
        execStrategy['id'] = this.strId;
        execStrategy.isPassExport =  execStrategy.isPassExport === false ? "N" : "Y";

        //execStrategy.execMode == 1 && this.langComp.length == 0

        if(execStrategy.execNodeId == this.nodeName){

          //节点离线，匹配不到id,无法传递到后台
          this.hasLeaveNodeAction(execStrategy);

        }else{

         // this.uploading = true;
         // this.confirmMg = "提交中";

          //向后台发参数， 提交数据
          //
          if(this.leaveType){

            this.hasLeaveNodeAction(execStrategy);

          }else{
            let promise = PostAjax(urls.modifyStr,execStrategy);

            promise.done((res) => {
              let code = res.code;
              let message = res.message;
              code === 0 ? this.addSucc(message) : this.addError(message);
            });

            promise.fail((err) => {
              
              let message = '服务器异常,请稍后刷新';
              RequestError(this,message,this.closeLayer);

            })
          }

        }
      },
      hasLeaveNodeAction(execStrategy){
        //无法匹配到 id， 弹出响应的提示

        let errorMessage = '远程主机 '+ execStrategy.execNodeId +' 已离线，无法做任何修改';

        this.$confirm(errorMessage,'提示',{
          confirmButonText:'确定',
          showConfirmButton:true,
          showCancelButton:false,
          cancelButtonText: '关闭',
          type:'error'
        }).then(()=>{
          /*点击确认*/
          this.refreshStrCommon(); //刷新数据
         
        }).catch(()=>{

          this.refreshStrCommon();   //刷新数据

        })
      },
      addSucc(msg){

          //this.closeLayer();

          this.uploading = false;    //关闭loading
          let successMg = msg;

          this.$confirm(successMg,'提示',{
            confirmButonText:'确认',
            showCancelButton:false,
            type:'success'
          }).then(()=>{
            /*点击确认*/
            //发请求,重新请求最新的策略信息
           this.refreshStrCommon();   //刷新数据

          }).catch(()=>{
             /*点击关闭*/
             this.refreshStrCommon();   //刷新数据
          })
          
      },
      addError(msg){
           //失败提示原因
          let errorMessage = msg;

          this.$confirm(errorMessage,'提示',{
            confirmButonText:'确认',
            showCancelButton:false,
            type:'error'
          }).then(()=>{
            /*点击确认*/
            this.refreshStrCommon();   //刷新数据
           
          }).catch(()=>{
            this.refreshStrCommon();   //刷新数据
          })
      },
      refreshStrCommon(){
         this.closeLayer();   //关闭遮罩层

         let currPage = this.$store.state.stragePagitation.currPage;
         let currperItem = this.$store.state.stragePagitation.pageSize;

         // let param = {pageIndex: currPage, perItem: currperItem};

         let param = {
            page:{
              pageLine: currperItem,
              pageNum: currPage
            },
            condition:{
              searchText: this.searchText
            }
          }

          refreshStrdata(this,urls.strageList,param);
      },
      closeLayer(){
        let obj = {type: 'close'};
        this.$store.dispatch("resetStreviseMessage",obj);
      }
    }
  }
</script>