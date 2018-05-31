import $ from "jquery"
import baseParams from './baseParams'

/**
 * 统一ajax请求
 * @param  {[type]} opts [description]
 *                  opts.url [请求地址]
 *                  opts.data [请求参数]
 *                  opts.loadMask [是否开户遮罩]
 *                  opts.success [数据请求成功后的回调]
 *                  opts.error   [数据请求失败后的回调]
 *                  
 * @return {[type]}      [description]
 */
function ajax(opts) {
	if(opts.loadMask === true){
		
	}
	if (!opts.url) {
		console.warn("url为必填参数，请传入请求地址")
		return;
	}
	else if(!opts.success){
		console.warn("数据请求成功后的回调为必填参数,请传入回调")
		return;
	}
	var csrf = $("meta[name='_csrf']").attr("content");
	$.ajax({
			url: opts.url,
			type: opts || "POST",
			dataType: opts.dataType || "json",
			data: opts.data ? $.extend({},baseParams,opts.data) : {},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"X-CSRF-TOKEN":csrf
			}
		})
		.done(function(res) {
			opts.success(res)
		})
		.fail(function(err) {
			if(opts.error && $.type(opts.error === "function")){
				opts.error(err)
			}else{
				console.error(err)
			}
		})
}

export default ajax