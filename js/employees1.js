/**********************************************************************
 * Recent Employees Module
 * Part 3B.2A.1
 **********************************************************************/

/*************************************************************
 * Global Variables
 *************************************************************/

let employees = [];
let filteredEmployees = [];
let currentEmployeePage = 1;
const employeePageSize = 10;

/*************************************************************
 * Load Recent Employees
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
document.getElementById("sameAddress").addEventListener("change", function () {

    if (!this.checked) return;

    document.getElementById("editCurrentAddress").value =
        document.getElementById("editPermanentAddress").value;

    document.getElementById("editCurrentCountry").value =
        document.getElementById("editPermanentCountry").value;

    document.getElementById("editCurrentState").value =
        document.getElementById("editPermanentState").value;

    document.getElementById("editCurrentDistrict").value =
        document.getElementById("editPermanentDistrict").value;

    document.getElementById("editCurrentCity").value =
        document.getElementById("editPermanentCity").value;

    document.getElementById("editCurrentPincode").value =
        document.getElementById("editPermanentPincode").value;

});
function validateBankDetails() {

    const account =
        document.getElementById("editAccountNumber").value.trim();

    const confirm =
        document.getElementById("editConfirmAccountNumber").value.trim();

    if (confirm !== "" && account !== confirm) {

        alert("Account numbers do not match.");

        return false;

    }

    return true;

}
function calculateSalary() {

    const basic = Number(document.getElementById("editBasicSalary").value) || 0;
    const hra = Number(document.getElementById("editHRA").value) || 0;
    const medical = Number(document.getElementById("editMedicalAllowance").value) || 0;
    const travel = Number(document.getElementById("editTravelAllowance").value) || 0;
    const other = Number(document.getElementById("editOtherAllowance").value) || 0;

    const gross = basic + hra + medical + travel + other;

    document.getElementById("editGrossSalary").value = gross.toFixed(2);
    document.getElementById("editMonthlySalary").value = gross.toFixed(2);
}

document.querySelectorAll(".salary-field").forEach(control => {
    control.addEventListener("input", calculateSalary);
});

/**********************************************************************
 * Part 3B.2B.2C
 * Employee Update Module
 **********************************************************************/

/**************************************************************
 * Form Validation
 **************************************************************/
function validateEmployeeForm() {

    const firstName =
        document.getElementById("editFirstName").value.trim();

    const lastName =
        document.getElementById("editLastName").value.trim();

    const department =
        document.getElementById("editDepartment").value;

    const designation =
        document.getElementById("editDesignation").value;

    const mobile =
        document.getElementById("editMobile").value.trim();

    const email =
        document.getElementById("editEmail").value.trim();

    if (firstName === "") {

        showMessage("First Name is required.", "warning");
        return false;

    }

    if (lastName === "") {

        showMessage("Last Name is required.", "warning");
        return false;

    }

    if (department === "") {

        showMessage("Please select Department.", "warning");
        return false;

    }

    if (designation === "") {

        showMessage("Please select Designation.", "warning");
        return false;

    }

    if (!/^[0-9]{10}$/.test(mobile)) {

        showMessage(
            "Enter a valid 10-digit mobile number.",
            "warning"
        );

        return false;

    }

    if (
        email !== "" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        showMessage(
            "Enter a valid email address.",
            "warning"
        );

        return false;

    }

    if (!validatePassword())
        return false;

    return true;

}


