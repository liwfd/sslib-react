/**
 * Created By Tangjingqi 2017/8/30
 * */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {createForm} from 'rc-form';
import _ from 'lodash';
import SSIcon from '../icon/SSIcon';
import ajax from '../../utils/ajax'
import EnvUtils from '../../utils/EnvUtils'
import RestUrl from "../../common/RestUrl";
import {Toast} from 'antd-mobile/lib/index';

let ADDR = RestUrl.ADDR;
let ROOT_PATH = RestUrl.ROOT_PATH;
let GETPROJECT = ADDR + ROOT_PATH + "/pub/getProjectByOrgId";
let hasProject;

class SSPosition extends Component {
    state = {
        projectName: ''
    }

    componentWillMount() {
        let that = this;
        let orgId = EnvUtils.getKeyValue('orgaId');
        //优化当已经存在项目信息不在发请求
        if (hasProject) {
            this.setState({
                projectName: hasProject
            });
            return;
        }

        ajax.postJSON(GETPROJECT, {orgId: orgId}, function (result) {
            if (result && result.success) {
                that.setState({
                    projectName: result.backData ? result.backData.projectName : ''
                });
                hasProject = result.backData ? result.backData.projectName : '';
            }
            else {
                Toast.fail('没有获取到项目信息', 1)
            }
        });
    }

    callBack = (key) => {
        if (_.isFunction(this.proprs.callBack)) this.props.callBack(key)
    }
    handleTabClick = (key) => {
        if (_.isFunction(this.proprs.handleTabClick)) this.props.handleTabClick(key)
    }

    render() {
        let {title, names, position, icon, iconColor, color, titlevalue, display} = this.props;
        let style = {
            display: display,
        }
        let styl1 = {
            display: 'flex',
            backgroundColor: '#ecf6ff',
            textAlign: 'center',
            alignItems: 'center',
            height: '35px',
            justifyContent: 'center'
        }
        let postyle = {
            display: 'inline-block',
            height: '30px',
            textAlign: 'center',
            minWidth: 'auto',
            maxWidth: '80%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: '30px',
            color: '#128aff',
            marginLeft: '0px',
            marginRight: '8px'
        }

        return (
            <div style={style}>
                <div style={styl1}>
                    <SSIcon icon={icon} color={color} style={{paddingRight: '3px'}}/>
                    <span style={postyle}>
                        {this.state.projectName}
                    </span>
                </div>
            </div>
        )
    };
};

SSPosition.defaultProps = {
    title: '',
    icon: 'icon-dingwei',
    color: '#128aff',
    display: 'none',
}
SSPosition.PropTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    display: PropTypes.string,
    colo: PropTypes.string,

}

export default SSPosition;