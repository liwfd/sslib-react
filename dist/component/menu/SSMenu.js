import React, {Component} from 'react';
import _ from 'lodash';
import classNames from '../../utils/classnames'
import SSMenuCss from '../../../css/SSMenu.css';
import SSIcon from "../icon/SSIcon";

export default class SSMenu extends Component {

    state = {
        cellArr: [],
        isDown:false
    }

    componentWillMount() {
        this.setValues(this.props.values);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.values !== this.props.values) {
            this.setValues(nextProps.values);
        }
    }

    setValues = (values) => {
        let arr = [];
        let result = [];
        let data = [];
        if (values) {
            data = values.slice()
        }
        if (Array.isArray(data) && data.length > 0) {
            data.push(...new Array(4 - data.length % 4).fill(''));
            for (let i = 0, len = data.length; i < len; i += 4) {
                result.push(data.slice(i, i + 4));
            }
            result.map((item, index) => {
                arr.push(this.getCellRow(index, item));
            })
        } else {
            arr.push(this.getCellRow(0, new Array(4).fill('')));
        }
        this.setState({
            cellArr: arr
        })
    }



    delCellRow = (index) => {
        let curArr = this.state.cellArr;
        curArr.splice(index, 1, null);
        this.setState({
            cellArr: curArr
        })
    }

    getCellRow = (index, rowData) => {
        const style1 = {
            margin: '7px 0 0 7px',
            float: 'left',
            border: '1px solid #ccc',
        };

        const style2 = {
            lineHeight: '2.15',
            width: '19vw'
        };

        const style3 = {
            width: '9vw',
            display: 'inline-block',
            paddingTop: 15,
            paddingLeft: 5,
            margin: '0 auto',
            float: 'right',
        };


        return (<div key={index} style={{height: 45}}>
            {rowData.map((v, i) => {
                return (<div key={4 * index + i} style={style1}><input defaultValue={v} type='number'
                                                                       onChange={this.onChange}
                                                                       style={style2}/></div>)
            })}
            <div style={style3}>
                <SSIcon size='md' color='red' onClick={this.delCellRow.bind(this, index)} icon="icon-shanchu1"/>
            </div>
        </div>);
    }

    addCellRow = () => {
        let curArr = this.state.cellArr;
        curArr.push(this.getCellRow(curArr.length, new Array(4).fill('')));
        this.setState({
            cellArr: curArr
        })
    }

    getValues = () => {
        let form = document.getElementById('inputCell');
        let values = new Array();
        let tagElements = form.getElementsByTagName('input');
        for (let i = 0; i < tagElements.length; i++) {
            tagElements[i].value && values.push(tagElements[i].value);
        }
        return values;
    }
    menuTopClick=()=>{
        if(this.state.isDown){
            this.setState({
                isDown:false
            })
        }else{
            this.setState({
                isDown:true
            })
        }
    };
    maskClick=()=>{
        this.slideUp();
    }
    slideUp=()=>{
        this.setState({
            isDown:false
        })
    };
    onClick1 = (res) => {
         if (_.isFunction(this.props.onClick)) {
             this.props.onClick(res);
         }
        this.setState({
            txt:res.label,
        });
        this.slideUp();

    }

    render() {
        const {txt} = this.props;
        const cls=classNames({
            menuTop:true,
            active:this.state.isDown?true:false,
        });
        const arr = [
            {
                index:0,
                label:'直接取数值法'
            },
            {
                index:1,
                label:'极差值测量法'
            },
            {
                index:2,
                label:'基准尺寸偏差测量法'
            },
        ];

        return (
            <div>
                <div className='menu' onBlur={this.slideUp}>
                    <div className={cls} onClick={this.menuTopClick}>
                        <span className='menuTopLeft'>{txt}</span>
                        <span className='down'/>
                    </div>
                    <div className='menuContainer' style={{display:this.state.isDown?'':'none'}}>
                        <ul className='menuList'>
                            {
                                arr.map((item,index)=>{
                                    return(
                                        <li className='item' key={index} onClick={()=>{this.onClick1(item)}}>
                                            <span>{item.label}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className='mask' onClick={this.maskClick} style={{display:this.state.isDown?'':'none'}}/>
            </div>

        );
    }
}
SSMenu.defaultProps = {
    txt: '下拉菜单头部'
};