async function saveEmployee() {
	debugger

    try {

        // Validate Form

        // if (!validateEmployee())
            // return;

        showLoader();

        // Create FormData

       // const formData = buildEmployeeFormData();
		 const data = {
    "EmployeeCode": document.getElementById("employeeCode").value,
    "FirstName": document.getElementById("firstName").value.trim(),
    "LastName": document.getElementById("lastName").value.trim(),
    "Gender": document.getElementById("gender").value,
    "DOB": document.getElementById("dob").value,
    "Mobile": document.getElementById("mobile").value,
    "Email": document.getElementById("email").value,
    "AadharNo": document.getElementById("aadharNo").value,
    "PANNo": document.getElementById("panNo").value,

    "DepartmentID": document.getElementById("department").value,
    "DesignationID": document.getElementById("designation").value,
    "JoiningDate": document.getElementById("joiningDate").value,
    "EmploymentType": document.getElementById("employmentType").value,
    "Shift": document.getElementById("shift").value,
    "ReportingManager": document.getElementById("reportingManager").value,
    "Status": document.getElementById("employeeStatus").value,
	
    "BasicSalary": document.getElementById("basicSalary").value,
    "HRA": document.getElementById("hra").value,
    "MedicalAllowance": document.getElementById("medicalAllowance").value,
    "TravelAllowance": document.getElementById("travelAllowance").value,
    "OtherAllowance": document.getElementById("otherAllowance").value,
    "Bonus": document.getElementById("bonus").value,
    "GrossSalary": document.getElementById("grossSalary").value,
    "MonthlySalary": document.getElementById("monthlySalary").value,
    "PF": document.getElementById("pf").value,
    "ESIC": document.getElementById("esic").value,
    "ProfessionalTax": document.getElementById("professionalTax").value,
	
    "BankName": document.getElementById("bankName").value,
    "AccountHolderName": document.getElementById("accountHolder").value,
    "AccountNumber": document.getElementById("accountNumber").value,
    "IFSCCode": document.getElementById("ifscCode").value,
    "BranchName": document.getElementById("branchName").value,
	
    "PermanentAddress": document.getElementById("permanentAddress").value,
    "CurrentAddress": document.getElementById("currentAddress").value,
	
    "Username": document.getElementById("username").value,
    "Password": document.getElementById("password").value,
    "Role": document.getElementById("role").value,
    "AccountStatus": document.getElementById("accountStatus").value
  };
  
  
  var data1={
"EmployeeCode": "EMP0116",
"FirstName": "Amit",
"LastName": "Sharma",
"Gender": "Male",
"DOB": "1990-05-15",
"Mobile": "9876543210",
"Email": "amit.sharma@example.com",
"AadharNo": "123456789012",
"PANNo": "ABCDE1234F",
"DepartmentID": 2,
"DesignationID": 5,
"JoiningDate": "2026-07-01",
"BasicSalary": 25000,
"HRA": 8000,
"TravelAllowance": 1500,
"OtherAllowance": 1000,
"ESICNumber": 500,
"BankName": "State Bank of India",
"AccountHolderName": "Amit Sharma",
"AccountNumber": "1234567890",
"IFSCCode": "SBIN0001234",
"BranchName": "Kurla"
}


  // Handle photo separately
  const photo = document.getElementById("employeePhoto").files[0];
  if (photo) {
    data1.Photo = photo; // ⚠️ Note: if you send JSON, you can't include File directly
  }
		
		
		
        var SaveempData = await apiPost("/employees",data1);
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
}
/**************************************************************
 * Update Employee
 **************************************************************/
async function updateEmployee(employeeId) {

    if (!validateEmployeeForm())
        return;

    try {

        showLoader();

        const employeeId =
            document.getElementById("editEmployeeId").value;

        const employee = {

            EmployeeCode:
                document.getElementById("editEmployeeCode").value,

            FirstName:
                document.getElementById("editFirstName").value,

            LastName:
                document.getElementById("editLastName").value,

            Gender:
                document.getElementById("editGender").value,

            DOB:
                document.getElementById("editDOB").value,

            Mobile:
                document.getElementById("editMobile").value,

            Email:
                document.getElementById("editEmail").value,

            Department:
                document.getElementById("editDepartment").value,

            Designation:
                document.getElementById("editDesignation").value,

            JoiningDate:
                document.getElementById("editJoiningDate").value,

            EmploymentType:
                document.getElementById("editEmploymentType").value,

            Shift:
                document.getElementById("editShift").value,

            ReportingManager:
                document.getElementById("editReportingManager").value,

            Status:
                document.getElementById("editStatus").value,

            BasicSalary:
                Number(document.getElementById("editBasicSalary").value),

            HRA:
                Number(document.getElementById("editHRA").value),

            MedicalAllowance:
                Number(document.getElementById("editMedicalAllowance").value),

            TravelAllowance:
                Number(document.getElementById("editTravelAllowance").value),

            OtherAllowance:
                Number(document.getElementById("editOtherAllowance").value),

            PF:
                Number(document.getElementById("editPF").value),

            ESIC:
                Number(document.getElementById("editESIC").value),

            ProfessionalTax:
                Number(document.getElementById("editProfessionalTax").value),

            MonthlySalary:
                Number(document.getElementById("editMonthlySalary").value),

            BankName:
                document.getElementById("editBankName").value,

            AccountHolderName:
                document.getElementById("editAccountHolder").value,

            AccountNumber:
                document.getElementById("editAccountNumber").value,

            IFSCCode:
                document.getElementById("editIFSC").value,

            BranchName:
                document.getElementById("editBranchName").value,

            PermanentAddress:
                document.getElementById("editPermanentAddress").value,

            CurrentAddress:
                document.getElementById("editCurrentAddress").value,

            Username:
                document.getElementById("editUsername").value,

            Role:
                document.getElementById("editUserRole").value,

            AccountStatus:
                document.getElementById("editAccountStatus").value,

            Password:
                document.getElementById("editPassword").value

        };

        await apiPut(

            "/employees" + "/" + employeeId,

            employee

        );

        bootstrap.Modal.getInstance(

            document.getElementById("editEmployeeModal")

        ).hide();

        showMessage(

            "Employee updated successfully.",

            "success"

        );

        await loadRecentEmployees();

        await loadDashboard();

    }
    catch (error) {

        console.error(error);

        showMessage(

            "Unable to update employee.",

            "error"

        );

    }
    finally {

        hideLoader();

    }

}

/**************************************************************
 * Submit Event
 **************************************************************/
document
.getElementById("editEmployeeForm")
.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        updateEmployee();

    }
);


