// State management
let tasks = [];
let activeTab = 'day';
let activeCategory = 'All';
let currentMonthDate = new Date(); // Used for calendar navigation

// Authentication State
let currentUser = null; // format: { token: 'raja', name: 'Raja' }

// Speech recognition instances
let recognition = null;
let parsedVoiceTask = null;
let isRecording = false;

// DOM Elements
const elements = {
    appContainer: document.querySelector('.app-container'),
    tabs: document.querySelectorAll('.nav-item, .bottom-nav-item'),
    viewPanels: document.querySelectorAll('.view-panel'),
    categoryFilterBar: document.getElementById('category-filter-bar'),
    filterPills: document.querySelectorAll('.filter-pill'),
    
    // Login Elements
    loginOverlay: document.getElementById('login-overlay'),
    loginForm: document.getElementById('login-form'),
    loginUsernameInput: document.getElementById('login-username'),
    loginPasswordInput: document.getElementById('login-password'),
    loginErrorMsg: document.getElementById('login-error-msg'),
    btnLogoutUser: document.getElementById('btn-logout-user'),
    
    // Lists
    listToday: document.getElementById('list-today'),
    listTomorrow: document.getElementById('list-tomorrow'),
    listAll: document.getElementById('list-all'),
    weekBoard: document.getElementById('week-board'),
    calendarGridDays: document.getElementById('calendar-grid-days'),
    calendarMonthYear: document.getElementById('calendar-month-year'),
    
    // Counts
    countToday: document.getElementById('count-today'),
    countTomorrow: document.getElementById('count-tomorrow'),
    countAll: document.getElementById('count-all'),
    
    // Stats Header
    headerGreeting: document.getElementById('header-greeting'),
    headerDate: document.getElementById('header-date'),
    progressCircle: document.getElementById('progress-circle'),
    progressPercentage: document.getElementById('progress-percentage'),
    progressCounts: document.getElementById('progress-counts'),
    
    // Network info
    networkUrl: document.getElementById('network-url'),
    settingsSyncUrl: document.getElementById('settings-sync-url'),
    btnCopyUrl: document.getElementById('btn-copy-url'),
    speechSupportBadge: document.getElementById('speech-support-badge'),
    btnResetData: document.getElementById('btn-reset-data'),
    
    // Input Console
    consoleTextInput: document.getElementById('console-text-input'),
    btnSubmitTask: document.getElementById('btn-submit-task'),
    btnConsoleMic: document.getElementById('btn-console-mic'),
    
    // Voice Overlay
    voiceOverlay: document.getElementById('voice-recognition-overlay'),
    btnAssistantMicToggle: document.getElementById('btn-assistant-mic-toggle'),
    voiceStatus: document.getElementById('voice-status'),
    voiceTranscript: document.getElementById('voice-transcript'),
    voiceNlpFeedback: document.getElementById('voice-nlp-feedback'),
    nlpBadgeTitle: document.getElementById('nlp-badge-title'),
    nlpBadgeDate: document.getElementById('nlp-badge-date'),
    nlpBadgeTime: document.getElementById('nlp-badge-time'),
    nlpBadgeCat: document.getElementById('nlp-badge-cat'),
    btnVoiceCancel: document.getElementById('btn-voice-cancel'),
    btnVoiceConfirm: document.getElementById('btn-voice-confirm'),
    
    // Month navigation
    btnPrevMonth: document.getElementById('btn-prev-month'),
    btnNextMonth: document.getElementById('btn-next-month')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    initSpeechRecognition();
    setupEventListeners();
    displayNetworkUrls();
});

// Check local storage for authenticated user session
function checkAuthentication() {
    const cachedSession = localStorage.getItem('session_user');
    if (cachedSession) {
        currentUser = JSON.parse(cachedSession);
        setupSessionUI();
        fetchTasks();
    } else {
        showLoginScreen();
    }
}

// Show/hide screen overlays for login
function showLoginScreen() {
    elements.loginOverlay.classList.remove('hidden');
    elements.appContainer.classList.add('blurred');
    elements.loginErrorMsg.style.display = 'none';
    elements.loginForm.reset();
}

function hideLoginScreen() {
    elements.loginOverlay.classList.add('hidden');
    elements.appContainer.classList.remove('blurred');
}

// Populate user session fields
function setupSessionUI() {
    hideLoginScreen();
    initGreetingAndDate();
}

