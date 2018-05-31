import commonFun from '../common.js';

const PostAjax = commonFun.PostAjax;
const RequestError = commonFun.RequestError;

const getTransferData = function(_this,transUrl,chartUrl,row,callback){

	let param = {id: row.id, name: row.name};

	_this.$store.dispatch('addLoadingCover',true);

	let promise = PostAjax(transUrl,param);

	promise.done((res) => {

		res = typeof(res) === 'string' ? JSON.parse(res) : res;

		let code = res.code;
		let message = res.message;

		_this.$store.dispatch('addLoadingCover',false);

		if(code === 0){

			let result = res.result;

			//this.chartTitle += this.jobName;

			let defaultOne = result.entrylist.default.name;

			_this.transferData = result.entrylist.details;

			_this.defaultEntry = defaultOne;

			//总数量, 总数据
			//发送默认请求第一个transtab
			getChartData(_this,chartUrl,row,defaultOne,callback);

			//this.intervalType = true;  //周期刷新
			
		}else{

			//关闭所有的打钩
			_this.$refs.multipleTable !== undefined ? RequestError(_this,message,_this.$refs.multipleTable.clearSelection) : RequestError(_this,message);
		}
	});
	promise.fail((res) => {

		_this.$store.dispatch('addLoadingCover',false);

		//关闭所有的打钩
		let message = '服务器异常,请稍后刷新';
		_this.$refs.multipleTable !== undefined ? RequestError(_this,message,_this.$refs.multipleTable.clearSelection) : RequestError(_this,message);
		//console.warn("request error");
	})
}


const getChartData = function(_this,chartUrl,row,defaultOne,callback,errorClose){

	_this.$store.dispatch('addLoadingCover',true);

	let param = {job: row.id, entryname: defaultOne};

	let promise = PostAjax(chartUrl,param);

	promise.done((res) => {

		_this.$store.dispatch('addLoadingCover',false);

		res = typeof(res) === 'string' ? JSON.parse(res) : res;

		let code = res.code;
		let message = res.message;

		if(code === 0){

			let result = res.result;
			//_this.chartData = result;

			_this.$store.dispatch('resetChartData',result);


			//callback, 初始：打开信息
			//切换： 刷新图表
			
			callback(defaultOne);

			//callback !== undefined ?  : '';

			//series.length !== 0 ? this.addChart(transName,result) : this.chartNotice = "暂无数据...";
			
		}else{

			//关闭弹框，关闭定时器
			errorClose !== undefined ? errorClose() : '';

			//关闭所有的打钩
			_this.$refs.multipleTable !== undefined ? RequestError(_this,message,_this.$refs.multipleTable.clearSelection) : RequestError(_this,message);
		}
	});

	promise.fail((res) => {

		//关闭弹框，关闭定时器
		errorClose !== undefined ? errorClose() : '';

		_this.$store.dispatch('addLoadingCover',false);

		//关闭所有的打钩
		let message = '服务器异常,请稍后刷新';

		_this.$refs.multipleTable !== undefined ? RequestError(_this,message,_this.$refs.multipleTable.clearSelection) : RequestError(_this,message);

		//console.warn("manger error");
	})
}

export default {getTransferData, getChartData}