import React, {Component} from 'react';
import { NavBar, Icon } from 'antd-mobile/lib/index';
import '../../../css/SSNavBar.css'
import _ from 'lodash';
import { hashHistory } from 'react-router'

class SSNavBar extends Component{

  onLeftClick = () =>{
    if(_.isFunction(this.props.onLeftClick)){
      this.props.onLeftClick();
    }else{
      hashHistory.goBack();
    }
  }

  render() {
    const { title, leftContent, rightContent } = this.props;
    let style1={
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 888
    };
    return (
      <div>
        <NavBar style={style1} {...this.props}
                icon={<Icon type="left" />}
                leftContent={leftContent}
                onLeftClick={this.onLeftClick}
                rightContent={rightContent}>

          {title}
        </NavBar>
        <div style={{height: '45px'}}></div>
      </div>
    );
  }
}
SSNavBar.defaultProps = {
  title: '',
  leftContent: '返回',
  rightContent: [],
}
export default SSNavBar;