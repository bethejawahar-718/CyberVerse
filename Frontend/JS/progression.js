
/* CyberVerse — shared lesson and lab progression */

(() => {
  "use strict";

  const LESSON_KEY = "cyberverse_progress_";
  const LAB_KEY = "cyberverse_labs_";

  function getUserEmail() {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      return user?.email?.trim().toLowerCase() || null;
    } catch {
      return null;
    }
  }

  function readArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function getCompletedLessons() {
    const email = getUserEmail();
    return email ? readArray(LESSON_KEY + email) : [];
  }

  function getCompletedLabs() {
    const email = getUserEmail();
    return email ? readArray(LAB_KEY + email) : [];
  }

  function isLessonComplete(moduleId, level, lessonIndex) {
    const lessonId = `${moduleId}-${level}-${lessonIndex}`;
    return getCompletedLessons().includes(lessonId);
  }

  function hasCompletedLessons(requiredLessons) {
    return requiredLessons.every(({ moduleId, level, lessonIndex }) =>
      isLessonComplete(moduleId, level, lessonIndex)
    );
  }

  function saveLabCompletion(labId) {
    const email = getUserEmail();
    if (!email) return false;

    const key = LAB_KEY + email;
    const completed = readArray(key);

    if (!completed.includes(labId)) {
      completed.push(labId);
      localStorage.setItem(key, JSON.stringify(completed));
    }

    return true;
  }

  window.CyberVerseProgress = Object.freeze({
    getUserEmail,
    getCompletedLessons,
    getCompletedLabs,
    isLessonComplete,
    hasCompletedLessons,
    saveLabCompletion
  });
})();
