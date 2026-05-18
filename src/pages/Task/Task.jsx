import "./Task.css";
import { useBrowser } from "../../context/browser-context";
import { Fragment, useEffect, useState } from "react";
import { quotes } from "../../db/quotes";
import { Todo } from "../../components/Todo/Todo";

export const Task = () => {

    const [isChecked, setIsChecked] = useState(false);
    const [isTodoOpen, setIsTodoOpen] = useState(false);
    const [taskInput, setTaskInput] = useState("");

    const [quote, setQuote] = useState(() => {
        const index = Math.floor(Math.random() * quotes.length);
        return quotes[index].quote;
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            const index = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[index].quote);
        }, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const { name, time, message, task, browserDispatch } = useBrowser();

    useEffect(() => {
        const userTask = localStorage.getItem("task");
        browserDispatch({
            type: "TASK",
            payload: userTask
        });
        if (new Date().getDate() !== Number(localStorage.getItem("date"))) {
            localStorage.removeItem("task");
            localStorage.removeItem("date");
            localStorage.removeItem("checkedStatus");
        }
    }, [browserDispatch])

    useEffect(() => {
        const checkStatus = localStorage.getItem("checkedStatus");
        checkStatus === "true" ? setIsChecked(true) : setIsChecked(false)
    }, [])

    useEffect(() => {
        const getCurrentTime = () => {
            const today = new Date();
            const hours = today.getHours();
            const minutes = today.getMinutes();

            const hour = hours < 10 ? `0${hours}` : hours;
            const minute = minutes < 10 ? `0${minutes}` : minutes;

            const currentTime = `${hour}:${minute}`

            browserDispatch({
                type: "TIME",
                payload: currentTime
            })

            browserDispatch({
                type: "MESSAGE",
                payload: hours
            })
        }
        getCurrentTime();
        const intervalId = setInterval(getCurrentTime, 1000);
        return () => clearInterval(intervalId);
    }, [browserDispatch])

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const trimmedTask = taskInput.trim();
        if (trimmedTask.length > 0) {
            browserDispatch({
                type: "TASK",
                payload: trimmedTask
            });
            localStorage.setItem("task", trimmedTask);
            localStorage.setItem("date", new Date().getDate());
            setTaskInput("");
        }
    }

    const handleCompleteTaskChange = (event) => {
        setIsChecked(event.target.checked);
        localStorage.setItem("checkedStatus", event.target.checked);
    }

    const handleClearClick = () => {
        browserDispatch({
            type: "CLEAR"
        })
        setIsChecked(false);
        localStorage.removeItem("task");
        localStorage.removeItem("checkedStatus");
    }

    const handleToDoClick = () => {
        setIsTodoOpen(isTodoOpen => !isTodoOpen);
    }

    return (
        <div className="task-container d-flex direction-column align-center relative">
            <span className="time">{time}</span>
            <span className="message">{message}, {name}</span>
            {name !== null && task === null ? (
                <Fragment>
                    <span className="focus-question">What is your main focus for today?</span>
                    <form onSubmit={handleFormSubmit}>
                        <input required className="input task-input" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
                    </form>
                </Fragment>) : (
                <div className="user-task-container d-flex direction-column align-center gap-sm">
                    <span className="heading-2">Today's Focus</span>
                    <div className="d-flex align-center gap">
                        <label className={`${isChecked ? "strike-through" : ""} heading-3 d-flex align-center gap-sm cursor`}>
                            <input className="check cursor" type="checkbox" onChange={handleCompleteTaskChange} checked={isChecked} />
                            {task}
                        </label>
                        <button className="button cursor" onClick={handleClearClick}>
                            <span className="material-icons-outlined">
                                clear
                            </span>
                        </button>
                    </div>

                </div>
            )}
            <div className="quote-container">
                <span className="heading-3">{quote}</span>
            </div>
            {isTodoOpen && <Todo />}
            <div className="todo-btn-container absolute">
                <button className="button cursor todo-btn" onClick={handleToDoClick}>ToDo</button>
            </div>
            <footer className="footer">Made by Divanshiv ❤️</footer>
        </div>

    )
}