import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from '../../utils/classnames';
import { LoadMore } from 'react-weui';

import '../../../css/SSInfiniteLoader.less';

/**
 *  A Container trigger loading once it reach certain scrolltop
 *
 */
class SSInfiniteLoader extends Component{

    static propTypes = {
        /**
         * height for the container, use string like '10px', default for '100vh'
         *
         */
        height: PropTypes.string,
        /**
         * element(icon) for default loader when there is no more content
         *
         */
        loaderDefaultIcon: PropTypes.object,
        /**
         * element(icon) for loading loader
         *
         */
        loaderLoadingIcon: PropTypes.object,
        /**
         * percentage of scrollTop to trigger loading
         *
         */
        triggerPercent: PropTypes.number,
        /**
         * callback when user scroll the content, pass event
         *
         */
        onScroll: PropTypes.func,
        /**
         * callback when user did not scroll for 150ms
         *
         */
        onScrollEnd: PropTypes.func,
        /**
         * callback when it's requesting for more content, pass resolve function and finish function
         *
         */
        onLoadMore: PropTypes.func,
        /**
         * disable the loader
         *
         */
        disable: PropTypes.bool,
    };

    static defaultProps = {
        height: '100vh',
        triggerPercent: 100,
        loaderLoadingIcon: <LoadMore loading> 加载中... </LoadMore>,
        loaderDefaultIcon: <LoadMore showLine> 无更多数据 </LoadMore>,
        disable: false
    }

    constructor(props){
        super(props);

        this.state = {
            loading: false,
            finish: false,
            scrollTimer: null
        };

        this.scrollHandle = this.scrollHandle.bind(this);
        this.resolveLoading = this.resolveLoading.bind(this);
        this.finish = this.finish.bind(this);
        
    }

    finish(){
        this.setState({
            loading: false,
            finish: true
        });
    }

    resolveLoading(){
        this.setState({
            loading: false,
            finish: false
        });
    }

    scrollHandle(e){
        if (this.props.onScroll) this.props.onScroll(e);
        if (this.state.loading || this.state.finish || this.props.disable || e.target.scrollTop === 0) return;

        //setup for scrollend event
        clearTimeout(this.state.scrollTimer);
        this.setState({ scrollTimer: setTimeout( ()=>{
            if (this.props.onScrollEnd) this.props.onScrollEnd();
        }, 150) });

        let target = e.target;
        let scrollPercent = Math.floor(( (target.scrollTop + target.clientHeight) / target.scrollHeight) * 100);

        if (scrollPercent >= this.props.triggerPercent) {
            this.setState({
                loading: true
            });

            this.props.onLoadMore(this.resolveLoading, this.finish);
        }
    }

    render(){

        const { children, className, height, disable, loaderLoadingIcon, loaderDefaultIcon} = this.props;
        const clx = classNames( 'react-weui-infiniteloader', className );

        let containerStyle = {
            height,
        };

        let contentStyle = {
            overflow: disable ? 'hidden' : 'scroll'
        };

        let loaderStyle = {
            display: this.state.loading || this.state.finish ? 'block' : 'none'
        };

        return (
            <div
                className={clx}
                style={containerStyle}
                onScroll={this.scrollHandle}
            >
                <div
                    className="react-weui-infiniteloader__content"
                    style={contentStyle}
                    ref="container"
                >
                    { children }
                    <div style={loaderStyle}>
                        { this.state.finish ? loaderDefaultIcon : this.state.loading ? loaderLoadingIcon : false }
                    </div>
                </div>
            </div>
        );
    }
}

export default SSInfiniteLoader;
