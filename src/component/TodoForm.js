// 任务表单
import React from "react";
import moment from "moment";
import { Form, Input, DatePicker, Button, message } from "antd";

import "./TodoForm.scss";

import Api from "../api";

class TodoFrom extends React.Component {
  state = {
    todo: this.props.defaultTodo
  };

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 注意，deadline 是 Moment 对象,提交到后台之前需要做下 格式化
        let { title, deadline, content } = values;
        deadline = deadline.format("YYYY-MM-DD");
        if (this.state.todo.id) {
          this.updateTodo({ id: this.state.todo.id, title, deadline, content });
        } else {
          this.createTodo({ title, deadline, content });
        }
      }
    });
  }

  cancle() {
    this.props.formActionBack({ type: "cancle" });
  }
  reset() {
    this.props.form.resetFields();
  }
  // 更新
  async updateTodo(todo) {
    try {
      let { data } = await Api.post_todo_update(todo);
      if (data.code === 0) {
        // 成功
        message.success(data.message);
        this.props.formActionBack({ type: "update", todo: data.data.todo });
      } else {
        throw new Error(data.errmsg || data.message);
      }
    } catch (error) {
      // 创建失败
      message.error(error.message);
    }
  }
  // 新增
  async createTodo(todo) {
    try {
      let { data } = await Api.post_todo_create(todo);
      if (data.code === 0) {
        // 创建成功
        message.success(data.message);
        this.props.formActionBack({ type: "create" });
      } else {
        throw new Error(data.errmsg || data.message);
      }
    } catch (error) {
      // 创建失败
      message.error(error.message);
    }
  }

  // 设置截止日期不可选择的区域
  disabledDate(current) {
    return (
      current &&
      current <
        moment()
          .add("d", -1)
          .endOf("day")
    );
  }

  componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="todo-form">
        <Form.Item label="任务名称">
          {getFieldDecorator("title", {
            rules: [
              {
                required: true,
                message: "请输入任务名称"
              },
              {
                max: 10,
                message: "任务名称最长10个字符"
              }
            ],
            initialValue: this.state.todo.title
          })(<Input placeholder="请输入任务名称" />)}
        </Form.Item>
        <Form.Item label="任务截止日期">
          {getFieldDecorator("deadline", {
            rules: [
              {
                required: true,
                message: "请选择截止日期"
              }
            ],
            initialValue: this.state.todo.deadline
          })(
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={this.disabledDate}
              placeholder="请选择截止日期"
            />
          )}
        </Form.Item>
        <Form.Item label="任务内容">
          {getFieldDecorator("content", {
            rules: [],
            initialValue: this.state.todo.content
          })(<Input.TextArea row={40} placeholder="请输入任务内容" />)}
        </Form.Item>
        {/* 按钮区域 保存、取消、清空*/}
        <Form.Item>
          <div className="form-action-wrap">
            <Button type="primary" onClick={() => this.save()}>
              保存
            </Button>
            <Button onClick={() => this.reset()}>重置</Button>
            <Button type="danger" onClick={() => this.cancle()}>
              取消
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({ name: "todoForm" })(TodoFrom);
