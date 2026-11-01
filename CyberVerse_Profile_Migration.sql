-- CyberVerse profile and resume metadata extension
-- Run this once against the existing cyberverse database.
-- Existing users and all current tables/data are preserved.
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  phone VARCHAR(25) NULL,
  date_of_birth DATE NULL,
  gender VARCHAR(40) NULL,
  qualification VARCHAR(120) NULL,
  branch VARCHAR(120) NULL,
  college VARCHAR(180) NULL,
  graduation_year SMALLINT NULL,
  skills TEXT NULL,
  projects MEDIUMTEXT NULL,
  experience MEDIUMTEXT NULL,
  certifications TEXT NULL,
  career_interests VARCHAR(500) NULL,
  career_objective TEXT NULL,
  profile_picture_path VARCHAR(255) NULL,
  resume_path VARCHAR(255) NULL,
  resume_original_name VARCHAR(255) NULL,
  resume_uploaded_at TIMESTAMP NULL DEFAULT NULL,
  resume_data LONGTEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_profiles_user_id (user_id),
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
