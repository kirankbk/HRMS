/**********************************************************************
 * HRMS Dashboard
 * dashboard.js
 * Part 1A
 **********************************************************************/

/*************************************************************
 * Configuration
 *************************************************************/

const CONFIG = {

    API_BASE_URL: "http://localhost:3000/api",

    TOKEN_KEY: "token",

    ROLE_KEY: "role",

    USER_KEY: "employeeId",

    REQUEST_TIMEOUT: 30000

};

/*************************************************************
 * API Endpoints
 *************************************************************/

const API = {

    LOGIN: "/auth/login",

    ADMIN_DASHBOARD: "/dashboard/admin",

    EMPLOYEE_DASHBOARD: "/dashboard/employee",

    EMPLOYEES: "/employees",

    ATTENDANCE: "/attendance",

    PAYROLL: "/salary",

    REPORTS: "/reports",

    PROFILE: "/profile"

};
window.onload=function(){
debugger
loadDashboard();

loadRecentEmployees();


startClock();

}
/*************************************************************
 * Token Helpers
 *************************************************************/
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
	document.getElementById('openModalBtn').addEventListener('click', function () {
  const modalElement = document.getElementById('employeeProfileModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
  
  viewEmployee(1003);
});
});

function loadRecentEmployees(){

loadEmployees();

}


function loadEmployees(){

let data=localStorage.getItem("employees");


if(data){

employees=JSON.parse(data);

}
else{


employees=[

{
id:"EMP001",
name:"Rahul Patil",
email:"rahul@gmail.com",
mobile:"9876543210",
photo:"images/user.png",
status:"Active"
},


{
id:"EMP002",
name:"Amit Shinde",
email:"amit@gmail.com",
mobile:"9898989898",
photo:"images/user.png",
status:"Inactive"
}


];


localStorage.setItem(
"employees",
JSON.stringify(employees)
);


}



displayEmployees();

}



function displayEmployees(){


let tbody=document.getElementById(
"employeeTableBody"
);


if(!tbody)
return;



tbody.innerHTML="";


let start=
(currentPage-1)*rowsPerPage;


let end=
start+rowsPerPage;



let pageEmployees=
employees.slice(start,end);



pageEmployees.forEach(emp=>{


tbody.innerHTML+=`


<tr>


<td>

<img 
src="${emp.photo}"
class="emp-photo">

</td>


<td>${emp.id}</td>


<td>${emp.name}</td>


<td>${emp.email}</td>


<td>${emp.mobile}</td>



<td>

<span class="
status 
${emp.status=="Active"?
"active":
"inactive"}
">

${emp.status}

</span>


</td>


<td>


<button 
class="view-btn"
onclick="viewEmployee('${emp.id}')">

👁

</button>



<button 
class="edit-btn"
onclick="editEmployee('${emp.id}')">

✏️

</button>



<button 
class="delete-btn"
onclick="deleteEmployee('${emp.id}')">

🗑

</button>


</td>


</tr>


`;


});


createPagination();



}
function getToken() {

    return localStorage.getItem(CONFIG.TOKEN_KEY);

}

function getRole() {

    return localStorage.getItem(CONFIG.ROLE_KEY);

}

function getEmployeeId() {

    return localStorage.getItem(CONFIG.USER_KEY);

}

function saveToken(token) {

    localStorage.setItem(CONFIG.TOKEN_KEY, token);

}

function removeToken() {

    localStorage.removeItem(CONFIG.TOKEN_KEY);

    localStorage.removeItem(CONFIG.ROLE_KEY);

    localStorage.removeItem(CONFIG.USER_KEY);

}

/*************************************************************
 * JWT Decode
 *************************************************************/

function parseJwt(token) {

    try {

        return JSON.parse(

            atob(token.split(".")[1])

        );

    }

    catch (e) {

        return null;

    }

}

/*************************************************************
 * Check Token Expiry
 *************************************************************/

function isTokenExpired(token) {

    if (!token)

        return true;

    const decoded = parseJwt(token);

    if (!decoded)

        return true;

    const current = Date.now() / 1000;

    return decoded.exp < current;

}

/*************************************************************
 * Authentication Validation
 *************************************************************/

function validateAuthentication() {

    const token = getToken();

    if (!token) {

        redirectLogin();

        return false;

    }

    if (isTokenExpired(token)) {

        alert("Session Expired");

        removeToken();

        redirectLogin();

        return false;

    }

    return true;

}

