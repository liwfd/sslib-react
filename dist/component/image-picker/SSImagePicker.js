/**
 * Created by liulei on 2017/8/24.
 */
import React, {Component} from 'react';
import {List, WhiteSpace, Modal, ImagePicker, Toast, Popup, ActivityIndicator} from 'antd-mobile/lib/index';
import Gallery from './gallery'
import {GalleryDelete} from 'react-weui';
import classNames from 'classnames'
import PropTypes from 'prop-types';
import SSignature from '../signature/SSignature'
import '../../../css/SSImagePicker.css';
import SSIcon from '../icon/SSIcon'
import _ from 'lodash';
import UploadFileUtils from '../../utils/UploadFileUtils';
import ajax from '../../utils/ajax'
import BaseHost from '../../utils/BaseHost'
const uploadUrl = '/icop-file/file/muploadx';
const delUrl = '/icop-file/file/del';
const ADDR = BaseHost.ADDR;
const Item = List.Item;
const alert = Modal.alert;

class SSImagePicker extends Component {
    state = {
        files: this.props.files,
        showGallery: false,
        eidtBtnColor: '#fff',
        saveBtnColor: 'gray',
        scrawl: false,
        animating: false,
        showSignPanel:false
    };
    static propTypes = {
        selectable: PropTypes.bool,
        icon: PropTypes.string,
        iconColor: PropTypes.string,
        label: PropTypes.string,
        maxSize: PropTypes.number,
        disabled: PropTypes.bool,
        source: PropTypes.object,
        files: PropTypes.array,
        showWaterMark: PropTypes.bool,
        multipleSign: PropTypes.bool,
        showScrawlBtn: PropTypes.bool,

    };

    static defaultProps = {
        selectable: true,
        icon: 'icon-xingzhuang8',
        iconColor: '',
        label: '附件',
        maxSize: 5,
        disabled: false,
        scrawl: false,
        files: [],
        source: {
            billType: '',
            sourceType: '',
            sourceId: ''
        },
        displayStyle: '1',
        showWaterMark: false,
        showScrawlBtn: false,

    };

