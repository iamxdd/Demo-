<template>
	<div>
		<!-- <p class='title'>任务管理</p> -->
		<div class="mangerDiv">
			<p>
				<!-- 提示 -->
				<el-popover ref="startpop" trigger="click" placement="top" :popper-class="popClass">
					<div v-model="noStartItem">
						<p class="lastmsg">至少选择一项</p>
					</div>
				</el-popover >

				<el-popover ref="stoppop" trigger="click" placement="top" :popper-class="popClass">
					<div v-model="noStopItem">
						<p class="lastmsg">至少选择一项</p>
					</div>
				</el-popover>

				<el-button @click="batchAction()" size="small" v-popover:startpop type="primary">批量执行</el-button>
				<el-button @click="batchStop()" size="small" v-popover:stoppop type="primary">批量停止</el-button>



				<!-- <el-popover ref="startpop" trigger="click" placement="top" v-model="noStartItem">
					<div class="lastOne">
						至少选择一项
					</div>
			         <el-button slot="reference" @click="batchAction()" size="small" v-popover:startpop type="primary">批量执行</el-button>
				</el-popover>


				<el-popover ref="startpop" trigger="click" placement="top" v-model="noStartItem">
					<div class="lastOne">
						至少选择一项
					</div>
			         <el-button slot="reference" @click="batchStop()" size="small" v-popover:startpop type="primary">批量停止</el-button>
				</el-popover> -->



				<span class="searchDutyName">任务名称：</span>
				<el-input placeholder="请输入" v-model="inputVal" size="small"></el-input>	
				<el-button type="primary" icon="search" @click="searchClick" size="small" class="searchMargin">搜索</el-button>

				<span class="redNotice" v-show="redNotice">长度不超过 128 个字符</span>
			</p>

			<div class="tableGation">
				<div class="showTable">
					<div>
						任务管理
					</div>
					<el-table :data="$store.state.mangerDatas" stripe tooltip-effect="dark" style="width:100%" @select="selectOneFun" ref="multipleTable" @select-all="selectAllFun">
						<el-table-column type="selection"></el-table-column>

						<el-table-column label="任务名称">
							<template scope="scope">
								<span class="limitedWidth" :title="scope.row.name">{{scope.row.name}}</span>
							</template>
						</el-table-column>

						<el-table-column label="创建时间" width="190">
							<template scope="scope">
								<span class="limitedWidth" :title="scope.row.createtime">{{scope.row.createtime}}</span>
							</template>
						</el-table-column>

						<el-table-column label="调度类型">
							<template scope="scope">
								<span class="limitedWidth" :title="scope.row.scheduletype">{{scope.row.scheduletype}}</span>
							</template>
						</el-table-column>

						<el-table-column label="调度时间">
							<template scope="scope">
								<span class="limitedWidth" :title="scope.row.scheduletime">{{scope.row.scheduletime}}</span>
							</template>
						</el-table-column>

						<el-table-column label="策略名称" width="180">
							<template scope="scope">
								<span class="limitedWidth" :title="scope.row.strategyName">{{scope.row.strategyName}}</span>
							</template>
						</el-table-column>

						<el-table-column label="执行">
							<template scope="scope">

								 <span  @click="singleStart(scope.row,scope.row.status)" class="fa"  :class="[(scope.row.status==='停止' ? true : false) ? 'fa-play' : 'fa-plays']"></span>
								 
							</template>
						</el-table-column>
						<el-table-column label="停止">
							<template scope="scope">

								<span class="fa" @click="singleStop(scope.row,scope.row.status)" :class="[(scope.row.status==='执行' ? true : false) ? 'fa-stop' : 'fa-stops']"></span>

							</template>
						</el-table-column>
						<el-table-column label="详情">
							<template scope="scope">
								<span class="fa fa-bars" @click="detailsFun(scope.row)" title="详情"></span>
							</template>
						</el-table-column>

						<el-table-column label="状态">
							<template scope="scope">
								<span class="limitedWidth" :title="scope.row.status">{{scope.row.status}}</span>
							</template>
						</el-table-column>
					</el-table>	

					<div class="pagation">
						<el-pagination layout="total, prev, pager, next, sizes, jumper, pager" :total="$store.state.mangerPagitation.totalItem" :current-page="$store.state.mangerPagitation.currPage" :page-sizes="$store.state.mangerPagitation.pageSizeArr" :page-size="$store.state.mangerPagitation.pageSize" @current-change="handleCurrentChange" @size-change="handleSizeChange">
				           </el-pagination>
					</div>

				</div>
			</div>

		</div>
		<!-- 弹出框 -->
		<detail-chart v-if="this.$store.state.mangerChartShow" :job-id="jobId" :job-name="jobName" :transfer-data="transferData" :default-entry="defaultEntry" :parent-this="this"></detail-chart>

	</div>
