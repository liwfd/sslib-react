import React, {Component} from 'react';
import { Accordion } from 'antd-mobile/lib/index';

class SSAccordionPanel extends Component{
    render() {
        return (<Accordion.Panel {...this.props}>
            {this.props.children}
        </Accordion.Panel>);
    }
}

SSAccordionPanel.defaultProps = {
}

export default SSAccordionPanel;