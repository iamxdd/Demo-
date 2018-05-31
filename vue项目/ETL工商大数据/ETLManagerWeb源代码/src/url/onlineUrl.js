var url = {
	topBar:basePath + "rankingsAnalysisPages/getCityRankings.action"
	//首页接口
	homeIndex:{
	// 折线图
	blockdataUrl:"homepage/blockdata",
	// 饼图
	overviewdataUrl:"homepage/overviewdata",
	},
	//节点管理接口
	nodeMange:{
		//表格
        nodeUrl:"nodemanager/init",
        //增加
        nodeAddUrl:"nodemanager/add",
        //编辑
        nodeEditUrl:"nodemanager/edit",
        //删除
        nodeDeletUrl:"nodemanager/del",
        //查询
        nodeSearchUrl:"nodemanager/search",
        //刷新
        nodeFreshUrl:"nodemanager/updateStatus"
	}
}
export default url;