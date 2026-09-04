"use client";

import "./globals.css";
import { useState, useEffect, useSyncExternalStore } from "react";
import { TodoButton } from "./components/Todo-button";
import { TodoActionButton } from "./components/TodoActionButton";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("All");
  const isClient = useIsClient();
  const [todos, setTodos] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("LocalStorage уншихад алдаа гарлаа", e);
      return [];
    }
  });

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isClient]);

  const isEmpty = text.trim() === "";
  const doneCount = todos.filter((todo) => todo.done).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.done;
    if (filter === "Completed") return todo.done;
    return true;
  });

  const isListEmpty = filteredTodos.length === 0;

  function handleAdd(e) {
    e.preventDefault();
    if (isEmpty) return;

    const newTodo = { id: Date.now(), title: text.trim(), done: false };
    setTodos((prev) => [...prev, newTodo]);
    setText("");
  }

  function handleToggle(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function handleDelete(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleClearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  }
  if (!isClient) {
    return null;
  }

  return (
    <div className="container">
      <div className="Main-container">
        <h1 className="Header">To-do list</h1>

        <form onSubmit={handleAdd} className="form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input"
          />
          <TodoActionButton
            text="Add"
            className="button1"
            type="submit"
            disabled={isEmpty}
          />
        </form>

        <div className="Container2">
          <TodoButton
            onClick={() => setFilter("All")}
            text="All"
            filterValue={filter}
          />
          <TodoButton
            onClick={() => setFilter("Active")}
            text="Active"
            filterValue={filter}
          />
          <TodoButton
            onClick={() => setFilter("Completed")}
            text="Completed"
            filterValue={filter}
          />
        </div>

        {isListEmpty ? (
          <p className="empty-state">No tasks yet. Add one above!</p>
        ) : (
          <div className="task-list">
            {filteredTodos.map((todo) => (
              <div key={todo.id} className="Container3">
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggle(todo.id)}
                    className="checkbox"
                  />
                  <span
                    className={`task-text ${todo.done ? "completed-text" : ""}`}
                  >
                    {todo.title}
                  </span>
                </div>

                <TodoActionButton
                  text="Delete"
                  className="delete-text-btn"
                  onClick={() => {
                    if (window.confirm("Устгах нь зөв үү?")) {
                      handleDelete(todo.id);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {!isListEmpty && (
          <div className="Container4">
            <span className="summary-text">
              {doneCount} of {todos.length} tasks completed
            </span>
            {doneCount > 0 && (
              <button onClick={handleClearCompleted} className="Button3">
                Clear completed
              </button>
            )}
          </div>
        )}

        <p className="footer-text">
          Powered by <span>Pinecone academy</span>
        </p>
      </div>
    </div>
  );
}
