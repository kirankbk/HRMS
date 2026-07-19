/*********************************************************************
 * HRMS Employee Module
 * Part 4.1
 * Configuration & Modal Helpers
 *********************************************************************/

/*********************************************************************
 * Configuration
 *********************************************************************/

const API_CONFIG = {

    BASE_URL: "http://localhost:3000/api",

    EMPLOYEE_API: "/employees",

    DEPARTMENT_API: "/departments",

    DESIGNATION_API: "/designations",

    MANAGER_API: "/employees/managers"

};

/*********************************************************************
 * Bootstrap Modal Instance
 *********************************************************************/

let addEmployeeModal = null;

document.addEventListener("DOMContentLoaded", () => {

    const modalElement =
        document.getElementById("addEmployeeModal");

    addEmployeeModal =
        new bootstrap.Modal(modalElement);

});



/*********************************************************************
 * Open Add Employee Modal
 *********************************************************************/

async function openEmployeeModal() {

    try {

        resetEmployeeForm();

        await generateEmployeeCode();

        await loadDepartments();

        await loadDesignations();

        await loadManagers();

        addEmployeeModal.show();

    }

    catch (error) {

        console.error(error);

        Swal.fire(

            "Error",

            "Unable to open employee form.",

            "error"

        );

    }

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

function generateEmployeeCode() {

    const value =

        "EMP" +

        Date.now()

            .toString()

            .slice(-6);

    document.getElementById(

        "employeeCode"

    ).value = value;

}

/*********************************************************************
 * JWT Token Helpers
 *********************************************************************/

function getToken() {

    return localStorage.getItem("token");

}

function setToken(token) {

    localStorage.setItem("token", token);

}

function removeToken() {

    localStorage.removeItem("token");

}

function isLoggedIn() {

    return getToken() !== null;

}


/*********************************************************************
 * Common API Request
 *********************************************************************/

async function apiRequest(

    url,

    method = "GET",

    body = null,

    isFormData = false

) {

    const headers = {};

    const token = getToken();

    if (token) {

        headers["Authorization"] =

            "Bearer " + token;

    }

    if (!isFormData) {

        headers["Content-Type"] =

            "application/json";

    }

    const response = await fetch(

        API_CONFIG.BASE_URL + url,

        {

            method,

            headers,

            body:

                body

                    ? isFormData

                        ? body

                        : JSON.stringify(body)

                    : null

        }

    );

    const result = await response.json();

    if (!response.ok) {

        throw result;

    }

    return result;

}


/*********************************************************************
 * Common API Request
 *********************************************************************/

async function apiRequest(

    url,

    method = "GET",

    body = null,

    isFormData = false

) {

    const headers = {};

    const token = getToken();

    if (token) {

        headers["Authorization"] =

            "Bearer " + token;

    }

    if (!isFormData) {

        headers["Content-Type"] =

            "application/json";

    }

    const response = await fetch(

        API_CONFIG.BASE_URL + url,

        {

            method,

            headers,

            body:

                body

                    ? isFormData

                        ? body

                        : JSON.stringify(body)

                    : null

        }

    );

    const result = await response.json();

    if (!response.ok) {

        throw result;

    }

    return result;

}