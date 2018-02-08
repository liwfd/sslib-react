import React, {Component} from 'react';
import SSForm from '../../form/SSForm';
import SSIcon from '../../icon/SSIcon';
import SSImagePicker from '../SSImagePicker';
import SSSwitch from '../../switch/SSSwitch';
import SSButton from '../../button/SSButton';
import SSPage from '../../page/SSPage';
import SSInput from '../../input/SSInput';
import SSRefer from '../../refer/SSRefer';
import SSTextarea from '../../textarea/SSTextarea';
import SSTree from '../../tree/SSTree';
import SSPicker from "../../picker/SSPicker";
import SSStepper from "../../stepper/SSStepper";
import {List, SearchBar} from 'antd-mobile'
import SSignature from "../../signature/SSignature";
import SSNavBar from "../../navbar/SSNavBar";
import {hashHistory, useRouterHistory, withRouter, Route} from 'react-router';
import {SSTab} from "../../../index";
import SSDatePicker from "../../date-picker/SSDatePicker";

class NativeDemo extends SSPage {
    state = {
        searchText: '',
        vava: true
    }

    change = (flag) => {
        this.setState({
            vava: flag
        })
    }

    componentWillReceiveProps(nextProps, nextState) {
        // debugger;
    }

    componentWillMount() {
        window.addEventListener('backbutton', (hash) => {
            let oldUri = hash.oldURL.split('#/')[1].split('?')[0];
            if (oldUri.endsWith('/refer')) {
                this.onClose();
            }
        })
    }

    onOk = (value) => {
        debugger;
    }

    onClick = () => {
        this.setState({
            vava: !this.state.vava
        })
    }

    jump = () => {
        let s = this.props.form.getFieldsValue();
        console.log(s);
        // hashHistory.push({
        //     pathname: hashHistory.getCurrentLocation().pathname + '/drawer'
        // })
        // hashHistory.push(hashHistory.getCurrentLocation().pathname + '/drawer')
    }

    treeChange = (selectedNode) => {
        debugger
    };
    // saveSign=(result)=>{
    //     result&&Popup.hide()
    //
    // };
    signature = (source) => {
        // Popup.show(<SSignature showDelBtn showCloseBtn={false} source={source} saveData={this.saveSign}/>);

    };
    handleClick = () => {
        let blueParams = {
            isFilter: true,
            blueteeth: [{
                sn: '1234567893',
                id: 'a1234567894',
                name: 'dev01',
                code: 'a1234567894',
                mac: '68:9E:19:03:AB:72',
            }, {
                sn: '1234567894',
                id: 'b1234567894',
                name: 'dev02',
                mac: '68:9E:19:03:7F:5E',
            }]
        }
        let a = YYPlusUtils.blueToothScan(blueParams);
        console.log(a)
    }