/********************************************************************
 * Salary Calculation
 ********************************************************************/

const salaryInputs = [

    "basicSalary",

    "hra",

    "medicalAllowance",

    "travelAllowance",

    "otherAllowance",

    "bonus"

];

salaryInputs.forEach(id => {

    document
        .getElementById(id)
        .addEventListener(

            "input",

            calculateSalary

        );

});

function calculateSalary() {

    const basic =
        Number(document.getElementById("basicSalary").value) || 0;

    const hra =
        Number(document.getElementById("hra").value) || 0;

    const medical =
        Number(document.getElementById("medicalAllowance").value) || 0;

    const travel =
        Number(document.getElementById("travelAllowance").value) || 0;

    const other =
        Number(document.getElementById("otherAllowance").value) || 0;

    const bonus =
        Number(document.getElementById("bonus").value) || 0;

    const pf =
        Number(document.getElementById("pf").value) || 0;

    const esic =
        Number(document.getElementById("esic").value) || 0;

    const pt =
        Number(document.getElementById("professionalTax").value) || 0;

    const gross =
        basic +
        hra +
        medical +
        travel +
        other +
        bonus;

    const monthly =
        gross -
        pf -
        esic -
        pt;

    document.getElementById("grossSalary").value =
        gross.toFixed(2);

    document.getElementById("monthlySalary").value =
        monthly.toFixed(2);

}

/********************************************************************
 * Load Departments
 ********************************************************************/

async function loadDepartments() {

    try {

        const departments =
            await apiRequest(
                API_CONFIG.DEPARTMENT_API
            );

        const ddl =
            document.getElementById("department");

        ddl.innerHTML =
            '<option value="">Select Department</option>';

        departments.forEach(department => {

            ddl.innerHTML += `

<option value="${department.DepartmentID}">

${department.DepartmentName}

</option>

`;

        });

    }
    catch (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Unable to load departments.",
            "error"
        );

    }

}

/********************************************************************
 * Load Designations
 ********************************************************************/

async function loadDesignations() {

    try {

        const list =
            await apiRequest(
                API_CONFIG.DESIGNATION_API
            );

        const ddl =
            document.getElementById("designation");

        ddl.innerHTML =
            '<option value="">Select Designation</option>';

        list.forEach(item => {

            ddl.innerHTML += `

<option value="${item.DesignationID}">

${item.DesignationName}

</option>

`;

        });

    }
    catch (error) {

        Swal.fire(
            "Error",
            "Unable to load designations.",
            "error"
        );

    }

}

/********************************************************************
 * Load Reporting Managers
 ********************************************************************/

