import React, {Component} from 'react';
import SSIcon from "../icon/SSIcon";
import _ from 'lodash';
import SSCellCss from '../../../css/SSCell.css';

export default class SSInputCell extends Component {

    state = {
        cellArr: []
    }

    componentWillMount() {
        this.setValues(this.props.values);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.values !== this.props.values) {
            this.setValues(nextProps.values);
        }
    }

    setValues = (values) => {
        let arr = [];
        let result = [];
        let data = [];
        if(values){
            data = values.slice()
        }
        if (Array.isArray(data) && data.length > 0) {
            if((data.length % 4)>0){
                data.push(...new Array(4 - data.length % 4).fill(''));
            }
            for (let i = 0, len = data.length; i < len; i += 4) {
                result.push(data.slice(i, i + 4));
            }
            result.map((item, index) => {
                arr.push(this.getCellRow(index, item));
            })
        } else {
            // arr.push(this.getCellRow(0, new Array(4).fill('')));
        }
        this.setState({
            cellArr: arr
        })
    }

    onChange = () => {
        let values = this.getValues();
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);

        }
    }

    delCellRow = (index) => {
        if (_.isFunction(this.props.delCellRow)) {
            this.props.delCellRow(index);
        }
        /*let curArr = this.state.cellArr;
        curArr.splice(index, 1, null);
        this.setState({
            cellArr: curArr
        })*/
    }

    getCellRow = (index, rowData) => {
        const style1 = {
            margin: '7px 0 0 7px',
            float: 'left',
            border: '1px solid #ccc',
        };

        const style2 = {
            lineHeight: '33px',
            width: '19vw',
            border:'none',
            textAlign:'center'
        };

        const style3 = {
            // width: '12vw',
            paddingTop: 15,
            paddingRight: 10,
            // margin: '0 auto',
            // float: 'right',
        };


        return (<div key={index} style={{height: 45}} className='flexFather'>
            <div>
                {rowData.map((v, i) => {
                    return (<div key={4 * index + i} style={style1}><input value={v} type='number' onChange={this.onChange}
                                                                           style={style2}/></div>)
                })}
            </div>
            <div style={style3} onClick={this.delCellRow.bind(this, index)}className='flexSon2'>
                <SSIcon size='md' color='red' icon="icon-jianhao"/>
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

    render() {
        const {cellArr} = this.state;
        const style1 = {
            paddingTop: 14,
            paddingLeft: 5,
            textAlign:'right',
            paddingRight:10
        };
        return (
            <div style={{padding: '0 auto', marginLeft: '5px'}}>
                <form id="inputCell">
                    {cellArr}
                    <div style={style1} onClick={this.addCellRow}>
                        <SSIcon size='md' color='green' icon="icon-jiahao"/>
                    </div>
                    <div style={{clear: 'both'}}></div>
                </form>
            </div>
        );
    }
}