/*************************************************************
 * Role Validation
 *************************************************************/

function validateAdmin() {

    if (getRole() !== "Admin") {

        alert("Unauthorized Access");

        window.location.href = "employee-dashboard.html";

        return false;

    }

    return true;

}

/*************************************************************
 * Redirect Login
 *************************************************************/

function redirectLogin() {

    window.location.href = "login.html";

}

/*************************************************************
 * Common API Request
 *************************************************************/

async function apiRequest(

    endpoint,

    method = "GET",

    body = null

) {
debugger
    const token = getToken();

    const options = {

        method: method,

        headers: {

            "Content-Type": "application/json",

            "Authorization": `Bearer ${token}`

        }

    };

    if (body) {

        options.body = JSON.stringify(body);

    }

    try {

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, CONFIG.REQUEST_TIMEOUT);

        options.signal = controller.signal;

        const response = await fetch(

            CONFIG.API_BASE_URL + endpoint,

            options

        );

        clearTimeout(timeout);

        if (response.status === 401) {

            removeToken();

            redirectLogin();

            return null;

        }

        if (!response.ok) {

            throw new Error(

                "API Error : " + response.status

            );

        }

        return await response.json();

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

        return null;

    }

}

/*************************************************************
 * GET Request
 *************************************************************/

async function apiGet(endpoint) {

    return await apiRequest(

        endpoint,

        "GET"

    );

}

/*************************************************************
 * POST Request
 *************************************************************/

async function apiPost(

    endpoint,

    data

) {

    return await apiRequest(

        endpoint,

        "POST",

        data

    );

}

/*************************************************************
 * PUT Request
 *************************************************************/

async function apiPut(

    endpoint,

    data

) {

    return await apiRequest(

        endpoint,

        "PUT",

        data

    );

}

/*************************************************************
 * DELETE Request
 *************************************************************/

async function apiDelete(endpoint) {

    return await apiRequest(

        endpoint,

        "DELETE"

    );

}

/*************************************************************
 * Loader
 *************************************************************/

function showLoader() {

    const loader = document.getElementById(

        "loader"

    );

    if (loader)

        loader.style.display = "flex";

}

function hideLoader() {

    const loader = document.getElementById(

        "loader"

    );

    if (loader)

        loader.style.display = "none";

}

/*************************************************************
 * Notification
 *************************************************************/

function showMessage(

    message,

    type = "success"

) {

    console.log(type, message);

}

/*************************************************************
 * Number Format
 *************************************************************/

function formatCurrency(value) {

    return new Intl.NumberFormat(

        "en-IN",

        {

            style: "currency",

            currency: "INR"

        }

    ).format(value);

}

/*************************************************************
 * Date Format
 *************************************************************/

function formatDate(date) {

    return new Date(date)

        .toLocaleDateString("en-IN");

}

/*************************************************************
 * Time Format
 *************************************************************/

function formatTime(date) {

    return new Date(date)

        .toLocaleTimeString("en-IN");

}

/*************************************************************
 * Console
 *************************************************************/

console.log(

    "Dashboard JS Loaded Successfully"

);

/**********************************************************************
 * HRMS Dashboard
 * dashboard.js
 * Part 1B
 **********************************************************************/

/*************************************************************
 * Sidebar Toggle
 *************************************************************/
function toggleSidebar() {

    const sidebar = document.querySelector(".sidebar");
    const wrapper = document.querySelector(".wrapper");
    const menuToggle = document.getElementById("menuToggle");

    if (!sidebar) return;

    sidebar.classList.toggle("collapsed");

    if (wrapper) {
        wrapper.classList.toggle("sidebar-collapsed");
    }

    if (menuToggle) {
        menuToggle.classList.toggle("active");
    }
}

/*************************************************************
 * Close Sidebar on Mobile
 *************************************************************/
function closeSidebarOnMobile() {

    if (window.innerWidth <= 768) {

        const sidebar = document.querySelector(".sidebar");
        const wrapper = document.querySelector(".wrapper");

        if (sidebar) {
            sidebar.classList.add("collapsed");
        }

        if (wrapper) {
            wrapper.classList.add("sidebar-collapsed");
        }
    }
}

/*************************************************************
 * Logout
 *************************************************************/
function logout() {

    if (!confirm("Are you sure you want to logout?")) {
        return;
    }

    removeToken();

    window.location.href = "login.html";
}

