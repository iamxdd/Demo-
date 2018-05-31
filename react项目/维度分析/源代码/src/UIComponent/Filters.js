/**
 * @description:多维度分析复选框部分数据。
 */

import React, { Component } from "react";
import SelectCondition from "../filters/selectCondition.js";
import DegradationDefinition from "../filters/degradationDefinition.js";
import Indicator from "../filters/indicator.js";

class Filters extends Component {
    constructor(props) {
        super(props);
        /***
         * @description:组件状态.
         */
        this.state = {
            
        };
    }
    componentWillReceiveProps(nextProps) {}
    componentDidMount() {

    }
    render() {
        return ( < div className = "filrate_control" style={{width:"100%"}}>
                < SelectCondition / >
                < DegradationDefinition />
                < Indicator />
            < /div>
        )
    }
}
export default Filters;
