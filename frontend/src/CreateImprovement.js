import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateImprovement.css";

function CreateImprovement() {
    const [improvement, setImprovement] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8081/create", { improvement }, { withCredentials: true });
            alert("Behaviour added successfully!");
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="create-improvement-container">
            <form className="create-improvement-form" onSubmit={handleSubmit}>
                <h2>Create Behaviour</h2>
                <textarea
                    className="improvement-textarea"
                    placeholder="Describe the Behaviour..."
                    value={improvement}
                    onChange={(e) => setImprovement(e.target.value)}
                    required
                />
                <button className="submit-button" type="submit">
                    Add Behaviour
                </button>
                <button className="back-button" onClick={() => navigate("/")}>
                Back to Behaviours
            </button>
            </form>
        </div>
    );
}

export default CreateImprovement;
