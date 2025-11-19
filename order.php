<?php
// Kam sūtīt pasūtījumu
$to = "orders@sotins.eu"; // <-- Ja vajag, nomainiet uz savu e-pastu, piem. yourname@gmail.com

// Debug log faila ceļš (tajā pašā mapē)
$logFile = __DIR__ . "/order_debug_log.txt";

// Nolasām JSON datus
$raw = file_get_contents("php://input");
file_put_contents($logFile, "---- " . date("Y-m-d H:i:s") . " RAW ----\n" . $raw . "\n", FILE_APPEND);

$data = json_decode($raw, true);

$name  = isset($data["name"])  ? trim($data["name"])  : "";
$phone = isset($data["phone"]) ? trim($data["phone"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$notes = isset($data["notes"]) ? trim($data["notes"]) : "";
$items = isset($data["items"]) ? trim($data["items"]) : "";
$total = isset($data["total"]) ? trim($data["total"]) : "";

// Vienkārša validācija
if ($items === "" || $total === "" || $name === "" || $phone === "" || $email === "") {
    file_put_contents($logFile, "ERROR: Missing fields\n", FILE_APPEND);
    http_response_code(400);
    echo "Missing fields";
    exit;
}

// Temats
$subject = "Jauns pasūtījums — €" . $total;

// Ziņas saturs
$bodyLines = [
    "Jauns pasūtījums:",
    "",
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

// Headeri
$headers   = [];
$headers[] = "From: Sotins.eu <noreply@sotins.eu>";
$headers[] = "Reply-To: " . $email;
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headersStr = implode("\r\n", $headers);

$ok = mail($to, $subject, $body, $headersStr);

if ($ok) {
    file_put_contents($logFile, "MAIL OK uz: $to\n", FILE_APPEND);
    http_response_code(200);
    echo "OK";
} else {
    file_put_contents($logFile, "MAIL ERROR uz: $to\n", FILE_APPEND);
    http_response_code(500);
    echo "ERROR";
}
?>
