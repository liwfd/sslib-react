import React, {Component} from 'react';
import {createForm} from 'rc-form';
import $ from 'jquery';

let flag = false;
class SSForm extends Component {

    componentDidMount() {

        $('#ss-form').on('touchstart touchmove touchend', function(event) {
            switch(event.type) {
                case 'touchstart':
                    flag = false;
                    break;
                case 'touchmove':
                    event.stopPropagation();
                    let inputs = document.getElementsByTagName('input');
                    let textareas = document.getElementsByTagName('textarea');
                    let inputArr = Array.from(inputs);
                    let textareaArr = Array.from(textareas);
                    inputArr.push(...textareaArr);
                    if (Array.isArray(inputArr) && inputArr.length > 0) {
                        inputArr.map((item) => {
                            setTimeout(() => {
                                item.blur();
                            }, 300);
                        })
                    }
                    flag = true;
                    break;
                case 'touchend':
                    if( !flag ) {
                        // console.log('点击');
                    } else {
                        event.stopPropagation();
                        // console.log('滑动');
                    }
                    break;
            }
        });
    }

    render() {
        return (
            <div id='ss-form'>
                <form>
                    {this.props.children}
                </form>
            </div>);

    }
}


SSForm.create = createForm;
export default SSForm;