export default function todos(state=[],action){
  switch(action.type){
    case 'CREATE_TODO':
      return state.concat([action.todo])
    case 'UPDATE_TODOS':
      return action.todos
    default:
      return state
  }
}