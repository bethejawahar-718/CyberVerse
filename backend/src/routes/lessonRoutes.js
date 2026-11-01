
const express = require("express");
const router = express.Router();

const {
    getLessons,
    getTopicsByLesson,
    getTopicById
} = require("../controllers/lessonController");

// Get all lessons
router.get("/", getLessons);

// Get all topics for a specific lesson
router.get("/:lessonId/topics", getTopicsByLesson);

// Get one topic by its ID
router.get("/topics/:topicId", getTopicById);

module.exports = router;
