/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React, {Component} from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './stepOne.scss'
import {Form, Select, Input, Button, Upload, Icon, message} from 'antd';
import {Map} from 'immutable'

const FormItem = Form.Item;
const Option = Select.Option;
import {AsyncPost} from 'Utils/utils'
import {change} from 'RAndA/UserId'
import {connect} from 'react-redux';

class stepOne extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                departmentList: [],
            })
        }
    }


    componentDidMount() {
        AsyncPost('/api/v1/cn/edu/ahut/department/listAll', {}, "get", (data) => {
            if (data.code === 0) {
                this.setState({
                    data: this.state.data.update('departmentList', () => data.result)
                });
            }
        })
    }

    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                AsyncPost('/api/v1/cn/edu/ahut/user/saveUser', {
                    userName: values.userName,
                    userCode: values.userCode,
                    departmentName: values.departmentName,
                    role: values.role,
                }, 'post', (data) => {
                    this.props.dispatch(change(data.userId));
                    this.props.next()
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        return (
            <div>
                <div className={style.from_box}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="选择部门"
                        >
                            {getFieldDecorator('selectDepartment', {
                                rules: [
                                    {required: true, message: '请选择您的部门 !'},
                                ],
                            })(
                                <Select placeholder="请选择您的部门">
                                    {
                                        this.state.data.get('departmentList').map((data, index) => {
                                            return (
                                                <Option key={data.id}
                                                        value={data.departmentName}>{data.departmentName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="员工姓名">
                            {getFieldDecorator('userName', {
                                rules: [{
                                    required: true,
                                    message: '请输入员工姓名',
                                    whitespace: true
                                }],
                            })(
                                <Input placeholder="请输入员工姓名"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="员工编号">
                            {getFieldDecorator('userCode', {
                                rules: [{
                                    required: true,
                                    message: '请输入员工编号',
                                    whitespace: true
                                }]
                            })(
                                <Input placeholder="请输入员工编号"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择权限">
                            {getFieldDecorator('role', {
                                rules: [{
                                    required: true,
                                    message: '请选择员工权限',
                                }]
                            })(
                                <Select placeholder="请选择员工权限">
                                    <Option value="user">普通员工</Option>
                                    <Option value="admin">管理人员</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={style.submitbtnBox}>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )

    }
}

const WrappedDemo = Form.create()(stepOne);


export default connect(() => {
    return {}
})(WrappedDemo)
