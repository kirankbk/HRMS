

document.addEventListener(
"DOMContentLoaded",
()=>{
debugger
loadTodayAttendance();
generateEmployeeCode();
document.getElementById('saveBtn').addEventListener('click', saveEmployee);
document.getElementById("btnUpdate").addEventListener("click",buildEmployeeFormDatasss);
});

// document
// .getElementById("btnSave")
// .addEventListener(

// "click",

// saveEmployee

//);
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


//loadRecentEmployees();

}



/*********************************************************************
 * Generate Employee Code
 *********************************************************************/

async function generateEmployeeCode() {

    try {

        const result = await apiRequest(

            "/employees/next-code"

        );

        document.getElementById(

            "employeeCode"

        ).value = result.employeeCode;

    }

    catch (error) {

        console.error(error);

    }

}

//======================================================
// Save Employee
// POST : /api/employees
//======================================================

async function saveEmployee() {
	debugger

    try {

        // Validate Form

        if (!validateEmployee())
          return;

        showLoader();

        // Create FormData

       // const formData = buildEmployeeFormData();
		var data={
  "employeeCode": document.getElementById("employeeCode").value,
  "firstName":  document.getElementById("FirstName").value,
  "lastName":  document.getElementById("FirstName").value,
  "gender":  document.getElementById("Gender").value,
  "mobile":  document.getElementById("Mobile").value,
  "email":  document.getElementById("Email").value,
  "designation":  document.getElementById("Designation").value,
  "departmentId":  document.getElementById("DepartmentID").value,
  "joiningDate":  document.getElementById("JoiningDate").value,
  "dailySalary":  document.getElementById("salary").value,
  "monthlySalary": document.getElementById("salary").value
}
		
		
		
        var SaveempData = await apiPost("/employees",data);
		debugger
     if (!SaveempData)
            return;

                  

        hideLoader();
      if (SaveempData.success==true) {

        showToast(
            "Employee Saved Successfully",
            "success"
        );

           //resetEmployeeForm();
           await loadTodayAttendance();
       }
     else
	 {
		  showToast(Saveemp.message, "error");

             return;
	 }

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast(

            "Unable to Save Employee",

            "error"

        );

    }
//=====================================
// Edit Mode
//=====================================

let editEmployeeId = null;
//=====================================
// Update Employee
//=====================================

async function updateEmployee() {

    try {

        if (!validateEmployee())
            return;

        showLoader();

        const formData = buildUpdateFormData();

        const response = await fetch(

            `${hhh}/${editEmployeeId}`,

            {

                method: "PUT",

                headers: {

                    Authorization: `Bearer ${getToken()}`

                },

                body: formData

            }

        );

        const result = await response.json();

        hideLoader();

        if (!response.ok) {

            showToast(

                result.message,

                "error"

            );

            return;

        }

        showToast(

            "Employee Updated Successfully",

            "success"

        );

        resetEmployeeForm();

        editEmployeeId = null;

        loadEmployees();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast(

            "Unable to Update Employee",

            "error"

        );

    }

}
//=====================================
// Edit Employee
//=====================================

async function editEmployee(id) {

    try {

        showLoader();

        const result = await apiRequest(

            `${EMPLOYEE_API}/${id}`,

            {

                method: "GET",

                headers: getHeaders()

            }

        );

        hideLoader();

        if (!result.success) {

            showToast(result.message, "error");

            return;

        }

        editEmployeeId = id;

        fillEmployeeForm(result.data);

    }

    catch (error) {

        hideLoader();

        showToast(error.message, "error");

    }

}

//=====================================
// Build Update FormData
//=====================================

function buildUpdateFormData() {

    const formData = buildEmployeeFormData();

    // Existing Image Path
    const currentPhoto =
        document.getElementById("CurrentPhoto").value;

    formData.append(

        "CurrentPhoto",

        currentPhoto

    );

    const file =
        document.getElementById("employeePhoto").files[0];

    if (file) {

        formData.set(

            "Photo",

            file

        );

    }

    return formData;

}
}
// document.getElementById("CurrentPhoto").value =
    // emp.Photo || "";

// if (emp.Photo) {

    // document.getElementById("photoPreview").src =
        // `${API_BASE_URL}/${emp.Photo}`;

// }
// else {

    // document.getElementById("photoPreview").src =
        // "images/profile.png";

// }


function resetEmployeeForm() {

    document
        .getElementById("employeeForm")
        .reset();

    editEmployeeId = null;

    document
        .getElementById("CurrentPhoto")
        .value = "";

    document
        .getElementById("photoPreview")
        .src =
        "images/profile.png";

}


