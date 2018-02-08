import React, {Component} from 'react';
import { Accordion } from 'antd-mobile/lib/index';
import '../../../css/SSAccordion.css'

class SSAccordion extends Component{
    render() {
        const { whiteHeader } = this.props;
        return (<Accordion className={whiteHeader ? "" : "ss-accordion"} {...this.props}>
            {this.props.children}
        </Accordion>);
    }
}
SSAccordion.defaultProps = {
    whiteHeader: false  //折叠卡片header颜色（默认灰色，设置为true则为白色）
}
export default SSAccordion;