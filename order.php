<?php
// Kam sūtīt pasūtījumu
$to = "supersotins@gmail.com"; // <-- NOMAINSIET ŠEIT UZ SAVU E-PASTU, JA VAJAG

// Nolasām JSON datus no fetch()
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$name  = isset($data["name"])  ? trim($data["name"])  : "";
$phone = isset($data["phone"]) ? trim($data["phone"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$notes = isset($data["notes"]) ? trim($data["notes"]) : "";
$items = isset($data["items"]) ? trim($data["items"]) : "";
$total = isset($data["total"]) ? trim($data["total"]) : "";

// Vienkārša validācija
if ($items === "" || $total === "" || $name === "" || $phone === "" || $email === "") {
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

// Headeri (no noreply@ jūsu domēna)
$headers   = [];
$headers[] = "From: Sotins.eu <noreply@sotins.eu>";
$headers[] = "Reply-To: " . $email;
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headersStr = implode("\r\n", $headers);

// Sūtam e-pastu
$ok = mail($to, $subject, $body, $headersStr);

if ($ok) {
    http_response_code(200);
    echo "OK";
} else {
    http_response_code(500);
    echo "ERROR";
}
?>

