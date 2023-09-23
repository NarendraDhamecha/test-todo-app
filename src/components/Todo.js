import { useEffect, useRef, useState } from "react";
import axios from "axios";

let editId = null;

function Todo() {
  const todoRef = useRef("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios("http://156.67.217.219:9002/items/todos")
      .then((response) => setTodos(response.data.data))
      .catch((err) => console.log(err));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    let URL = "http://156.67.217.219:9002/items/todos";
    let METHOD = "POST";

    if (editId) {
      URL = `http://156.67.217.219:9002/items/todos/${editId}`;
      METHOD = "PATCH";
      editId = null;
    }

    try {
      const response = await axios({
        method: METHOD,
        url: URL,
        data: { name: todoRef.current.value },
      });
      setTodos((prevTodos) => [...prevTodos, response.data.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(
        `http://156.67.217.219:9002/items/todos/${id}`
      );

      if (response.status === 204) {
        const filteredTodos = todos.filter((todo) => {
          return id !== todo.id;
        });

        setTodos(filteredTodos);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editTodo = (id, name) => {
    const filteredTodos = todos.filter((todo) => {
      return id !== todo.id;
    });

    setTodos(filteredTodos);
    todoRef.current.value = name;
    editId = id;
  };

  return (
    <div className="App">
      <div>
        <form onSubmit={submitHandler}>
          <input type="text" placeholder="Enter todo" ref={todoRef} />
          <button type="submit">Add</button>
        </form>
      </div>
      <div>
        <ul>
          {todos &&
            todos.map((todo) => {
              return (
                <li key={todo.id}>
                  <span>{todo.name}</span>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  <button onClick={() => editTodo(todo.id, todo.name)}>
                    Edit
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
