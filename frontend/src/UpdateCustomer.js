import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./UpdateCustomer.css";

function UpdateCustomer() {
    const [improvement, setImprovement] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8081/", { withCredentials: true })
            .then((res) => {
                const customer = res.data.find((c) => c.id === parseInt(id));
                if (customer) setImprovement(customer.improvement);
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8081/update/${id}`, { improvement }, { withCredentials: true });
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="update-container">
            <form className="update-form" onSubmit={handleSubmit}>
                <h2>Update Behaviour</h2>
                <textarea
                    className="update-textarea"
                    placeholder="Update your behaviour..."
                    value={improvement}
                    onChange={(e) => setImprovement(e.target.value)}
                    required
                />
                <button className="update-button" type="submit">Update</button>
            </form>
            <button className="back-button" onClick={() => navigate("/")}>
                Back to Behaviours
            </button>
        </div>
    );
}

export default UpdateCustomer;
