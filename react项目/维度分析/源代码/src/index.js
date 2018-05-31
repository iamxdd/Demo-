import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import App from './App';
import Handle from './util/Handle';
import "./utils/auto.js";
import baseParams from './util/baseParams';
import {Provider} from "react-redux";
import configureStore from "./store/configureStore.js";
const commonHandle = window.commonHandle;

const store=configureStore();


window.loadTask = {

};
window.moreParams = {
	filter:"",
	dimId:"",
	subKqiId:""
};
window.filterOptions = {
	andOr:"",
	filterList:"",
	LinkUp:""
};
window.conditionsReady = false;
window.dimNavReady = false;
//根据屏幕大小设置根元素的字体大小，达到自适应的目的
// var commonHandle = new Handle();
// window.commonHandle = commonHandle;
commonHandle.leftKqis = "";
commonHandle.rightKqis = "";
commonHandle.on("cacheLeftKQIs",function(data){
	commonHandle.leftKqis = data;
});
commonHandle.on("cacheRightKQIs",function(data){
	commonHandle.rightKqis = data
});
commonHandle.on("saveFilter",function(value){
	var lastValue = window.moreParams.filter;
	if( lastValue !== value ){
		commonHandle.fire("emptyFilter",null);
	}
	window.moreParams.filter = value;
});
commonHandle.on("saveDimId",function(value){
	window.moreParams.dimId = value;
});
commonHandle.on("saveSubKqiId",function(value){
	window.moreParams.subKqiId = value;
});

window.isRatePage = $("#isSuccessKqi").val();

if(!window.basePath){
	window.basePath = "http://localhost:3000/";
}
if(!window.seqBasePath){
	window.seqBasePath = "http://localhost:3000/";
}

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('#root')
);

setTimeout( function(){
	$("#left-bottom>div.nav>span").eq(0).click();
},1000 )



