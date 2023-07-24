import { useCallback, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const getTodos = useCallback(() => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  const toggleCompleteTodo = useCallback(async (id) => {
    const updatedTodo = await fetch(`${API_BASE}/todo/complete/${id}`, {
      method: "PUT",
    }).then((res) => res.json());

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    );
  }, []);

  const deleteTodo = useCallback(async (id) => {
    const deletedTodo = await fetch(`${API_BASE}/todo/delete/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo._id !== deletedTodo._id)
    );
  }, []);

  const addTodo = useCallback(
    async (e) => {
      e.preventDefault();
      const payload = {
        text: newTodo,
      };

      const newFetchedTodo = await fetch(`${API_BASE}/todo/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());

      setTodos((prevTodos) => [...prevTodos, newFetchedTodo]);
      setPopupActive(false);
      setNewTodo("");
    },
    [newTodo]
  );

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <h1>Hello, Imran</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`todo ${todo.complete ? "is-complete" : ""}`}
            onClick={() => toggleCompleteTodo(todo._id)}
          >
            <div className="checkbox" />
            <div className="text">{todo.text}</div>
            <div
              className="delete-todo"
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo._id);
              }}
            >
              X
            </div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={(e) => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <form className="popup" onSubmit={addTodo}>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              autoFocus
              value={newTodo}
              onChange={(e) => setNewTodo(() => e.target.value)}
            />
            <input className="button" type="submit" value="Create Task" />

            <button
              className="closePopup"
              onClick={() => setPopupActive(false)}
            >
              X
            </button>
          </div>
        </form>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
