import React, { useState, FC, useContext } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import TodoList from './TodoList';
import type { Store } from '../App';
import contextValue from '../context';
import AddTodoModal from './AddTodoModal';

const TodoApp: FC = observer(() => {
  const store = useContext<Store>(contextValue);
  const [isModalVis, setIsModalVis] = useState(false);
  return (
    <div className="App">
      <header>Multi-level Todo List</header>
      <div className="todoApp">
        <div className="title">
          <div>To do</div>
          <PlusOutlined
            className="plusIcon"
            onClick={() => {
              setIsModalVis(true);
            }}
          />
        </div>
        <TodoList data={store.filterUnDoneTodos} />
        <div className="title">
          <div>Completed</div>
        </div>
        <TodoList data={store.filterDoneTodos} />
      </div>
      <AddTodoModal visible={isModalVis} toggleVisible={setIsModalVis} />
    </div>
  );
});
export default TodoApp;
