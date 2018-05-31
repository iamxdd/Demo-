//深拷贝函数

const ObjCopy = function(obj){
	var tmp_obj;
	if(typeof obj == 'object') {
		if(obj instanceof Array) {
			tmp_obj = [];
		} else {
			tmp_obj = {};
		}
	} else {
		return obj;
	}
	for (var i in obj) {
		if (typeof obj[i] != 'object') {
			tmp_obj[i] = obj[i];
		} else if (obj[i] instanceof Array) {
			tmp_obj[i] = [];
			for (var j in obj[i]) {
				if (typeof obj[i][j] != 'object') {
					tmp_obj[i][j] = obj[i][j];
				} else {
					tmp_obj[i][j] = ObjCopy(obj[i][j]);
				}
			}
		} else {
			tmp_obj[i] = ObjCopy(obj[i]);
		}
	}
	return tmp_obj;
};

var sendType = 'POST';

const PostAjax = function(url, param){
	let ajaxObj = $.ajax({
		url: url,
		type: sendType,
		data: JSON.stringify(param),
		datatype: 'json',
		headers: {
			'Content-Type':'application/json;charset=UTF-8'
		}
	});
	return ajaxObj;
};


const GetAjax = function(url){
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

/*错误的提示框*/
const RequestError = function(_this,message,callback){
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

export default {ObjCopy,PostAjax,GetAjax,RequestError};

