/**
 * Created by liulei on 2017/8/24.
 */
import React, {Component} from 'react'
import {List, Modal} from 'antd-mobile/lib/index'
import PropTypes from 'prop-types'
import _ from 'lodash'
import SSReferList from './SSReferList'
import SSReferTree from './SSReferTree'
import SSInput from '../input/SSInput'
import {hashHistory} from 'react-router';
import SSIcon from '../icon/SSIcon'
import SSReferTreeList from "./SSReferTreeList";
import classNames from '../../utils/classnames'
import SSQBReferTree from "./SSQBReferTree";
import SSQBReferList from "./SSQBReferList";

const Item = List.Item
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let maskProps
if (isIPhone) {
    // Note: the popup content will not scroll.
    maskProps = {
        onTouchStart: e => e.preventDefault(),
    }
}

class SSRefer extends Component {
    static propTypes = {
        extraFields: PropTypes.array, //额外显示字段e.g.['code', 'id']
        extra: PropTypes.string || PropTypes.element,//右边内容
        label: PropTypes.string,//标签名
        arrow: PropTypes.string,//箭头方向(右,上,下), 可选horizontal,up,down,empty，如果是empty则存在对应的dom,但是不显示
        align: PropTypes.string,//Flex 子元素垂直对齐，可选top,middle,bottom
        error: PropTypes.bool,//报错样式,右侧文字颜色变成橙色
        multipleLine: PropTypes.bool,//多行
        wrap: PropTypes.bool,//是否换行，默认情况下，文字超长会被隐藏，
        activeStyle: PropTypes.object,//自定义active的样式
        platform: PropTypes.string,//设定组件的平台特有样式, 可选值为 android, ios， 默认为 cross， 即组件会自动检测设备 UA 应用不同平台的样式
        displayField: PropTypes.string,//参照显示名称字段
    }
    state = {
        value: this.props.value,
        isNewState: false,
        showTreeList: false,
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.setState({
                value: nextProps.value,
                isNewState: true,
            })
        }
    }

    onOkSuccess = (selectNodes) => {
        hashHistory.goBack();
        this.setState({
            value: _.isEmpty(selectNodes) ? null : selectNodes,
            [this.state.curModel]: false
        })

        let fields = {}
        fields[this.props.field] = {
            dirty: true,
            errors: undefined,
            name: this.props.field,
            touched: true,
            validating: true,
            value: _.isEmpty(selectNodes) ? null : selectNodes
        }
        this.props.form.setFields(fields);
    }

    onOk = (selectNodes) => {
        if (_.isFunction(this.props.onOk)) {
            if (!!this.props.onOk(selectNodes)) {
                this.onOkSuccess(selectNodes);
            }
        } else {
            this.onOkSuccess(selectNodes);
        }
    }

    onClick = (e) => {
        e.stopPropagation();
        let curUri = hashHistory.getCurrentLocation().pathname;
        if (curUri.endsWith('/')) {
            hashHistory.push({
                pathname: curUri + 'refer'
            });
        } else {
            hashHistory.push({
                pathname: curUri + '/refer'
            });
        }
        if (this.props.referStyle == 'tree') {
            this.setState({
                showTree: true,
                curModel: 'showTree'
            })
        } else if (this.props.referStyle == 'list') {
            this.setState({
                showList: true,
                curModel: 'showList'
            })
        } else if (this.props.referStyle == 'tree-list') {
            this.setState({
                showTreeList: true,
                curModel: 'showTreeList'
            })
        } else if (this.props.referStyle == 'qb-tree') {
            this.setState({
                showQBTree: true,
                curModel: 'showQBTree'
            })
        } else if (this.props.referStyle == 'qb-list') {
            this.setState({
                showQBList: true,
                curModel: 'showQBList'
            })
        }
    }

    getFieldInfo = () => {
        if (_.isFunction(this.props.getFieldInfo)) this.props.getFieldInfo()
    }

    onClose = key => () => {
        hashHistory.goBack();
        this.setState({
            [key]: false,
        });
    }

    render() {
        let {
            arrow, align, error, multipleLine, wrap, activeStyle, platform, label, form, field,
            required, icon, iconColor, disabled, displayField, displayStyle, multiMode, listCondition,
            treeCondition, referName, referCode, ajaxType, condition, extraFields, onCheck
        } = this.props;
        condition = _.isEmpty(condition)?{}:JSON.stringify(condition);
        listCondition = _.isEmpty(listCondition)?{}:JSON.stringify(listCondition);
        treeCondition = _.isEmpty(treeCondition)?{}:JSON.stringify(treeCondition);
        let {isNewState, value} = this.state;
        let displayValue = '';
        let values;
        const cls = classNames({
            borderBottom: true,
            arrowNone: disabled ? true : false,
        });
        if (form) {
            let _value = form.getFieldValue(field);
            if (!isNewState && _value) {
                values = _value
            } else {
                values = value
            }
            // values = _value || this.state.value;
            if (!!values) {
                if (!Array.isArray(values)) {
                    if (Object.getOwnPropertyNames(values).length > 0) {
                        displayValue = values[displayField];
                    } else {
                        values = null;
                        displayValue = disabled ? null : '请选择';
                    }
                } else if (values.length > 0) {
                    displayValue = values.map(v => v[displayField]).join();
                }
            } else {
                displayValue = disabled ? null : '请选择';
            }
        }
        let dom;
        switch (displayStyle) {
            case '1':
                dom = <Item className={cls}
                            ref="refer"
                            extra={displayValue}
                            arrow={disabled ? '' : arrow}
                            align={align}
                            error={error}
                            multipleLine={multipleLine}
                            wrap={wrap}
                            activeStyle={activeStyle}
                            platform={platform}
                            onClick={disabled ? null : this.onClick}
                ><SSInput field={field} form={form} label={label} value={values} required={this.props.required}
                          visible={false}/>
                    <SSIcon icon={icon} color={iconColor}/>
                    <span style={{marginLeft: '0.3rem',marginRight:!required&&disabled?'0.46rem':''}}>{label}</span>
                    <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian"
                                                                            color="red"/></span>
                </Item>;
                break;
            case '2':
                iconColor = 'red';
                dom = <Item className={cls}
                            ref="refer"
                            extra={displayValue}
                            arrow={disabled ? '' : arrow}
                            align={align}
                            error={error}
                            multipleLine={multipleLine}
                            wrap={wrap}
                            activeStyle={activeStyle}
                            platform={platform}
                            onClick={disabled ? null : this.onClick}
                ><SSInput field={field} form={form} label={label} value={values} required={this.props.required}
                          visible={false}/>
                    <span style={{display:required?'':'none'}}><SSIcon icon='icon-bixutian' color={iconColor}/></span>
                    <span style={{marginLeft:required?'0':'0.3rem',marginRight:!required&&disabled?'0.46rem':''}}>{label}</span>
                </Item>;
                break;
            default:
                break;
        }
        return (
            <div>
                <Modal
                    popup
                    style={{width: '100vw', height: '100vh'}}
                    visible={this.state.showTreeList}
                    onClose={this.onClose('showTreeList')}
                    animationType="slide-up"
                >
                    <SSReferTreeList onCheck={onCheck} value={value} extraFields={extraFields} onClose={this.onClose('showTreeList')} displayField={displayField} multiMode={multiMode}
                                     onOk={this.onOk} listCondition={listCondition}
                                     treeCondition={treeCondition}
                                     referCode={referCode} referName={referName}/>
                </Modal>
                <Modal
                    popup
                    style={{width: '100vw', height: '100vh'}}
                    visible={this.state.showTree}
                    onClose={this.onClose('showTree')}
                    animationType="slide-up"
                >
                    <SSReferTree value={value} onCheck={onCheck} onClose={this.onClose('showTree')} displayField={displayField} multiMode={multiMode}
                                 onOk={this.onOk} condition={condition}
                                 referCode={referCode} referName={referName}/>
                </Modal>
                <Modal
                    popup
                    style={{width: '100vw', height: '100vh'}}
                    visible={this.state.showQBTree}
                    onClose={this.onClose('showQBTree')}
                    animationType="slide-up"
                >
                    <SSQBReferTree onClose={this.onClose('showQBTree')} displayField={displayField} multiMode={multiMode}
                                 onOk={this.onOk} condition={condition}
                                 referCode={referCode} referName={referName}/>
                </Modal>
                <Modal
                    popup
                    style={{width: '100vw', height: '100vh'}}
                    visible={this.state.showList}
                    onClose={this.onClose('showList')}
                    animationType="slide-up"
                >
                    <SSReferList value={value} extraFields={extraFields} onClose={this.onClose('showList')} displayStyle={displayStyle} displayField={displayField} multiMode={multiMode}
                                 onOk={this.onOk} onCheck={onCheck} condition={condition}
                                 referCode={referCode} referName={referName} ajaxType={ajaxType}/>
                </Modal>
                <Modal
                    popup
                    style={{width: '100vw', height: '100vh'}}
                    visible={this.state.showQBList}
                    onClose={this.onClose('showQBList')}
                    animationType="slide-up"
                >
                    <SSQBReferList onClose={this.onClose('showQBList')} displayStyle={displayStyle} displayField={displayField} multiMode={multiMode}
                                 onOk={this.onOk} condition={condition}
                                 referCode={referCode} referName={referName} ajaxType={ajaxType}/>
                </Modal>
                {dom}
            </div>
        )

    }
}

SSRefer.defaultProps = {
    extra: '',
    icon: '',
    iconColor: '',
    defaultValue: {name: '请选择'},
    arrow: 'horizontal',
    align: 'middle',
    error: false,
    multipleLine: false,
    wrap: false,
    required: false,
    activeStyle: {},
    platform: 'cross',
    label: '参照名称',
    referCode: '',
    referName: '',
    condition: {},
    listCondition: {},
    treeCondition: {},
    value: null,
    referStyle: '',
    field: '',
    displayField: 'name',
    multiMode: false,
    displayStyle: '1',
    ajaxType:'get',
    extraFields: []
}

export default SSRefer;