import axios from "axios";
const base = "/api";

/**
 * @description 创建一个新的任务
 */
export function post_todo_create(todo) {
  return axios({
    url: `${base}/todo/create`,
    method: "POST",
    data: todo
  });
}
/**
 * @description 更新任务
 */
export function post_todo_update(todo) {
  // 避免后端校验失败，不要传null到后端
  if (todo.content == null) {
    delete todo.content;
  }
  return axios({
    url: `${base}/todo/update`,
    method: "POST",
    data: todo
  });
}

/**
 * @description 查询任务列表
 */
export function post_todo_list(data) {
  return axios({
    url: `${base}/todo/list`,
    method: "POST",
    data
  });
}

export default {
  post_todo_create,
  post_todo_update,
  post_todo_list
};
