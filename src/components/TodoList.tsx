import React, { FC } from 'react';
import { observer } from 'mobx-react';
import type { Todo } from '../context';
// eslint-disable-next-line import/no-cycle
import TodoItem from './TodoItem';
import './TodoList.css';

interface Props {
  data: Todo[];
}
const TodoList: FC<Props> = observer(({ data }) => (
  <div className="todoList">
    {data.map((item) => (
      <TodoItem
        done={item.done}
        content={item.content}
        subTodos={item.subTodos}
        loadMore={item.loadMore}
        id={item.id}
        dueDate={item.dueDate}
        key={item.id}
      />
    ))}
  </div>
));
export default TodoList;
