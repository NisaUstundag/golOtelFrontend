<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>İletişim Sonucu</title>
    <link rel="stylesheet" href="styles\php2.css">
</head>
<body>

<?php
$serverName = "localhost";
$connectionOptions = array(
    "Database" => "otelWeb",
    "TrustServerCertificate" => true
);

$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    die("<div class='message error'>Bağlantı hatası: " . print_r(sqlsrv_errors(), true) . "</div>");
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$complaint = $_POST['complaint'] ?? '';

if (empty($name) || empty($email) || empty($phone) || empty($complaint)) {
    die("<div class='message error'>Lütfen tüm alanları doldurun.</div>");
}

$sql = "INSERT INTO contact (name, email, phone, complaint) VALUES (?, ?, ?, ?)";
$params = array($name, $email, $phone, $complaint);
$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt) {
    echo "<div class='message success'>Şikayetiniz başarıyla alındı. En kısa sürede dönüş yapacağız.</div>";
} else {
    echo "<div class='message error'>Hata: " . print_r(sqlsrv_errors(), true) . "</div>";
}

sqlsrv_close($conn);
?>



</body>
</html>
