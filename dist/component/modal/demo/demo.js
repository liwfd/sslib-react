import React, {Component} from 'react';
import SSCell from "../../cell/SSCell";
import SSInputCell from "../../cell/SSInputCell";
import SSPage from "../../page/SSPage";
import SSInput from "../../input/SSInput";
import SSForm from "../../form/SSForm";
import SSTextarea from "../../textarea/SSTextarea";

export default class demo extends SSPage {
    state = {
        values: [2, 4, 4, 5, 6],
        values3: [2, 4, 4],
        key: 3,
        focus: false
    }

    test = () => {
        let values = this.refs.rangeCell.getValues();
    }

    test2 = () => {
        this.setState({
            values: [1, 4, 4, 5, 6, 4, 6, 7, 9],
            values3: null,
            key: 4
        })
    }

    test3 = () => {
        this.routeTo('/', {}, {curState: this.state});
    }

    componentWillReceiveProps(nextProps, nextState) {
    }

    onChange = (values) => {
    }

    render() {
        let values = this.state.values;
        let values3 = this.state.values3;
        let values2 = ['是', '否', '是', '否', '是', '否', '是'];
        const {form} = this.props;
        return (
            <div>
                <SSForm>
                    {/*<SSInputCell ref='inputCell' onChange={this.onChange} key={this.state.key} values={values}/>*/}
                    <SSInputCell ref='inputCell' onChange={this.onChange} values={values3}/>
                    <SSCell ref='mgCell' onChange={this.onChange} values={values} type='ynCell'/>
                    {/*<SSCell ref='mgCell' onChange={this.onChange} values={values} type='mgCell'/>*/}
                    {/*<SSCell ref='rangeCell' onChange={this.onChange} values={values} type='rangeCell'/>*/}
                    <input id='abc'/><br/>
                    <input id='abcd'/><br/>
                    <input/><br/>
                    <SSTextarea
                        field="area"
                        value="爱神的箭福利卡时代峻峰爱神的箭福利卡时代峻峰爱神的箭福利卡时代峻峰"
                        form={form}
                        label="文本域"/>
                </SSForm>

                <button onClick={this.test2}>点击</button>
            </div>
        );
    }
}