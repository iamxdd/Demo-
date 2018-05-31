/**
 * [服务端API URL枚举]
 * @type {Object}
 */
let Apis;

if (process.env.NODE_ENV === 'development') {
	Apis = {

		//----------------------Patrick----------------------------
		SAVE_TEMPLATE: 'http://localhost:8081/miipm/kqiAnalysis/saveTemplate.action',
		GET_TEMPLATE: 'http://localhost:8081/miipm/kqiAnalysis/loadTemplate.action',
		DELETE_TEMPLATE: 'http://localhost:8081/miipm/kqiAnalysis/deleteTemplate.action',
		GET_KQI: 'http://localhost:8081/miipm/kqiAnalysis/kqiList.action',
		GET_FILTER_VALUE: 'http://localhost:8081/miipm/kqiAnalysis/filterDataByType.action',
		GET_OTHER_FILTER: 'http://localhost:8081/miipm/kqiAnalysis/filterData.action',
		GET_KQI_CHART: 'http://localhost:8081/miipm/kqiAnalysis/dataQuery.action',
		GET_KQI_GRID: 'http://localhost:8081/miipm/kqiAnalysis/listDataQuery.action',
		GET_FILTER_RELATIVE: 'http://localhost:8081/miipm/kqiAnalysis/filterLinkageData.action',
		SEARCH_FILTER: 'http://localhost:8081/miipm/kqiAnalysis/filterFuzzyQuery.action',
		EXPORT_KQI_GRID: 'http://localhost:8081/miipm/kqiAnalysis/dataExport.action',
		//---------------------------------------------------------
		GET_ALARMTREND: 'http://localhost:2620/api/ECHART',
		GET_ALARMTREND_48: 'http://localhost:2620/api/TWOECHART',
		GET_VIP_USER: 'http://localhost:2620/api/vipUser',
		GET_VIP_GROUP: 'http://localhost:2620/api/VIPGROUP',
		GET_NE_DATA: 'http://localhost:2620/api/indexNe',
		GET_MSG_DATA: 'http://localhost:2620/api/init',
		GET_QUERYTIME_DATA: 'http://localhost:2620/api/QUERYTIME',
		GET_DEFAULTMODEL_DATA: 'http://localhost:2620/api/DEFAULTMODEL',
		GET_SP_GROUP: 'http://localhost:2620/api/SP',
		GET_CELLAREA_DATA: 'http://localhost:2620/api/CELLAREA',
		GET_TREND_DATA: 'http://localhost:2620/api/TWOECHART',
		GET_ICON_DATA: 'http://localhost:2620/api/SP',
		GET_ALARM_DATA: 'http://localhost:2620/api/ALARM',
		GET_SPPAGING_DATA: 'http://localhost:2620/api/PAGING',
		GET_SPPOPUP_DATA: 'http://localhost:2620/api/detail',
	};
} else {
	Apis = {
		//----------------------Patrick----------------------------
		SAVE_TEMPLATE: basePath + 'kqiAnalysis/saveTemplate.action',
		GET_TEMPLATE: basePath + 'kqiAnalysis/loadTemplate.action',
		DELETE_TEMPLATE: basePath + 'kqiAnalysis/deleteTemplate.action',
		GET_KQI: basePath + 'kqiAnalysis/kqiList.action',
		GET_FILTER_VALUE: basePath + 'kqiAnalysis/filterDataByType.action',
		GET_OTHER_FILTER: basePath + 'kqiAnalysis/filterData.action',
		GET_KQI_CHART: basePath + 'kqiAnalysis/dataQuery.action',
		GET_KQI_GRID: basePath + 'kqiAnalysis/listDataQuery.action',
		EXPORT_KQI_GRID: basePath + 'kqiAnalysis/dataExport.action',
		GET_FILTER_RELATIVE: basePath + 'kqiAnalysis/filterLinkageData.action',
		SEARCH_FILTER: basePath + 'kqiAnalysis/filterFuzzyQuery.action',
		//---------------------------------------------------------
		GET_ALARMTREND: basePath + 'homePage/getAlarmTrend.action',
		GET_VIP_USER: basePath + 'homePage/getVipUser.action',
		GET_VIP_GROUP: basePath + 'homePage/getVipGroup.action',
		GET_NE_DATA: basePath + 'homePage/getNetwork.action',
		GET_MSG_DATA: basePath + 'homePage/getMsg.action',
		GET_QUERYTIME_DATA: basePath + 'homePage/getQueryTime.action',
		GET_DEFAULTMODEL_DATA: basePath + 'homePage/getDefaultModel.action',
		GET_SP_GROUP: basePath + 'homePage/getSp.action',
		GET_CELLAREA_DATA: basePath + 'homePage/getCell.action',
		GET_TREND_DATA: basePath + 'spMonitor/getTrend.action',
		GET_ICON_DATA: basePath + 'spMonitor/getIcon.action',
		GET_ALARM_DATA: basePath + 'spMonitor/getAlarm.action',
		GET_SPPAGING_DATA: basePath + 'spMonitor/getPaging.action',
		GET_SPPOPUP_DATA: basePath + 'spMonitor/detailDataQuery.action',
		GET_SPEXPORT: basePath + 'spMonitor/dataExport.action',
	};
}

export default Apis
