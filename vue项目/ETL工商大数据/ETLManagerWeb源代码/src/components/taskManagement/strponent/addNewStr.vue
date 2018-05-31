<template>
  <div class="newStrDiv">
    <el-dialog title="添加策略" :visible.sync="$store.state.strAddNew.layShow" size="tiny">
       <el-form :model="formMessage" ref="formMessage" :rules="rules" class="dialogMinWidth">
        <el-form-item label="策略名称：" prop="name">
          <el-input v-model="formMessage.name" size="small" placeholder="请输入" class="strInput"></el-input>
        </el-form-item>

        <el-form-item label="执行方式：" prop="execMode">
          <el-select v-model="formMessage.execMode" placeholder="请选择" size="small">
            <el-option v-for="item in actionStyle" :label="item.label" :value="item.value" :key="item.value" :title="item.label"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="远程主机：" prop="execNodeId">
          <el-select v-model="formMessage.execNodeId" placeholder="请选择" size="small" :disabled="ifDistable">
            <el-option v-for="item in langComp" :label="item.label" :value="item.value" :key="item.value" :title="item.label"></el-option>
          </el-select>
        </el-form-item>
       <!--  <el-form-item label="将导出的文件发送到远程服务器" prop="isPassExport">
          <el-switch v-model="formMessage.isPassExport" on-text="" off-text="" :disabled="ifDistable"></el-switch>
        </el-form-item> -->

        <el-form-item label="级别：" prop="logLevel">
          <el-select v-model="formMessage.logLevel" placeholder="请选择" size="small">
            <el-option v-for="item in stepLevel" :label="item.label" :value="item.value" :key="item.value" :title="item.label"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="sureorclose">
          <el-button type="primary" size="primary" @click="submitForm('formMessage')" >
            <i class="el-icon-loading" v-if="uploading"></i>
            <span>{{confirmMg}}</span>
          </el-button>
          <el-button size="primary" @click="closeLayer">
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

  const ObjCopy = commonFun.ObjCopy;
  const PostAjax = commonFun.PostAjax;
  const GetAjax = commonFun.GetAjax;

  const RequestError = commonFun.RequestError;

	const actionStyleObj = [
		// {value:'0', label: '本地执行'},
		{value:'1', label: '远程执行'}
	];

  // const stepLevelObj  = [
  //   {value:'0', label: '没有日志'},
  //   {value:'1', label: '错误日志'},
  //   {value:'2', label: '最小日志'},
  //   {value:'3', label: '基本日志'},
  //   {value:'4', label: '详细日志'},
  //   {value:'5', label: '调试日志'},
  //   {value:'6', label: '行级日志'}
  // ];

  // const langCompObj  = [
  //   {value:'00', label: '远程1'},
  //   {value:'11', label: '远程2'},
  //   {value:'22', label: '远程3'},
  //   {value:'33', label: '远程4'},
  //   {value:'44', label: '远程5'},
  //   {value:'55', label: '远程6'},
  //   {value:'66', label: '远程7'}
  // ];


	export default{
    props: ["langComp","stepLevel"],
		data(){

      var checkNameReg = (rule, value, callback) => {

        let reg = new RegExp(/^[\u4E00-\u9FA5a,\w,_]*$/);

        if(!reg.test(value)){
          return callback(new Error("无效字符，仅支持汉字，字母，数字及下划线"));
        }else{
          callback();
        }

      };

			return {
        currentPage:'',
        perItem:'',
        innerBoxShow:false,
        confirmMg:'立即创建',
        uploading:false,     //提交的图标
			//	stepLevel: [],
				actionStyle: actionStyleObj,
       // langComp: [],   //langCompObj
        ifDistable:false,    //是否禁止
				formMessage:{
					name:'',        //策略名称
					execMode:'',    //执行模式 0：本地执行 1：远程执行
          isPassExport: false,  //远程下载
          logLevel:'',      //日志级别
          execNodeId:''    //执行节点id
				},
				rules:{
					name:[
						{required:true, message:'仅支持汉字，字母，数字及下划线，长度在1到128',trigger:'blur'},
						{min: 1, max:128, message:'超出字符长度：在1到128',trigger: 'blur'},
            {validator: checkNameReg, trigger: 'blur'}
					],
					execMode:[
						{required:true, message:'至少选择一项',trigger:'change'}
					],
          logLevel:[
            {required:true, message:'至少选择一项',trigger:'change'}
          ],
          execNodeId:[
            {required:true, message:'至少选择一项',trigger:'change'}
          ]
				}
			}
		},
    created(){
      
      // getOnlineData(this, urls.online, this.closeLayer);   //得到远程的节点数

      // getLogLevelData(this, urls.logLevel, this.closeLayer);   //获取日志

    },
    watch:{
      /*监听是否选择远程连接*/
      'formMessage.execMode': function(newVal,oldVal){

        let _this = this;

        if(newVal === "1"){   //远程打开
          _this.ifDistable = false;   //取消禁止选择
          _this.rules.execNodeId[0].required = true;    //远程必选

        }else{  //本地执行

          _this.ifDistable = true;   //取消禁止选择
          _this.rules.execNodeId[0].required = false;  //远程必选

          this.formMessage.execNodeId = '';
          this.formMessage.isPassExport = false;

          //重置条件
          _this.$refs['formMessage'].validateField("execNodeId", function(msg){
          });

        }
      }
    },
		methods:{
			 submitForm(formName) {

        this.$refs[formName].validate((valid) => {

          if (valid) {

            this.closeLayer();  ////关闭以及弹出框

            /*全部有效，确认按钮*/
            let execStrategy = ObjCopy(this.formMessage);

            execStrategy.execNodeId = execStrategy.execNodeId === "" ? "" : execStrategy.execNodeId;
            execStrategy.isPassExport =  execStrategy.isPassExport === false ? "N" : "Y";

            // this.uploading = true;
            // this.confirmMg = "提交中";
            //向后台发参数， 提交数据
           // let param = {condition: execStrategy};
           
            let param = execStrategy;

            this.$store.dispatch('addLoadingCover',true);

            let promise = PostAjax(urls.addNewStr,param);

            promise.done((res) => {

              this.$store.dispatch('addLoadingCover',false);

              res = typeof(res) === 'string' ? JSON.parse(res) : res;

              let code = res.code;
              let message = res.message;

              let successType = 'success';
              let errorType = 'error';

              if(code === 0){
                this.confirmOrCancel(message,successType)
              }else{
                this.confirmOrCancel(message,errorType)
              }

            });
            promise.fail((err) => {
               this.$store.dispatch('addLoadingCover',false);

               let message = '服务器繁忙,请稍后刷新';
               RequestError(this,message,this.closeLayer);
              // console.warn("request error");
            })
           
          }else {
            return false;
          }
        });
      },
      //提交后弹出失败或成功
      confirmOrCancel(msg,type){

        let currPage = this.$store.state.stragePagitation.currPage;
        let currperItem = this.$store.state.stragePagitation.pageSize;

        // this.uploading = false;    //关闭loading
        
        //let param = {pageIndex: currPage, perItem: currperItem, searchText: ''};
        
        let param = {
            page:{
              pageLine: currperItem,
              pageNum: currPage
            },
            condition:{
              searchText: ''
            }
          }

        this.$confirm(msg,'提示',{
          confirmButonText:'确认',
          showCancelButton:false,
          type: type
        }).then(()=>{
          /*点击确认*/
          //发请求,重新请求最新的策略信息
          this.closeLayer();  //关闭遮罩层
          //刷新数据和页码

          refreshStrdata(this,urls.strageList,param);

        }).catch(()=>{
           /*点击关闭*/
           this.closeLayer();  //关闭遮罩层 
          //刷新数据和页码

          refreshStrdata(this,urls.strageList,param);
         
        })
      },
			closeLayer(){
				  let type = 'close';
          this.$store.dispatch('addStreviseMessage',type)
			}
		}
	}
</script>