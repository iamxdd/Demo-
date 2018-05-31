import React,{Component} from 'react'
import $ from "jquery"
import { Spin } from 'antd';
import urls from '../config/urls'
import baseParams from '../util/baseParams'
import LineComponent from "./LineComponent"
import util from '../util/util'
import {addLoadingTask,deleteLoadingTask}  from '../util/loadingTask'
const commonHandle  = window.commonHandle;
class LoadMask extends Component{
	constructor(props) {
		super(props);
		this.state = {
			showLoading:false
		}
	}
	componentDidMount(){
		commonHandle.on("setLoading",(state)=>{
	      this.setState({
	        showLoading:state
	      })
	    });
	}
	render(){
		return (
			<Spin tip="loading..." spinning={this.state.showLoading} >
				<div id="loadMask"></div>
			</Spin>
		)
	}
}

export default LoadMask;