/*********************************************************************
 * HRMS Employee Dashboard
 * employee-dashboard.js
 *********************************************************************/

/* ==========================================================
   Configuration
========================================================== */

const CONFIG = {
    API_BASE_URL: "http://localhost:3000/api",

    ENDPOINTS: {
        DASHBOARD: "/dashboard/employee",
        PROFILE: "/employees/profile",
        ATTENDANCE_MONTHLY: "/attendance/monthly",
        ATTENDANCE_TODAY: "/attendance/today",
        LEAVES: "/leave",
        SALARY: "/salary",
        HOLIDAYS: "/holidays",
        NOTIFICATIONS: "/notifications",
        LOGOUT: "/auth/logout"
    },

    TOKEN_KEY: "token",
    USER_KEY: "user"
};


/* ==========================================================
   Global Variables
========================================================== */

let attendanceChart = null;

let currentDate = new Date();

let currentMonth = currentDate.getMonth() + 1;

let currentYear = currentDate.getFullYear();


/* ==========================================================
   JWT Token Helpers
========================================================== */

function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
}

function getUser() {

    const user = localStorage.getItem(CONFIG.USER_KEY);

    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {

    return !!getToken();

}

function clearSession() {

    localStorage.removeItem(CONFIG.TOKEN_KEY);

    localStorage.removeItem(CONFIG.USER_KEY);

}

function redirectToLogin() {

    window.location.href = "login.html";

}


/* ==========================================================
   JWT Validation
========================================================== */

function validateLogin() {

    if (!isLoggedIn()) {

        Swal.fire({

            icon: "warning",

            title: "Session Expired",

            text: "Please login again."

        }).then(() => {

            redirectToLogin();

        });

        return false;
    }

    return true;

}


/* ==========================================================
   Common API Request
========================================================== */

async function apiRequest(endpoint, method = "GET", body = null) {

    const options = {

        method,

        headers: {

            Authorization: `Bearer ${getToken()}`

        }

    };

    if (!(body instanceof FormData)) {

        options.headers["Content-Type"] = "application/json";

    }

    if (body) {

        options.body = body instanceof FormData
            ? body
            : JSON.stringify(body);

    }

    try {

        const response = await fetch(

            CONFIG.API_BASE_URL + endpoint,

            options

        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(

                result.message || "API Error"

            );

        }

        return result;

    }

    catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Error",

            text: error.message

        });

        throw error;

    }

}


/* ==========================================================
   Loader
========================================================== */

function showLoader() {

    const loader = document.getElementById("loader");

    if (loader)

        loader.style.display = "flex";

}

function hideLoader() {

    const loader = document.getElementById("loader");

    if (loader)

        loader.style.display = "none";

}


/* ==========================================================
   Live Date & Time
========================================================== */

function updateDateTime() {

    const now = new Date();

    const dateOptions = {

        weekday: "long",

        day: "2-digit",

        month: "long",

        year: "numeric"

    };

    const timeOptions = {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    };

    const dateElement = document.getElementById("currentDate");

    const timeElement = document.getElementById("currentTime");

    if (dateElement)

        dateElement.innerHTML =
            now.toLocaleDateString("en-IN", dateOptions);

    if (timeElement)

        timeElement.innerHTML =
            now.toLocaleTimeString("en-IN", timeOptions);

}


/* ==========================================================
   Logout
========================================================== */

async function logout() {

    const result = await Swal.fire({

        title: "Logout?",

        text: "Are you sure you want to logout?",

        icon: "question",

        showCancelButton: true,

        confirmButtonText: "Logout"

    });

    if (!result.isConfirmed)

        return;

    try {

        await apiRequest(

            CONFIG.ENDPOINTS.LOGOUT,

            "POST"

        );

    }

    catch (e) {

        // Ignore API failure and clear session locally

    }

    clearSession();

    redirectToLogin();

}


/* ==========================================================
   Dark Mode
========================================================== */

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(

        "darkMode",

        document.body.classList.contains("dark-mode")

    );

}

function loadDarkMode() {

    if (localStorage.getItem("darkMode") === "true") {

        document.body.classList.add("dark-mode");

    }

}


/* ==========================================================
   Dashboard Initialization
========================================================== */

async function initializeDashboard() {

    if (!validateLogin())

        return;

    showLoader();

    try {

        loadDarkMode();

        updateDateTime();

        setInterval(updateDateTime, 1000);

        // These functions will be implemented in later parts

        //await loadEmployeeProfile();

       // await loadDashboardSummary();

        //await loadAttendanceChart();

       // generateAttendanceCalendar();

       // await loadNotifications();

    }

    catch (error) {

        console.error(error);

    }

    finally {

        hideLoader();

    }

}


/* ==========================================================
   Event Listeners
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeDashboard();

        const logoutBtn = document.getElementById("logoutBtn");

        if (logoutBtn)

            logoutBtn.addEventListener("click", logout);

        const darkModeBtn = document.getElementById("darkModeToggle");

        if (darkModeBtn)

            darkModeBtn.addEventListener("click", toggleDarkMode);

        const prevBtn = document.getElementById("prevMonth");

        // if (prevBtn)

            // prevBtn.addEventListener("click", previousMonth);

        const nextBtn = document.getElementById("nextMonth");

        if (nextBtn)

            nextBtn.addEventListener("click", nextMonth);

        const monthDropdown = document.getElementById("attendanceMonth");

        if (monthDropdown) {

            monthDropdown.addEventListener("change", function () {

                currentMonth = Number(this.value);

                loadAttendanceChart();

                generateAttendanceCalendar();

            });

        }

    }

);