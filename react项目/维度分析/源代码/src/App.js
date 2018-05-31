import React, {
  Component
} from 'react';
import { Spin } from 'antd';
import './style/antd.min.css';
import './style/App.css';
import './style/resetAntdStyle.css';
import './style/updateAntd.css';
import './style/multi_analysis_control.css';
import './style/icon.css';
// import './style/fonts/icomoon.eot';
import LeftTop from "./UIComponent/LeftTop"
import Mask from "./UIComponent/Mask"
import LeftBottom from './UIComponent/LeftBottom'
import RightGrid from './UIComponent/RightGrid'
import LoadMask from './UIComponent/LoadMask'
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading:true
    }
  }
  componentDidMount() {

  }
  render() {
    return ( 
              < section >
                    <Mask />
                    <div id="left">
                      <LeftTop />
                      <LeftBottom />
                    </div>
                    <div id="right">
                      <RightGrid />
                      <div id="tempBg"></div>
                    </div>
                    <div id="loadMask">
                      <LoadMask / >
                    </div>
              < /section>);
    }
  }

  export default App;