import React, { FC, useContext } from 'react';
import type { Store } from '../App';
import contextValue from '../context';
import TodoItem from './TodoItem';
import './DoneRootTodoList.css';

const DoneRootTodoLIst: FC = () => {
  const store = useContext<Store>(contextValue);
  return (
    <div className="doneTodos">
      {store.filterDoneTodos &&
        store.filterDoneTodos.map((item) => (
          <TodoItem
            done={item.done}
            content={item.content}
            subTodos={item.subTodos}
            loadMore={item.loadMore}
            id={item.id}
            key={item.id}
            dueDate={item.dueDate}
          />
        ))}
    </div>
  );
};
export default DoneRootTodoLIst;
