import { createContext } from 'react';

export interface Todo {
  loadMore: boolean;
  done: boolean;
  content: string;
  subTodos: Todo[];
  id: string;
  parentTodoId: string | undefined;
  dueDate: string;
}

export interface Context {
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
}
const contextValue = createContext<any>({});
export default contextValue;