</template>

<script>

	import url from '../../../url/urls.js';
	import commonFun from '../common.js';

	import detailChart from './detailChart';
	import ajaxData from './ajaxData.js';

	const ObjCopy = commonFun.ObjCopy;
 	const PostAjax = commonFun.PostAjax;
 	const RequestError = commonFun.RequestError;

 	const getTransferData = ajaxData.getTransferData;
 	const getChartData = ajaxData.getChartData;

  	const urls = url.taskMange;

	export default{
		name:'manger',
		data(){
			return {
				jobId:'',
				jobName:'',
				detailShow:false,
				noStartItem:false,
				noStopItem:false,
				dialogDiv:false,
				actionType:'',
				totalnum:0,
				succnum:0,			//成功的格式
				succDetails:'',		//成功的任务详情
				failnum:0,			//失败的格式
				failDetails:'',     //失败的任务详情
				inputVal: '',
				mangerData:[],
				pageChangeSelectionArr:[],   //翻页时已经被点击的
				newestSelection:[],      //当前页最新被点击的
				oldPage:'',
				newPage: '',
				searchText:'',
				redNotice:false,
				showPopLayer:false,
				popClass: 'showItem',

				//图表数据
				transferData: '',
				defaultEntry:''
			}
		},
		created(){
			//页数归为初始化
			
			this.$store.dispatch('resetManagerCurrPage',1);
			this.$store.dispatch('resetManagerPageSize',20);

		},
		watch:{
			"$store.state.mangerPagitation.currPage": function(newVal, oldVal){
				this.oldPage = oldVal;
				this.newPage = newVal;
			},
			"inputVal": function(newVal, oldVal){

				const MAXLEN = 128;

				if(newVal.length < MAXLEN){
					this.redNotice = false;
				}else if(newVal.length > MAXLEN){
					this.redNotice = true;
				}
			}
		},
		mounted(){

			this.$nextTick(() => {
				this.getMangerData();
			})

		},
		updated(){
			//实例更新, 打钩
			if(this.oldPage !== this.newPage){
				this.hasSelected();
			}
			
		},
		methods:{
			getMangerData(){

				let currPage =  this.$store.state.mangerPagitation.currPage;
				let currperItem = this.$store.state.mangerPagitation.pageSize;

				//let param = {pageIndex: this.$store.state.mangerPagitation.currPage, perItem: this.$store.state.mangerPagitation.pageSize, searchText: this.searchText};

				let param = {
	    			page:{
	    				pageLine: currperItem,
	    				pageNum: currPage
	    			},
	    			condition:{
	    				searchText: this.searchText
	    			}
	    		}

	    		param.condition.searchText = param.condition.searchText.replace(/(^\s*)|(\s*$)/g,'');

	    		this.$store.dispatch('addLoadingCover',true);

				let promise = PostAjax(urls.manger,param);

				promise.done((res) => {

					res = typeof(res) === 'string' ? JSON.parse(res) : res;

					this.$store.dispatch('addLoadingCover',false);

					let code = res.code;
					let message = res.message;

					if(code === 0){
						//总数量, 总数据
						if(res.total !== undefined){
							this.$store.dispatch('resetManagerTotalItem',res.total);
							this.$store.dispatch('resetManagerTableData',res.result);
						}
						
					}else{
						RequestError(this,message);
					}
				});
				promise.fail((res) => {

					this.$store.dispatch('addLoadingCover',false);

					let message = '服务器异常,请稍后刷新';
     				RequestError(this,message);

					//console.warn("manger error");
				})
			},
			/*页数点击*/
			handleCurrentChange(val){

				this.$store.dispatch('resetManagerCurrPage',val);

				this.pageChangeSelectionArr = this.pageChangeSelectionArr.concat(this.newestSelection);
				this.newestSelection = [];

				//拼接
				val === 1 ? this.getMangerData() : this.getMangerData();

		    },
		    //当前页之前勾选的打钩
		    hasSelected(){
		    	let mangerData = this.$store.state.mangerDatas;
				let clickCurrPageSelect = this.pageChangeSelectionArr;

				if(clickCurrPageSelect.length !== 0){

					clickCurrPageSelect.filter((val,index) => {
						for(let i = 0; i < mangerData.length; i++){
							if(val.id === mangerData[i].id){
								this.$refs.multipleTable.toggleRowSelection(this.$store.state.mangerDatas[i]);
								return;
							}
						}
					})
				}
		    },
		     /*每页的数量分布*/
		    handleSizeChange(val){

		     	this.$store.dispatch('resetManagerPageSize',val);

		     	this.$store.state.mangerPagitation.currPage === 1 ? this.getMangerData() : this.$store.dispatch('resetManagerCurrPage',1);//手动刷新到第一页
		 
		    },
		    /*单个点击, 单行*/
		    selectOneFun(selection, row){

		    	let exist = selection.every((v,i) => {
		    		return row.id !== v.id
		    	});

		    	let hasSelected = this.pageChangeSelectionArr;

		    	//true 重复，需要取消
		    	//false 没有重复，需要删除.
		    	if(exist){
		    		//取消打钩
		    		for(let i = 0; i < hasSelected.length; i++){
		    			if(hasSelected[i].id === row.id){
		    				hasSelected.splice(i,1);
		    				return;
		    			}
		    		}

		    		this.pageChangeSelectionArr = hasSelected;

		    	}else{
		    		//当前页打钩
		    		this.newestSelection = selection;
		    	}
		    },
		    //全选
		    selectAllFun(selection){
		    	//将已经存在的移除，直接把现在全选的存入
		    	//若 selection 为空则就是取消全新
		    	if(selection.length === 0){

		    		//取消全选  mangerData 全部取消
		    		let mangerDatas = this.$store.state.mangerDatas;
		    		let noRepeactSelected = this.selectAllCommon();
		    		this.newestSelection = [];                     //当前页选择制空

		    		//防止 undefined 的出现
		    		noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;

		    		this.pageChangeSelectionArr = noRepeactSelected;

		    	}else{

		    		//全选, 删除存在列表的拼接不存在的
		    		let mangerDatas = this.$store.state.mangerDatas;
		    		let noRepeactSelected = this.selectAllCommon();
		    		this.newestSelection = [];                       //当前页选择制空

		    		//防止 undefined 的出现
		    		noRepeactSelected = noRepeactSelected === undefined ? [] : noRepeactSelected;
		    		this.pageChangeSelectionArr = mangerDatas.concat(noRepeactSelected);

		    	}
		    },
		    //全选和取消全新公共方法封装
		    selectAllCommon(){

		    	let hasSelected = ObjCopy(this.pageChangeSelectionArr);

		    	let mangerDatas = this.$store.state.mangerDatas;

		    	for(var i = hasSelected.length-1; i >=0; i--){
	    			for(var k = 0; k < mangerDatas.length; k++){
	    				if(hasSelected[i].id == mangerDatas[k].id){
	    					hasSelected.splice(i,1);
	    					break;
	    				}
	    			}
	    		};

	    		//防止 undefined 的出现
	    		hasSelected = hasSelected === undefined ? [] : hasSelected;

	    		return hasSelected;
		    },
		    //单个执行，结束的公共函数
		    singleActionCommon(url,param,actionType){

		    	var param = {job: param};

		    	this.$store.dispatch('addLoadingCover',true);

		    	let promise = PostAjax(url,param);

				promise.done((res) => {

					this.$store.dispatch('addLoadingCover',false);

					res = typeof(res) === 'string' ? JSON.parse(res) : res;

					let message = res.message;
					let code = res.code;

					this.newestSelection = [];   //清除当前页的选择
					this.pageChangeSelectionArr = [];   //清除所有选择的

					if(code === 0){

						this.$confirm(message,'提示',{
					        confirmButonText:'确认',
					        showCancelButton:false,
					        type:'success',
					    }).then( ()=> {
					    	 this.closeLayer();
					    	//this.$store.state.mangerPagitation.currPage === 1 ? this.getMangerData() : this.$store.dispatch('resetManagerCurrPage',1);
					    }).catch(()=>{
					    	 this.closeLayer();
					    });

					}else{

						this.$store.dispatch('addLoadingCover',false);

						//失败的情况, 关闭所有的打钩
						this.$refs.multipleTable !== undefined ? RequestError(this,message,this.$refs.multipleTable.clearSelection) : RequestError(this,message);
					}
				})

				promise.fail((res) => {
					
					this.$store.dispatch('addLoadingCover',false);

					let message = '服务器异常,请稍后刷新';
					//失败的情况, 关闭所有的打钩
					this.$refs.multipleTable !== undefined ? RequestError(this,message,this.$refs.multipleTable.clearSelection) : RequestError(this,message);

				})
		    },
		    //批量执行的公共函数
		    barchActionCommon(url,param,actionType){

		    	var param = {jobs: param};

		    	this.$store.dispatch('addLoadingCover',true);

		    	let promise = PostAjax(url,param);

				promise.done((res) => {

					this.$store.dispatch('addLoadingCover',false);

					res = typeof(res) === 'string' ? JSON.parse(res) : res;

					let message = res.message;
					let code = res.code;

					if(code === 0){
						let result = res.result;

						// this.dialogDiv = true;
						this.actionType = actionType;

						let type = 'success';

						this.confirmPopBox(type, actionType, result);

						this.newestSelection = [];
						this.pageChangeSelectionArr = [];


					}else{

						this.$refs.multipleTable !== undefined ? RequestError(this,message,this.$refs.multipleTable.clearSelection) : RequestError(this,message);
					}
				})

				promise.fail((res) => {
					
					this.$store.dispatch('addLoadingCover',false);

					let message = '服务器异常,请稍后刷新';
					this.$refs.multipleTable !== undefined ? RequestError(this,message,this.$refs.multipleTable.clearSelection) : RequestError(this,message);

					//console.log("request error");
				})
		    },
		    //点击确认后弹出框的信息
		    confirmPopBox(type, title, result){

		        //  let Sflag="";
		        // let Flag="";
		        // result.succnum>0 ? Sflag=":" : Sflag="";
		        // result.failnum>0 ? Flag=":" : Flag="";

		        let totalmsg = '总共：' + result.totalnum + '个';

		         let succmsg = '成功：' + result.succnum + '个'
		         let succmsgs=result.succ.join(",");
		        let failmsg = '失败：' + result.failnum + '个'
		         let failmsgs= result.fail.join(",");

		        const h = this.$createElement;

		        this.$msgbox({
		          title: title,
		          message: h('div',null,[
		            h('p', null, totalmsg),
		            h('p', null, succmsg),
		            h('p', {style:'color:#13ce66'}, succmsgs),
		            h('p', null, failmsg),
		            h('p', {style:'color:#ff4949'}, failmsgs)
		          ]),
		          confirmButonText: '确认',
		          showCancelButton:false,
		          // type: type

		        }).then(() => {

		            this.closeLayer();

		        }).catch(() => {

		           this.closeLayer();
		        })
		     },
		    //单个开始
			singleStart(val,status){

				let param = {id:val.id, name: val.name};

				let actionType= "任务执行";

				if(status == '执行'){

					// let message = "任务正在执行中，请先停止再执行";
					
					// RequestError(this,message);

				}else{
					this.singleActionCommon(urls.mangerSingleStart,param,actionType)
				}

			},
			//单个停止
			singleStop(val,status){

				let param = {id:val.id, name: val.name};

				let actionType= "任务停止";

				if(status == '停止'){

					// let message = "当前状态为停止，该操作无效";
					// RequestError(this,message);

				}else{
					this.singleActionCommon(urls.mangerSingleStop,param,actionType)
				}

			},
			batchCommon(actionType,url){

				this.oldPage = this.newPage;   //只有page 发生改变时才能触发，当前页之前打钩的打钩

				let selectAll = this.newestSelection.concat(this.pageChangeSelectionArr);

				//数据整理发送后台
				let param = [];

				if(selectAll.length !== 0){

					// this.noStartItem = true;
					// this.noStopItem = true;
					// this.noStartItem = false;
					// this.noStopItem = false;	

					//this.showPopLayer = true;  //关闭弹出框
					this.popClass = 'closeItem';

					selectAll.forEach((v,i) => {
						let paramItem = {id: v.id, name: v.name};
						param.push(paramItem);
					})

					this.barchActionCommon(url,param,actionType);

				}else{

					this.popClass = 'showItem';

				}
			},
			/*批量执行*/
			batchAction(){

				let url = urls.mangerBatchStart;

				this.batchCommon("批量执行",url);
			},
			/*批量停止*/
			batchStop(){

				let url = urls.mangerBatchStop;

				this.batchCommon("批量停止",url);
			},
			searchClick(){

				this.searchText = this.inputVal;

				this.newestSelection = [];
				this.pageChangeSelectionArr = [];

				//每页显示的条数回到最初的20个
			//	this.$store.dispatch('resetManagerPageSize',20);

				this.$store.state.mangerPagitation.currPage === 1 ? this.getMangerData() : this.$store.dispatch('resetManagerCurrPage',1);//手动刷新到第一页

			},
			//详情
			detailsFun(val){

				let status = val.status;
				if(status !== '停止'){
					//打开窗口
					getTransferData(this,urls.mangerTransfer,urls.mangerChart,val,this.detailOpen);
					//传值.
					this.jobId = val.id;
					this.jobName = val.name;
				}
				
				
				
			},
			detailOpen(){
				this.$store.dispatch('mangerChartShow',true);
			},
			//执行成功后，再次刷新数据
			closeLayer(){

				//类似刷新
				this.$store.state.mangerPagitation.currPage === 1 ? this.getMangerData() : this.$store.dispatch('resetManagerCurrPage',1);//手动刷新到第一页
			}
		},
		components:{
			'detail-chart':detailChart
		}
	}
</script>