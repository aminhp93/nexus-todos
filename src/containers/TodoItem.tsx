import React from 'react';
import { Checkbox, Input, DatePicker } from 'antd';
import { get } from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';


import {
    CloseCircleOutlined,
} from '@ant-design/icons';
import onClickOutside from 'react-onclickoutside'

import { TTodoItem } from 'types';
import { deleteItemSuccess, updateItemSuccess } from 'reducers/todos';
import { formatTime } from 'constants/common';


interface IProps {
    data: TTodoItem;
    updateItemSuccess: any;
    deleteItemSuccess: any;
}

interface IState {
    isEdit: boolean;
    todoText: string;
}

class TodoItem extends React.Component<IProps, IState> {
    dom: any;

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            todoText: props.data.name
        }

        this.dom = React.createRef();
    }

    handleDoubleClick = () => {
        this.setState({
            isEdit: true
        })
    }

    handleClickOutside = () => {
        const { data } = this.props;
        const updatedItem = {
            id: data.id,
            name: this.state.todoText
        }
        this.props.updateItemSuccess(updatedItem)
        this.setState({
            isEdit: false
        })
    }

    handleClickCheckbox = e => {
        const { data } = this.props;
        const newItem = {id: data.id, active:e.target.checked}
        this.props.updateItemSuccess(newItem)
    }

    handleChangeInput = e => {
        
        this.setState({
            todoText: e.target.value
        })
    }

    handleDelete = () => {
        const id = this.props.data.id;
        this.props.deleteItemSuccess({ id })
    }

    onChange = () => {


    }

    onOk = () => {

    }

    handlePressEnter = () => {
        const { data } = this.props;
        const updatedItem = {
            id: data.id,
            name: this.state.todoText
        }
        this.props.updateItemSuccess(updatedItem)
        this.setState({
            isEdit: false
        })
    }

    getLeftTime = data => {
        const duration = moment.duration(moment(data).diff(moment()));
        const minutes = duration.asMinutes()
        if (minutes < 60) {
            return `in ${minutes.toFixed(0)} minutes`
        } else if (minutes < 59 * 24) {
            return `in ${duration.asHours().toFixed(0)} hours`
        }
        return data
    }

    render() {
        const { data } = this.props;
        const { isEdit, todoText } = this.state;
        return <div className="flex TodoItem" ref={dom => this.dom = dom}>
            <Checkbox
                checked={data.active}
                onChange={this.handleClickCheckbox}
            />
            <div className="flex TodoItem-input-container">
                {
                    isEdit
                    ? <div className="flex" style={{ flex: 1}}>
                        <Input
                            value={todoText}
                            onChange={this.handleChangeInput}
                            onPressEnter={this.handlePressEnter}
                            style={{
                                height: '51px'
                            }}
                        />
                    </div>
                    : <div className={`flex TodoItem-content ${data.active ? 'completed' : ''}`} style={{ flex: 1 }} onDoubleClick={this.handleDoubleClick}>
                        <div>{data.name}</div>
                        {data.time && <div style={{ marginRight: '20px' }}>{this.getLeftTime(data.time)}</div>}
                    </div>
                }
                <div style={{ width: "60px"}}>
                <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} onClick={this.handleDelete}/>
                </div>
                
                
            </div>
        </div>
    }
}


const mapStateToProps = (state) => {
    const todos = get(state, 'todos') || [];
    return {
        todos
    };
}

const mapDispatchToProps = {
    deleteItemSuccess,
    updateItemSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(TodoItem))
