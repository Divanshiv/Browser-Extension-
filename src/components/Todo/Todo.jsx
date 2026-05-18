import { useEffect, useState } from "react";
import "./Todo.css"

export const Todo = () => {

    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        const userTodo = JSON.parse(localStorage.getItem("todo")) || [];
        setTodoList(userTodo);
    }, [])

    const handleTodoInputChange = (event) => {
        setTodo(event.target.value)
    }

    const handleTodoFormSubmit = (event) => {
        event.preventDefault();
        const trimmedTodo = todo.trim();
        if (trimmedTodo.length > 0) {
            const updatedTodoList = [...todoList, { _id: crypto.randomUUID(), todo: trimmedTodo, isCompleted: false }];
            setTodoList(updatedTodoList);
            setTodo("");
            localStorage.setItem("todo", JSON.stringify(updatedTodoList));
        }
    }

    const handleTodoCheckChange = (todoId) => {
        const updatedTodoList = todoList.map(todo => todoId === todo._id ? { ...todo, isCompleted: !todo.isCompleted } : todo);
        setTodoList(updatedTodoList);
        localStorage.setItem("todo", JSON.stringify(updatedTodoList));
    }

    const handleTodoDeleteClick = (todoId) => {
        const updatedTodoList = todoList.filter(({ _id }) => _id !== todoId);
        setTodoList(updatedTodoList);
        localStorage.setItem("todo", JSON.stringify(updatedTodoList));
    }

    return (
        <div className="todo-container absolute">
            <form className="todo-input-container" onSubmit={handleTodoFormSubmit}>
                <input className="todo-input" value={todo} onChange={handleTodoInputChange} />
            </form>
            <div className="todo-list">
                {
                    todoList && todoList.map(({ todo, _id, isCompleted }) => {
                        return (
                            <div key={_id} className="todo-items d-flex align-center">
                                <label className={`${isCompleted ? "strike-through" : ""} todo-label`}>
                                    <input className="todo-check" type="checkbox" onChange={() => handleTodoCheckChange(_id)} checked={isCompleted} /> {todo}</label>
                                <button className="button cursor todo-clear-btn" onClick={() => handleTodoDeleteClick(_id)}>
                                    <span className="material-icons-outlined">
                                        clear
                                    </span>
                                </button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}