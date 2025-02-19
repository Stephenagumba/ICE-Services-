document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phone");
    const loginForm = document.getElementById("loginForm");
    const responseMessage = document.getElementById("responseMessage");

    // Phone numbers and emails stored securely within the script
    const registeredNumbers = [
        "+254706127473", "+254728309076", "+254723504480", "+254722760727",
        "+254721561704", "+254708352126", "+254724155915", "+254722856806",
        "+254110070484", "+254728507454", "+254721330292", "+254112080869",
        "+254708157114", "+254790571706", "+254745185624", "+254700547122",
        "+254742542068", "+254728662275", "+254725014732", "+254721444591",
        "+254746947646", "+254707968116", "+254728325799", "+254721658950",
        "+254721213854", "+254718722515", "+254715833067"
    ];

    const emails = [
        "rotedamsteve95@gmail.com", "stevethopi234@gmail.com", "hakisteve87@gmail.com",
        "tekonatrea234@gmail.com", "goffidukes345@gmail.com", "derasteve56@gmail.com",
        "stevekabarnet@gmail.com", "pokeaakanji@gmail.com", "kigalisamu@gmail.com",
        "ishangarwanda34@gmail.com", "peterrwanda34@gmail.com", "bukayosaka235@gmail.com",
        "stevepassi@gmail.com", "missrieroni23@gmail.com", "camiisteve@gmail.com",
        "talipakasi@gmail.com", "comtastoki@gmail.com", "stevejokey1134@gmail.com",
        "angolistepa234@gmail.com", "malamuangola23@gmail.com", "grapilelajohn@gmail.com",
        "davidmuisa2567@gmail.com", "jaksondomigo3421@gmail.com", "fistempire483@gmail.com",
        "geographical.geo360@gmail.com", "stevejupiter52@gmail.com", "mobeyii765mobi@gmail.com",
        "stevechampion345@gmail.com"
    ];

    const showmax1 = { email: "stevejupiter52@gmail.com", password: "2025New@2025" };
    const showmax2 = { email: "geographical.geo360@gmail.com", password: "Exit@20244" };
    const commonPassword = "pass@2025";

    function getStoredLogin(phone) {
        const storedData = JSON.parse(localStorage.getItem(phone));
        if (storedData) {
            const storedTime = new Date(storedData.timestamp);
            const now = new Date();
            const timeDiff = now - storedTime;
            const daysPassed = timeDiff / (1000 * 60 * 60 * 24);
            
            if (daysPassed < 30) {
                return storedData; // Return the same login details if within 30 days
            }
        }
        return null;
    }

    function storeLogin(phone, email) {
        const loginDetails = {
            phone,
            email,
            password: commonPassword,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(phone, JSON.stringify(loginDetails));
        return loginDetails;
    }

    function generateLogins(phone) {
        // Convert phone number format
        const formattedPhone = phone.replace("+254", "07");

        // Check if phone number is registered
        if (!registeredNumbers.includes(phone)) {
            responseMessage.style.display = "block";
            responseMessage.style.color = "red";
            responseMessage.innerHTML = `Sorry, this number is not registered.`;
            return;
        }

        let loginData = getStoredLogin(phone);
        if (!loginData) {
            const randomEmail = emails[Math.floor(Math.random() * emails.length)];
            loginData = storeLogin(phone, randomEmail);
        }

        const clientIP = "Fetching...";
        const clientDevice = navigator.userAgent;
        const currentTime = new Date().toLocaleString();

        // Display login details
        responseMessage.style.display = "block";
        responseMessage.style.color = "white";
        responseMessage.style.backgroundColor = "#007bff";
        responseMessage.style.padding = "15px";
        responseMessage.style.borderRadius = "5px";
        responseMessage.innerHTML = `
            <strong>Dear ${formattedPhone},</strong><br><br>
            <strong>Your new DStv stream logins:</strong><br>
            Email: <strong>${loginData.email}</strong><br>
            Password: <strong>${commonPassword}</strong><br><br>

            <strong>Other logins (Showmax):</strong><br>
            Email: <strong>${showmax1.email}</strong><br>
            Password: <strong>${showmax1.password}</strong><br><br>

            <strong>Showmax 2:</strong><br>
            Email: <strong>${showmax2.email}</strong><br>
            Password: <strong>${showmax2.password}</strong><br><br>

            <strong>Client IP:</strong> ${clientIP}<br>
            <strong>Time:</strong> ${currentTime}<br>
            <strong>Device:</strong> ${clientDevice}<br><br>

            <em>Your logins are generated from Ice Services server (USA).</em><br>
            <strong style="color: red;">🚫 Sharing of logins is prohibited 🚫</strong><br><br>

            <span style="color: yellow;">You will receive the same logins until 30 days have passed.</span>
        `;
    }

    // Form submission event
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const phone = phoneInput.value.trim();

        if (phone === "") {
            responseMessage.style.display = "block";
            responseMessage.style.color = "red";
            responseMessage.innerHTML = "Please enter your phone number.";
            return;
        }

        generateLogins(phone);
    });
});