// Setup date and localized greeting with username
function initGreetingAndDate() {
    if (!currentUser) return;
    const today = new Date();
    const hours = today.getHours();
    let greeting = "Good Evening";
    if (hours < 12) greeting = "Good Morning";
    else if (hours < 17) greeting = "Good Afternoon";
    
    elements.headerGreeting.textContent = `${greeting}, ${currentUser.name}`;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.headerDate.textContent = today.toLocaleDateString('en-US', options);
}

// Display Network URLs based on browser origin
function displayNetworkUrls() {
    const origin = window.location.origin;
    elements.networkUrl.textContent = origin;
    elements.settingsSyncUrl.textContent = origin;
}

// Set up speech recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        elements.speechSupportBadge.textContent = "Supported";
        elements.speechSupportBadge.className = "nlp-badge";
        elements.speechSupportBadge.style.color = "var(--accent-emerald)";
        elements.speechSupportBadge.style.backgroundColor = "rgba(16, 185, 129, 0.1)";

        recognition.onstart = () => {
            isRecording = true;
            elements.voiceStatus.textContent = "Listening...";
            elements.assistantMicPulse.classList.add('recording');
            elements.btnAssistantMicToggle.style.boxShadow = "0 0 30px var(--accent-rose)";
            elements.btnAssistantMicToggle.style.background = "linear-gradient(135deg, var(--accent-rose), #e11d48)";
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const activeTranscript = finalTranscript || interimTranscript;
            if (activeTranscript) {
                elements.voiceTranscript.textContent = `"${activeTranscript}"`;
                
                // Live NLP preview
                const parsed = window.parseTaskInput(activeTranscript);
                parsedVoiceTask = parsed; // Cache parsed object
                
                elements.nlpBadgeTitle.textContent = parsed.title;
                elements.nlpBadgeDate.textContent = parsed.date;
                elements.nlpBadgeTime.textContent = parsed.time || 'No Time';
                elements.nlpBadgeCat.textContent = parsed.category;
                elements.voiceNlpFeedback.classList.add('show');
                
                if (finalTranscript) {
                    elements.btnVoiceConfirm.style.display = 'block';
                    elements.voiceStatus.textContent = "Review details below";
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            elements.voiceStatus.textContent = `Error: ${event.error}. Try clicking the mic to restart.`;
            stopAudioRecordingUI();
        };

        recognition.onend = () => {
            stopAudioRecordingUI();
            if (parsedVoiceTask) {
                elements.voiceStatus.textContent = "Tap Confirm to add or mic to record again.";
            } else {
                elements.voiceStatus.textContent = "No audio captured. Tap mic to try again.";
            }
        };
    } else {
        elements.speechSupportBadge.textContent = "Unsupported";
        elements.speechSupportBadge.className = "nlp-badge";
        elements.speechSupportBadge.style.color = "var(--accent-rose)";
        elements.speechSupportBadge.style.backgroundColor = "rgba(244, 63, 94, 0.1)";
        elements.btnConsoleMic.style.display = 'none'; // Hide mic if not supported
    }
}

function stopAudioRecordingUI() {
    isRecording = false;
    elements.btnAssistantMicToggle.style.boxShadow = "var(--shadow-indigo)";
    elements.btnAssistantMicToggle.style.background = "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))";
}

// Global Event Listeners
function setupEventListeners() {
    // Login Submit Form
    elements.loginForm.addEventListener('submit', handleLoginSubmit);

    // Logout Button Action
    elements.btnLogoutUser.addEventListener('click', handleLogoutUser);

    // Navigation Tabs (supports both desktop sidebar and mobile bottom nav)
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Category Filter pills
    elements.categoryFilterBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category');
        renderTasks();
    });

    // Submit via manual input
    elements.btnSubmitTask.addEventListener('click', handleTextInputSubmit);
    elements.consoleTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleTextInputSubmit();
    });

    // Copy Sync URL button
    elements.btnCopyUrl.addEventListener('click', () => {
        const url = elements.networkUrl.textContent;
        navigator.clipboard.writeText(url).then(() => {
            elements.btnCopyUrl.style.color = 'var(--accent-emerald)';
            setTimeout(() => {
                elements.btnCopyUrl.style.color = '';
            }, 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
    });

    // Open Voice Assistant Overlay
    elements.btnConsoleMic.addEventListener('click', () => {
        if (!recognition) return;
        openVoiceOverlay();
    });

    // Assistant Mic Toggle (start/stop)
    elements.btnAssistantMicToggle.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
        } else {
            startRecording();
        }
    });

    // Voice Overlay Buttons
    elements.btnVoiceCancel.addEventListener('click', closeVoiceOverlay);
    elements.btnVoiceConfirm.addEventListener('click', handleVoiceConfirmSubmit);

    // Month Navigation
    elements.btnPrevMonth.addEventListener('click', () => {
        currentMonthDate.setMonth(currentMonthDate.getMonth() - 1);
        renderMonthView();
    });
    elements.btnNextMonth.addEventListener('click', () => {
        currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
        renderMonthView();
    });

    // Reset database action
    elements.btnResetData.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all tasks? This will delete your current tasks and restore the initial sample tasks.")) {
            resetDatabase();
        }
    });
}

