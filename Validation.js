/*********************************************************************
 * Part 4.3
 * Client Side Validation
 *********************************************************************/

/**************************************************************
 * Validation Patterns
 **************************************************************/

const VALIDATION = {

    email:
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    mobile:
        /^[6-9]\d{9}$/,

    aadhaar:
        /^\d{12}$/,

    pan:
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,

    ifsc:
        /^[A-Z]{4}0[A-Z0-9]{6}$/,

    username:
        /^[a-zA-Z0-9_.]{4,30}$/,

    password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_]).{8,}$/

};


/**************************************************************
 * Show Validation Error
 **************************************************************/

function validationError(message, elementId) {

    Swal.fire({

        icon: "warning",

        title: "Validation Error",

        text: message

    });

    if (elementId) {

        const element = document.getElementById(elementId);

        element.classList.add("is-invalid");

        element.focus();

    }

}


/**************************************************************
 * Remove Validation Style
 **************************************************************/

function clearValidation() {

    document

        .querySelectorAll(".form-control,.form-select")

        .forEach(control => {

            control.classList.remove(

                "is-valid",

                "is-invalid"

            );

        });

}