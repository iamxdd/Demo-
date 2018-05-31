/**
 * @description:多维度分析复选框点击按钮弹出复选框。
 */
import React,{Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import $ from "jquery";
import { Form, Input, Icon, Button, Popover } from 'antd';
import OpenDefinitionForm from "./openDefinition.js";
import { } from "../actions/action.js";


const FormItem = Form.Item;
let uuid = 0;

class DegradationDefinition extends Component {
    constructor(props) {
        super(props);
        this.queryData={};
        this.state={
            visible:false,
        }
    }
    hide() { //控制卡片气泡隐藏
        this.setState({
          visible: false,
        });
    }
    componentDidMount(){
        // let dispatch = this.props.dispatch;
        // dispatch(getDataQuery({
        //
        // }));
    }

    render(){
        let me = this;
        const {data, dispatch} = this.props;
        this.queryData = data;
        let handleVisibleChange = ()=>{ //控制显示气泡卡片
            me.setState({ visible:true });
            // debugger;
            var imageBase64 = document.querySelector("#left-bottom canvas").toDataURL();
            $("#left-bottom canvas").hide();
            $("#left-bottom canvas").parent().append("<img src='"+ imageBase64 +"' style='width:100%;height:100%'/>");
        }
        const content = (
            <div>
                <OpenDefinitionForm hide={this.hide.bind(this)}/>
            </div>
        );
        return(
            <div className="degradation_condition">
                <Popover
                    placement="bottomLeft"
                    content={content}
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={handleVisibleChange}
                >
                    <Button type="ghost">Degradation Definition</Button>
                </Popover>
            </div>
        )
    }
}


// function mapStateToProps(state){
//     if(state.filterDataGetQuery.data){
//         return{
//             data:state.filterDataGetQuery.data
//         }
//     };
//     return{
//         data:{}
//     }
// }
export default connect()(DegradationDefinition);
