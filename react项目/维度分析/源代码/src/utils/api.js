/***
 * @description:模拟加载路径.
 */
 let Apis;
 let development="localhost";

 /***
  * @GET_DATA_QUERY_URL：获取最左侧筛选框和过滤条件点击OK时调用.
  * @REJECT_DATA_QUERY_URL：获取剔除top指标返回的数据。
  * @UPLOAD_SQL_URL：上传SQL文件的获取数据。
  */
if(development == "development"){
  Apis = {
  	GET_DATA_QUERY_URL: 'http://localhost:2620/api/DATAQUERY',
    REJECT_DATA_QUERY_URL: 'http//localhost:2620/api/REJECTDATAQUERY',
    UPLOAD_SQL_URL: 'http://localhost:2620/api/UPLOADSQL'
  };
} else if(development=="development"){
  Apis = {
    // GET_DATA_QUERY_URL: '/multiAnalysis/filterDataQuery.action',
    // REJECT_DATA_QUERY_URL: '/multiAnalysis/rejectDataQuery.action',
    // UPLOAD_SQL_URL: '/multiAnalysis/fileUpload.action',
  }
}

 export default Apis