const pool = require("../config/db");

exports.getLessons = async (req, res) => {
    try {
        const [lessons] = await pool.execute(
            `SELECT id, title, description, category, order_index, created_at
             FROM lessons
             ORDER BY order_index ASC, id ASC`
        );

        res.json({
            lessons
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
