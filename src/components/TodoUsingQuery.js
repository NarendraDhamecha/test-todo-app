import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";

let editId = null;

const TodoUsingQuery = () => {
  const todoRef = useRef("");
  const queryClient = useQueryClient();

  const getTodos = async () => {
    try {
      const { data } = await axios(`http://156.67.217.219:9002/items/todos`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data } = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  const postTodo = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();

      const todoData = {
        name: todoRef.current.value,
      };

      let URL = "http://156.67.217.219:9002/items/todos";
      let METHOD = "POST";

      if (editId) {
        URL = `http://156.67.217.219:9002/items/todos/${editId}`;
        METHOD = "PATCH";
        editId = null;
      }

      return await axios({ method: METHOD, url: URL, data: todoData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const editTodo = ({ id, name }) => {
    todoRef.current.value = name;
    editId = id;
  };

  const deleteTodo = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://156.67.217.219:9002/items/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <>
      <div>
        <form onSubmit={postTodo.mutate}>
          <input type="text" placeholder="Enter todo" ref={todoRef} />
          <button type="submit">Add</button>
        </form>
      </div>
      <div>
        <ul>
          {data &&
            data.data.map((todo) => {
              return (
                <li key={todo.id}>
                  <span>{todo.name}</span>
                  <button onClick={() => deleteTodo.mutate(todo.id)}>
                    Delete
                  </button>
                  <button onClick={() => editTodo(todo)}>Edit</button>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default TodoUsingQuery;