    render() {
        let source = {
            sourceId: '980474b965bfa7df43fff4208fa7e30',  //主表单据id，子表附件也取主表id
            sourceType: 'aerialDrawing',  //业务类型（可自定义），与PC端保持一致，子表的sourceType: 子表id+ '_' +业务类型
            billType: 'POV01'  //单据类型
        }
        const {form} = this.props;
        const {searchText, vava} = this.state;
        let data = [{label: '是', value: '1'}, {label: '否', value: '0'}];

        const footerList = ['待办', '已保存', '已提交', '未完成', '待验收', '已完成', '呵呵'];
        return (
            <div>
                <SSForm>
                    <SSNavBar title='测试用例'/>
                    <SSTab display="none" names={['未完成', '已完成']}/>
                    <List>
                        <SearchBar placeholder="搜索"/>
                        <SSDatePicker
                            iconColor="#108ee9"
                            field='dealDate'
                            form={form}
                            mode='datetime'
                            required={true}
                            label="处理日期"
                            format="YYYY-MM-DD hh:mm:ss"
                            onChange={v => {
                                this.setState({dealDate: v})
                            }}
                            value={new Date()}/>
                        <SSButton onClick={this.onClick} text='返回'></SSButton>
                        <SSButton onClick={this.handleClick}>呵呵</SSButton>
                        <SSButton onClick={this.jump} text='跳转'></SSButton>
                        <SSImagePicker label="附件3" source={source} showWaterMark showScrawlBtn/>
                        <SSIcon color="red" icon="icon-Add"/>
                        <SSInput label="主讲单位2" form={form} disabled value="432534553"/>
                        <SSRefer
                            field="relatedFuncId"
                            onCheck={this.onOk}
                            icon="icon-xingzhuang1"
                            iconColor="#FFBF00"
                            label="主讲单位"
                            referName="主讲单位参照"
                            referCode="0006"
                            form={form}
                            multiMode={true}
                            referStyle="tree"
                            displayStyle="2"
                            required
                        />
                        <SSRefer
                            field="relatedFunc"
                            icon="icon-xingzhuang1"
                            iconColor="#FFBF00"
                            label="环境因素"
                            onCheck={this.onOk}
                            referName="主讲单位参照"
                            referCode="environment_ierc"
                            form={form}
                            multiMode={true}
                            referStyle="list"
                            displayStyle="2"
                            required
                        />
                        <SSButton text='签字' onClick={() => this.signature(source)}/>
                        <SSImagePicker label="签字" source={source} displayStyle="2" multipleSign maxSize={20}/>
                        <SSInput showIcon={false} label="测试图标粉丝发生的放松放松防水" form={form}/>
                        <SSTextarea disabled required field="myary" footerList={footerList}
                                    value="测试图标粉丝发生的放松放松防水测试图标粉丝发生的放松放松防水测试水测试粉丝松防水测试图标粉丝发生的放松放松防水测试水测试粉丝松防水测试图标粉丝发生的放松放松防水测试水测试粉丝松防水测试图标粉丝发生的放松放松防水测试水测试粉丝松防水测试图标粉丝发生的放松放松防水测试水测试粉丝发生的放松放松防水测试水测试图标"
                                    form={form} label="文本域"/>
                        <SSTextarea required field="area" footerList={footerList}
                                    value="测试图标粉丝发生的放松放松防水测试图标粉丝发生的放松放松防水测试水测试图标粉丝发生的放松放松防水测试水测试图标粉丝发生试图标粉丝发生的放松放松防水测试水测试图标粉丝发生的放松放松防水测试水测试图标粉丝发生试图标粉丝发生的放松放松防水测试水测试图标粉丝发生的放松放松防水测试水测试图标粉丝发生的放松放松防水测试图标粉丝发生的放松放松防水"
                                    form={form} label="文本域"/>
                        {/*<SSSwitch required displayStyle='2' field="switch" value={true} form={form} label="开关" unCheckedText="不通过" checkedText="通过" onChange={this.change}/>*/}
                        <SSSwitch required field="switch2" value={vava} onChange={this.onClick} form={form} label="开关"
                                  unCheckedText="不通过" checkedText="通过"/>
                        <SSStepper displayStyle='2' label="实到人数" icon='icon-xingzhuang3' color='#FFBF00' form={form}
                                   required field="actualNumber"/>
                        <SSPicker
                            label="隐患等级"
                            field="hiddenGrade"
                            displayStyle='2'
                            required
                            disabled
                            data={data}
                            form={form}
                            value={['0']}/>
                        {/*<SSTree referCode={'schedule_pp'}*/}
                        {/*referName={'参照'}*/}
                        {/*searchText={searchText}*/}
                        {/*multiMode={false}*/}
                        {/*></SSTree>*/}
                        <SSPicker form={form} data={data} onOk={this.onOk}/>
                        <SSButton text={'我不是针对个人'} type={'footer'}></SSButton>
                    </List>
                </SSForm>
            </div>
        );
    }
}

export default SSForm.create()(NativeDemo);