    onChange = (files, type, index) => {
        console.log(files, 'flas')
        let that = this;

        if (type == 'add') {
            UploadFileUtils.multiFilesUpLoad(files[files.length - 1], this.props.source.billType, {
                sourceId: this.props.source.sourceId,
                sourceType: this.props.source.sourceType
            }, (fileList) => {
                that.setState({
                    files: that.state.files.concat(fileList)
                });
                //如果是签字模式，成功隐藏窗口
                if (this.props.multipleSign) {
                    this.setState({
                        showSignPanel:false
                    })
                }
                if (_.isFunction(this.props.onChange)) {
                    this.props.onChange(that.state.files);
                }
            }, that.props.showWaterMark);
        } else if (type == 'remove') {
            const alertInstance = alert('删除', '删除后不可恢复!', [
                {
                    text: '取消', onPress: () => {
                    alertInstance.close();
                }, style: 'default'
                },
                {
                    text: '确定', onPress: () => {
                    if (this.props.source.sourceId) {
                        let params = {
                            id: this.props.source.sourceId,
                            billType: this.props.source.billType,
                            sourceType: this.props.source.sourceType,
                            attachIds: this.state.files[index].gid
                        };
                        UploadFileUtils.delAttach(params, () => {
                            //删除成功的回调
                            that.existCanvas = false;
                            that.setState({
                                files: files,
                                scrawl: false
                            })
                            if (_.isFunction(this.props.onChange)) {
                                this.props.onChange(files);
                            }
                        });
                    } else {
                        that.existCanvas = false;
                        that.setState({
                            files: files,
                            scrawl: false
                        })
                        if (_.isFunction(this.props.onChange)) {
                            that.props.onChange(files);
                        }
                    }
                }
                },
            ]);
        }
    };
    onImageClick = (index) => {
        this.setState({
            showGallery: true,
            gallery: {
                index: index
            },
            eidtBtnColor: '#fff',
            saveBtnColor: 'gray'
        })
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.source && this.props.source.sourceId != nextProps.source.sourceId) {
            this.loadAttachList(nextProps.source);
        }
        if (JSON.stringify(nextProps.files) !== JSON.stringify(this.props.files)) {
            this.setState({
                files: nextProps.files
            })
        }
    }

    loadAttachList(source) {
        let params = {
            id: source.sourceId,
            billType: source.billType,
            type: source.sourceType
        };
        let that = this;
        if (source.sourceId && source.sourceType && source.billType) {
            UploadFileUtils.loadAttachList(params, (fileList) => {
                that.setState({
                    files: fileList
                })
            })
        }
    }

    componentDidMount() {
        if (this.props.source) {
            this.loadAttachList(this.props.source);
        }
    }

    galleryClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        //防止Gallery在未unmount时调用setState导致内存泄漏的警告
        document.body.style.overflow = 'auto';
        this.existCanvas = false;
        let that = this;
        setTimeout(() => {
            that.setState({
                gallery: that.state.files.length <= 1 ? true : false,
                showGallery: false,
                scrawl: false,
            })
        }, 300);
    };
    gallerySaveClick = (e, index, imgData) => {
        e.preventDefault();
        e.stopPropagation();

        if (imgData) {

            let params = this.props.source;
            let content = imgData.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', '');

            params.files = [
                {
                    fileName: `${params.sourceType}.jpg`,
                    fileContent: content,
                }
            ];
            let that = this;
            let fileList = [];
            ajax.postJSON(ADDR + uploadUrl, params, function (result) {
                let backData = result.backData;

                if (result.success) {

                    if (backData.length) {
                        for (var i = 0; i < backData.length; i++) {
                            var item = backData[i];
                            var thumbUrl = ADDR + '/' + UploadFileUtils.zoomImgPath(item.filePath, '_100x100');
                            var originalUrl = ADDR + '/' + UploadFileUtils.zoomImgPath(item.filePath);
                            var fileUrl = ADDR + '/' + item.filePath;
                            var file = {
                                gid: item.gid,
                                name: item.fileName,
                                url: thumbUrl,
                                originalUrl: originalUrl,
                                fileUrl: fileUrl,
                                status: 'done',
                                backData: item
                            };
                            fileList.push(file)
                        }
                    }
                    Toast.success(result.backMsg ? result.backMsg : '保存成功!', 1);
                    that.setState({
                        showGallery: false,
                        files: that.state.files.concat(fileList)

                    });

                    if (params.sourceId) {
                        let oldParams = {
                            id: params.sourceId,
                            billType: params.billType,
                            sourceType: params.sourceType,
                            attachIds: that.state.files[index].gid
                        };
                        ajax.getJSON(ADDR + delUrl, oldParams, function (data) {
                            if (data.success) {
                                that.existCanvas = false;
                                that.setState({
                                    files: that.state.files.filter((e, i) => i != index),
                                    gallery: that.state.files.length <= 1 ? true : false,
                                    showGallery: false,
                                    scrawl: false
                                })
                            } else {

                            }
                        }, function (error) {
                            Toast.fail('服务器请求失败!', 1)
                        })
                    } else {
                        that.setState({
                            files: that.state.files.filter((e, i) => i != index),
                            gallery: that.state.files.length <= 1 ? true : false,
                            showGallery: false,
                            scrawl: false
                        });
                        that.existCanvas = false;
                        if (_.isFunction(that.props.onChange)) {
                            that.props.onChange(that.state.files.filter((e, i) => i != index));
                        }
                    }


                } else {
                    Toast.fail(result.backMsg ? result.backMsg : '保存失败!', 1)
                }

            });

        }

    };
    galleryEditClick = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.existCanvas)return;//当已经涂鸦状态时
        this.existCanvas = true;
        this.setState({
            scrawl: true,
            saveBtnColor: '#fff',
            eidtBtnColor: 'gray',
            animating: true
        })
    };

    galleryDeleteClick = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        let that = this;
        const alertInstance = alert('删除', '删除后不可恢复!', [
            {
                text: '取消', onPress: () => {
                alertInstance.close();
            }, style: 'default'
            },
            {
                text: '确定', onPress: () => {
                that.existCanvas = false;
                if (this.props.source.sourceId) {
                    let params = {
                        id: this.props.source.sourceId,
                        billType: this.props.source.billType,
                        sourceType: this.props.source.sourceType,
                        attachIds: this.state.files[index].gid
                    };
                    UploadFileUtils.delAttach(params, () => {
                        that.setState({
                            files: that.state.files.filter((e, i) => i != index),
                            gallery: that.state.files.length <= 1 ? true : false,
                            showGallery: false,
                            scrawl:false
                        })
                    });
                } else {
                    that.setState({
                        files: that.state.files.filter((e, i) => i != index),
                        gallery: that.state.files.length <= 1 ? true : false,
                        showGallery: false,
                        scrawl:false
                    })
                    if (_.isFunction(this.props.onChange)) {
                        that.props.onChange(that.state.files.filter((e, i) => i != index));
                    }
                }
            }
            },
        ]);
    }

    onAddImageClick = () => {
        let that = this;
        if (navigator.userAgent.match(/(Android)/i)) {
            navigator.camera.getPicture((imageURI) => {

                if (imageURI) {
                    imageURI = "data:image/jpeg;base64," + imageURI;//添加信息头，成为完整图片base64
                    let file = {};
                    file.fileName = this.props.source && this.props.source.sourceType ? this.props.source.sourceType + '_' + new Date().getTime() + '.jpg' : 'attach_' + new Date().getTime() + '.jpg';
                    file.fileContent = imageURI.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', '');
                    that.onChange(that.state.files.concat({files: [file]}), 'add');
                }
            }, (message) => {
            })
        }
    };
    saveSign = (multipleSign, params) => {
        if (multipleSign) {
            let file = params.files
            this.onChange(this.state.files.concat({files: file}), 'add');
        }


    };
    onAddSign = () => {
        //let {source, multipleSign} = this.props;
        this.setState({
            showSignPanel:true
        })
        //Popup.show(<SSignature source={source} saveData={this.saveSign} multipleSign/>);
    };

    renderGallery() {
        if (!this.state.gallery) return false;
        let {scrawl, showGallery, gallery, eidtBtnColor, saveBtnColor, files} = this.state;
        let srcs = this.state.files.map(file => file.originalUrl);
        const btnStyle = {
            verticalAlign: 'middle',
            width: '22px',
            height: '22px',
            display: 'inline',
        };
        let showScrawlBtn = this.props.showScrawlBtn;
        return (
            <Gallery
                src={srcs}
                scrawl={scrawl}

                fileList={files}
                show={showGallery}
                defaultIndex={gallery.index}
                onClick={this.galleryClick}
            >{showScrawlBtn ?
                <SSIcon icon='icon-edit' color={eidtBtnColor} style={btnStyle} onClick={this.galleryEditClick}/> : null}
                <SSIcon icon='icon-shanchu1' color='#fff' style={Object.assign(btnStyle, {margin: '0 35px'})}
                        onClick={this.galleryDeleteClick}/>
                {showScrawlBtn ? <SSIcon icon='icon-baocun' color={saveBtnColor} style={btnStyle}
                                         onClick={this.gallerySaveClick }/> : null}
            </Gallery>


        )
    }

    render() {
        const {files,showSignPanel} = this.state;
        const {icon, disabled, maxSize, iconColor, label, required, displayStyle, multipleSign,source} = this.props;
        let ico = (<div>
            <SSIcon icon={icon} color={iconColor}/>
            <span style={{marginLeft: '0.3rem'}}>
                        {label}
                    </span>
            <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
        </div>)
        switch (displayStyle) {
            case '2':
                ico = (<div>
                    <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
                    <span style={{marginLeft: required ? 0 : '0.3rem'}}>
                        {label}
                    </span>
                </div>)
                break;
            default:
                break
        }
        const cls = classNames({
            'none': disabled,
            'signature': multipleSign
        });
        return (
            <div className={cls}>
                <WhiteSpace size="lg"/>
                <Modal visible={showSignPanel} popup onClose={()=>{this.setState({showSignPanel:false})}}>

                    <SSignature onClose={()=>{this.setState({showSignPanel:false})}} source={source} saveData={this.saveSign} multipleSign/>
                </Modal>
                { this.renderGallery() }
                <Item>
                    {ico}
                    <ImagePicker
                        files={files}
                        onChange={disabled ? null : this.onChange}
                        onImageClick={this.onImageClick}
                        selectable={!disabled && files.length < maxSize}
                        onAddImageClick={multipleSign ? this.onAddSign : this.onAddImageClick}
                    />
                </Item>
            </div>
        );
    }
}

export default SSImagePicker;