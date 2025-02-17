<?php
// backend.php

// Set common password and timezone for timestamp generation
define('COMMON_PASSWORD', 'pass@2025');
date_default_timezone_set('Africa/Nairobi');  // Adjust as needed

// Allowed phone numbers (normalized to start with "0")
// Provided phone numbers (converted from +254 format)
// Note: If a number does not start with 07 after conversion, review if it should be allowed.
$allowedPhones = [
    "0706127473", // +254 706 127473
    "0728309076", // +254 728 309076
    "0723504480", // +254 723 504480
    "0722760727", // +254 722 760727
    "0721561704", // +254 721 561704
    "0708352126", // +254 708 352126
    "0724155915", // +254 724 155915
    "0722856806", // +254 722 856806
    "0110070484", // +254 110 070484
    "0728507454", // +254 728 507454
    "0721330292", // +254 721 330292
    "0112080869", // +254 112 080869
    "0708157114", // +254 708 157114
    "0790571706", // +254 790 571706
    "0745185624", // +254 745 185624
    "0700547122", // +254 700 547122
    "0742542068", // +254 742 542068
    "0728662275", // +254 728 662275
    "0725014732", // +254 725 014732
    "0721444591", // +254 721 444591
    "0746947646", // +254 746 947646
    "0707968116", // +254 707 968116
    "0728325799", // +254 728 325799
    "0721658950", // +254 721 658950
    "0721213854", // +254 721 213854
    "0718722515", // +254 718 722515
    "0715833067"  // +254 715 833067
];

// Available emails list (as provided)
$availableEmails = [
    "rotedamsteve95@gmail.com",
    "stevethopi234@gmail.com",
    "hakisteve87@gmail.com",
    "tekonatrea234@gmail.com",
    "goffidukes345@gmail.com",
    "derasteve56@gmail.com",
    "stevekabarnet@gmail.com",
    "pokeaakanji@gmail.com",
    "kigalisamu@gmail.com",
    "ishangarwanda34@gmail.com",
    "peterrwanda34@gmail.com",
    "bukayosaka235@gmail.com",
    "stevepassi@gmail.com",
    "missrieroni23@gmail.com",
    "camiisteve@gmail.com",
    "talipakasi@gmail.com",
    "comtastoki@gmail.com",
    "stevejokey1134@gmail.com",
    "angolistepa234@gmail.com",
    "malamuangola23@gmail.com",
    "grapilelajohn@gmail.com",
    "davidmuisa2567@gmail.com",
    "jaksondomigo3421@gmail.com",
    "fistempire483@gmail.com",
    "geographical.geo360@gmail.com",
    "stevejupiter52@gmail.com",
    "mobeyii765mobi@gmail.com",
    "stevechampion345@gmail.com"
];

// File to store assignments (phone => [email, timestamp])
$assignmentFile = 'assignments.json';

// Load existing assignments or initialize an empty array
if (file_exists($assignmentFile)) {
    $assignments = json_decode(file_get_contents($assignmentFile), true);
    if (!is_array($assignments)) {
        $assignments = [];
    }
} else {
    $assignments = [];
}

// Read POSTed JSON input
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['phone'])) {
    echo json_encode(['status' => 'error', 'message' => 'No phone number provided.']);
    exit;
}

$rawPhone = trim($input['phone']);

// Normalize the phone number:
// If it starts with "+254", remove it and prefix with "0"
// If it starts with "254", do the same.
if (strpos($rawPhone, '+254') === 0) {
    $phone = '0' . preg_replace('/\s+/', '', substr($rawPhone, 4));
} elseif (strpos($rawPhone, '254') === 0) {
    $phone = '0' . preg_replace('/\s+/', '', substr($rawPhone, 3));
} else {
    $phone = preg_replace('/\s+/', '', $rawPhone);
}

// Basic phone format check (expects 10 digits, starting with 0)
if (strlen($phone) != 10 || substr($phone, 0, 1) != '0') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid phone number format.']);
    exit;
}

// Check if phone number is allowed
if (!in_array($phone, $allowedPhones)) {
    echo json_encode(['status' => 'error', 'message' => 'Phone number not recognized.']);
    exit;
}

// Check if this phone already has an assigned email and if it was assigned within the last 30 days
$now = time();
$thirtyDaysInSeconds = 30 * 24 * 60 * 60;
if (isset($assignments[$phone])) {
    $assignmentTime = $assignments[$phone]['timestamp'];
    if (($now - $assignmentTime) < $thirtyDaysInSeconds) {
        // Use the same email
        $assignedEmail = $assignments[$phone]['email'];
    } else {
        // Assignment expired - free the email for re-use
        unset($assignments[$phone]);
        $assignedEmail = null;
    }
} else {
    $assignedEmail = null;
}

// If no email assigned yet, pick a random available email that is not already assigned to someone else.
if (!$assignedEmail) {
    // Find emails already in use
    $usedEmails = [];
    foreach ($assignments as $assigned) {
        $usedEmails[] = $assigned['email'];
    }
    // Get emails that are still available
    $unusedEmails = array_diff($availableEmails, $usedEmails);
    
    if (empty($unusedEmails)) {
        echo json_encode(['status' => 'error', 'message' => 'No available emails at the moment.']);
        exit;
    }
    
    // Pick a random email from the unused list
    $unusedEmails = array_values($unusedEmails); // reindex
    $assignedEmail = $unusedEmails[array_rand($unusedEmails)];
    
    // Save the assignment with current timestamp
    $assignments[$phone] = [
        'email' => $assignedEmail,
        'timestamp' => $now
    ];
    
    // Write updated assignments back to file
    file_put_contents($assignmentFile, json_encode($assignments, JSON_PRETTY_PRINT));
}

// Prepare the message with details
$timeGenerated = date('Y-m-d H:i:s', $now);
$message = "Dear $phone,\n";
$message .= "Your new Dstv logins are:\n";
$message .= "Email: $assignedEmail\n";
$message .= "Password: " . COMMON_PASSWORD . "\n";
$message .= "Logins generated on: $timeGenerated\n";
$message .= "Warning: Sharing of logins is prohibited 🚫\n";
$message .= "@copyrights Ice Services";

// Return the response as JSON
echo json_encode(['status' => 'success', 'message' => $message]);
exit;
?>