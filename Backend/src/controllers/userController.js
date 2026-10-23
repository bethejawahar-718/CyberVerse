const pool = require("../config/db");

exports.getProfile = async (req, res) => {
    try {
        const [users] = await pool.execute(
            `SELECT id, username, email, role, created_at
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: users[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};