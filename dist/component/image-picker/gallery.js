import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ajax from '../../utils/ajax'
import classNames from 'classnames';
import {Toast} from 'antd-mobile'
import {Swiper} from 'react-weui';
import $ from 'jquery'


/**
 * Full screen photo display
 *
 */
class Gallery extends Component {
    static propTypes = {
        /**
         * indicate whather the component is display
         *
         */
        show: PropTypes.bool,
        /**
         * image source, string for single element, array for multiple element
         *
         */
        src: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        fileList: PropTypes.array,
        /**
         * indicate whather the component is display
         *
         */
        defaultIndex: PropTypes.number,
    };

    static defaultProps = {
        show: undefined,
        src: '',
        defaultIndex: 0
    }

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: this.props.defaultIndex
        };
    }

    handleClick(func) {

        return (e) => {

            if (func) func(e, this.state.currentIndex, this.getDataURL());
        };
    };

    componentDidUpdate() {
        if (this.props.scrawl) {
            this.createCanvas()
        }
    }


    createCanvas = () => {
        this.canvas = false;
        this.$canvas = false;
        this.context = false;
        this.drawing = false;
        this.currentPos = {
            x: 0,
            y: 0
        };
        this.lastPos = this.currentPos;
        this.transferBase64()
    };


    _renderCanvas = () => {
        if (this.drawing) {
            this.context.moveTo(this.lastPos.x, this.lastPos.y);
            this.context.lineTo(this.currentPos.x, this.currentPos.y);
            this.context.stroke();
            this.lastPos = this.currentPos
        }
    };

    _getPosition = (event) => {
        let xPos, yPos, rect;
        rect = this.canvas.getBoundingClientRect();
        event = event.originalEvent;
        // Touch event
        if (event.type.indexOf('touch') !== -1) { // event.constructor === TouchEvent
            xPos = event.touches[0].clientX - rect.left;
            yPos = event.touches[0].clientY - rect.top;
        }
        else {
            xPos = event.clientX - rect.left;
            yPos = event.clientY - rect.top
        }

        return {
            x: xPos,
            y: yPos
        }
    };

    getDataURL = () => {

        return this.props.scrawl && this.canvas ? this.canvas.toDataURL("image/png") : null
    };

    transferBase64 = () => {
        let that = this;
        let {fileList, src, defaultIndex} = this.props;
        let fileId = fileList[defaultIndex].gid;
        ajax.getJSON('https://dev.yonyouccs.com/icop-schedule-web/pub/getBase64FileByFileId', {fileId: fileId}, function (result) {
            if (result.success) {
                let imageURI = "data:image/jpeg;base64," + result.backData;//添加信息头，成为完整图片base64

                that.init(imageURI)
            } else {
                Toast.fail('请求出错,请重试')

            }


        }, function (err) {
            Toast.fail(err)
        });
    };


    init = (imageURI) => {
        $(document.body).css({overflow: 'hidden'});
        window.requestAnimFrame = (function (callback) {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimaitonFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60)
                }
        })();

        let {src, defaultIndex} = this.props;
        let drawBox = $('.draw-box');
        let that = this;
        let img = new Image();
        img.src = imageURI;
        this.canvas = document.createElement('canvas');
        this.context = that.canvas.getContext('2d');
        let clientWidth = document.body.clientWidth;

        img.onload = function () {
            let naturalWidth = img.naturalWidth;
            let naturalHeight = img.naturalHeight;

            let rate = clientWidth / naturalWidth;
            that.canvas.width = clientWidth;
            that.canvas.height = img.naturalHeight * rate;

            console.log(naturalWidth, naturalHeight, 'height', img.naturalHeight * rate);
            that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
            //利用canvas进行绘图
            that.context.drawImage(img, 0, 0, that.canvas.width, that.canvas.height);
            let span = $('<span>');
            span.css({color: '#fff'});
            span.text('你可以在下图进行涂鸦');

            drawBox.append(span, that.canvas);
            drawBox.on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            drawBox.find('canvas').on('mousedown touchstart', that.st = (e) => {
                that.drawing = true;
                that.lastPos = that.currentPos = that._getPosition(e)

            });
            drawBox.find('canvas').on('mousemove touchmove', (e) => {
                that.currentPos = that._getPosition(e);


            });

            drawBox.find('canvas').on('mouseup touchend', (e) => {
                that.drawing = false
            });

            $(document).on('touchstart touchmove touchend', (e) => {

                if (e.target === that.canvas) {
                    e.preventDefault()
                }
            });


            (function drawLoop() {
                window.requestAnimFrame(drawLoop);
                that._renderCanvas()
            })()

        }
    }


    renderImages(imgs) {
        return (
            <div className="weui-gallery__img">
                <Swiper
                    indicators={false}
                    defaultIndex={this.props.defaultIndex}
                    onChange={(prev, next) => this.setState({currentIndex: next})}
                >
                    {
                        imgs.map((img, i) => {
                            const imgStyle = {
                                backgroundImage: `url(${img})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center',
                            };
                            const btnStyle = {
                                position: 'absolute',
                                right: 10,
                                top: 10,
                                padding: '5 8',
                                fontStyle: 'normal',
                                backgroundColor: 'red'
                            };
                            return (
                                <span key={i} style={imgStyle}></span>
                            );
                        })
                    }
                </Swiper>
            </div>
        );
    }

    renderOprs() {
        if (Array.isArray(this.props.children)) {
            return this.props.children.map((child, i) => {
                if (child) {
                    return React.cloneElement(child, {
                        key: i,
                        onClick: this.handleClick(child.props.onClick)
                    });
                }

            });
        } else {
            if (this.props.children) {
                return React.cloneElement(this.props.children, {
                    onClick: this.handleClick(this.props.children.props.onClick)
                });
            } else {
                return false;
            }
        }
    }

    render() {
        const {children, className, show, src, defaultIndex, scrawl, fileList, ...others} = this.props;

        const cls = classNames({
            'weui-gallery': true,
            [className]: className
        });

        if (!show) return false;
        const style = {
            position: 'absolute',
            top: '50%',
            transform: 'translate(0, -49%)'

        };
        return (
            <div className={cls} style={{display: show ? 'block' : 'none'}} {...others}>
                {
                    scrawl ?
                        <div className="draw-box" style={style}></div> : Array.isArray(src) ? this.renderImages(src)
                        : <span className="weui-gallery__img" style={{backgroundImage: `url(${src})`}}></span>
                }

                <div className="weui-gallery__opr">
                    {
                        this.renderOprs()
                    }
                </div>
            </div>
        );
    }
}

export default Gallery;
