
const API_BASE = "https://cyberverse-bqt0.onrender.com/api/lessons";

const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id");

const lessonTitle = document.getElementById("lessonTitle");
const lessonDescription = document.getElementById("lessonDescription");
const topicsList = document.getElementById("topicsList");
const topicTitle = document.getElementById("topicTitle");
const topicText = document.getElementById("topicText");

async function loadLesson() {
    if (!lessonId || !/^[1-9]\d*$/.test(lessonId)) {
        lessonTitle.textContent = "Invalid lesson";
        topicsList.textContent = "Please return to the roadmap.";
        return;
    }

    try {
        const response = await fetch(API_BASE);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error("Unable to load lessons");
        }

        const lesson = data.lessons.find(
            item => String(item.id) === lessonId
        );

        if (!lesson) {
            lessonTitle.textContent = "Lesson not found";
            topicsList.textContent = "This lesson is unavailable.";
            return;
        }

        lessonTitle.textContent = lesson.title;
        lessonDescription.textContent = lesson.description || "";

        await loadTopics();

    } catch (error) {
        console.error(error);
        lessonTitle.textContent = "Unable to load lesson";
        topicsList.textContent = "Please check your backend server.";
    }
}

async function loadTopics() {
    try {
        const response = await fetch(`${API_BASE}/${lessonId}/topics`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error("Unable to load topics");
        }

        if (!data.topics.length) {
            topicsList.textContent = "No topics available.";
            return;
        }

        topicsList.innerHTML = data.topics.map((topic, index) => `
            <article class="roadmap-item">
                <div class="roadmap-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>
                <div>
                    <h3>${escapeHTML(topic.title)}</h3>
                </div>
                <button class="card-link"
                    data-topic-id="${topic.id}">
                    Read →
                </button>
            </article>
        `).join("");

        topicsList.querySelectorAll("[data-topic-id]").forEach(button => {
            button.addEventListener("click", () => {
                loadTopic(button.dataset.topicId);
            });
        });

    } catch (error) {
        console.error(error);
        topicsList.textContent = "Unable to load topics.";
    }
}

async function loadTopic(topicId) {
    try {
        const response = await fetch(
            `${API_BASE}/topics/${encodeURIComponent(topicId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error("Unable to load topic");
        }

        topicTitle.textContent = data.topic.title;
        topicText.innerHTML = sanitizeLessonHTML(data.topic.content || "<p>No content available.</p>");

        document.getElementById("topicContent").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);
        topicTitle.textContent = "Unable to load topic";
        topicText.textContent = "Please try again.";
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

loadLesson();


// Render lesson markup from the trusted CyberVerse lesson database using a small allow-list.
function sanitizeLessonHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(html), "text/html");
    const allowed = new Set(["H2", "H3", "H4", "P", "UL", "OL", "LI", "B", "STRONG", "I", "EM", "BR", "HR", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD", "CODE", "PRE", "BLOCKQUOTE"]);
    const cleanNode = node => {
        [...node.childNodes].forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!allowed.has(child.tagName)) {
                    child.replaceWith(...child.childNodes);
                } else {
                    [...child.attributes].forEach(attr => child.removeAttribute(attr.name));
                    cleanNode(child);
                }
            } else if (child.nodeType !== Node.TEXT_NODE) {
                child.remove();
            }
        });
    };
    cleanNode(doc.body);
    return doc.body.innerHTML;
}