// Tab switcher logic
function switchTab(tabName) {
    activeTab = tabName;
    
    // Update navigation active states
    elements.tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Toggle panels visibility
    elements.viewPanels.forEach(panel => {
        if (panel.id === `panel-${tabName}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Render corresponding view
    if (tabName === 'month') {
        renderMonthView();
    } else if (tabName === 'week') {
        renderWeekView();
    } else {
        renderTasks(); // Updates Day and Inbox
    }
}

// Voice Recognition Flow
function openVoiceOverlay() {
    elements.voiceOverlay.classList.add('active');
    parsedVoiceTask = null;
    elements.voiceTranscript.textContent = '"Speak clearly now. For example: \'Send reports to vice president tomorrow\'"';
    elements.voiceNlpFeedback.classList.remove('show');
    elements.btnVoiceConfirm.style.display = 'none';
    startRecording();
}

function startRecording() {
    try {
        recognition.start();
    } catch (e) {
        console.warn("Recognition already started or error:", e);
    }
}

// Close Voice Assistant overlay
function closeVoiceOverlay() {
    if (recognition) recognition.stop();
    elements.voiceOverlay.classList.remove('active');
    stopAudioRecordingUI();
}

// --- Auth API Handlers ---

// Handle login submissions
async function handleLoginSubmit(e) {
    e.preventDefault();
    const username = elements.loginUsernameInput.value.trim();
    const password = elements.loginPasswordInput.value;

    elements.loginErrorMsg.style.display = 'none';

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Login failed');
        }

        const data = await response.json();
        // Login success: save session
        currentUser = data;
        localStorage.setItem('session_user', JSON.stringify(currentUser));
        
        setupSessionUI();
        fetchTasks();
    } catch (err) {
        console.error('Authentication failed:', err.message);
        elements.loginErrorMsg.style.display = 'block';
        elements.loginErrorMsg.textContent = err.message;
    }
}

// Handle logging out
function handleLogoutUser() {
    currentUser = null;
    localStorage.removeItem('session_user');
    tasks = [];
    renderAllViews();
    showLoginScreen();
}

// --- Task API Scoped Handlers ---

// Fetch tasks with Auth header
async function fetchTasks() {
    if (!currentUser) return;
    try {
        const response = await fetch('/api/tasks', {
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) {
            if (response.status === 401) {
                handleLogoutUser();
                return;
            }
            throw new Error('API fetch error');
        }
        tasks = await response.json();
        renderAllViews();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Add task with Auth header
async function saveTask(taskDetails) {
    if (!currentUser) return;
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token
            },
            body: JSON.stringify(taskDetails)
        });
        if (!response.ok) throw new Error('Failed to create task');
        const newTask = await response.json();
        tasks.push(newTask);
        renderAllViews();
        return newTask;
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

// Update task completion with Auth header
async function toggleTaskComplete(id, completed) {
    if (!currentUser) return;
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token
            },
            body: JSON.stringify({ completed })
        });
        if (!response.ok) throw new Error('Failed to update task');
        
        // Update local state
        const idx = tasks.findIndex(t => t.id === id);
        if (idx !== -1) {
            tasks[idx].completed = completed;
            renderAllViews();
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete task with Auth header
async function deleteTask(id) {
    if (!currentUser) return;
    try {
        const response = await fetch(`/api/tasks/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) throw new Error('Failed to delete task');
        
        // Update local state
        tasks = tasks.filter(t => t.id !== id);
        renderAllViews();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Reset database helper
async function resetDatabase() {
    if (!currentUser) return;
    try {
        for (const t of tasks) {
            await fetch(`/api/tasks/${t.id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + currentUser.token }
            });
        }
        // Force reload page to fetch fresh defaults
        window.location.reload();
    } catch (err) {
        console.error("Error resetting DB:", err);
    }
}

// --- Submit Handlers ---

// Submit text task
async function handleTextInputSubmit() {
    const rawText = elements.consoleTextInput.value.trim();
    if (!rawText) return;

    // Use smart NLP parser to extract values
    const parsed = window.parseTaskInput(rawText);
    
    await saveTask({
        title: parsed.title,
        date: parsed.date,
        time: parsed.time,
        category: parsed.category,
        completed: false,
        source: 'text'
    });

    elements.consoleTextInput.value = '';
}

// Submit voice task
async function handleVoiceConfirmSubmit() {
    if (!parsedVoiceTask) return;
    
    await saveTask({
        title: parsedVoiceTask.title,
        date: parsedVoiceTask.date,
        time: parsedVoiceTask.time,
        category: parsedVoiceTask.category,
        completed: false,
        source: 'voice'
    });

    closeVoiceOverlay();
}

// --- View Rendering Logic ---

// Helper to filter tasks by category
function filterTasksByCategory(taskList) {
    if (activeCategory === 'All') return taskList;
    return taskList.filter(t => t.category === activeCategory);
}

// Renders everything based on updated state
function renderAllViews() {
    renderTasks();
    if (activeTab === 'week') renderWeekView();
    if (activeTab === 'month') renderMonthView();
    renderProgressWidget();
}

// Default views (Day & Inbox)
function renderTasks() {
    const todayStr = getLocalDateStringISO(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = getLocalDateStringISO(tomorrow);

    // 1. Day View
    const todayTasks = filterTasksByCategory(tasks.filter(t => t.date === todayStr));
    const tomorrowTasks = filterTasksByCategory(tasks.filter(t => t.date === tomorrowStr));

    renderTaskListContainer(elements.listToday, todayTasks, 'today');
    renderTaskListContainer(elements.listTomorrow, tomorrowTasks, 'tomorrow');
    
    elements.countToday.textContent = todayTasks.length;
    elements.countTomorrow.textContent = tomorrowTasks.length;

    // 2. Inbox / All View
    const allFilteredTasks = filterTasksByCategory(tasks);
    // Sort tasks: pending first, then by date, then by time
    allFilteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    });
    
    renderTaskListContainer(elements.listAll, allFilteredTasks, 'inbox');
    elements.countAll.textContent = `${allFilteredTasks.length} task${allFilteredTasks.length !== 1 ? 's' : ''}`;
}

// Dynamic weekly board (starting from today)
function renderWeekView() {
    elements.weekBoard.innerHTML = '';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const loopDate = new Date();
        loopDate.setDate(today.getDate() + i);
        const loopDateStr = getLocalDateStringISO(loopDate);
        
        const isToday = i === 0;
        const dayLabel = isToday ? 'Today' : weekdays[loopDate.getDay()];
        const dateLabel = loopDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const dayTasks = filterTasksByCategory(tasks.filter(t => t.date === loopDateStr));
        
        const card = document.createElement('div');
        card.className = `week-day-card ${isToday ? 'today' : ''}`;
        
        card.innerHTML = `
            <div class="week-day-header">
                <h3>${dayLabel}</h3>
                <span class="week-day-date">${dateLabel}</span>
            </div>
            <div class="tasks-list" id="list-week-${i}"></div>
        `;
        
        elements.weekBoard.appendChild(card);
        const listContainer = card.querySelector('.tasks-list');
        renderTaskListContainer(listContainer, dayTasks, `week-${i}`);
    }
}

// Dynamic Month Calendar View
function renderMonthView() {
    elements.calendarGridDays.innerHTML = '';
    
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    
    elements.calendarMonthYear.textContent = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Day of the week headings
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'calendar-weekday';
        cell.textContent = day;
        elements.calendarGridDays.appendChild(cell);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const todayStr = getLocalDateStringISO(new Date());

    // Empty cells before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        elements.calendarGridDays.appendChild(emptyCell);
    }

    // Generate Calendar days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
        const cellDate = new Date(year, month, dayNum);
        const cellDateStr = getLocalDateStringISO(cellDate);
        
        const cell = document.createElement('div');
        const isToday = cellDateStr === todayStr;
        cell.className = `calendar-day ${isToday ? 'today' : ''}`;
        
        // Filter tasks for this calendar date
        const dayTasks = tasks.filter(t => t.date === cellDateStr);
        
        let dotsHtml = '';
        if (dayTasks.length > 0) {
            dotsHtml = '<div class="calendar-task-dots">';
            dayTasks.slice(0, 4).forEach(t => {
                const colorVar = `var(--cat-${t.category.toLowerCase()})`;
                dotsHtml += `<span class="task-dot" style="background-color: ${colorVar}"></span>`;
            });
            dotsHtml += '</div>';
        }

        cell.innerHTML = `
            <span class="day-number">${dayNum}</span>
            ${dotsHtml}
        `;
        
        cell.addEventListener('click', () => {
            activeCategory = 'All';
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            document.querySelector('.filter-pill[data-category="All"]').classList.add('active');
            
            switchTab('inbox');
            
            const listAllEl = elements.listAll;
            const dayTasksFiltered = tasks.filter(t => t.date === cellDateStr);
            renderTaskListContainer(listAllEl, dayTasksFiltered, 'focused-day');
            elements.countAll.textContent = `${dayTasksFiltered.length} task${dayTasksFiltered.length !== 1 ? 's' : ''} on ${cellDate.toLocaleDateString()}`;
        });

        elements.calendarGridDays.appendChild(cell);
    }
}

// Progress Ring rendering
function renderProgressWidget() {
    const todayStr = getLocalDateStringISO(new Date());
    const todayTasks = tasks.filter(t => t.date === todayStr);
    const totalCount = todayTasks.length;
    const completedCount = todayTasks.filter(t => t.completed).length;

    elements.progressCounts.textContent = `${completedCount} of ${totalCount} task${totalCount !== 1 ? 's' : ''} completed`;

    let percentage = 0;
    if (totalCount > 0) {
        percentage = Math.round((completedCount / totalCount) * 100);
    }
    
    elements.progressPercentage.textContent = `${percentage}%`;

    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    elements.progressCircle.style.strokeDashoffset = offset;
}

// Master Task Builder helper
function renderTaskListContainer(container, taskList, viewContextId) {
    container.innerHTML = '';
    
    if (taskList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span>No active tasks</span>
            </div>
        `;
        return;
    }

    taskList.forEach(task => {
        const item = document.createElement('div');
        const completedClass = task.completed ? 'completed' : '';
        const catClass = `cat-${task.category.toLowerCase()}`;
        item.className = `task-item ${completedClass} ${catClass}`;
        
        const taskDateObj = new Date(task.date);
        const prettyDate = taskDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const sourceBadgeHtml = task.source === 'voice' ? `
            <span class="task-source-badge" title="Added via voice">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8"/>
                </svg>
                Voice
            </span>
        ` : '';

        item.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
                <span class="checkmark">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
            </label>
            <div class="task-details">
                <span class="task-title">${task.title}</span>
                <div class="task-meta">
                    <span class="task-tag cat-${task.category.toLowerCase()}">${task.category}</span>
                    <span class="task-date">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                            <line x1="16" x2="16" y1="2" y2="6"/>
                            <line x1="8" x2="8" y1="2" y2="6"/>
                            <line x1="3" x2="21" y1="10" y2="10"/>
                        </svg>
                        ${prettyDate}
                    </span>
                    ${task.time ? `
                        <span class="task-time">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            ${formatTimeAmPm(task.time)}
                        </span>
                    ` : ''}
                    ${sourceBadgeHtml}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn delete-btn" data-task-id="${task.id}" title="Delete Task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        `;

        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.getAttribute('data-task-id');
            const isChecked = e.target.checked;
            toggleTaskComplete(taskId, isChecked);
        });

        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-btn');
            const taskId = btn.getAttribute('data-task-id');
            deleteTask(taskId);
        });

        container.appendChild(item);
    });
}

// --- Helper Utilities ---

function getLocalDateStringISO(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTimeAmPm(time24) {
    if (!time24) return '';
    const parts = time24.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}
