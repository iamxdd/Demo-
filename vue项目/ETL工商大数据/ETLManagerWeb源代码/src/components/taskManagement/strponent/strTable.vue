<template>
	<div>
		<el-table :data="$store.state.strageDatas" stripe tooltip-effect="dark" style="width:100%">
	        <!-- <el-table-column type="selection"></el-table-column> -->
			<!-- <el-table-column prop="name" label="策略名称" class="strClick"></el-table-column> -->
			<el-table-column label="策略名称"  :show-overflow-tooltip="false">
				<template scope="scope">

					 <el-popover trigger="click" placement="top">
					 
					 	<div class="strmsg" v-model="popShow" :style="{'display': block}">
					 		<p>策略名称: <span :title="scope.row.name">{{ scope.row.name }}</span></p>
 			          		<p>执行方式: <span :title="execMode">{{ execMode }}</span></p>
 			          		<p>远程主机: <span :title="execNode">{{ execNode}}</span></p>
 			          		<p class="exportFile">将导出的文件发送到服务器: {{isPassExport}}</p>
 			          		<p>级别: {{logLevel }}</p>
					 	</div>
					 			          
	 			          <div slot="reference" class="name-wrapper"  @click="strNamePopover(scope.row)">
	 			            <span class="limitedWidth" :title="scope.row.name">{{ scope.row.name }}</span>
	 			          </div>
	 
	 			        </el-popover>
					
				</template>
				
			</el-table-column>

			<el-table-column label="创建时间" :show-overflow-tooltip="false">
				<template scope="scope">
					<!-- <span class="icon-lock"></span> -->
					<span class="limitedWidth" :title="scope.row.time">{{scope.row.time}}</span>
				</template>
			</el-table-column>

			<el-table-column label="关联任务" show-overflow-tooltip>
				<template scope="scope">
					<!-- <span class="icon-lock"></span> -->
					<span class="fa fa-link" @click.stop="dutychain(scope.row)" title="关联任务"></span>
				</template>
			</el-table-column>

			<el-table-column label="查看关联" :show-overflow-tooltip="false">
				<template scope="scope">
					<span class="el-icon-view" @click.stop="querychain(scope.row)" title="查看关联"></span>
				</template>
			</el-table-column>

			<el-table-column label="操作" flixed="right" :show-overflow-tooltip="false">
				<template scope="scope">
					<el-button size="small" type="text" @click.stop="reviseSingle(scope.row)" title="修改">修改</el-button>
					<el-button size="small" type="text" @click.stop="deleteSingle(scope.row)" title="删除">删除</el-button>
				</template>
			</el-table-column>
			
		</el-table> 

		<!-- 修改的遮罩层 -->
		<revise-str v-if="$store.state.strRevise.layShow" :str-id="clickStrId" :str-name="clickStrName" :search-text="searchText" :lang-comp="langComp" :step-level="stepLevel" :form-message="formMessage"></revise-str>

		
		<!-- 关联任务, 查看关联 -->
		<duty-chain v-if="$store.state.dutyChain.layShow" :str-id="clickStrId" :str-name="clickStrName" :duty-type="dutyType" :empty-emptyText="tableEmptyText"></duty-chain>

	</div>
</template>

