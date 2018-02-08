import React, {Component} from 'react';
import {List} from 'antd-mobile'
import SSForm from '../../form/SSForm';
import SSPage from '../../page/SSPage';
import SSList from '../../list/SSList';
import SSNavBar from '../../navbar/SSNavBar'
import SSTextarea from "../../textarea/SSTextarea";
import SSRefer from '../../refer/SSRefer'
import SSImagePicker from "../../image-picker/SSImagePicker";
const bgStyle = {
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 888,
    background: '#fff',
    color: "#333"
};
class ListTest extends SSPage {
    render() {
        const {form} = this.props;
        return (
            <SSForm>
                <SSNavBar
                    title='例子'
                    style={bgStyle}
                />
                {/*  <SSignature saveData={this.saveData}/>*/}

                <List>
                    <SSTextarea
                        field="workContent"
                        label='工作内容'
                        color='#148CFF'
                        form={form}
                        placeholder="在此输入工作内容..."
                        displayStyle='2'
                        required
                    />


                </List>
            </SSForm>


        )


    }
}

export default SSForm.create()(ListTest);