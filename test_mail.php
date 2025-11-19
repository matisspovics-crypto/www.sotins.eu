<?php
// Vienkāršs tests vai mail() strādā uz servera
$to = "orders@sotins.eu"; // <-- nomainiet uz savu e-pastu testam, ja vajag
$subject = "Testa epasts no sotins.eu";
$body = "Šis ir testa epasts no test_mail.php skripta.";
$headers = "From: Sotins.eu <noreply@sotins.eu>\r\nContent-Type: text/plain; charset=UTF-8";

if (mail($to, $subject, $body, $headers)) {
    echo "OK - tests nosūtīts uz: " . htmlspecialchars($to);
} else {
    echo "ERROR - mail() nestrādā šajā serverī.";
}
?>
