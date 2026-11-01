CYBERVERSE - GITHUB-READY SOURCE PACKAGE

CONTENTS
- CyberVerse_Interactive_Lessons_Integrated/: website frontend, lessons, labs, roadmap, dashboard, login/register and profile UI.
- backend/: Express API, MySQL integration, JWT authentication, lessons API, profile/resume APIs.
- CyberVerse_Profile_Migration.sql: additive user_profiles table migration. It does not drop or replace existing users/lesson/lab tables.

IMPORTANT BEFORE PUSHING TO GITHUB
1. Do NOT upload your real backend/.env file or database passwords. This package intentionally contains .env.example only.
2. In GitHub, keep backend/.env ignored. Create your own local backend/.env from backend/.env.example and fill in your local MySQL values and a long random JWT_SECRET.
3. Never commit passwords, API keys, JWT secrets, database dumps containing personal data, or uploaded user files.
4. Run CyberVerse_Profile_Migration.sql once in the existing CyberVerse MySQL database. Back up the database first.

LOCAL STARTUP
Backend:
  cd backend
  npm install
  npm start

Frontend:
  Open the folder:
  CyberVerse_Interactive_Lessons_Integrated/cyberverse/CyberVerse_dashboard_login_register/CyberVerse_dashboard_auth/
  Run index.html/login.html using VS Code Live Server.

API CHECKS
  http://localhost:5000/
  http://localhost:5000/api/health
  http://localhost:5000/api/user/test

NOTES
- Frontend currently expects the API at http://localhost:5000/api. If deploying online, change the API base URL in the frontend JavaScript files to your deployed backend URL and configure CORS for your frontend domain.
- Login requires a valid existing users row and matching bcrypt password hash in the CyberVerse database.
- Existing lesson content is read from the lessons/topics tables. The lesson page now renders the HTML lesson content through an allow-list sanitizer. The 95-topic replacement migration is a separate migration from this profile bundle; use the already supplied CyberVerse_95_Topics_Replace_Migration.sql only if you still need to apply that lesson content update.
- Browser Print -> Save as PDF is used for the resume builder. Uploaded resumes support PDF, DOC and DOCX.
- This package has been syntax-checked, but it has NOT been tested against your private local MySQL credentials or deployed GitHub Pages/hosting environment. Run the API health check and test login with your own database before sharing it as production-ready.

OPTIONAL LESSON CONTENT MIGRATION
- CyberVerse_95_Topics_Replace_Migration.sql is the separate 95-topic content replacement migration.
- It deletes/replaces lesson-related records as documented in that SQL file. Back up first and read the SQL before running it. Do not run it if your current 95 topics are already correctly installed.
