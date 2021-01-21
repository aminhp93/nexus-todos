import React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Input, Radio, DatePicker, Modal } from 'antd';
import moment from 'moment';

import { createItemSuccess, markAllCompleted, markAllUnCompleted } from 'reducers/todos';
import { TTodoItem } from 'types';
import { formatTime } from 'constants/common';
import TodoItem from './TodoItem';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface IProps {
    todos: [TTodoItem];
    createItemSuccess: (TTodoItem) => void;
    markAllCompleted: () => void;
    markAllUnCompleted: () => void;
}

interface IState {
    todoText: string;
    type: string;
    time: moment.Moment;
    visible: boolean;
    contentModal: string;
    markAllChecked: boolean;
}

const INTERVAL_TIME = 1000

class Todos extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            todoText: '',
            type: 'all',
            time: null,
            visible: false,
            contentModal: null,
            markAllChecked: false
        }
    }

    componentDidMount() {
        // setInterval(() => {
        //     this.setState({
        //         time: moment()
        //     })
        // }, INTERVAL_TIME)
    }

    handleChange = (e) => {
        this.setState({
            todoText: e.target.value
        })
    }

    handleSizeChange = (e) => {    
        this.setState({ type: e.target.value })
    }

    handlePressEnter = () => {
        const name = this.state.todoText;
        this.props.createItemSuccess({ 
            name,
            time: this.state.time ? this.state.time.format(formatTime) : null
        })
        if (this.state.time) {
            // const diffTime = moment.duration(moment(this.state.time).diff(moment())).asMinutes()

            setTimeout(() => {
                this.setState({ visible: true, contentModal: name })
            }, 3000)
        }
        this.setState({
            todoText: '',
            time: null
        })
    }

    onChange = (value, dateString) => {
        if (!value) {
            this.setState({
                time: null
            })
        } else {
            this.setState({
                time: value
            })
        }
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
    }
      
    onOk = (value) => {
        // console.log('onOk: ', value);
        this.setState({
            time: value
        })
    }

    handleOk = () => {
        this.setState({ visible: false })
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    handleClickMarkAll = () => {
        this.setState({
            markAllChecked: !this.state.markAllChecked
        })
        if (this.state.markAllChecked) {
            this.props.markAllCompleted()
        } else {
            this.props.markAllUnCompleted()
        }
        
    }

    render() {
        const { todos } = this.props;
        const { todoText, type, time, visible, contentModal, markAllChecked } = this.state;
        const filterTodos = todos.filter(i => {
            if (type === 'active') {
                return !i.active
            } else if (type === 'complete') {
                return i.active
            } else {
                return i
            }
        })
        const leftCount = filterTodos.filter(i => !i.active).length

        return <div className="Todos">
            <div className="Todos-title red flex">
                todos
            </div>
            <div className="Todos-input-container flex">
    <div className="Todos-check-all" onClick={this.handleClickMarkAll}>{markAllChecked ? <DownOutlined style={{ fontSize: 20 }}/> : <UpOutlined style={{ fontSize: 20 }}/>}</div>
                <Input
                    className="Todos-input"
                    placeholder="What needs to be done?"
                    value={todoText}
                    onChange={this.handleChange}
                    onPressEnter={this.handlePressEnter}
                />
                <DatePicker 
                    placeholder="Set alert time"
                    className="Todos-datepicker" 
                    value={time} 
                    showTime 
                    format={formatTime}
                    onChange={this.onChange} 
                    onOk={this.onOk} />
            </div>
            <div>
                {filterTodos.map(i => <TodoItem key={i.id} data={i}/>)}
            </div>
            <div className="flex" style={{ margin: '20px 0 0 20px' }}>
                <div>{`${leftCount} item${leftCount > 1 ? 's' : ''} left`}</div>
                <div style={{
                    flex: 1,
                    justifyContent: 'center',
                    display: 'flex'
                }}>
                <Radio.Group value={type} onChange={this.handleSizeChange}>
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="active">Active</Radio.Button>
                    <Radio.Button value="complete">Completed</Radio.Button>
                </Radio.Group>
                </div>
            </div>
            <Modal title="WARNING" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <div>{contentModal}</div>
            </Modal>
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
    createItemSuccess,
    markAllCompleted,
    markAllUnCompleted
}

export default connect(mapStateToProps, mapDispatchToProps)(Todos)

