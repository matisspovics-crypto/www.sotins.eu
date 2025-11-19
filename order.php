<?php
$to = "orders@sotins.eu";
$data = json_decode(file_get_contents("php://input"), true);

$name  = $data["name"]  ?? "";
$phone = $data["phone"] ?? "";
$email = $data["email"] ?? "";
$notes = $data["notes"] ?? "";
$items = $data["items"] ?? "";
$total = $data["total"] ?? "";

$subject = "Jauns pasūtījums – €" . $total;

$body = "Jauns pasūtījums:\n\n" .
        $items . "\n\n" .
        "Kopā: €" . $total . "\n\n" .
        "Klienta dati:\n" .
        "Vārds: $name\n" .
        "Telefons: $phone\n" .
        "E-pasts: $email\n" .
        "Adrese/komentāri: $notes\n";

$headers = "From: noreply@sotins.eu\r\n" .
           "Reply-To: $email\r\n";

if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo "OK";
} else {
    http_response_code(500);
    echo "ERROR";
}
?>