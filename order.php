<?php
// ====== GMAIL SMTP PASŪTĪJUMI UZ supersotins@gmail.com ======

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// PHPMailer klases (tām jābūt mapē phpmailer/ blakus order.php)
require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

// Nolasām JSON datus no fetch('order.php', ...)
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

$name  = isset($data["name"])  ? trim($data["name"])  : "";
$phone = isset($data["phone"]) ? trim($data["phone"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$notes = isset($data["notes"]) ? trim($data["notes"]) : "";
$items = isset($data["items"]) ? trim($data["items"]) : "";
$total = isset($data["total"]) ? trim($data["total"]) : "";

// Pamata pārbaude
if ($items === "" || $total === "" || $name === "" || $phone === "" || $email === "") {
    http_response_code(400);
    echo "Missing fields";
    exit;
}

// E-pasta temats un saturs
$subject = "Jauns pasūtījums — €" . $total;

$bodyLines = [
    "Jauns pasūtījums no sotins.eu",
    "",
    "Preces:",
    $items,
    "",
    "Kopā: €" . $total,
    "",
    "Klienta dati:",
    "Vārds: " . $name,
    "Telefons: " . $phone,
    "E-pasts: " . $email,
    "Adrese/komentāri: " . $notes,
];

$body = implode("\n", $bodyLines);

$mail = new PHPMailer(true);

try {
    // SMTP iestatījumi (Gmail)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'supersotins@gmail.com';        // JŪSU GMAIL
    $mail->Password   = 'ŠEIT_IELIEC_APP_PAROLI';       // 16-zīmju Google App Password (NEVIS parasto paroli)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // No/Uz
    $mail->setFrom('supersotins@gmail.com', 'Sotins.eu');
    $mail->addAddress('supersotins@gmail.com');         // saņēmējs – jūs pats
    $mail->addReplyTo($email, $name);                   // atbildes iet klientam

    // Saturs
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->CharSet = 'UTF-8';

    $mail->send();
    http_response_code(200);
    echo "OK";
} catch (Exception $e) {
    http_response_code(500);
    echo "ERROR: " . $mail->ErrorInfo;
}