async function loadTodayAttendance() {

    try {
debugger
        //showLoader();

        const attendance =
            await apiGet("/employees");

        if (!attendance)
            return;
debugger
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

       

    }

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


/************************************************************
 * Render Attendance Table
 ************************************************************/

function renderAttendanceTable(records) {

    const tbody =
        document.getElementById("employeeTableBody");

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

       <td>${emp.EmployeeCode}</td>

        <td>

            <img

                src="${emp.Photo || 'images/DhandaiLogo.png'}"

                class="employee-photo">

        </td>

      

        <td>${emp.FirstName}</td>

        <td>${emp.LastName}</td>

        <td>${emp.DepartmentID}</td>

        <td>${emp.Designation || "-"}</td>
		  <td>${emp.Gender || "-"}</td>

        <td>

            ${emp.Mobile}

        </td>

        <td>${emp.Email}</td>

        `;

        tbody.appendChild(row);

    });

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

//=====================================================
// Part 2A
// Validation + FormData + Loader + Toast
//=====================================================

//--------------------------------------------
// Validate Employee Form
//--------------------------------------------

function validateEmployee() {

    if (document.getElementById("employeeCode").value.trim() === "") {

        showToast("Employee Code is required", "error");

        return false;
    }

    if (document.getElementById("FirstName").value.trim() === "") {

        showToast("First Name is required", "error");

        return false;
    }

    // if (document.getElementById("LastName").value.trim() === "") {

        // showToast("Last Name is required", "error");

        // return false;
    // }

    if (document.getElementById("DepartmentID").value === "") {

        showToast("Please select Department", "error");

        return false;
    }

    if (document.getElementById("Designation").value.trim() === "") {

        showToast("Designation is required", "error");

        return false;
    }

    const mobile = document.getElementById("Mobile").value.trim();

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {

        showToast("Invalid Mobile Number", "error");

        return false;
    }

    const email = document.getElementById("Email").value.trim();

    if (email !== "") {

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {

            showToast("Invalid Email Address", "error");

            return false;
        }

    }

    return true;

}
//resetform
function resetEmployeeForm() {

    document
        .getElementById("employeeForm")
        .reset();

    document
        .getElementById("photoPreview")
        .src = "images/profile.png";

    document
        .getElementById("EmployeeID")
        .value = "";

}

function buildEmployeeFormData() {

    const formData = new FormData();

    formData.append(
        "employeeCode",
        document.getElementById("EmployeeCode").value
    );

    formData.append(
        "firstName",
        document.getElementById("FirstName").value
    );

    // formData.append(
        // "LastName",
        // document.getElementById("LastName").value
    // );

    formData.append(
        "gender",
        document.getElementById("Gender").value
    );

    formData.append(
        "DOB",
        document.getElementById("DOB").value
    );

    formData.append(
        "mobile",
        document.getElementById("Mobile").value
    );

    formData.append(
        "email",
        document.getElementById("Email").value
    );

    formData.append(
        "Address",
        document.getElementById("Address").value
    );

    // formData.append(
        // "AadharNo",
        // document.getElementById("AadharNo").value
    // );

    // formData.append(
        // "PANNo",
        // document.getElementById("PANNo").value
    // );

    formData.append(
        "departmentId",
        document.getElementById("DepartmentID").value
    );

    formData.append(
        "designation",
        document.getElementById("Designation").value
    );

    formData.append(
        "joiningDate",
        document.getElementById("JoiningDate").value
    );

    // formData.append(
        // "DailySalary",
        // document.getElementById("DailySalary").value
    // );

    // formData.append(
        // "MonthlySalary",
        // document.getElementById("MonthlySalary").value
    // );

    // formData.append(
        // "UserID",
        // document.getElementById("UserID").value
    // );

    // formData.append(
        // "BankName",
        // document.getElementById("BankName").value
    // );

    // formData.append(
        // "AccountNumber",
        // document.getElementById("AccountNumber").value
    // );

    // formData.append(
        // "IFSCCode",
        // document.getElementById("IFSCCode").value
    // );

    // formData.append(
        // "BranchName",
        // document.getElementById("BranchName").value
    // );

    // formData.append(
        // "UANNo",
        // document.getElementById("UANNo").value
    // );

    // formData.append(
        // "PFNumber",
        // document.getElementById("PFNumber").value
    // );

    // formData.append(
        // "ESICNumber",
        // document.getElementById("ESICNumber").value
    // );

    formData.append(
        "dailySalary",
        document.getElementById("salary").value
    );
 formData.append(
        "monthlySalary",
        document.getElementById("salary").value
    );

    // formData.append(
        // "HRA",
        // document.getElementById("HRA").value
    // );

    // formData.append(
        // "MedicalAllowance",
        // document.getElementById("MedicalAllowance").value
    // );

    // formData.append(
        // "TravelAllowance",
        // document.getElementById("TravelAllowance").value
    // );

    // formData.append(
        // "OtherAllowance",
        // document.getElementById("OtherAllowance").value
    // );

    // formData.append(
        // "IsActive",
        // document.getElementById("IsActive").checked ? 1 : 0
    // );

    const file =
        document.getElementById("employeePhoto").files[0];

    if (file) {

        formData.append("Photo", file);

    }

    return formData;

}
//--------------------------------------------
// Employee JSON Object
//--------------------------------------------

function buildEmployeeObject() {

    return {

        EmployeeID:
            document.getElementById("EmployeeID").value,

        EmployeeCode:
            document.getElementById("EmployeeCode").value,

        FirstName:
            document.getElementById("FirstName").value,

        LastName:
            document.getElementById("LastName").value,

        Gender:
            document.getElementById("Gender").value,

        DOB:
            document.getElementById("DOB").value,

        Mobile:
            document.getElementById("Mobile").value,

        Email:
            document.getElementById("Email").value,

        Address:
            document.getElementById("Address").value,

        AadharNo:
            document.getElementById("AadharNo").value,

        PANNo:
            document.getElementById("PANNo").value,

        DepartmentID:
            document.getElementById("DepartmentID").value,

        Designation:
            document.getElementById("Designation").value,

        JoiningDate:
            document.getElementById("JoiningDate").value,

        DailySalary:
            document.getElementById("DailySalary").value,

        MonthlySalary:
            document.getElementById("MonthlySalary").value,

        UserID:
            document.getElementById("UserID").value,

        IsActive:
            document.getElementById("IsActive").checked ? 1 : 0,

        BankName:
            document.getElementById("BankName").value,

        AccountNumber:
            document.getElementById("AccountNumber").value,

        IFSCCode:
            document.getElementById("IFSCCode").value,

        BranchName:
            document.getElementById("BranchName").value,

        UANNo:
            document.getElementById("UANNo").value,

        PFNumber:
            document.getElementById("PFNumber").value,

        ESICNumber:
            document.getElementById("ESICNumber").value,

        BasicSalary:
            document.getElementById("BasicSalary").value,

        HRA:
            document.getElementById("HRA").value,

        MedicalAllowance:
            document.getElementById("MedicalAllowance").value,

        TravelAllowance:
            document.getElementById("TravelAllowance").value,

        OtherAllowance:
            document.getElementById("OtherAllowance").value

    };

}

//--------------------------------------------
// FormData (For Multer Upload)
//--------------------------------------------

function buildEmployeeFormDatasss() {

    const formData = new FormData();

    const employee = buildEmployeeObject();

    Object.keys(employee).forEach(key => {

        formData.append(key, employee[key]);

    });

    const file = document.getElementById("employeePhoto").files[0];

    if (file) {

        formData.append("Photo", file);

    }

    return formData;

}

//--------------------------------------------
// Loader
//--------------------------------------------

function showLoader() {

    document.getElementById("loader").style.display = "flex";

}

function hideLoader() {

    document.getElementById("loader").style.display = "none";

}

//--------------------------------------------
// Toast Notification
//--------------------------------------------

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className =
        `toast-message ${type}`;

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}

//==================================================
// Fill Employee Form
//==================================================

function fillEmployeeForm(emp) {

    if (!emp)
        return;

    document.getElementById("EmployeeID").value =
        emp.EmployeeID || "";

    document.getElementById("EmployeeCode").value =
        emp.EmployeeCode || "";

    document.getElementById("FirstName").value =
        emp.FirstName || "";

    document.getElementById("LastName").value =
        emp.LastName || "";

    document.getElementById("Gender").value =
        emp.Gender || "";

    document.getElementById("DOB").value =
        emp.DOB || "";

    document.getElementById("Mobile").value =
        emp.Mobile || "";

    document.getElementById("Email").value =
        emp.Email || "";

    document.getElementById("Address").value =
        emp.Address || "";

    document.getElementById("AadharNo").value =
        emp.AadharNo || "";

    document.getElementById("PANNo").value =
        emp.PANNo || "";

    document.getElementById("DepartmentID").value =
        emp.DepartmentID || "";

    document.getElementById("Designation").value =
        emp.Designation || "";

    document.getElementById("JoiningDate").value =
        emp.JoiningDate || "";

    document.getElementById("DailySalary").value =
        emp.DailySalary || 0;

    document.getElementById("MonthlySalary").value =
        emp.MonthlySalary || 0;

    document.getElementById("UserID").value =
        emp.UserID || "";

    document.getElementById("BankName").value =
        emp.BankName || "";

    document.getElementById("AccountNumber").value =
        emp.AccountNumber || "";

    document.getElementById("IFSCCode").value =
        emp.IFSCCode || "";

    document.getElementById("BranchName").value =
        emp.BranchName || "";

    document.getElementById("UANNo").value =
        emp.UANNo || "";

    document.getElementById("PFNumber").value =
        emp.PFNumber || "";

    document.getElementById("ESICNumber").value =
        emp.ESICNumber || "";

    document.getElementById("BasicSalary").value =
        emp.BasicSalary || 0;

    document.getElementById("HRA").value =
        emp.HRA || 0;

    document.getElementById("MedicalAllowance").value =
        emp.MedicalAllowance || 0;

    document.getElementById("TravelAllowance").value =
        emp.TravelAllowance || 0;

    document.getElementById("OtherAllowance").value =
        emp.OtherAllowance || 0;

    document.getElementById("IsActive").checked =
        emp.IsActive == 1;

    if (emp.Photo) {

        document.getElementById("photoPreview").src =
            `${API_BASE_URL}/${emp.Photo}`;

    }

}
