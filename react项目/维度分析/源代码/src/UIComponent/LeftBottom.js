import React, { Component } from 'react'
import LeftBottomNav from './LeftBottomNav'
import LeftBottomChart from './LeftBottomChart'
import Filters from "./Filters"

class LeftBottom extends Component{
	constructor(props) {
		super(props);		
	}
	componentDidMount() {
	}
	render(){
		return (
			    <div id="left-bottom">
                        <LeftBottomNav />
                        <Filters / >
                        <LeftBottomChart />
            	</div> 
        )
	}
}
export default LeftBottom;