const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,
}));

app.use(session({
    secret: "your_secret_key", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to database.");
});

// User registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: "Registration failed" });
        res.status(201).json({ message: "User registered successfully" });
    });
});

// User login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: "Login failed" });
        if (results.length === 0) return res.status(404).json({ error: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, results[0].password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

        req.session.user = results[0];
        res.status(200).json({ message: "Login successful", user: req.session.user });
    });
});

// Check authentication
app.get("/auth", (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.status(200).json({ message: "Logged out successfully" });
    });
});

// CRUD endpoints
app.get("/", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const sql = "SELECT * FROM customer WHERE user_id = ?";
    db.query(sql, [req.session.user.id], (err, data) => {
        if (err) return res.status(500).json({ error: "Database query error" });
        res.status(200).json(data);
    });
});


app.post("/create", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const sql = "INSERT INTO customer (improvement, user_id) VALUES (?, ?)";
    const values = [req.body.improvement, req.session.user.id];
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to create record" });
        res.status(201).json(data);
    });
});

app.put("/update/:id", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const sql = "UPDATE customer SET improvement = ? WHERE id = ? AND user_id = ?";
    const values = [req.body.improvement, req.params.id, req.session.user.id];
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to update record" });
        res.status(200).json(data);
    });
});

app.delete("/customer/:id", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const sql = "DELETE FROM customer WHERE id = ? AND user_id = ?";
    db.query(sql, [req.params.id, req.session.user.id], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to delete record" });
        res.status(200).json(data);
    });
});

// Get sub-improvements
app.get("/improvements/:id/sub", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const userId = req.session.user.id;

    const sql = "SELECT * FROM sub_improvements WHERE improvement_id = ? AND user_id = ?";
    db.query(sql, [id, userId], (err, data) => {
        if (err) return res.status(500).json({ error: "Database query error" });
        res.status(200).json(data);
    });
});

// Create a new sub-improvement
app.post("/improvements/:id/sub", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { description } = req.body;
    const userId = req.session.user.id;

    if (!description) {
        return res.status(400).json({ error: "Description is required" });
    }

    const sql = "INSERT INTO sub_improvements (improvement_id, description, user_id) VALUES (?, ?, ?)";
    db.query(sql, [id, description, userId], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to create sub-improvement" });
        res.status(201).json(data);
    });
});

// Update a sub-improvement
app.put("/sub-improvements/:subId", (req, res) => {
    const { subId } = req.params;
    const { description } = req.body;

    const sql = "UPDATE sub_improvements SET description = ? WHERE id = ?";
    db.query(sql, [description, subId], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to update sub-improvement" });
        res.status(200).json(data);
    });
});

// Delete a sub-improvement
app.delete("/sub-improvements/:subId", (req, res) => {
    const { subId } = req.params;

    const sql = "DELETE FROM sub_improvements WHERE id = ?";
    db.query(sql, [subId], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to delete sub-improvement" });
        res.status(200).json(data);
    });
});


app.listen(8081, () => {
    console.log("Server is running on http://localhost:8081");
});
