import React, { FC } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { useLocalObservable } from 'mobx-react';
import contextValue from './context';
import type { Todo } from './context';
import TodoApp from './components/TodoApp';

export interface Store {
  todoList: Todo[];
  editingId: string | undefined;
  saveAllTodos: () => void;
  setEditingId: (todoId: string | undefined) => void;
  findTodoById: (todoId: string, arr: Todo[]) => Todo | undefined;
  editTodoItem: (todoId: string, content: string) => void;
  addTodoItem: (content: string, dueDate: string) => void;
  addSubTodos: (todoId: string, content: string, dueDate: string) => void;
  toggleTodoDone: (todoId: string | undefined, flag?: boolean) => void;
  toggleLoadMore: (todoId: string) => void;
  check: (todoList: string) => void;
  filterDoneTodos: Todo[];
  filterUnDoneTodos: Todo[];
}
const todoDataStr = localStorage.getItem('TodoList');
const todoData = todoDataStr ? JSON.parse(todoDataStr) : [];
const App: FC = () => {
  const store: Store = useLocalObservable<Store>(() => ({
    todoList: todoData,
    editingId: undefined,
    saveAllTodos() {
      localStorage.setItem('TodoList', JSON.stringify(store.todoList));
    },
    setEditingId(todoId) {
      store.editingId = todoId;
    },
    findTodoById: function findTodoById(
      todoId,
      arr = store.todoList
    ): Todo | undefined {
      if (!arr.length) return undefined;
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].id === todoId) return arr[i];
        const todoItem = findTodoById(todoId, arr[i].subTodos);
        if (todoItem) return todoItem;
      }
      return undefined;
    },
    editTodoItem(todoId, newContent) {
      const todoItem = store.findTodoById(todoId, store.todoList);
      if (todoItem) todoItem.content = newContent;
      store.saveAllTodos();
    },
    addTodoItem(content, dueDate) {
      const newRootTodoItem = {
        loadMore: false,
        content,
        subTodos: [],
        done: false,
        id: uuidv4(),
        parentTodoId: undefined,
        dueDate,
      };
      store.todoList.push(newRootTodoItem);
      store.saveAllTodos();
    },
    addSubTodos(todoId, content, dueDate) {
      const todoItem = store.findTodoById(todoId, store.todoList);
      const newSubTodoItem = {
        loadMore: false,
        content,
        id: uuidv4(),
        done: false,
        subTodos: [],
        parentTodoId: todoId,
        dueDate,
      };
      if (todoItem) {
        todoItem.subTodos.push(newSubTodoItem);
      }
      store.saveAllTodos();
    },

    check(todoId) {
      const todoItem = store.findTodoById(todoId, store.todoList);
      if (!todoItem) return;
      if (todoItem.subTodos.length === 0) return;
      const isAllSubTodosDone = todoItem.subTodos.every(
        (item) => item.done === true
      );
      if (isAllSubTodosDone) {
        todoItem.done = true;
        return;
      }
      todoItem.done = false;
      todoItem.subTodos.forEach((todo) => store.check(todo.id));
    },
    toggleTodoDone(todoId, flag) {
      if (!todoId) return;
      const todoItem = store.findTodoById(todoId, store.todoList);
      if (!todoItem) return;
      if (flag === undefined) todoItem.done = !todoItem.done;
      if (typeof flag === 'boolean') todoItem.done = flag;
      todoItem.subTodos.forEach((item) => {
        store.toggleTodoDone(item.id, todoItem.done);
      });
    },
    toggleLoadMore(todoId) {
      const todoItem = store.findTodoById(todoId, store.todoList);
      if (todoItem) todoItem.loadMore = !todoItem.loadMore;
      store.saveAllTodos();
    },
    get filterDoneTodos() {
      return store.todoList.filter((item) => item.done === true);
    },
    get filterUnDoneTodos() {
      return store.todoList.filter((item) => item.done !== true);
    },
  }));

  return (
    <contextValue.Provider value={store}>
      <TodoApp />
    </contextValue.Provider>
  );
};

export default App;
