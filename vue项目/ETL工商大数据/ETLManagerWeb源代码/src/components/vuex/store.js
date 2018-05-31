import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import url from '../../url/urls.js'
import global from '../global/global.js'
var qs = require('qs');
Vue.use(Vuex)
const nodeUrl=url.nodeMange
const state={
	tabClickIndex:0,
	//表格数据
	tableData:[],
	//每页显示的行数
	pageLine:10,
	//当前页码数
    pageNum:1,
    //总条数
    totalNum:0,
    //搜索数据量
    searchData:[],
    //搜索成功标识
    searchFlag:0,
    //对在线离线转换
    currentType:"",
    //将端口号转换成数字
    Port:"",
    // 将ip转换成数字
    ipNumber:"",
     //遮罩
    fullscreenLoading:false,
    //是删除input框中的
    deleteInput:"",
    //状态
    code:0,
	//任务管理*******************************************************
	strageDatas:null,
	stragePagitation:{
		pageSizeArr: [20,30,40],
		currPage:1,
		totalItem: 0,
		pageSize: 20
	},
	strAddNew:{
		layShow:false,
	},
	strRevise:{
		layShow:false,
	},
	dutyData:[],
	//关联任务
	dutyChain:{
		layShow: false,
		pagitation:{
			pageSizeArr: [20,30,40],
			currPage:1,
			totalItem: 0,
			pageSize: 20
		}
	},
	//查看关联
	queryChain:{
		layShow: true,
		pagitation:{
			pageSizeArr: [20,30,40],
			currPage:1,
			totalItem: 0,
			pageSize: 20
		}
	},
	//任务管理
	mangerDatas:null,
	mangerPagitation:{
		pageSizeArr: [20,30,40],
		currPage:1,
		totalItem: 0,
		pageSize: 20
	},
	mangerChartShow:false,      //图标的遮罩层
	loadingCover: false,
	chartData:''

};
//发生变化时
const getters={    
     tableData:state=>state.tableData,
     pageLine:state=>state.pageLine,
     pageNum:state=>state.pageNum,
     totalNum:state=>state.totalNum,
     searchData:state=>state.searchData,
     searchFlag:state=>state.searchFlag,
     currentType:state=>state.currentType,
     Port:state=>state.Port,
     ipNumber:state=>state.ipNumber,
     fullscreenLoading:state=>state.fullscreenLoading,
     deleteInput:state=>state.deleteInput,
     code:state=>state.code


};
const mutations={
	SHOW_TABLE(state,data){
		state.tableData=data
	},
	TOTAL_NUM(state,data){
		state.totalNum=data;
	},
	SEARCH_FLAG(state,data){
		state.searchFlag=data
	},
	CURRENT_TYPE(state,data){
		state.currentType=data
	},
	PORT(state,data){
		state.Port=data
	},
	IP_NUMBER(state,data){
		state.ipNumber=data
	},
	FULL(state,data){
		state.fullscreenLoading=data
	},
	DELETE_INPUT(state,data){
        state.deleteInput=data
	},
	CODE(state,data){
		state.code=data
	},
	MESSAGE(state,data){
		state.message=data
	},
	//任务管理*******************************************************
	//任务配置策略
	strategy_pageSize(state,pageSize){
		state.stragePagitation.pageSize = pageSize;
	},
	strategy_crrPage(state,currPage){
		state.stragePagitation.currPage = currPage;
	},
	strategy_data(state,data){
		state.strageDatas = data.datas;
		state.stragePagitation.totalItem = data.totalItem;
	},
	strategy_new(state,data){
		let type = data.type;

		if(type === 'open'){   //打开
			state.strAddNew.layShow = true;
		}else{  //关闭遮罩层
			state.strAddNew.layShow = false;
		}
	},
	strategy_revise(state,data){

		let type = data.type;

		if(type === 'open'){   //打开
			state.strRevise.layShow = true;
		}else{  //关闭遮罩层
			state.strRevise.layShow = false;
		}
	},
	dutyChain_data(state,data){
		state.dutyData = data;
	},
	//任务关联： 查看关联
	dutyChain_showLayer(state,data){
		let type = data.type;
		state.dutyChain.layShow = type === 'open' ? true : false;
	},
	dutyChain_currPage(state,data){
		state.dutyChain.pagitation.currPage = data;
	},
	dutyChain_pageSize(state,data){
		state.dutyChain.pagitation.pageSize = data;
	},
	dutyChain_totalItem(state,data){
		state.dutyChain.pagitation.totalItem = data;
	},
	//任务管理部分
	manager_tableData(state, data){
		state.mangerDatas = data;
	},
	manager_totalItem(state, totalItem){
		state.mangerPagitation.totalItem = totalItem;
	},
	manager_crrPage(state, currPage){
		state.mangerPagitation.currPage = currPage;
	},
	manager_pageSize(state, pageSize){
		state.mangerPagitation.pageSize = pageSize;
	},
	manager_chartShow(state,chartShow){
		state.mangerChartShow = chartShow;
	},
	addLoading_Cover(state, status){
		//true, false
		state.loadingCover = status;
	},
	//点击的第几个,index
	tab_ClickIndex(state,index){
		state.tabClickIndex = index;
	},
	add_chartData(state,data){
		state.chartData = data;
	}
};