<script>
 	import commonFun from '../common.js';
 	import url from '../../../url/urls.js';

 	import reviseStr from './reviseStr';

 	import dutyChainCom from './dutyChain';
	
	//刷新str策略信息
	import refreshStrFun from './strAjax.js';
    const refreshStrdata = refreshStrFun.refreshStrdata;  //url, param
    const getOnlineData = refreshStrFun.getOnlineData;
    const getRelationDutyData = refreshStrFun.getRelationDutyData; //关联任务数据

    const getCurrentStrData = refreshStrFun.getCurrentStrData;    //修改策略的元素信息

 	const PostAjax = commonFun.PostAjax;
 	const RequestError = commonFun.RequestError;

 	const urls = url.taskMange;

	export default {
		props:["searchText"],
		data(){
			return {
				popShow: false,
				clickStrId:'',
				clickStrName:'',
				multipleSelection: '',
				dutyType:'',
				execMode:'',
				execNode:'',
				isPassExport: '',
				logLevel:'',
				willCancel: false,
				//dutyData:[],
				tableEmptyText:'暂无数据',
				block:'block',
				formMessage:{
		          name:'',        //策略名称
		          execMode:'',    //执行模式 0：本地执行 1：远程执行
		          isPassExport: false,  //远程下载
		          logLevel:'',      //日志级别
		          execNodeId:''    //执行节点id
		        }
			}
		},
		methods:{
			openPopComm(text,row){

				this.clickStrId = row.id;
		     	this.clickStrName = row.name;
			 	let obj = {type: 'open'};
			 	this.$store.dispatch(text,obj);
			 	
			},
			/*任务关联*/
			dutychain(row){

				getRelationDutyData(this,urls.unrelationJobRequest,row,this.dutychainOpen);

			//	this.dutyType = '关联任务';
			//	this.openPopComm('dutyChainShow',row);

			},
			dutychainOpen(row){
				this.dutyType = '关联任务';
				this.openPopComm('dutyChainShow',row);
			},
			 /*查看关联*/
			querychain(row){

				getRelationDutyData(this,urls.queryRelationReq,row,this.querychainOpen);

			},
			querychainOpen(row){

				this.dutyType = '查看关联';
				this.openPopComm('dutyChainShow',row);
			},
			/*修改*/
		    reviseSingle(row){

		    	//读取在线节点数据， 和level， 若失败则不弹出
	    		//getOnlineData(this,urls.openStrage, urls.online, urls.logLevel, this.reviseSingleOpen,row);

	    		getCurrentStrData(this,urls.openStrage, urls.online, urls.logLevel, this.reviseSingleOpen,row);

		     },
		     reviseSingleOpen(row){
		     	this.openPopComm('resetStreviseMessage',row);   //打开策略消息弹框
		     },
		     /*删除*/
		    deleteSingle(row){
		     	let message = "确认是否删除";

		     	this.willCancel = false;

		     	this.$confirm(message,'提示',{
		            confirmButonText:'确认',
		            cancelButtonText:'取消',
		            showCancelButton:true,
		            cancelButtonClass:'floatRight',
		            type:'warning',
		            beforeClose: (action, instance, done) => {
		            	if(action === 'confirm'){

		            		instance.confirmButtonLoading = true;
		            		instance.confirmButtonText = '删除中...';

		            		this.sendDelMessage(row,instance,done);

		            	}else{
		            		 done();
		            	}
		            },
		          }).then(()=>{
		             
		          }).catch(()=>{
		          	//点击关闭时，刷新策略数据
		          	if(this.willCancel === true){

		          		let currPage = this.$store.state.stragePagitation.currPage;
           				let currperItem = this.$store.state.stragePagitation.pageSize;

		          		let param = {
			    			page:{
			    				pageLine: currperItem,
			    				pageNum:currPage
			    			},
			    			condition:{
			    				searchText: this.searchText
			    			}
			    		}



			    		if(this.$store.state.strageDatas.length === 1){


			    			let totalItem = this.$store.state.stragePagitation.totalItem;
			    			let pageSize = this.$store.state.stragePagitation.pageSize;
			    			let newLastPage = (totalItem-1)/pageSize;

			    			newLastPage = newLastPage === 0 ? 1 : newLastPage;

			    			this.$store.state.stragePagitation.currPage !== 1 ? this.$store.dispatch("resetStrCurrPage",newLastPage) : refreshStrdata(this,urls.strageList,param); 

			    			//回到最后一页

			    		}else{

			    			//在当前页刷新数据
			    			refreshStrdata(this,urls.strageList,param)
			    		}


		          	}
		          	
		          })

		    },
		    sendDelMessage(row,instance,done){

		     	let param = {strategy: row.id};
		     	
		     	// let param = {
		     	// 	condition: {
		     	// 		strategy: row.id
		     	// 	}
		     	// }
		     	instance.confirmButtonLoading = false;
		        instance.confirmButtonText = '确定';

		        this.$store.dispatch('addLoadingCover',true);

		     	let promise = PostAjax(urls.sendDeleteStr,param);

		     	promise.done((res)=>{

		     		res = typeof(res) === 'string' ? JSON.parse(res) : res;

		     		this.$store.dispatch('addLoadingCover',false);

		     		let code = res.code;
		     		let message = res.message;

		     		if(code === 0){

		     			let message = res.message;
		     			instance.message = "删除成功";
		     			instance.confirmButtonText = "确认";
		     			instance.showConfirmButton = false;
		     			instance.cancelButtonText = '关闭';
		     			instance.confirmButtonLoading = false;
		            	instance.type = "success";

		            	this.willCancel = true;

		     		}else{

		     			instance.message = message;
		     			instance.showConfirmButton = false;
		     			instance.cancelButtonText = '关闭';
		     			instance.confirmButtonLoading = false;
		     			instance.type = "error";
		     			// RequestError(this,message);
		     		}
		     	})

		     	promise.fail((res)=>{

		     		this.$store.dispatch('addLoadingCover',false);

		     		//关闭提示，再弹出
		     		let message = '服务器异常,请稍后刷新';
		     		instance.message = message;
		     		instance.showConfirmButton = false;
		     		instance.cancelButtonText = '确认';
		     		instance.type = "error";

		     		// let message = '服务器繁忙,请稍后刷新';
     				// RequestError(this,message);
		     	})
		    },
		    //查看str相关信息
		    strNamePopover(row){

		    	let param = {strategy:row.id};
		    	
		    	// let param = {
		    	// 	condition: {
		    	// 		strategy:row.id
		    	// 	}
		    	// }

		    	let promise = PostAjax(urls.openStrage,param)
		    	
		    	promise.done((res) => {

		    		res = typeof(res) === 'string' ? JSON.parse(res) : res;

		    		let code = res.code;
		    		let message = res.message;

		    		if(code === 0){

		    			this.popShow = true;  //显示总数

		    			this.popClass = 'showItem'

		    			let result = res.result.execStrategy;
		    			this.execMode = result.execMode;
		    			this.execNode = result.execNode;
		    			this.isPassExport = result.isPassExport;
		    			this.logLevel = result.logLevel;

		    		}else{

		    			this.popShow = false;
		    			this.block = 'none';

		    			this.popClass = 'closeItem';

		    			RequestError(this,message);
		    		}
		    	})

		    	promise.fail((res) => {

		    		this.popShow = false;
		    	    this.block = 'none';
		    	    this.popClass = 'closeItem'

		    		//console.warn("request error")
		    		let message = '服务器异常,请稍后刷新';
     				RequestError(this,message);
		    	})

		    }
		},
		components:{
			'revise-str':reviseStr,
			'duty-chain':dutyChainCom
		}
	}
</script>