/*************************************************************
 * Live Date & Time
 *************************************************************/
function updateDateTime() {

    const now = new Date();

    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");

    const dateOptions = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    if (dateElement) {
        dateElement.innerHTML =
            now.toLocaleDateString("en-IN", dateOptions);
    }

    if (timeElement) {
        timeElement.innerHTML =
            now.toLocaleTimeString("en-IN");
    }
}

/*************************************************************
 * Load Logged-in User
 *************************************************************/
async function loadLoggedInUser() {

    const profile = await apiGet(API.PROFILE);

    if (!profile) return;

    const adminName =
        document.getElementById("adminName");

    const adminFullName =
        document.getElementById("adminFullName");

    if (adminName) {
        adminName.innerHTML = profile.fullName;
    }

    if (adminFullName) {
        adminFullName.innerHTML = profile.fullName;
    }

    const profileImage =
        document.querySelector(".profile img");

    if (profileImage && profile.photo) {

        profileImage.src = profile.photo;

    }
}

/*************************************************************
 * Auto Refresh Dashboard
 *************************************************************/
function startAutoRefresh() {

    setInterval(() => {

        if (typeof loadDashboard === "function") {
            loadDashboard();
        }

    }, 60000);

}

/*************************************************************
 * Dashboard Initialization
 *************************************************************/
async function initializeDashboard() {

    console.log("Initializing Dashboard...");

    if (!validateAuthentication()) {
        return;
    }

    if (!validateAdmin()) {
        return;
    }

    showLoader();

    try {

        updateDateTime();

        setInterval(updateDateTime, 1000);

        await loadLoggedInUser();

        if (typeof loadDashboard === "function") {
            await loadDashboard();
        }

        startAutoRefresh();

    }
    catch (err) {

        console.error(err);

        alert("Dashboard initialization failed.");

    }
    finally {

        hideLoader();

    }
}

/*************************************************************
 * Event Listeners
 *************************************************************/
document.addEventListener("DOMContentLoaded", () => {
debugger
    initializeDashboard();
    loadTodayAttendance();
    const menuToggle =
        document.getElementById("menuToggle");

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleSidebar
        );

    }

    const logoutButton =
        document.getElementById("logoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }

    window.addEventListener(
        "resize",
        closeSidebarOnMobile
    );

    closeSidebarOnMobile();

});

console.log("Dashboard Initialization Complete");


/**********************************************************************
 * Dashboard Data Loading
 **********************************************************************/

/*************************************************************
 * Load Dashboard
 *************************************************************/
async function loadDashboard() {
debugger
    try {

        showLoader();

        const dashboard = await apiGet(API.ADMIN_DASHBOARD);

        if (!dashboard) {

            console.error("Dashboard API returned no data.");

            return;
        }

        populateDashboardCards(dashboard);

        populateAttendanceSummary(dashboard);

        populatePayrollSummary(dashboard);

    }
    catch (err) {

        console.error("Dashboard Load Error", err);

        showMessage("Unable to load dashboard.", "error");

    }
    finally {

        hideLoader();

    }

}

/*************************************************************
 * Populate Dashboard Cards
 *************************************************************/
function populateDashboardCards(data) {

    animateCounter("totalEmployees", data.totalEmployees || 0);

    animateCounter("presentToday", data.presentToday || 0);

    animateCounter("absentToday", data.absentToday || 0);

    animateCounter("leaveToday", data.leaveToday || 0);

    animateCounter("lateCheckin", data.lateCheckin || 0);

    animateCounter("totalDepartments", data.totalDepartments || 0);

    document.getElementById("attendancePercent").innerHTML =
        (data.attendancePercent || 0) + "%";

}

/*************************************************************
 * Payroll Summary
 *************************************************************/
function populatePayrollSummary(data) {

    document.getElementById("monthlyPayroll").innerHTML =
        formatCurrency(data.monthlyPayroll || 0);

    document.getElementById("salaryPaid").innerHTML =
        formatCurrency(data.salaryPaid || 0);

    document.getElementById("pendingPayroll").innerHTML =
        formatCurrency(data.pendingPayroll || 0);

}

/*************************************************************
 * Attendance Summary
 *************************************************************/
function populateAttendanceSummary(data) {

    document.getElementById("activeUsers").innerHTML =
        data.activeUsers || 0;

    document.getElementById("pendingLeave").innerHTML =
        data.pendingLeave || 0;

}

