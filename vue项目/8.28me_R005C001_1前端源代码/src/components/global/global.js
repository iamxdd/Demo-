/**
 * 错误的提示框
 * @param {[type]}   _this    [description]
 * @param {[type]}   message  [description]
 * @param {Function} callback [description]
 */
function RequestError(_this,message,callback){
  _this.$confirm(message,'提示',{
        confirmButonText:'确认',
        showCancelButton:false,
        type:'error',
    }).then( ()=> {
      if(callback !== undefined){
        callback();
      }
    }).catch( () =>{
      if(callback !== undefined){
        callback();
      }
    });
}
/**
 * 正确的提示框
 * @param {[type]}   _this    [description]
 * @param {[type]}   message  [description]
 * @param {Function} callback [description]
 */
function RequestRight(_this,succmessage,failmessage,callback){
    _this.$alert(succmessage, '提示', {
       confirmButtonText: '确定',
       type:'success',
       beforeClose: (action, instance, done) =>{   
          if(action === 'confirm'){
              callback;
           }
          setTimeout(() => {done()},100);                       
        }
      },(response)=>{
          global.RequestError(_this,failmessage);
      });
}
/**
 * 去除数组重复
 * [getArray description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function getArray(arr) {
    var hash = {};
    var len = arr.length;
    var result = [];

    for (var i = 0; i < len; i++){
        if (!hash[arr[i]]){
            hash[arr[i]] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

/**
 * [axiosPost description] axio POST请求封装
 * @param  {[type]} _this [组件本身]
 * @param  {[type]} url   [发送地址]
 * @param  {[type]} data  [传递参数]
 * @return {[type]}       [description]
 */
function axiosPost(_this,url,data){
let axiospost = _this.$axios({
   method:'POST',
   url:url,
   data:data,
   // ...option
 });
 return axiospost
}
/**
 * [axiosPost description] axio GET请求封装
  * @param  {[type]} _this [组件本身]
 * @param  {[type]} url   [发送地址]
 * @param  {[type]} data  [传递参数]
 * @return {[type]}       [description]
 */
function axiosGet(_this,url,data){
 let axiosget = _this.$axios({
   method:'GET',
   url:url,
   params:data,
   headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
 });
 return axiosget
}


let sendType='POST'
function PostAjax(url, param){
  let ajaxObj = $.ajax({
    url: url,
    type: sendType,
    data: JSON.stringify(param),
    //data: param,
    // contentType: "application/json",
    datatype: 'json',
    headers: {
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
  return ajaxObj;
};

function GetAjax  (url){
  let ajaxObj = $.ajax({
    url: url,
    type: 'GET',
    datatype: 'json',
    headers: {
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
  return ajaxObj;
};
export default{
  RequestError,
    getArray,
    ajax,
    PostAjax,
    GetAjax,
    RequestRight,
    axiosPost,
    axiosGet
}
