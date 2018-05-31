import commonFun from '../common.js';

const PostAjax = commonFun.PostAjax;
const GetAjax = commonFun.GetAjax;
const RequestError = commonFun.RequestError;

const refreshStrdata = function(_this,url,param){


   _this.$store.dispatch('addLoadingCover',true);

   param.condition.searchText = param.condition.searchText.replace(/(^\s*)|(\s*$)/g,'');
	/*得到新数据*/
  let promise = PostAjax(url,param);

  promise.done((res) => {

    res = typeof(res) === 'string' ? JSON.parse(res) : res;

    let code = res.code;
    let message = res.message;
    let total = res.total;

    _this.$store.dispatch('addLoadingCover',false);

    if(code === 0){

      let data = res.result;

      if(res.total !== undefined){
        let obj = {datas: data, totalItem: res.total};
        //更新页面数据，和总数
        _this.$store.dispatch('resetStrDataAndTotalItem',obj);

        //res.total <= _this.$store.state.stragePagitation.pageSize  ? _this.$store.dispatch("resetStrCurrPage",1) : _this.$store.dispatch('resetStrDataAndTotalItem',obj);;

      }
      
    }else{
      //提示请求异常
        RequestError(_this,message);
    }

  });
  promise.fail((err) => {
    _this.$store.dispatch('addLoadingCover',false);

    let message = '服务器异常,请稍后刷新';
     RequestError(_this,message);
    // console.warn("request error");
  })
}

var onlineFail = false;

//远程执行：获取在线的节点数据
const getOnlineData = function(_this,onlineUrl,levelUrl,callback,reviseParam){

  let promise = GetAjax(onlineUrl);

  promise.done((res) => {
    let code = res.code;
    let message = res.status;
    if(code === 0){
      let data = res.datas;
      let newData = [];

      data.forEach((v,i) => {
        let item = {value: ''+v.id, label: v.name};
        newData.push(item);
      })

      _this.langComp = newData;

      getLogLevelData(_this,levelUrl,callback,reviseParam)

    }else{
      //弹出错误提示
      RequestError(_this,message);

    }
  })

  promise.fail((res) => {

     onlineFail = true;

     let message = '服务器异常,请稍后刷新';
     RequestError(_this,message);
    // console.warn("request error");
  }) 

}


const getLogLevelData = function(_this,url,callback,reviseParam){

  let promise = GetAjax(url);

  promise.done((res) => {

    let code = res.code;
    let message = res.message;

    if(code === 0){

      let data = res.result;

      _this.stepLevel = data;

      //打开新建
      reviseParam == undefined ? callback() : callback(reviseParam);

    }else{
      //弹出错误提示
      RequestError(_this,message);
    }

  });

  promise.fail((res) => {

     let message = '服务器异常,请稍后刷新';

     onlineFail === true ?  '' :  RequestError(_this,message);

     //console.warn("request error");
  }) 

}


//关联任务数据
const getRelationDutyData = function(_this,url,row,callback,closeCallback){

  let currPage = _this.$store.state.dutyChain.pagitation.currPage;
  let currperItem = _this.$store.state.dutyChain.pagitation.pageSize;

  // let param = {pageIndex: currPage, perItem: currperItem, searchText:this.searchText};

  let param = {
      page:{
        pageLine: currperItem,
        pageNum: currPage
      },
      condition:{
        searchText: _this.searchText
      },
      name:row.name,
      id:row.id
  };

  param.condition.searchText = param.condition.searchText.replace(/(^\s*)|(\s*$)/g,'');

  _this.$store.dispatch('addLoadingCover',true);

  let promise = PostAjax(url,param);

  promise.done((res) => {

    _this.$store.dispatch('addLoadingCover',false);

    res = typeof(res) === 'string' ? JSON.parse(res) : res;

    let code = res.code;
    let message = res.message;

    if(code === 0){

      let jobs = res.result

      _this.$store.dispatch('resetDutyChainData',jobs)
     // _this.dutyData = jobs;

      if(res.total !== undefined){

        //打开弹出框
        callback !== undefined ?  callback(row) : '';
          //任务条数
        _this.$store.dispatch('resetDutyChainTotalItem',res.total);

      }

      if(res.total === 0){
         _this.tableEmptyText = '未找到任何匹配信息';
      }

    }else{

       //关闭当前一级弹框
      let type = {type: 'close'};
      _this.$store.dispatch('dutyChainShow',type);
      //弹出失败原因
      RequestError(_this,message);

    }
  });

  promise.fail((res) => {

    _this.$store.dispatch('addLoadingCover',false);

    //关闭当前弹框
    let type = {type: 'close'};
    _this.$store.dispatch('dutyChainShow',type);

    let message = '服务器异常,请稍后刷新';
    RequestError(_this,message);
     // console.warn("Request Error")
  })

}


//修改时获取当前策略信息
const getCurrentStrData = function(_this,openStrUrl, onlineUrl, logLeveUrl, callback,row){

  let param = {strategy: row.id};
          
  _this.$store.dispatch('addLoadingCover',true);

  let promise = PostAjax(openStrUrl,param);

  promise.done((res) => {

    res = typeof(res) === 'string' ? JSON.parse(res) : res;

    _this.$store.dispatch('addLoadingCover',false);

    let code = res.code;
    let message = res.message;

    if(code === 0){
      let result = res.result;
      let clickData = result.execStrategy;

      _this.formMessage.name = clickData.name;
      _this.formMessage.execMode = clickData.execMode;
      _this.formMessage.execNodeId = clickData.execNode;
      _this.formMessage.logLevel = clickData.logLevel;

      _this.formMessage.isPassExport = clickData.isPassExport == 'N' ? false : true;

      //保存一份原始的节点名称
      _this.orginExecNodeId = clickData.execNode;
      //原始节点名称
      _this.nodeName = _this.formMessage.execNodeId;

      //成功后再读取在线节点数
      getOnlineData(_this, onlineUrl, logLeveUrl, callback,row); 

    }else{
      //其他情况
      RequestError(_this,message);
    }

  });
  promise.fail((err) => {

     _this.$store.dispatch('addLoadingCover',false);

     let message = '服务器异常,请稍后刷新';
     RequestError(_this,message);
    //console.warn("click str AjaxError")
  })
}


export default {refreshStrdata, getOnlineData, getLogLevelData, getRelationDutyData, getCurrentStrData};