/*************************************************************
 * Animated Counter
 *************************************************************/
function animateCounter(id, endValue) {

    const element = document.getElementById(id);

    if (!element)
        return;

    let start = 0;

    const duration = 1000;

    const increment = Math.max(1, Math.ceil(endValue / 50));

    const timer = setInterval(() => {

        start += increment;

        if (start >= endValue) {

            start = endValue;

            clearInterval(timer);

        }

        element.innerHTML = start.toLocaleString("en-IN");

    }, duration / 50);

}

/*************************************************************
 * Refresh Dashboard
 *************************************************************/
async function refreshDashboard() {

    await loadDashboard();

}

/*************************************************************
 * Auto Refresh Every Minute
 *************************************************************/
setInterval(() => {

    refreshDashboard();

}, 60000);

/**********************************************************************
 * Today's Attendance
 **********************************************************************/

/************************************************************
 * Load Today's Attendance
 ************************************************************/

async function loadTodayAttendance() {

    try {

        showLoader();

        const attendance =
            await apiGet("/attendance/today");

        if (!attendance)
            return;

        renderAttendanceTable(attendance);

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Unable to load attendance.",
            "error"
        );

    }
    finally {

        hideLoader();

    }

}


/********************************************************************
 View Employee
********************************************************************/

async function viewEmployee(employeeId) {

    try {

        showLoader();

        const employee = await apiGet(

           "employees" + "/" + employeeId

        );

        if (!employee)
            return;

        document.getElementById("profilePhoto").src =
            employee.Photo || "images/default-user.png";

        document.getElementById("profileName").innerHTML =
            employee.FirstName + " " + employee.LastName;

        document.getElementById("profileCode").innerHTML =
            employee.EmployeeCode;

        document.getElementById("profileDepartment").innerHTML =
            employee.Department;

        document.getElementById("profileDesignation").innerHTML =
            employee.Designation;

        document.getElementById("profileMobile").innerHTML =
            employee.Mobile;

        document.getElementById("profileEmail").innerHTML =
            employee.Email;

        document.getElementById("profileJoiningDate").innerHTML =
            formatDate(employee.JoiningDate);

        document.getElementById("profileSalary").innerHTML =
            formatCurrency(employee.MonthlySalary);

        document.getElementById("profileAddress").innerHTML =
            employee.Address;

        document.getElementById("profileStatus").innerHTML =
            employee.Status === "Active"
                ? '<span class="badge bg-success">Active</span>'
                : '<span class="badge bg-danger">Inactive</span>';

        const modal = new bootstrap.Modal(

            document.getElementById(
                "employeeProfileModal"
            )

        );

        modal.show();

    }
    catch (err) {

        console.error(err);

        showMessage(

            "Unable to load employee.",

            "error"

        );

    }
    finally {

        hideLoader();

    }

}
/************************************************************
 * Render Attendance Table
 ************************************************************/

function renderAttendanceTable(records) {

    const tbody =
        document.getElementById("attendanceTableBody");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    if (records.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8"
                    class="text-center">

                    No Attendance Found

                </td>

            </tr>

        `;

        return;

    }

    records.forEach((emp, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${index + 1}</td>

        <td>

            <img

                src="${emp.Photo || 'images/DhandaiLogo.png'}"

                class="employee-photo">

        </td>

        <td>${emp.EmployeeCode}</td>

        <td>${emp.FirstName}</td>

        <td>${emp.LastName}</td>

        <td>${emp.CheckIn || "-"}</td>

        <td>${emp.CheckOut || "-"}</td>

        <td>

            ${attendanceBadge(emp.Status)}

        </td>

        <td>${emp.WorkingHours || "0"} Hrs</td>

        `;

        tbody.appendChild(row);

    });

}

/**********************************************************************
 * Attendance Status Badge
 **********************************************************************/

function attendanceBadge(status) {

    switch (status) {

        case "Present":

            return `
            <span class="badge bg-success">
                Present
            </span>`;

        case "Absent":

            return `
            <span class="badge bg-danger">
                Absent
            </span>`;

        case "Leave":

            return `
            <span class="badge bg-warning text-dark">
                Leave
            </span>`;

        case "Half Day":

            return `
            <span class="badge bg-info">
                Half Day
            </span>`;

        case "Late":

            return `
            <span class="badge bg-primary">
                Late
            </span>`;

        default:

            return `
            <span class="badge bg-secondary">
                ${status}
            </span>`;

    }

}