async function loadManagers() {

    try {

        const managers =
            await apiRequest(
                API_CONFIG.MANAGER_API
            );

        const ddl =
            document.getElementById(
                "reportingManager"
            );

        ddl.innerHTML =
            '<option value="">Select Manager</option>';

        managers.forEach(manager => {

            ddl.innerHTML += `

<option value="${manager.EmployeeID}">

${manager.EmployeeCode}
 -
${manager.FirstName}
 ${manager.LastName}

</option>

`;

        });

    }
    catch (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Unable to load reporting managers.",
            "error"
        );

    }

}

/*********************************************************************
 * Save Employee Error Handling
 *********************************************************************/

function handleSaveEmployeeError(error) {

    let message =
        "Unable to save employee.";

    if (error.message)
        message = error.message;

    switch (error.code) {

        case "EMPLOYEE_CODE_EXISTS":

            message =
                "Employee Code already exists.";

            break;

        case "USERNAME_EXISTS":

            message =
                "Username already exists.";

            break;

        case "EMAIL_EXISTS":

            message =
                "Email address already exists.";

            break;

        case "MOBILE_EXISTS":

            message =
                "Mobile number already exists.";

            break;

    }

    Swal.fire({

        icon: "error",

        title: "Save Failed",

        text: message

    });

}

/*********************************************************************
 * Save Button
 *********************************************************************/

document

// .getElementById("btnSaveEmployee")

// .addEventListener(

    // "click",

    // function (e) {

        // e.preventDefault();

        // saveEmployee();

    // }

// );
/********************************************************************
 * Reset Employee Form
 ********************************************************************/

function resetEmployeeForm() {

    document
        .getElementById("addEmployeeForm")
        .reset();

    photoPreview.src =
        "images/default-user.png";

    document.getElementById("grossSalary").value = "";

    document.getElementById("monthlySalary").value = "";

}
/********************************************************************
 * Employee Photo Preview
 ********************************************************************/

const employeePhoto =
    document.getElementById("employeePhoto");

const photoPreview =
    document.getElementById("photoPreview");

employeePhoto.addEventListener("change", function () {

    const file = this.files[0];

    if (!file)
        return;

    if (!file.type.startsWith("image/")) {

        Swal.fire(
            "Invalid File",
            "Please select an image.",
            "warning"
        );

        this.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        photoPreview.src = e.target.result;

    };

    reader.readAsDataURL(file);

});
/********************************************************************
 View Employee
********************************************************************/

