import React from "react";
import { connect } from "react-redux";
import { Table, Button, Divider, message } from "antd";
import moment from "moment";

import Api from "../api";

import TodoDrawer from "../component/TodoDrawer";

import "./TodoListPage.scss";

class TodoListPage extends React.Component {
  todoDrawerRef = React.createRef();
  state = {
    // 开启table的 checkbox功能
    rowSelection: {},
    filteredInfo: {
      action: [-1]
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    loading: true
  };
  // 生成 antd table 组件的 columns
  getTableColumns() {
    return [
      {
        title: "ID",
        dataIndex: "id",
        align: "center",
        width: "40px"
      },
      {
        title: "标题",
        dataIndex: "title",
        align: "center",
        width: "200px"
      },
      {
        title: "内容",
        dataIndex: "content",
        align: "center",
        width: "400px"
      },
      {
        title: "截止日期",
        dataIndex: "deadline",
        align: "center",
        render: (text, record) => {
          return !text || moment(text).format("YYYY-MM-DD");
        }
      },
      {
        title: "状态",
        dataIndex: "status",
        align: "center",
        width: "80px",
        render: (text, record) => {
          switch (text) {
            case 1:
              return "待办";
            case 2:
              return "完成";
            case 3:
              return "删除";
            default:
              return "";
          }
        }
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        align: "center",
        filters: [
          {
            text: "全部",
            value: -1
          },
          {
            text: "待办",
            value: 1
          },
          {
            text: "完成",
            value: 2
          },
          {
            text: "删除",
            value: 3
          }
        ],
        filterMultiple: false,
        filteredValue: this.state.filteredInfo.action,
        render: (text, record) => {
          return (
            <div className="table-row-action">
              <Button size="small" onClick={() => this.editTodo(record)}>
                编辑
              </Button>
              {record.status == 1 && (
                <Button size="small" onClick={() => this.completed(record)}>
                  完成
                </Button>
              )}
              {record.status == 2 && (
                <Button size="small" onClick={() => this.uncompleted(record)}>
                  待办
                </Button>
              )}
              {record.status != 3 && (
                <Button
                  size="small"
                  onClick={() => this.delete(record)}
                  type="danger"
                >
                  删除
                </Button>
              )}
            </div>
          );
        }
      }
    ];
  }
  // 编辑
  editTodo(todo) {
    this.todoDrawerRef.current.show(todo, "任务详情");
  }
  async completed(todo) {
    let newTodo = {
      ...todo,
      status: 2
    };
    try {
      let { data } = await Api.post_todo_update(newTodo);
      if (data.code == 0) {
        this.updateTodoList(newTodo);
        message.success("设置任务完成成功");
      } else {
        throw new Error(data.errmsg || data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }
  async uncompleted(todo) {
    let newTodo = {
      ...todo,
      status: 1
    };
    try {
      let { data } = await Api.post_todo_update(newTodo);
      if (data.code == 0) {
        this.updateTodoList(newTodo);
        message.success("设置任务待办成功");
      } else {
        throw new Error(data.errmsg || data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }
  async delete(todo) {
    let newTodo = {
      ...todo,
      status: 3
    };
    try {
      let { data } = await Api.post_todo_update(newTodo);
      if (data.code == 0) {
        this.updateTodoList(newTodo);
        message.success("任务删除成功");
      } else {
        throw new Error(data.errmsg || data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }
  // 分页、排序、过滤 发生变化的时候触发
  tableOnChange(pagination, filters, sorter) {
    if (filters.action.length == 0) {
      filters.action = [-1];
    }
    // 过滤条件发生变化
    if (filters.action[0] != this.state.filteredInfo.action[0]) {
      this.loadTodoList(1, filters);
    } else {
      this.loadTodoList(pagination.current, filters);
    }
  }

  async loadTodoList(page = 1, filteredInfo) {
    filteredInfo = filteredInfo || { action: [-1] };
    this.setState({
      loading: true
    });
    try {
      let { data } = await Api.post_todo_list({
        page,
        status: filteredInfo.action[0]
      });
      if (data.code === 0) {
        this.props.dispatch({
          type: "UPDATE_TODOS",
          todos: data.data.rows
        });
        // 更新页码
        this.setState({
          pagination: {
            ...this.state.pagination,
            current: page,
            total: data.data.count
          },
          filteredInfo
        });
      } else {
        throw new Error(data.errmsg || data.message);
      }
    } catch (error) {
      // 加载列表失败
      message.error(error.message);
    } finally {
      this.setState({
        loading: false
      });
    }
  }
  // 更新单个的任务
  updateTodoList(newTodo) {
    let newTodos = this.props.todos.map(todo => {
      if (todo.id == newTodo.id) {
        return newTodo;
      } else {
        return todo;
      }
    });
    this.props.dispatch({
      type: "UPDATE_TODOS",
      todos: newTodos
    });
  }
  // 新增一个todo
  createTodo() {
    this.todoDrawerRef.current.show({}, "新增任务", 1);
  }
  // 组件挂载触发
  componentDidMount() {
    // 初始化列表数据
    this.loadTodoList(1, this.state.filteredInfo);
  }
  render() {
    let dataSource = this.props.todos;
    let columns = this.getTableColumns();
    return (
      <div className="todo-list-page">
        <Divider>任务列表</Divider>
        {/* action */}
        <div className="action-wrap">
          <Button onClick={() => this.createTodo()}>新增</Button>
        </div>
        {/* 数据列表 */}
        <Table
          rowKey="id"
          bordered={true}
          loading={this.state.loading}
          columns={columns}
          dataSource={dataSource}
          pagination={this.state.pagination}
          onChange={(pagination, filters, sorter) =>
            this.tableOnChange(pagination, filters, sorter)
          }
        />
        {/* 单个任务操作 */}
        <TodoDrawer
          ref={this.todoDrawerRef}
          loadTodoList={() => this.loadTodoList()}
          updateTodoList={todo => this.updateTodoList(todo)}
        />
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(TodoListPage);
