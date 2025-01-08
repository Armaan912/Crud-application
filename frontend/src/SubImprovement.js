import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import './SubImprovement.css';

function SubImprovement() {
    const { id } = useParams();
    const [subImprovements, setSubImprovements] = useState([]);
    const [newSubImprovement, setNewSubImprovement] = useState("");
    const [editingId, setEditingId] = useState(null); // ID of the sub-improvement being edited
    const [editingDescription, setEditingDescription] = useState(""); // New description for editing

    useEffect(() => {
        axios
            .get(`http://localhost:8081/improvements/${id}/sub`, { withCredentials: true })
            .then((res) => setSubImprovements(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleAdd = async () => {
        try {
            await axios.post(`http://localhost:8081/improvements/${id}/sub`, { description: newSubImprovement }, { withCredentials: true });
            setSubImprovements([...subImprovements, { description: newSubImprovement }]);
            setNewSubImprovement("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (subId) => {
        try {
            await axios.delete(`http://localhost:8081/sub-improvements/${subId}`, { withCredentials: true });
            // Filter out the deleted sub-improvement based on its ID
            setSubImprovements(subImprovements.filter((sub) => sub.id !== subId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (subId) => {
        try {
            await axios.put(`http://localhost:8081/sub-improvements/${subId}`, { description: editingDescription }, { withCredentials: true });
            setSubImprovements(subImprovements.map((sub) => 
                sub.id === subId ? { ...sub, description: editingDescription } : sub
            ));
            setEditingId(null); // Exit editing mode
            setEditingDescription("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Behaviourial Tasks</h2>
            <Link to="/">Back to Behaviours</Link>
            <br/>
            <br/>
            <input
                type="text"
                value={newSubImprovement}
                onChange={(e) => setNewSubImprovement(e.target.value)}
                placeholder="Add new task"
            />
            <button onClick={handleAdd}>Add</button>
            

            <ul>
                {subImprovements.map((sub) => (
                    <li key={sub.id}>
                        {editingId === sub.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingDescription}
                                    onChange={(e) => setEditingDescription(e.target.value)}
                                />
                                <button onClick={() => handleUpdate(sub.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {sub.description}
                                <button onClick={() => { 
                                    setEditingId(sub.id); 
                                    setEditingDescription(sub.description); 
                                }}>Edit</button>
                                <button onClick={() => handleDelete(sub.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SubImprovement;
