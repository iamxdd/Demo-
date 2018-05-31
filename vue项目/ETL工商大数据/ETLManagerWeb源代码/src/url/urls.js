// var basePath = "/static/mockJson/";
// var homeBase=basePath+'homeIndex/';
// var nodeBase=basePath+'nodeMange/';
// var desBase=basePath+'desMange/';


// var strOnline = basePath + 'taskMange/strfile/';
// var strBase = basePath + 'taskMange/strfile/';
// var jobMangerBase = basePath + 'taskMange/mangerfile/';

// var url = {
// 	homeIndex:{
// 		// 折线图
// 		blockdataUrl:homeBase+"blockdata.json",
// 		// 饼图
// 		overviewdataUrl:homeBase+"overviewdata.json"
// 	},
// 	designer:{
// 	  desurl:desBase+"url.json"
// 	},
// 	nodeMange:{
// 		//表格
//         nodeUrl:nodeBase+"node.json",
//         //增加
//         nodeAddUrl:nodeBase+"add.json",
//         //编辑
//         nodeEditUrl:nodeBase+"edit.json",
//         //删除
//         nodeDeletUrl:nodeBase+"delete.json",
//         //查询
//         nodeSearchUrl:nodeBase+"search.json",
//         //刷新
//         nodeFreshUrl:nodeBase+"fresh.json"
// 	},
// 	//任务管理
// 	taskMange: {

// 		logLevel: strBase + 'logLevel.json',

// 		online: strOnline + 'online.json',        //获取远程节点信息

// 		strageList:strBase + "strageList.json",   //获取策略列表

// 	  	openStrage: strBase + "openStrage.json",    //打开策略

// 		addNewStr: strBase + 'addNewStr.json',	       //新增策略

// 	  	sendDeleteStr: strBase + 'sendDeleteStr.json',  //删除策略

// 	  	unrelationJobRequest: strBase + 'unrelationJobRequest.json',   //获取未关联的策略 

// 	  	queryRelationReq: strBase + 'queryRelationReq.json',   //查看已关联任务

// 		singleChainJob:  strBase +'singleChainJob.json',   //单个关联任务

// 	    batchChainJob:  strBase + 'batchChainJob.json',     //批量关联任务

// 	    singleRelieveJob: strBase + 'singleRelieveJob.json',   //单个 解除关联

// 	    batchRelieveJob: strBase + 'batchRelieveJob.json',    //批量解除关联

// 		//修改策略
// 		modifyStr: strBase + 'modifyStr.json',   //提交修改策略

// 		//任务管理
// 		manger: jobMangerBase + 'manger.json',  //获取任务列表

// 		mangerSingleStart: jobMangerBase + 'mangerSingleStart.json',    //

// 		mangerSingleStop: jobMangerBase + 'mangerSingleStop.json',    //结束任务

// 		mangerBatchStart: jobMangerBase + 'mangerBatchStart.json',    //批量启动任务

// 		mangerBatchStart: jobMangerBase + 'mangerBatchStart.json',    //批量启动任务

// 	 	mangerBatchStop: jobMangerBase + 'mangerBatchStop.json',    //批量停止任务

// 		mangerChart: jobMangerBase + 'mangerChart.json',      //任务详情，图标

// 		mangerTransfer: jobMangerBase + 'mangerTransfer.json',

// 		//获取历史
// 		historyTime: jobMangerBase + 'historyTime.json',   //获取历史默认时间
	  	
// 	  	historyData: jobMangerBase + 'historyData.json',   //获取历史任务
// 	}
// }


var homeBase='/ETLManager/homepage/';
var strOnline = '/ETLManager/nodemanager/';
var strBase = '/ETLManager/ExecutionStrategy/';
var jobMangerBase = '/ETLManager/JobManager/';
var nodeBase='/ETLManager/nodemanager/';


var url={

	 //判断是否超时
	 timeOut:{
        istimeout:"heartbeat/check"
	 },
	
	 //首页接口
	 homeIndex:{
	 // 折线图
	 blockdataUrl:homeBase+"blockdata",
	 // 饼图
	 overviewdataUrl:homeBase+"overviewdata"
	 },
	//节点管理接口
	nodeMange:{
		//初始化所有数据/数据刷新
        nodeUrl:nodeBase+"flush",
        //增加
        nodeAddUrl:nodeBase+"add",
        //编辑
        nodeEditUrl:nodeBase+"modify",
        //删除
        nodeDeletUrl:nodeBase+"del",
        //状态刷新
        nodeFreshUrl:nodeBase+"updateStatus"
	},
	//设计器
	designer:{
	   desurl:"/ETLManager/kettle-url"
	},
	taskMange: {

	  logLevel: strBase + 'logLevel',
	
	  online: strOnline + 'online',        //获取远程节点信息
	  
	  strageList:strBase + "list",   //获取策略列表

	  openStrage: strBase + "open",    //打开策略

	  addNewStr: strBase + 'add',	       //新增策略

	  sendDeleteStr: strBase + 'del',  //删除策略

	  unrelationJobRequest: strBase + 'unrelationJobs',   //获取未关联的策略 

	  queryRelationReq: strBase + 'queryRelation',   //查看已关联任务

	  singleChainJob:  strBase + 'singleRelation',   //单个关联任务

	  batchChainJob:  strBase + 'relation',    //批量关联任务

	  singleRelieveJob: strBase + 'singleRelieve',   //单个解除关联

	  batchRelieveJob: strBase + 'relieve',   //批量解除关联任务

	  modifyStr: strBase + 'modify',   //修改策略

	  //任务管理
	  manger: jobMangerBase + 'list',  //获取任务列表

	  mangerSingleStart: jobMangerBase + 'singleRun',    //启动任务

	  mangerSingleStop: jobMangerBase + 'singleStop',    //停止任务

	  mangerBatchStart: jobMangerBase + 'run',    //批量启动任务

	  mangerBatchStop: jobMangerBase + 'stop',    //批量停止任务

	  mangerChart: jobMangerBase + 'details',      //任务详情, 图标

	  mangerTransfer: jobMangerBase + 'entrylist',

	  //获取历史
	  historyTime: jobMangerBase + 'historyTime',   //获取历史默认时间

	  historyData: jobMangerBase + 'history',   //获取历史任务
	 
	}
}	

export default url;