var type = 'POST';

const actions={
	//表格数据
	getshowTable({commit}, params){
		commit("FULL",true);
		 axios({
		      method: type,
		      url: nodeUrl.nodeUrl,
		      data:params.params,
		    
		      // timeout: 10000,
		      // data:qs.stringify(params),
		      // headers:{'Content-Type': 'application/x-www-form-urlencoded'}
		    }).then(function(res){
		    	console.log("///////////////",res);
		    	commit("FULL",true);
		    	var arrData=res.data.datas;
		    	let messs=res.data.status;	    	
		     	if(res.data.code===200){
		     		commit("FULL",false);
					arrData.map(function(v,i){
						if(v["status"]===0){
							v["status"]="在线"
						   }else if(v["status"]===1){
						   	v["status"]="离线"
						   }else if(v["status"]===2){
						   	v["status"]="----"
						   }
						  if(v["createTime"]){
						   	  v["createTime"]=v["createTime"].slice(0,v["createTime"].length-2);
						   }
						   return v;	
					})
						 commit('SHOW_TABLE',arrData);
						 commit('TOTAL_NUM',res.data.totalNum);
						 commit('SEARCH_FLAG',res.data.code);
				}else if(res.data.code===201){
					     commit("FULL",false);
					     global.RequestError(params.this,messs);
				}else{
					     global.RequestError(params.this,"服务器异常，请稍后刷新");
                         commit("FULL",false);
				} 
		    }).catch(function(err){
		    	commit("FULL",false);
		    	console.log("*************",err)
		        global.RequestError(params.this,"服务器异常，请稍后刷新");
		    })

   },
    //对在线离线转换
    getCurrentType({commit}, params){
            if(params==="在线"){
                params=0;
            }else if(params==="离线"){
                params=1;
            }else if(params==="----"){
            	params=2;

            }else if(params==="" || params==="请选择所有"){
            	params=-1;
           }
           commit('CURRENT_TYPE',params);
		    
    },
    //将端口号转换成数字
    getPort({commit}, params){
    	if(params===""){
    		params=-1
    	}else if(!isNaN(params)){
    		params=Number(params);
    	}else if(isNaN(params)){
    		params=-2
    	}

    	 commit('PORT',params);
    },

    // 将ip转换成数字
    getIPnumber({commit},params){
    	let arr=params.split(".");
    	let ipnumber='';
    	let newarr=arr.map(function(v,i){
    		return Number(v);
    	});
    	ipnumber=newarr.join(".");
         commit('IP_NUMBER',ipnumber);
    },
    //删除deleteinput
    getDeleteInput({commit}, params){
    	params="";
    	commit('DELETE_INPUT',params);
    },
    //遮罩
     fullScreen({commit}, params){
		commit('FULL',params);
	},
	//任务管理*******************************************************
	resetStrCurrPage(context,newVal){
		context.commit('strategy_crrPage',newVal);
	},
	resetStrPageSize(context,newVal){
		context.commit('strategy_pageSize',newVal);
	},
	//策略配置
	resetStrData(context,newVal){
		context.commit('strategy_data',newVal);
	},
	resetStrDataAndTotalItem(context,newVal){
		context.commit('strategy_data',newVal);
	},
	addStreviseMessage(context,newVal){
		context.commit('strategy_new',newVal);
	},
	resetStreviseMessage(context,newVal){
		context.commit('strategy_revise',newVal);
	},
	resetDutyChainData(context,newVal){
		context.commit('dutyChain_data',newVal);
	},
	//关联任务； 查看关联
	resetDutyChainCurrPage(context,newVal){
		context.commit('dutyChain_currPage',newVal);
	},
	resetDutyChainPageSize(context,newVal){
		context.commit('dutyChain_pageSize',newVal);
	},
	resetDutyChainTotalItem(context,newVal){
		context.commit('dutyChain_totalItem',newVal);
	},
	dutyChainShow(context,newVal){
		context.commit('dutyChain_showLayer',newVal);
	},
	//任务管理
	resetManagerTableData(context,newVal){
		context.commit('manager_tableData',newVal);
	},
	resetManagerTotalItem(context,newVal){
		context.commit('manager_totalItem',newVal);
	},
	resetManagerCurrPage(context,newVal){
		context.commit('manager_crrPage',newVal);
	},
	resetManagerPageSize(context,newVal){
		context.commit('manager_pageSize',newVal);
	},
	mangerChartShow(context,newVal){
		context.commit('manager_chartShow',newVal);
	},
	addLoadingCover(context, newVal){
		context.commit('addLoading_Cover',newVal);
	},
	//首页添加点击tab
	resetTabClickIndex(context,newVal){
		context.commit('tab_ClickIndex',newVal);
	},
	resetChartData(context,newVal){
		context.commit('add_chartData',newVal);
	}
   
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