async function viewEmployee(employeeId) {
 debugger
    try {


        showLoader();

        const employee = await apiGet(

           "/employees" + "/" + employeeId

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
            employee.DepartmentName;

        document.getElementById("profileDesignation").innerHTML =
            employee.Designation;

        document.getElementById("profileMobile").innerHTML =
            employee.Mobile;

        document.getElementById("profileEmail").innerHTML =
            employee.Email;

        document.getElementById("profileJoiningDate").innerHTML =
            formatDate(employee.JoiningDate);

        document.getElementById("profileSalary").innerHTML =
           employee.MonthlySalary;

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

       // hideLoader();

    }

}


/********************************************************************
 View Employee
********************************************************************/

async function EditviewEmployee(employeeId) {
 debugger
    try {


        showLoader();

        const employee = await apiGet(

           "/employees" + "/" + employeeId

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
            employee.DepartmentName;

        document.getElementById("profileDesignation").innerHTML =
            employee.Designation;

        document.getElementById("profileMobile").innerHTML =
            employee.Mobile;

        document.getElementById("profileEmail").innerHTML =
            employee.Email;

         document.getElementById("profileJoiningDate").innerHTML =
            formatDate(employee.JoiningDate);

        document.getElementById("profileSalary").innerHTML =
           employee.MonthlySalary;

        document.getElementById("profileAddress").innerHTML =
            employee.Address;

        document.getElementById("profileStatus").innerHTML =
            employee.Status === "Active"
                ? '<span class="badge bg-success">Active</span>'
                : '<span class="badge bg-danger">Inactive</span>';

        const modal = new bootstrap.Modal(

            document.getElementById(
                "editEmployeeModal"
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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
async function loadRecentEmployees() {

    try {
debugger
        showLoader();

        console.log("Loading employees...");

        // Uses apiGet() from Part 1A
        const response = await apiGet("/employees");

        if (!response) {

            throw new Error("No response received.");

        }

        employees = response;
        filteredEmployees = [...employees];

        console.log("Employees Loaded :", employees.length);

        // Render table
        renderEmployeeTable(filteredEmployees);

    }
    catch (error) {

        console.error("Employee Load Error :", error);

        showEmployeeError(
            "Unable to load employees."
        );

    }
    finally {

       // hideLoader();

    }

}

//--------------------------------------------
// Loader
//--------------------------------------------

function showLoader() {

    document.getElementById("loader").style.display = "flex";

}
//--------------------------------------------
// Loader
//--------------------------------------------


function hideLoader() {

    document.getElementById("loader").style.display = "none";

}

//-----
/************************************************************
 * Render Attendance Table
 ************************************************************/

function renderEmployeeTables(records) {

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
		
		<td> <button
class="btn btn-info btn-sm action-btn"
title="View">

<i class="fa fa-eye"></i>

</button>

<button
class="btn btn-warning btn-sm action-btn"
title="Edit">

<i class="fa fa-edit"></i>

</button>

<button
class="btn btn-danger btn-sm action-btn"
title="Delete">

<i class="fa fa-trash"></i>

</button></td>

        `;

        tbody.appendChild(row);

    });

}



/**********************************************************************
 * Recent Employees
 * Part 3B.2A.2
 **********************************************************************/

/*************************************************************
 * Render Employee Table
 *************************************************************/
function renderEmployeeTable(data = filteredEmployees) {

    const tbody = document.getElementById("employeeTableBody");
    const employeeCount = document.getElementById("employeeCount");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        showEmptyEmployees();
        return;
    }

    employeeCount.innerHTML = data.length;

    // Pagination
    const start = (currentEmployeePage - 1) * employeePageSize;
    const end = start + employeePageSize;

    const pageData = data.slice(start, end);

    pageData.forEach((emp, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${emp.EmployeeCode}</td>

        <td>
            <img
                src="${getEmployeePhoto(emp.Photo)}"
                class="employee-photo"
                alt="${emp.FirstName}">
        </td>

      
        <td>

            <strong>

                ${emp.FirstName} 

            </strong>

        </td>
   <td>${emp.LastName}</td>
        <td>${emp.DepartmentName || "-"}</td>

        <td>${emp.Designation || "-"}</td>

        <td>${emp.Gender}</td>
            <td>${emp.Mobile || "-"}</td>
       
       <td>${emp.Email}</td>
        <td>

            <button
                class="btn btn-info btn-sm action-btn"
                title="View"
                onclick="viewEmployee(${emp.EmployeeID})">

                <i class="fa fa-eye"></i>

            </button>

            <button
                class="btn btn-warning btn-sm action-btn"
                title="Edit"
                onclick="EditviewEmployee(${emp.EmployeeID})">

                <i class="fa fa-edit"></i>

            </button>

            <button
                class="btn btn-danger btn-sm action-btn"
                title="Delete"
                onclick="deleteEmployee(${emp.EmployeeID})">

                <i class="fa fa-trash"></i>

            </button>

        </td>

        `;

        tbody.appendChild(row);

    });

    renderEmployeePagination(data.length);

}


/*************************************************************
 * Employee Photo
 *************************************************************/
function getEmployeePhoto(photo) {

    if (
        !photo ||
        photo === "" ||
        photo === null
    ) {

        return "images/default-user.png";

    }

    return photo;

}

/*************************************************************
 * Status Badge
 *************************************************************/
function employeeStatusBadge(status) {

    switch ((status || "").toLowerCase()) {

        case "active":

            return `
                <span class="badge bg-success">
                    Active
                </span>`;

        case "inactive":

            return `
                <span class="badge bg-danger">
                    Inactive
                </span>`;

        default:

            return `
                <span class="badge bg-secondary">
                    Unknown
                </span>`;
    }

}

/*************************************************************
 * Pagination
 *************************************************************/
function renderEmployeePagination(totalRecords) {

    const pagination =
        document.getElementById("employeePagination");

    if (!pagination) return;

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(totalRecords / employeePageSize);

    if (totalPages <= 1)
        return;

    // Previous Button
    pagination.innerHTML += `

        <li class="page-item ${currentEmployeePage === 1 ? "disabled" : ""}">

            <a class="page-link"
               href="#"
               onclick="changeEmployeePage(${currentEmployeePage - 1})">

                Previous

            </a>

        </li>

    `;

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

        <li class="page-item ${i === currentEmployeePage ? "active" : ""}">

            <a class="page-link"
               href="#"
               onclick="changeEmployeePage(${i})">

                ${i}

            </a>

        </li>

        `;
    }

    // Next Button
    pagination.innerHTML += `

        <li class="page-item ${currentEmployeePage === totalPages ? "disabled" : ""}">

            <a class="page-link"
               href="#"
               onclick="changeEmployeePage(${currentEmployeePage + 1})">

                Next

            </a>

        </li>

    `;

}

/*************************************************************
 * Change Page
 *************************************************************/
function changeEmployeePage(page) {

    const totalPages =
        Math.ceil(filteredEmployees.length / employeePageSize);

    if (page < 1 || page > totalPages)
        return;

    currentEmployeePage = page;

    renderEmployeeTable(filteredEmployees);

}

/*************************************************************
 * Empty Table
 *************************************************************/
function showEmptyEmployees() {

    const tbody =
        document.getElementById("employeeTableBody");

    if (!tbody) return;

    tbody.innerHTML = `

        <tr>

            <td colspan="9"
                class="text-center text-muted py-5">

                <i class="fa fa-users fa-3x mb-3"></i>

                <br>

                No Employees Found

            </td>

        </tr>

    `;

}


async function deleteEmployee(employeeId) {

    const result = await Swal.fire({

        title: 'Delete Employee?',

        text: 'This action cannot be undone.',

        icon: 'warning',

        showCancelButton: true,

        confirmButtonColor: '#d33',

        cancelButtonColor: '#6c757d',

        confirmButtonText: 'Yes, Delete',

        cancelButtonText: 'Cancel'

    });

    if (!result.isConfirmed)
        return;

    try {

        showLoader();

        // JWT-authenticated DELETE request
        await apiDelete(API.EMPLOYEES + "/" + employeeId);

        // Refresh employee table
        await loadRecentEmployees();

        // Refresh dashboard statistics
        if (typeof loadDashboard === "function") {
            await loadDashboard();
        }

        Swal.fire({

            icon: 'success',

            title: 'Deleted',

            text: 'Employee deleted successfully.',

            timer: 2000,

            showConfirmButton: false

        });

    }
    catch (error) {

        console.error(error);

        Swal.fire({

            icon: 'error',

            title: 'Delete Failed',

            text: 'Unable to delete employee.'

        });

    }
    finally {

        hideLoader();

    }

}
function viewEmployees(employeeId) {

    console.log("View Employee :", employeeId);

}

function editEmployee(employeeId) {

    console.log("Edit Employee :", employeeId);

}

function deleteEmployees(employeeId) {

    console.log("Delete Employee :", employeeId);

}
/*************************************************************
 * Refresh Employee List
 *************************************************************/

async function refreshEmployees() {

    await loadRecentEmployees();

}

/*************************************************************
 * Employee Error Message
 *************************************************************/

function showEmployeeError(message) {

    const tbody =
        document.getElementById("employeeTableBody");

    if (!tbody)
        return;

    tbody.innerHTML = `

        <tr>

            <td colspan="9"
                class="text-center text-danger py-4">

                <i class="fa fa-circle-exclamation"></i>

                ${message}

            </td>

        </tr>

    `;

}

/*************************************************************
 * Empty Employee Table
 *************************************************************/

function showEmptyEmployees() {

    const tbody =
        document.getElementById("employeeTableBody");

    if (!tbody)
        return;

    tbody.innerHTML = `

        <tr>

            <td colspan="9"
                class="text-center py-4">

                No Employees Found

            </td>

        </tr>

    `;

}

/*************************************************************
 * Attach Refresh Button
 *************************************************************/

function initializeEmployeeModule() {

    const refreshButton =
        document.getElementById("refreshEmployeeBtn");

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshEmployees
        );

    }

}
document.getElementById('Addbtn').addEventListener('click', async () => {
	
   const modal = new bootstrap.Modal(

            document.getElementById(
                "addEmployeeModal"
            )

        );

        modal.show();
});
/*************************************************************
 * Load Employees after Dashboard Loads
 *************************************************************/

document.addEventListener(
    "DOMContentLoaded",
    () => {

       // initializeEmployeeModule();
        generateEmployeeCode();
        loadRecentEmployees();

    }
);