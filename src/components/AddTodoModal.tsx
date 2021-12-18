import React, { FC, useContext, useState } from 'react';
import { Input, Modal, DatePicker, message } from 'antd';
import contextValue from '../context';
import type { Store } from '../App';

interface Props {
  visible: boolean;
  id?: string;
  toggleVisible: (vis: boolean) => void;
}

const AddTodoModal: FC<Props> = ({ visible, id, toggleVisible }) => {
  const store = useContext<Store>(contextValue);
  const [todoContentVal, setTodoContentVal] = useState('');
  const [dueDate, setDueDate] = useState('');
  return (
    <Modal
      visible={visible}
      onOk={() => {
        if (!todoContentVal) {
          message.warn('please enter todo content');
          return;
        }
        if (id) {
          store.addSubTodos(id, todoContentVal, dueDate);
        } else {
          store.addTodoItem(todoContentVal, dueDate);
        }
        setTodoContentVal('');
        toggleVisible(false);
      }}
      okText="add new Todo"
      title="please add new sub Todo"
      onCancel={() => {
        setTodoContentVal('');
        toggleVisible(false);
      }}
      destroyOnClose
    >
      <div>
        Please enter todo content
        <Input
          value={todoContentVal}
          onChange={(e) => {
            setTodoContentVal(e.target.value);
          }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <div>Please select a due Date </div>
        <DatePicker
          onChange={(date, dateString) => {
            setDueDate(dateString);
          }}
        />
      </div>
    </Modal>
  );
};
AddTodoModal.defaultProps = {
  id: undefined,
};
export default AddTodoModal;
