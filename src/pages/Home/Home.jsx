import "./Home.css"
import { useBrowser } from "../../context/browser-context"
import { useState } from "react"

export const Home = () => {

    const { browserDispatch } = useBrowser();
    const [name, setName] = useState("");

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const trimmedName = name.trim();
        if (trimmedName.length > 0) {
            browserDispatch({
                type: "NAME",
                payload: trimmedName
            })
            localStorage.setItem("name", trimmedName);
        }
    }

    return (
        <div className="home-container d-flex direction-column align-center gap-lg">
            <h1 className="main-heading">Browser Extension</h1>
            <div className="user-details d-flex direction-column gap">
                <label htmlFor="name-input" className="heading-1">Hello, what's your name?</label>
                <form onSubmit={handleFormSubmit} className="d-flex direction-column align-center">
                    <input
                        id="name-input"
                        required
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name..."
                        maxLength={50}
                        autoFocus
                        aria-label="Enter your name"
                    />
                    <small className="hint">Press Enter to continue</small>
                </form>
            </div>
            <footer className="footer">Made by Divanshiv ❤️</footer>
        </div>
    )
}