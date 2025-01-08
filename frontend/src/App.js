import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Customer from "./Customer";
import CreateImprovement from "./CreateImprovement";
import UpdateCustomer from "./UpdateCustomer";
import Login from "./Login";
import Register from "./Register";
import SubImprovement from "./SubImprovement";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8081/auth", { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        await axios.post("http://localhost:8081/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <BrowserRouter>
            <div>
                {user ? (
                    <>
                        <button onClick={handleLogout}>Logout</button>
                        <Routes>
                            <Route path="/" element={<Customer />} />
                            <Route path="/create" element={<CreateImprovement />} />
                            <Route path="/update/:id" element={<UpdateCustomer />} />
                            <Route path="/improvements/:id/sub" element={<SubImprovement />} />
                        </Routes>
                    </>
                ) : (
                    <Routes>
                        <Route path="/" element={<Login setUser={setUser} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
            </div>
        </BrowserRouter>
    );
}

export default App;
