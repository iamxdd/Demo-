<template>
	<div>
		<div class="historyDiv">
			<p>
				<span class="verticalAlign">开始时间：</span>
				<el-date-picker placeholder="YYYY-MM-DD hh:mm:ss" type="datetime" v-model="start" size="small" :editable="false" class="verticalAlign"></el-date-picker>
				<span class='dash verticalAlign'></span>
				<span class="verticalAlign">结束时间：</span>
				<el-date-picker placeholder="YYYY-MM-DD hh:mm:ss" type="datetime" v-model="end" size="small" :editable="false" class="verticalAlign"></el-date-picker>
				<el-button type="primary" icon="search" @click.stop="searchClick()" size="small" class="searchMargin verticalAlign">查询</el-button>
				<span class="rednote verticalAlign" v-if="timeNoted">结束时间必须大于开始时间，且不能为空</span>
			</p>

			<div class="tableGation">
				<div class="showTable">

					<div>历史任务</div>
	
					<el-table :data="historyData" stripe tooltip-effect="dark" style="width:100%" height="80%">
						<!-- <el-table-column v-for="item in columArr" :prop="item.id" :label="item.label" :width="200" :key="item.id"></el-table-column> -->

						<el-table-column v-for="item in columName" :label="item.label" :key="item.id" :width="150">
							<template scope="scope">
								<span :title="scope.row[item.id]" class="limitedWidth">{{scope.row[item.id]}}</span>
							</template>	
						</el-table-column>

						<el-table-column v-for="item in columTime" :label="item.label" :key="item.id" :width="180">
							<template scope="scope">
								<span :title="scope.row[item.id]" class="limitedWidth">{{scope.row[item.id]}}</span>
							</template>	
						</el-table-column>

						<el-table-column v-for="item in columPut" :label="item.label" :key="item.id" :width="110">
							<template scope="scope">
								<span :title="scope.row[item.id]" class="limitedWidth">{{scope.row[item.id]}}</span>
							</template>	
						</el-table-column>

						<el-table-column v-for="item in columDesc" :label="item.label" :key="item.id" :width="250" >
							<template scope="scope">
								<span :title="scope.row[item.id]" class="limitedWidth">{{scope.row[item.id]}}</span>
							</template>	
						</el-table-column>

						<el-table-column v-for="item in columStatus" :label="item.label" :key="item.id" :width="110">
							<template scope="scope">
								<span :title="scope.row[item.id]" class="limitedWidth">{{scope.row[item.id]}}</span>
							</template>	
						</el-table-column>

					</el-table>
					<div class="pagation">
						<el-pagination layout="total, prev, pager, next, sizes, jumper" :total="totalItem" :current-page="currPage" :page-size="perItem" :page-sizes="[20,30,40]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
					</div>
				</div>
				
			</div>

			
		</div>
	</div>
</template>

