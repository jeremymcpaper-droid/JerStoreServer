const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Users Ordner erstellen, falls nicht existiert
const USERS_DIR = path.join(__dirname, 'Users');
fs.ensureDirSync(USERS_DIR);

// Register Endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.json({ status: "error", message: "Missing username or password" });

    const userFile = path.join(USERS_DIR, username + '.json');
    if (await fs.pathExists(userFile)) {
        return res.json({ status: "error", message: "User already exists" });
    }

    await fs.writeJson(userFile, { password });
    res.json({ status: "success" });
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.json({ status: "error", message: "Missing username or password" });

    const userFile = path.join(USERS_DIR, username + '.json');
    if (!await fs.pathExists(userFile)) {
        return res.json({ status: "error", message: "No user" });
    }

    const userData = await fs.readJson(userFile);
    if (userData.password === password) {
        return res.json({ status: "success" });
    } else {
        return res.json({ status: "error", message: "Wrong password" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
