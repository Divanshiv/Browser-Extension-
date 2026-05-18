import { useState, type FormEvent } from "react";
import "./Todo.css";

interface TodoItem {
  id: string;
  todo: string;
  isCompleted: boolean;
}

function loadTodos(): TodoItem[] {
  try {
    const stored = localStorage.getItem("todo");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export const Todo = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState<TodoItem[]>(loadTodos);

  const handleTodoInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(event.target.value);
  };

  const handleTodoFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTodo = todo.trim();
    if (trimmedTodo.length > 0) {
      const updatedTodoList: TodoItem[] = [
        ...todoList,
        { id: crypto.randomUUID(), todo: trimmedTodo, isCompleted: false },
      ];
      setTodoList(updatedTodoList);
      setTodo("");
      localStorage.setItem("todo", JSON.stringify(updatedTodoList));
    }
  };

  const handleTodoCheckChange = (todoId: string) => {
    const updatedTodoList = todoList.map((item) =>
      todoId === item.id
        ? { ...item, isCompleted: !item.isCompleted }
        : item,
    );
    setTodoList(updatedTodoList);
    localStorage.setItem("todo", JSON.stringify(updatedTodoList));
  };

  const handleTodoDeleteClick = (todoId: string) => {
    const updatedTodoList = todoList.filter(({ id }) => id !== todoId);
    setTodoList(updatedTodoList);
    localStorage.setItem("todo", JSON.stringify(updatedTodoList));
  };

  return (
    <div
      className="todo-container absolute"
      role="region"
      aria-label="Todo list"
    >
      <form className="todo-input-container" onSubmit={handleTodoFormSubmit}>
        <input
          className="todo-input"
          value={todo}
          onChange={handleTodoInputChange}
          placeholder="Add a new todo..."
          aria-label="New todo"
        />
      </form>
      <div className="todo-list" role="list">
        {todoList &&
          todoList.map(({ todo, id, isCompleted }) => {
            return (
              <div key={id} className="todo-items d-flex align-center" role="listitem">
                <label
                  className={`${isCompleted ? "strike-through" : ""} todo-label`}
                >
                  <input
                    className="todo-check"
                    type="checkbox"
                    onChange={() => handleTodoCheckChange(id)}
                    checked={isCompleted}
                  />{" "}
                  {todo}
                </label>
                <button
                  className="button cursor todo-clear-btn"
                  onClick={() => handleTodoDeleteClick(id)}
                >
                  <span className="material-icons-outlined">clear</span>
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};
