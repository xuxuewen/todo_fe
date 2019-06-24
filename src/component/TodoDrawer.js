// 通过抽屉的方式展示 任务详情
import React from "react";
import { Drawer, Divider } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import TodoForm from "./TodoForm";

class TodoDrawer extends React.Component {
  state = {
    visible: false,
    title: "",
    todo: {},
    todoFormKey: Date.now()
  };
  show(todo, title) {
    if (todo.deadline) {
      todo.deadline = moment(todo.deadline);
    }
    this.setState({
      todo,
      title,
      visible: true,
      todoFormKey: Date.now()
    });
  }
  close() {
    this.setState({
      visible: true
    });
  }
  formActionBack(data) {
    if (data.type === "create") {
      this.props.loadTodoList();
    } else if (data.type === "update") {
      this.props.updateTodoList(data.todo);
    }
    this.setState({
      visible: false
    });
  }
  render() {
    return (
      <Drawer
        title={this.state.title}
        width={400}
        closable={false}
        visible={this.state.visible}
        placement="right"
      >
        {
          <TodoForm
            key={this.state.todoFormKey}
            defaultTodo={this.state.todo}
            formActionBack={data => this.formActionBack(data)}
          />
        }
      </Drawer>
    );
  }
}

export default TodoDrawer;
