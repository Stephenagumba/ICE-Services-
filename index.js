"use strict";

// Store valid phone numbers securely
const validNumbers = new Set([
    "0706127473", "0728309076", "0723504480", "0722760727", "0721561704",
    "0708352126", "0724155915", "0722856806", "07110070484", "0728507454",
    "0721330292", "07112080869", "0708157114", "0790571706", "0745185624",
    "0700547122", "0742542068", "0728662275", "0725014732", "0721444591",
    "0746947646", "0707968116", "0728325799", "0721658950", "0721213854",
    "0718722515", "0715833067", "0700338057", "0780898618"
]);

// Validate user input
function validateLogin() {
    let phoneInput = document.getElementById("phone").value.trim();
    let errorMessage = document.getElementById("error-message");

    // Ensure number starts with 07 and is exactly 10 digits long
    if (!/^(07\d{8})$/.test(phoneInput)) {
        errorMessage.textContent = "Invalid phone number. Must be 10 digits starting with 07.";
        return;
    }

    // Check if phone number is in the valid list
    if (validNumbers.has(phoneInput)) {
        window.location.href = "main.html";
    } else {
        errorMessage.innerHTML = 
            "Number not registered. <a href='https://wa.me/254700338057' style='color: green;'>Register on WhatsApp</a>";
    }
}

// Prevent dev tools access
document.addEventListener("keydown", function(event) {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
    }
});