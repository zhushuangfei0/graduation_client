/**
 * Created by zhushuangfei on 2018/3/22.
 */

import React, {Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './stepTwo.scss'
import {Button, Icon, message, Upload} from 'antd';
import {Map} from 'immutable'
import {connect} from 'react-redux'
import * as apiConfig from 'Utils/apiConfig'

class stepTwo extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                companyseal: '',
                loading: false,
                finish: false
            })
        }
    }

    componentDidMount() {
        //console.log(this.props.changeUserId.getIn(['data']));
    }

    //图片上传验证
    beforeUpload = (file) => {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        if (!isJPG) {
            message.error('你只能上传JPG或者png文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isJPG && isLt2M;
    };

    //预览图片的
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    //图片上传状态监控
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({
                data: this.state.data.update('loading', () => true)
                    .update('companyseal', () => '')
                    .update('finish', () => false)
            });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                data: this.state.data.update('companyseal', () => imageUrl)
                    .update('loading', () => false)
                    .update('finish', () => true)

            }));
        }
        if (info.file.status === 'error') {
            message.error('对不起上传失败，请检查图片类型或服务器错误!');
            this.setState({
                data: this.state.data.update('loading', () => false)
                    .update('companyseal', () => '')
                    .update('finish', () => false)
            })
        }
    };

    handleNext = () => {
        if (this.state.data.get('finish')) {
            this.props.next();
        } else {
            message.error('请上传图片！')
        }

    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.data.get('loading') ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className={style.uploadbox}>
                <Upload
                    name="image"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={`${apiConfig.HOST}/api/v1/cn/edu/ahut/user/updateImage`}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    data={
                        {
                            id: this.props.changeUserId.getIn(['data'])
                        }
                    }
                >
                    {
                        this.state.data.get('companyseal') ?
                            <img width="284" height="284" src={this.state.data.get('companyseal')} alt=""/> :
                            uploadButton
                    }
                </Upload>
                <div className={style.btnbox}>
                    <Button type="primary" onClick={this.handleNext}>下一步</Button>
                </div>
            </div>
        )

    }
}


export default connect((state) => {
    return {
        changeUserId: state.getIn(['changeUserId'])
    }
})(stepTwo)


