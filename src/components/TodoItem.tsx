import React, { FC, useContext, useState, useEffect } from 'react';
import {
  PlusOutlined,
  FormOutlined,
  RightOutlined,
  DownOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Checkbox, Input, Button } from 'antd';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Todo } from '../context';
// eslint-disable-next-line import/no-cycle
import TodoList from './TodoList';
import contextValue from '../context';
import './TodoItem.css';
import type { Store } from '../App';
import AddTodoModal from './AddTodoModal';

dayjs.extend(customParseFormat);
interface Props {
  done: boolean;
  content: string;
  subTodos: Todo[];
  id: string;
  loadMore: boolean;
  dueDate: string;
}

const TodoItem: FC<Props> = observer((props) => {
  const { done, content, subTodos, id, loadMore, dueDate } = props;
  const store = useContext<Store>(contextValue);
  const [today, setToday] = useState<dayjs.Dayjs>();
  const onCheckChange = () => {
    store.toggleTodoDone(id);
    store.todoList.forEach((todo) => store.check(todo.id));
    store.saveAllTodos();
  };
  const isEditing = store.editingId === id;

  const [inputVal, setInputVal] = useState(content);
  const [isModalVis, setIsModalVis] = useState(false);
  if (!isEditing && inputVal !== content) {
    setInputVal(content);
  }
  useEffect(() => {
    const now = dayjs();
    setToday(now);
  }, []);
  console.log(dueDate);

  const dueDateObj = dayjs(dueDate, 'YYYY-MM-DD');
  console.log(dueDateObj);

  const isOverDue = today && !today.isBefore(dueDateObj);
  console.log(isOverDue);

  return (
    <div className="todoItem">
      <div className="mainItem">
        <div className="loadMoreIcon" style={{ width: '22px' }}>
          {subTodos.length > 0 && loadMore && (
            <DownOutlined
              onClick={() => {
                store.toggleLoadMore(id);
              }}
            />
          )}
          {subTodos.length > 0 && !loadMore && (
            <RightOutlined
              onClick={() => {
                store.toggleLoadMore(id);
              }}
            />
          )}
        </div>
        <Checkbox checked={done} onChange={onCheckChange} />
        <Input
          bordered={isEditing}
          value={inputVal}
          onChange={(e) => {
            if (!isEditing) return;
            setInputVal(e.target.value);
          }}
          onBlur={() => {
            store.setEditingId(undefined);
          }}
          suffix={
            <>
              {isEditing ? (
                <SaveOutlined
                  className="saveIcon"
                  onMouseDown={() => {
                    runInAction(() => {
                      store.editingId = undefined;
                      store.editTodoItem(id, inputVal);
                      setInputVal(inputVal);
                      return undefined;
                    });
                  }}
                />
              ) : (
                <FormOutlined
                  className="formIcon"
                  onClick={() => {
                    runInAction(() => {
                      store.setEditingId(id);
                    });
                  }}
                />
              )}
              <PlusOutlined
                className="addIcon"
                onClick={() => {
                  setIsModalVis(true);
                }}
                style={{ marginLeft: '8px' }}
              />
              <AddTodoModal
                visible={isModalVis}
                id={id}
                toggleVisible={setIsModalVis}
              />
            </>
          }
        />
        {dueDate && (
          <div className="dueDateCard">
            {isOverDue && (
              <Button
                style={{ borderRadius: '6px', margin: '6px' }}
                type="primary"
                danger
              >
                Overdue
              </Button>
            )}
            <span style={{ marginLeft: '10px' }}>{dueDate}</span>
          </div>
        )}
      </div>
      {subTodos.length > 0 && loadMore && <TodoList data={subTodos} />}
    </div>
  );
});

export default TodoItem;
