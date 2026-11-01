
const pool = require("../config/db");

// Get all lessons
exports.getLessons = async (req, res) => {
    try {
        const [lessons] = await pool.execute(
            `SELECT id, title, description, lesson_order
             FROM lessons
             ORDER BY lesson_order`
        );

        res.status(200).json({
            success: true,
            lessons: lessons
        });
    } catch (error) {
        console.error("Error fetching lessons:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch lessons"
        });
    }
};

// Get topics for a specific lesson
exports.getTopicsByLesson = async (req, res) => {
    try {
        const lessonId = Number(req.params.lessonId);

        if (!Number.isInteger(lessonId) || lessonId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid lesson ID"
            });
        }

        const [topics] = await pool.execute(
            `SELECT id, lesson_id, title, content, topic_order
             FROM topics
             WHERE lesson_id = ?
             ORDER BY topic_order`,
            [lessonId]
        );

        res.status(200).json({
            success: true,
            topics: topics
        });
    } catch (error) {
        console.error("Error fetching topics:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch topics"
        });
    }
};

 // Get one topic by its ID
exports.getTopicById = async (req, res) => {
    try {
        const topicId = Number(req.params.topicId);

        if (!Number.isInteger(topicId) || topicId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid topic ID"
            });
        }

        const [topics] = await pool.execute(
            `SELECT id, lesson_id, title, content, topic_order
             FROM topics
             WHERE id = ?`,
            [topicId]
        );

        if (topics.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        res.status(200).json({
            success: true,
            topic: topics[0]
        });
    } catch (error) {
        console.error("Error fetching topic:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch topic"
        });
    }
};
