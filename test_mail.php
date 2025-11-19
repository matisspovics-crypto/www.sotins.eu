<?php
// Ļoti vienkāršs tests, vai uz servera strādā mail()

$to = "supersotins@gmail.com"; // var mainīt uz citu testam
$subject = "Testa epasts no test_mail.php";
$body = "Šis ir testa epasts no sotins.eu servera (test_mail.php).";
$headers = "From: Sotins.eu <noreply@sotins.eu>\r\nContent-Type: text/plain; charset=UTF-8";

if (mail($to, $subject, $body, $headers)) {
    echo "OK - tests nosūtīts uz: " . htmlspecialchars($to);
} else {
    echo "ERROR - mail() nestrādā šajā serverī.";
}
?>
