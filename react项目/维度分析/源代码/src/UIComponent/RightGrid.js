import React,{Component} from 'react'
import { Table, Icon , LocaleProvider,Popover ,Button  } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import $ from "jquery"
import urls from "../config/urls"
import util from '../util/util'
import baseParams from '../util/baseParams'
const commonHandle = window.commonHandle;
class RightGrid extends Component{
	constructor(props) {
		super(props);
		this.onRowClick = this.onRowClick.bind(this);
		this.exportClick = this.exportClick.bind(this);

		this.state = {
			columns:this.props.columns || [ {
											  title: 'APN',
											  dataIndex: 'APN',
											  key: 'APN',
											}, {
											  title: 'Service Failure',
											  key: 'Service Failure',
											  dataIndex:"failureTimes",
											  render: (text, record) => (
											    <span style={{display:"inline-block",width:"100%",height:"100%",cursor:"pointer"}}>
											      <a href="#">{text}</a>
											    </span>
											  ),
											}],
			data:this.props.data || [],
			visible: false
		}
	}
	handleVisibleChange = (visible) => {
	    this.setState({ visible });
	}
	hide = () => {
	    this.setState({
	      visible: false,
	    });
	 }
	componentDidMount(){
		commonHandle.on("updateGrid",(data)=>{
			$.ajax({
				type:"POST",
				url:urls.rightGrid,
				dataType:"json",
				headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
				},
				data:$.extend({}, baseParams, {
												filter:window.moreParams.filter,
												dimId:window.moreParams.dimId,
												subKqiId:window.moreParams.subKqiId,
												andOr:window.filterOptions.andOr,
												filterList:window.filterOptions.filterList,
												LinkUp:window.filterOptions.LinkUp
				})
			}).then((res)=>{
				window.detailsSheetParams = res.params;
				var columns = [];																							
				for( let i=0;i<res.header.length;i++){
					columns.push({
				          title: res.header[i].title,
				          width:100/res.header.length + "%",
						  key: res.header[i].key,
						  dataIndex:res.header[i].dataIndex,
						  render: (text, record) => {
						  	if(res.header[i].rillDown === true && (text+"").trim()!=="0" ){
						  		return  (<span style={{display:"inline-block",width:"100%",height:"100%",cursor:"pointer"}}>
									      <a href="#" title={text}>{util.string.dealMoreChars(text,10)}</a>
									    </span>)
						  	}
						  	//else if(res.header[i].rillDown === false){
						  	else{
						  		return <div style={{display:"inline-block",width:"100%",height:"100%",overflow:"hidden"}} title={text}>
									      {util.string.dealMoreChars(text,10)}
									   </div>
						  	}	    
						  }
					})
				}
				this.setState({
					columns:columns,
					data:res.data
				})
			}).catch(function(err){console.error(err)})
		});
	}
	onRowClick(data,rowNumber,event){
		event.persist();
		var id = data.ID;
		//var params = data.params;
		var params = window.detailsSheetParams.replace(/@DIMID@/i,id).replace(/'/gi,'"');
		var target = event.target;
		if($(target).find("a").length>0 || target.nodeName.toLowerCase() ==="a" ){
			if(top.showTabPanel && $.type( top.showTabPanel ) === "function"){
				top.showTabPanel("details sheet","detailsSheet",urls.detailsSheet+params);
			}else{
				window.open(urls.detailsSheet+params)
			}
		}
	}
	

	exportClick(e){
		$.ajax({
				type:"POST",
				url:urls.exportGridData,
				dataType:"json",
				headers:{
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
				},
				data:$.extend({},baseParams,{
						filter:window.moreParams.filter,
						dimId:window.moreParams.dimId,
						subKqiId:window.moreParams.subKqiId,
						andOr:window.filterOptions.andOr,
						filterList:window.filterOptions.filterList,
						LinkUp:window.filterOptions.LinkUp,
						exportType:$(e.target).attr("data-id")
				})
			}).done((res)=>{
				window.location.href = res.path;
				// window.open(res.path);
			}).fail(function(err){console.error(err)});
		$(".exportBox").removeClass("exportBoxShow");
	}
	render() {
		return (
			<div>
				<div id="export">
					<Popover
			        content={<span><a onClick={this.exportClick} data-id="excel">Excel</a><br/><a onClick={this.exportClick} data-id="csv">Csv</a></span>}
			        trigger="click"
			        visible={this.state.visible}
			        onVisibleChange={this.handleVisibleChange}
			        placement="leftTop"
			      >
			        	<Button type="primary" title="export"><Icon type="download" /></Button>
			     	</Popover>		
				</div>	
				<LocaleProvider locale={enUS}>
					<Table
					 columns={this.state.columns} 
					 dataSource={this.state.data}
					 onRowClick={this.onRowClick}
				/>
				</LocaleProvider>
			</div>
		)
	}
}
export default RightGrid