let currentCaptchas = {}; 


// Opening Screen Functionality
function initOpeningScreen() {
    const openingScreen = document.getElementById('opening-screen');
    const logoVideo = document.querySelector('.logo-video');
    
    if (!openingScreen) return;
    
    // Check if video exists and handle its events
    if (logoVideo) {
        // When video ends, wait a moment then fade out
        logoVideo.addEventListener('ended', function() {
            setTimeout(() => {
                hideOpeningScreen();
            }, 1000);
        });
        
        // If video fails to load, still hide after timeout
        logoVideo.addEventListener('error', function() {
            console.log('Video failed to load, using fallback');
            setTimeout(() => {
                hideOpeningScreen();
            }, 3000);
        });
    }
    
    // Fallback: Hide opening screen after 4 seconds max
    setTimeout(() => {
        hideOpeningScreen();
    }, 4000);
}

function hideOpeningScreen() {
    const openingScreen = document.getElementById('opening-screen');
    if (openingScreen && !openingScreen.classList.contains('fade-out')) {
        openingScreen.classList.add('fade-out');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            openingScreen.remove();
        }, 500);
    }
}

// Enhanced version with skip functionality
function initOpeningScreenWithSkip() {
    const openingScreen = document.getElementById('opening-screen');
    const logoVideo = document.querySelector('.logo-video');
    
    if (!openingScreen) return;
    
    // Add skip button
    const skipButton = document.createElement('button');
    skipButton.innerHTML = 'Skip';
    skipButton.className = 'skip-button';
    skipButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.3s;
    `;
    skipButton.onmouseover = function() { this.style.background = 'rgba(0,0,0,0.9)'; };
    skipButton.onmouseout = function() { this.style.background = 'rgba(0,0,0,0.7)'; };
    skipButton.onclick = hideOpeningScreen;
    
    openingScreen.appendChild(skipButton);
    
    // Video event handlers
    if (logoVideo) {
        logoVideo.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
        });
        
        logoVideo.addEventListener('ended', function() {
            setTimeout(hideOpeningScreen, 800);
        });
        
        logoVideo.addEventListener('error', function() {
            console.log('Video error, using image fallback');
            // Show fallback image
            const fallbackImg = this.querySelector('img');
            if (fallbackImg) {
                this.style.display = 'none';
                fallbackImg.style.display = 'block';
            }
            setTimeout(hideOpeningScreen, 2000);
        });
        
        // Try to play video
        logoVideo.play().catch(error => {
            console.log('Video autoplay failed:', error);
            // Still hide after timeout
            setTimeout(hideOpeningScreen, 3000);
        });
    }
    
    // Maximum timeout as fallback
    setTimeout(hideOpeningScreen, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initOpeningScreenWithSkip();
});

// Alternative: Show opening screen only on first visit
function initOpeningScreenFirstVisit() {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('irctc_visited');
    
    if (!hasVisited) {
        // First visit - show opening screen
        initOpeningScreenWithSkip();
        // Mark as visited
        localStorage.setItem('irctc_visited', 'true');
    } else {
        // Returning visitor - hide immediately
        const openingScreen = document.getElementById('opening-screen');
        if (openingScreen) {
            openingScreen.style.display = 'none';
            openingScreen.remove();
        }
    }
}

// Mock API Configuration
const MOCK_API = {
    baseURL: "https://mock-irctc-api.com/v1",
    endpoints: {
        login: "/auth/login",
        signup: "/auth/signup",
        pnrStatus: "/pnr/status",
        searchTrains: "/trains/search",
        bookTicket: "/booking/create"
    },
    // Mock API Key (for demonstration only)
    apiKey: "irctc_mock_2025_hackathon_7x9k2m4p6q8r"
};

// Mock Database
const MOCK_DB = {
    users: [
        { id: 1, username: "demo123", mobile: "9876543210", email: "demo@example.com", password: "Demo@123", name: "Demo User" }
    ],
    pnrRecords: [
        { pnr: "1234567890", status: "CNF", coach: "S2", seat: "45", train: "12020 SHATABDI EXP" },
        { pnr: "2345678901", status: "WL", waitlist: "15", train: "12952 RAJDHANI EXP" }
    ],
    trains: [
        { number: "12020", name: "SHATABDI EXP", from: "NDLS", to: "LKO", classes: ["CC", "EC"] },
        { number: "12952", name: "RAJDHANI EXP", from: "NDLS", to: "CSMT", classes: ["3A", "2A", "1A"] }
    ]
};

// --- Custom Message Box Functions ---
const messageBox = document.getElementById('custom-message-box');
const messageText = document.getElementById('message-text');

function showMessageBox(message) {
    messageText.textContent = message;
    messageBox.style.display = 'flex';
}

function hideMessageBox() {
    messageBox.style.display = 'none';
}

// --- Mock API Functions ---
function mockApiCall(endpoint, data = {}, delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let response;
            
            switch(endpoint) {
                case MOCK_API.endpoints.login:
                    response = handleLoginAPI(data);
                    break;
                case MOCK_API.endpoints.signup:
                    response = handleSignupAPI(data);
                    break;
                case MOCK_API.endpoints.pnrStatus:
                    response = handlePnrAPI(data);
                    break;
                case MOCK_API.endpoints.searchTrains:
                    response = handleTrainSearchAPI(data);
                    break;
                default:
                    response = { success: false, message: "Invalid endpoint" };
            }
            
            if (response.success) {
                resolve(response);
            } else {
                reject(response);
            }
        }, delay);
    });
}

function handleLoginAPI(data) {
    const { username, password } = data;
    const user = MOCK_DB.users.find(u => 
        (u.username === username || u.mobile === username) && u.password === password
    );
    
    if (user) {
        return {
            success: true,
            message: "Login successful",
            data: {
                userId: user.id,
                name: user.name,
                token: "mock_jwt_token_" + Date.now()
            }
        };
    } else {
        return {
            success: false,
            message: "Invalid credentials"
        };
    }
}

function handleSignupAPI(data) {
    const { mobile, email, firstName, lastName, password } = data;
    
    // Check if user already exists
    const existingUser = MOCK_DB.users.find(u => u.mobile === mobile || u.email === email);
    if (existingUser) {
        return {
            success: false,
            message: "User with this mobile or email already exists"
        };
    }
    
    // Create new user
    const newUser = {
        id: MOCK_DB.users.length + 1,
        username: "user" + Date.now(),
        mobile,
        email,
        password,
        name: `${firstName} ${lastName}`
    };
    
    MOCK_DB.users.push(newUser);
    
    return {
        success: true,
        message: "Account created successfully",
        data: {
            userId: newUser.id,
            username: newUser.username
        }
    };
}

function handlePnrAPI(data) {
    const { pnr } = data;
    const record = MOCK_DB.pnrRecords.find(r => r.pnr === pnr);
    
    if (record) {
        return {
            success: true,
            message: "PNR status fetched successfully",
            data: record
        };
    } else {
        return {
            success: false,
            message: "PNR not found"
        };
    }
}

function handleTrainSearchAPI(data) {
    const { from, to, date } = data;
    
    // Filter trains based on route (mock implementation)
    const availableTrains = MOCK_DB.trains.filter(train => 
        train.from === from && train.to === to
    );
    
    return {
        success: true,
        message: "Trains fetched successfully",
        data: {
            trains: availableTrains,
            searchParams: { from, to, date }
        }
    };
}

// --- Auth Modal Functionality ---
const authModal = document.getElementById('auth-modal');
// let currentCaptchas = {
//     login: 'A1B2C3',
//     signup: 'X9Y8Z7'
// };

function showAuthModal() {
    authModal.style.display = 'flex';
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
    document.getElementById('login-captcha').textContent = currentCaptchas.login;
    document.getElementById('signup-captcha').textContent = currentCaptchas.signup;
}

function hideAuthModal() {
    authModal.style.display = 'none';
}

function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

function refreshCaptcha(type) {
    currentCaptchas[type] = generateCaptcha();
    document.getElementById(`${type}-captcha`).textContent = currentCaptchas[type];
    document.getElementById(`${type}-captcha-input`).value = '';
}

// Switch between login and signup tabs
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabType = this.getAttribute('data-tab');
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(`${tabType}-form`).classList.add('active');
    });
});

// Handle login form submission
/*
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const captchaInput = document.getElementById('login-captcha-input').value;
    const expectedCaptcha = currentCaptchas.login;
    
    if (!username || !password || !captchaInput) {
        showMessageBox("Please fill in all fields.");
        return;
    }
    
    if (captchaInput !== expectedCaptcha) {
        showMessageBox("Invalid captcha. Please try again.");
        refreshCaptcha('login');
        return;
    }
    
    try {
        const loginBtn = document.querySelector('#login-form .auth-submit');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = "Logging in...";
        loginBtn.disabled = true;
        
        const response = await mockApiCall(MOCK_API.endpoints.login, { username, password });
        
        showMessageBox(`Login successful! Welcome ${response.data.name}`);
        hideAuthModal();
        
        // Update UI for logged in state
        const navbarBtn = document.querySelector('.navbar .btn-primary');
        navbarBtn.textContent = `Hi, ${response.data.name.split(' ')[0]}`;
        navbarBtn.onclick = () => showMessageBox("Account dashboard coming soon!");
        
    } catch (error) {
        showMessageBox(error.message);
        refreshCaptcha('login');
    } finally {
        const loginBtn = document.querySelector('#login-form .auth-submit');
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
    }
} */

/* ================================================= */
/* AUTHENTICATION & FORM HANDLERS */
/* ================================================= */

function handleLogin(event) {
    event.preventDefault(); // Stop the form from submitting normally
    
    // 1. Get Input Values
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const captchaInput = document.getElementById('login-captcha-input').value;

    // 2. Captcha Validation
    if (captchaInput !== currentCaptchas['login']) {
        showMessageBox("Login Failed: Incorrect Captcha. Please try again.", "fas fa-shield-alt", 'var(--error-color)');
        refreshCaptcha('login'); // Generate a new captcha on failure
        return;
    }

    // 3. Credential Validation (Simulated)
    // Use 'demo' / 'demo' for successful login
    if (username === 'demo' && password === 'demo') {
        showMessageBox("Login Successful! Welcome, Demo User. 🥳", "fas fa-check-circle", 'var(--success-color)');
        hideAuthModal(); // Hide the modal on success
        
        // Clear inputs after successful login
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('login-captcha-input').value = '';

    } else {
        // Real-world: This would check a server database
        showMessageBox("Login Failed: Invalid User ID or Password.", "fas fa-lock", 'var(--error-color)');
        refreshCaptcha('login'); // Generate a new captcha on failure
    }
}

function fillDemoCredentials() {
    document.getElementById('login-username').value = 'demo';
    document.getElementById('login-password').value = 'demo';
    showMessageBox("Demo credentials filled. Please enter the Captcha to login.", "fas fa-fingerprint", 'var(--accent-color)');
}

function showForgotPassword() {
    showMessageBox("Password reset process initiated. Check your registered mobile/email (Simulation).", "fas fa-envelope", 'var(--accent-color)');
}

function showForgotUsername() {
    showMessageBox("User ID recovery process initiated. Check your registered mobile/email (Simulation).", "fas fa-id-badge", 'var(--accent-color)');
}

// Utility functions for the modal itself (if not already present)
function showAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function hideAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

//new code uptil here

// Handle signup form submission
async function handleSignup(event) {
    event.preventDefault();
    
    const mobile = document.getElementById('signup-mobile').value;
    const email = document.getElementById('signup-email').value;
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const captchaInput = document.getElementById('signup-captcha-input').value;
    const expectedCaptcha = currentCaptchas.signup;
    
    // Validation
    if (!mobile || !email || !firstName || !lastName || !password || !confirmPassword || !captchaInput) {
        showMessageBox("Please fill in all fields.");
        return;
    }
    
    if (mobile.length !== 10) {
        showMessageBox("Please enter a valid 10-digit mobile number.");
        return;
    }
    
    if (password !== confirmPassword) {
        showMessageBox("Passwords do not match.");
        return;
    }
    
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        showMessageBox("Password must be at least 8 characters with uppercase, lowercase, number and special character.");
        return;
    }
    
    if (captchaInput !== expectedCaptcha) {
        showMessageBox("Invalid captcha. Please try again.");
        refreshCaptcha('signup');
        return;
    }
    
    try {
        const signupBtn = document.querySelector('#signup-form .auth-submit');
        const originalText = signupBtn.textContent;
        signupBtn.textContent = "Creating Account...";
        signupBtn.disabled = true;
        
        const response = await mockApiCall(MOCK_API.endpoints.signup, {
            mobile, email, firstName, lastName, password
        });
        
        showMessageBox(`Account created successfully! Your username is: ${response.data.username}`);
        
        // Switch to login tab
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="login"]').classList.add('active');
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById('login-form').classList.add('active');
        
    } catch (error) {
        showMessageBox(error.message);
        refreshCaptcha('signup');
    } finally {
        const signupBtn = document.querySelector('#signup-form .auth-submit');
        signupBtn.textContent = "Create Account";
        signupBtn.disabled = false;
    }
}

// Forgot password/username handlers
function showForgotPassword() {
    showMessageBox("Password reset feature would be implemented here. In real implementation, OTP would be sent to registered mobile/email.");
}

function showForgotUsername() {
    showMessageBox("Username recovery feature would be implemented here. You would need to verify your mobile number or email.");
}

function fillDemoCredentials() {
    const demoUser = MOCK_DB.users[0];
    document.getElementById('login-username').value = demoUser.username;
    document.getElementById('login-password').value = demoUser.password;
    document.getElementById('login-captcha-input').value = currentCaptchas.login;
    showMessageBox("Demo credentials filled. Click Login to continue.");
}

// --- Lite Mode Toggle Functionality ---
function toggleLiteMode() {
    document.body.classList.toggle('lite-mode');
    const buttonText = document.getElementById('lite-mode-toggle');
    const liteCalloutBtn = document.querySelector('.btn-lite-mode');
    
    if (document.body.classList.contains('lite-mode')) {
        showMessageBox("Lite Mode Activated: Minimal CSS, no background image, reduced animations.");
        buttonText.textContent = "Exit Lite Mode";
        if (liteCalloutBtn) liteCalloutBtn.innerHTML = '<i class="fas fa-bolt"></i> Exit Lite Mode';
    } else {
        showMessageBox("Lite Mode Deactivated.");
        buttonText.textContent = "Lite Mode";
        if (liteCalloutBtn) liteCalloutBtn.innerHTML = '<i class="fas fa-bolt"></i> Switch to Lite Mode (Save Data & Go Faster)';
    }
}

// Attach function to navbar link
document.getElementById('lite-mode-toggle').addEventListener('click', toggleLiteMode);

// --- AI Chatbot Functionality ---
const chatbotBtn = document.getElementById("chatbot-btn");
const chatWindow = document.getElementById("chat-window");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

// Toggle chatbot window
chatbotBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
});

closeChat.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
});

// Send message
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    userInput.value = "";

    setTimeout(() => {
        addMessage(generateBotReply(message), "bot");
    }, 600);
}

function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(sender === "user" ? "user-msg" : "bot-msg");
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simple AI Replies
function generateBotReply(message) {
    const lower = message.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi"))
        return "Hello there! How can I assist you with your IRCTC booking?";
    if (lower.includes("ticket") || lower.includes("book"))
        return "You can book tickets directly on the homepage — just enter your source, destination, and date.";
    if (lower.includes("pnr"))
        return "To check your PNR status, use the PNR section above the popular routes.";
    if (lower.includes("refund"))
        return "Refunds are processed within 3–5 working days depending on your payment method.";
    if (lower.includes("cancel"))
        return "You can cancel your ticket by logging into your IRCTC account and visiting 'My Bookings'.";
    if (lower.includes("train") || lower.includes("schedule"))
        return "You can check train schedules and availability using the booking form on the homepage.";
    if (lower.includes("help"))
        return "I can help you with tickets, refunds, PNR, cancellations, train schedules, and more!";
    if (lower.includes("thank"))
        return "You're welcome! Is there anything else I can help you with?";
    return "I'm here to assist with IRCTC services! Try asking about tickets, refunds, PNR status, or train schedules.";
}

function toggleAIChatbot() {
    chatWindow.classList.toggle("hidden");
}

// --- PNR Status Check Functionality ---
async function checkPNRStatus() {
    const pnrInput = document.getElementById('pnr-number');
    const pnrResult = document.getElementById('pnr-result');
    const pnr = pnrInput.value;

    if (pnr.length !== 10 || isNaN(pnr)) {
        showMessageBox("Please enter a valid 10-digit PNR number.");
        pnrResult.innerHTML = '';
        pnrResult.classList.remove('pnr-success', 'pnr-error');
        return;
    }

    try {
        pnrResult.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking status...';
        pnrResult.classList.remove('pnr-success', 'pnr-error');
        
        const response = await mockApiCall(MOCK_API.endpoints.pnrStatus, { pnr }, 1500);
        
        const record = response.data;
        let statusHtml = '';
        
        if (record.status === 'CNF') {
            statusHtml = `<i class="fas fa-check-circle"></i> Status: <strong>CONFIRMED</strong><br>
                         Coach: ${record.coach}, Seat: ${record.seat}<br>
                         Train: ${record.train}`;
            pnrResult.classList.add('pnr-success');
        } else if (record.status === 'WL') {
            statusHtml = `<i class="fas fa-exclamation-triangle"></i> Status: <strong>WAITING LIST (WL ${record.waitlist})</strong><br>
                         Train: ${record.train}`;
            pnrResult.classList.add('pnr-error');
        } else {
            statusHtml = `<i class="fas fa-info-circle"></i> Status: ${record.status}<br>
                         Train: ${record.train}`;
            pnrResult.classList.add('pnr-error');
        }
        
        pnrResult.innerHTML = statusHtml;
        
    } catch (error) {
        pnrResult.innerHTML = `<i class="fas fa-times-circle"></i> ${error.message}`;
        pnrResult.classList.add('pnr-error');
    }
}

// --- Booking Modal Functionality ---
// const bookingModal = document.getElementById('booking-modal');

// function showBookingModal() {
//     bookingModal.style.display = 'flex';
    
//     // In real implementation, this would fetch actual train data
//     const fromInput = document.querySelector('.booking-form input[placeholder*="From"]');
//     const toInput = document.querySelector('.booking-form input[placeholder*="To"]');
//     const dateInput = document.querySelector('.booking-form input[type="date"]');
    
//     const searchParams = {
//         from: fromInput.value || 'NDLS',
//         to: toInput.value || 'LKO',
//         date: dateInput.value || '2025-10-04'
//     };
// }
/* ================================================= */
/* TRAIN SEARCH & BOOKING MODAL FUNCTIONALITY */
/* ================================================= */

function showBookingModal() {
    // 1. Get the values from the three input fields
    const from = document.getElementById('from-station').value;
    const to = document.getElementById('to-station').value;
    const date = document.getElementById('travel-date').value;
    
    const modal = document.getElementById('booking-modal');
    const modalHeading = document.querySelector('#booking-modal .modal-heading');

    // 2. Simple Validation Check
    if (!from || !to || !date) {
        // Use your custom alert box for validation failure
        showMessageBox("Please fill in all search fields (From, To, and Date) to find trains.", "fas fa-exclamation-circle", 'var(--warning-color)');
        return; 
    }

    // 3. Update the Modal with Search Criteria
    if (modalHeading) {
        // Display the route and date the user searched for
        modalHeading.innerHTML = `<i class="fas fa-ticket-alt text-primary"></i> Trains from ${from.toUpperCase()} to ${to.toUpperCase()} on ${date}`;
    }
    
    // 4. Show the Modal
    if (modal) {
        modal.style.display = 'flex';
        // Give a success message that the search was completed
        showMessageBox("Search complete! Available trains are listed below.", "fas fa-train", 'var(--success-color)');
    }
}

// Ensure you have a function to close the modal
function hideBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// NOTE: You must also ensure the 'showMessageBox' function is present 
// in your script.js for the validation message to work.

// function hideBookingModal() {
//     bookingModal.style.display = 'none';
// }

// --- Route Filtering Functionality ---
document.querySelectorAll('.route-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Update active tab
        document.querySelectorAll('.route-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Filter routes
        const category = this.getAttribute('data-category');
        const routeCards = document.querySelectorAll('.route-card');
        
        routeCards.forEach(card => {
            const categories = card.getAttribute('data-categories');
            if (category === 'all' || categories.includes(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log("IRCTC Reimagined - Mock API System Ready");
    console.log("API Key:", MOCK_API.apiKey);
    console.log("Available endpoints:", MOCK_API.endpoints);
    
    // Set minimum date to today
    const dateInput = document.querySelector('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Initialize route filtering
    document.querySelector('.route-tab.active').click();
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === authModal) {
        hideAuthModal();
    }
    if (event.target === bookingModal) {
        hideBookingModal();
    }
    if (event.target === messageBox) {
        hideMessageBox();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key closes modals
    if (event.key === 'Escape') {
        hideAuthModal();
        hideBookingModal();
        hideMessageBox();
        chatWindow.classList.add("hidden");
    }
    
    // Ctrl+L for lite mode
    if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        toggleLiteMode();
    }
});