<script>

	import moment from 'moment';

	import url from '../../../url/urls.js';
	import commonFun from '../common.js';

	const ObjCopy = commonFun.ObjCopy;
  	const PostAjax = commonFun.PostAjax;
  	const GetAjax = commonFun.GetAjax;
  	const RequestError = commonFun.RequestError;

	const urls = url.taskMange;

	const columName = [
		{id:"name", label:"任务名称"}
	];

	const columTime = [
		{id:"starttime", label:"开始时间"},
		{id:"stoptime", label:"结束时间"}
	]

	const columPut = [
		{id:"input", label:"输入"},
		{id:"output", label:"输出"},
		{id:"error", label:"错误"},
		{id:"execMode", label:"执行模式"}
	]

	const columDesc = [
		{id:"execNode", label:"执行描述"},
	]

	const columStatus = [
		{id:"status", label:"状态"},
		{id:"message", label:"消息"},
		{id:"speed", label:"速度"}
	]



	// const columArr = [
 //   		{id:"name", label:"任务名称"},
	// 	{id:"starttime", label:"开始时间"},
	// 	{id:"stoptime", label:"结束时间"},
	// 	{id:"input", label:"输入"},
	// 	{id:"output", label:"输出"},
	// 	{id:"error", label:"错误"},
	// 	{id:"execMode", label:"执行模式"},
	// 	{id:"execNode", label:"执行描述"},
	// 	{id:"status", label:"状态"},
	// 	{id:"message", label:"消息"},
	// 	{id:"speed", label:"速度"}
	// ];

	export default{
		data(){
			return {
				start:'',
				end: '',
				totalItem:0,
				currPage: 1,
				perItem:20,
				//columArr:columArr,
				columName: columName,
				columTime: columTime,
				columPut: columPut,
				columDesc: columDesc,
				columStatus: columStatus,

				historyData:[],
				start:[new Date(+new Date()-7*24*60*60*1000)],   //自动提前7天
				end:[new Date()],
				searchStart: '',
				searchEnd: '',
				timeNoted: false
			}
		},
		create(){
			this.currentPage = 1;
			this.perItem = 20;
		},
		mounted(){
			this.$nextTick(() => {
				this.getInitTime();
			})
		},
		methods:{
			getInitTime(){

				this.$store.dispatch('addLoadingCover',true);

				let promise = GetAjax(urls.historyTime);

				promise.done((res) => {

					res = typeof(res) === 'string' ? JSON.parse(res) : res;

					let code = res.code;
					let message = res.message;

					if(code === 0){
						let result = res.result;
						this.start = result.startime;
						this.end = result.stoptime;
						//获取历史数据
						//
						
						this.searchStart = this.start;
						this.searchEnd = this.end;

						let pageType = 'refresh';

						this.timeCheck(pageType,this.getHistoryData);

					}else{

						this.$store.dispatch('addLoadingCover',false);
						RequestError(this,message);
					}
				})

				promise.fail((res) => {
					this.$store.dispatch('addLoadingCover',false);

					let message = '服务器异常,请稍后刷新';
     				RequestError(this,message);
					//console.warn("initTime error")
				})
			},
			getHistoryData(getType){
				// let param = {
				// 	startime: this.start,
				// 	endtime: this.end,
				// 	pageIndex:this.currPage,
				// 	perItem: this.perItem
				// };
				// 

				this.$store.dispatch('addLoadingCover',true);

				let param = {
	    			page:{
	    				pageLine: this.perItem,
	    				pageNum: this.currPage
	    			},
	    			condition:{
	    				startime: moment(new Date(this.searchStart)).format('YYYY-MM-DD HH:mm:ss'),
	    				endtime: moment(new Date(this.searchEnd)).format('YYYY-MM-DD HH:mm:ss')
	    			}
	    		}

				let promise = PostAjax(urls.historyData, param);

				promise.done((res) => {

					res = typeof(res) === 'string' ? JSON.parse(res) : res;

					this.$store.dispatch('addLoadingCover',false);
					
					let code = res.code;
					let message = res.message;

					if(code === 0){
						let result = res.result;

						if(res.total !== undefined){
							this.totalItem = res.total;
							this.historyData = result;
						}

					}else{
						RequestError(this,message);
					}
				});

				promise.fail((res) => {
					this.$store.dispatch('addLoadingCover',false);

					let message = '服务器异常,请稍后刷新';
     				RequestError(this,message);
					//console.warn("request error")
				})

			},
			//页码更改
			handleCurrentChange(val){
				this.currPage = val;
				this.getHistoryData();
			},
			//改变每页条数
			handleSizeChange(val){
				this.perItem = val;

				this.currPage === 1 ? this.getHistoryData() : this.currPage = 1;
				/*this.getHistoryData();*/
			},
			//时间搜索
			searchClick(){
				//刷新

				this.searchStart = this.start;
				this.searchEnd = this.end;

				let pageType = 'refresh'

				this.timeCheck(pageType, this.getHistoryData);


			},
			timeCheck(pageType,callback){

				let startCuo = new Date(this.searchStart).getTime();
				let endCuo = new Date(this.searchEnd).getTime();


				if(this.searchStart !== undefined && this.searchEnd !== undefined && this.searchStart !== '' && this.searchEnd !== ''){

					if(startCuo > endCuo){
						this.timeNoted = true;   //红色提示
					}else{

						this.timeNoted = false;

						if(pageType == 'refresh'){

							//this.perItem = 20;
							this.currPage === 1 ? callback() : this.currPage = 1;

						}else{
							//条件正常
							callback();
						}

						
					}

				}else{
					this.timeNoted = true;
				}
			}

		}
	}
</script>