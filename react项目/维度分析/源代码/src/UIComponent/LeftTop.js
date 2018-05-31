import React, {
  Component
} from 'react';
import LeftTopLeft from "./LeftTopLeft";
import LeftTopRight from "./LeftTopRight";
import { Select } from "antd"
const Option = Select.Option;
class LeftTop extends Component{
	constructor(props){
		super(props)
	}
	render(){		
		return (
			<div id="left-top">
					<LeftTopLeft label={"Left xAxis"} />
					<LeftTopRight label={"Right xAxis"} />
			</div>
        )
	}
}

export default LeftTop;
