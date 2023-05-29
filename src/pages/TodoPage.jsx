import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from 'context/AuthContext';
// import { useAuth } from 'context/AuthContext';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const { currentMember, isAuthenticated } = useContext(AuthContext);
  // const { currentMember, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      return;
    } else {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);
  //initial render, get
  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        // console.log('getTodo done');
        setTodos(
          todos.map((todo) => {
            return { ...todo, isEdit: false };
          }),
        );
        // = todos.map(todo=>({...todo, isEdit: false}))
      } catch (error) {
        console.error(error);
      }
    };
    getTodosAsync();
  }, []);

  const handleChange = (value) => {
    setInputValue(value);
  };

  //post
  const handleAddTodo = async () => {
    if (inputValue.length !== 0) {
      try {
        const data = await createTodo({
          title: inputValue,
          isDone: false,
        });

        setTodos((prevTodos) => {
          return [
            ...prevTodos,
            {
              id: data.id,
              title: data.title,
              isDone: data.isDone,
              isEdit: false,
            },
          ];
        });
      } catch (error) {
        console.error(error);
      }
    }

    setInputValue('');
  };
  //post
  const handleKeyDone = async () => {
    if (inputValue.length !== 0) {
      try {
        const data = await createTodo({
          title: inputValue,
          isDone: false,
        });

        setTodos((prevTodos) => {
          return [
            ...prevTodos,
            {
              id: data.id,
              title: data.title,
              isDone: data.isDone,
              isEdit: false,
            },
          ];
        });
      } catch (error) {
        console.error(error);
      }
    }

    setInputValue('');
  };

  //patch
  const handleToggleDone = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id);

    try {
      await patchTodo({
        id,
        isDone: !currentTodo.isDone,
      });
      setTodos(
        todos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        return {
          ...todo,
          isEdit: false,
        };
      }),
    );
  };
  //patch
  const handleSave = async ({ id, title }) => {
    try {
      await patchTodo({
        id,
        title,
      });
      setTodos(
        todos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }
          return todo;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  //delete
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error(error);
    }

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name} />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDone}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer remainingItems={1} />
    </div>
  );
};

export default TodoPage;
