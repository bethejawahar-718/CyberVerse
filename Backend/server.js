require("dotenv").config();


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");

app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/lessons", lessonRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "CyberVerse Backend is running!"
    });
});

const PORT = process.env.PORT || 5000;

app.get("/api/user/test", (req, res) => {
    res.json({
        message: "User route is working"
    });
});

app.listen(PORT, () => {
    console.log(`CyberVerse server running on port ${PORT}`);
});