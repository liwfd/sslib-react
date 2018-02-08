import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SSIcon from '../icon/SSIcon'
class SSExtraItem extends Component {
    renderBackgroundImg(){
        var {extraIcon,extraIconColor}=this.props;
       /* const cls=`iconfont ${extraIcon}`;*/
        {/* <i className={cls} style={extraIconStyle}/>*/}

        return extraIcon?(
            <SSIcon icon={extraIcon} size="md" color={extraIconColor}/>

        ):null;
    }

    render() {
        var {text, extraStyle,extraIcon}=this.props;
        const cls = classNames({
            'listItem-extra': true,
            'listItem-extra-backgroundColor':extraIcon||extraStyle.backgroundColor?false:true,
            'listItem-extra-backgroundImg':extraIcon?true:false

        });


        return (
            <div>
                {this.renderBackgroundImg()}
                 <span className={cls} style={extraStyle}>{text}</span>
            </div>

        );
    }
}


export default SSExtraItem;