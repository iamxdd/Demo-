import React, {
  Component
} from 'react';
import { Select } from "antd"
import $ from "jquery"
import baseParams from '../util/baseParams'
import urls from "../config/urls"
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
const Option = Select.Option;
const commonHandle = window.commonHandle;
class NavSelect extends Component{
	constructor(props){
		super(props)
		console.log(props);
		this.selectHandle = this.selectHandle.bind(this);
		this.state = {
			unit:this.props.unit || "",
			defaultValue:this.props.defaultValue,
			label:this.props.label || "Left xAxis",
			options:this.props.options || [],
			currentSelect:this.props.currentSelect || "",
			leftKqis:this.props.leftKqis || "",
			rightKqis:this.props.rightKqis || ""
		}		
	}
	isSameUnit(u){
		if(this.state.unit === ""){
			return false;
		}else{
			return this.state.unit !== u;
		}
	}
	createSelectOptions(data) {
		var me = this;
	    var options = [];
	    data.map((item,i) => {
	      options.push(<Option style={{textOverflow:"ellipsis",whiteSpace:"nowrap"}} key={data[i].unit+"-"+i+":"+data[i].value} data-unit={data[i].value} disabled={ me.isSameUnit(data[i].unit)} title={data[i].text}>{data[i].text}</Option>)
	    });
	    return options;
  	}
  	selectHandle(value,option){
  		console.log("option",option)
  		console.log("value",value);
  		var me = this;
  		var result = [];
  		var ids = (function(){
  			if(value.length===0){
  				return ""
  			}if(value.length===1){
  				return value[0].split(":")[1];
  			}else{
  				return value.reduce(function(pre,next){
		  				return pre.split(":")[1]+=(","+next.split(":")[1])
		  		});
  			}
  		})()

		if(me.props.label === "Left xAxis"){
			if(value.length === 0){
				commonHandle.fire("limitLeftOptions","");
				commonHandle.fire("cacheLeftKQIs","");
			}else{
				commonHandle.fire("limitLeftOptions",value[0].split("-")[0]);
				commonHandle.fire("cacheLeftKQIs",ids);
			}			
		}
		if(me.props.label === "Right xAxis"){
			if(value.length === 0){
				commonHandle.fire("limitRightOptions","");
				commonHandle.fire("cacheRightKQIs","");
			}else{
				commonHandle.fire("limitRightOptions",value[0].split("-")[0]);
				commonHandle.fire("cacheRightKQIs",ids);
			}
		}
		commonHandle.fire("before-selected-left",null);
		var uid = util.createUID(6);
		addLoadingTask(uid);
		$("input").trigger("blur");
  		$.ajax({
			type:"POST",
			url:urls.leftTopChartLeft,
			dataType:"json",
			headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
			data:$.extend({}, baseParams,{leftKqis:commonHandle.leftKqis,rightKqis:commonHandle.rightKqis,fiterList:window.filterOptions.filterList})			
		}).done((res)=>{
			deleteLoadingTask(uid);
			window.nameMapping = res.nameMapping;
			commonHandle.fire("selected-right",{seriesName:Object.keys(res.nameMapping)[0]})
			if(me.props.label === "Left xAxis"){
				commonHandle.fire("selected-left",res);
			}
			if(me.props.label === "Right xAxis"){
				commonHandle.fire("selected-left",res);
			}
		}).fail(function(err){
			deleteLoadingTask(uid);
			console.error(err)
		})
  	}
  	componentWillReceiveProps(nextProps){
  		var newState = Object.assign({},this.state,nextProps);
  		this.setState(newState);
  	}
	render(){
		return (
				<div>
					 <span className="font-color-36383C" style={{float:"left"}}>{this.state.label}</span>
                      <Select
                        showSearch={false}
                        multiple={true}
                        style={{ width: 120,height:28,float:"left" }}
                        placeholder="please select"
                        optionFilterProp="children"
                        notFoundContent="no data"
                        onChange={this.selectHandle}
                      >
                 	   { this.createSelectOptions(this.state.options) }
                      </Select>
                </div>
        )
	}
}

export default NavSelect;
