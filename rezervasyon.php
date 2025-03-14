<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rezervasyon Sonucu</title>
    <link rel="stylesheet" href="styles/php.css">
    <a href="default.html" class="button">Ana Sayfa ➔</a>
</head>
<body>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = isset($_POST['name']) ? trim($_POST['name']) : null;
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : null;
    $card_info = isset($_POST['card_info']) ? trim($_POST['card_info']) : null;
    $service = isset($_POST['service']) ? trim($_POST['service']) : null;

    if (empty($name) || empty($phone) || empty($card_info) || empty($service)) {
        die("<div class='message'>Hata: Lütfen tüm alanları doldurun.</div>");
    }

    $serverName = "localhost";
    $connectionOptions = array(
        "Database" => "otelWeb",
        "TrustServerCertificate" => true
    );

    $conn = sqlsrv_connect($serverName, $connectionOptions);

    if (!$conn) {
        die("<div class='message'>Bağlantı hatası: " . print_r(sqlsrv_errors(), true) . "</div>");
    }

    $sql = "INSERT INTO reservations (name, phone, card_info, service) VALUES (?, ?, ?, ?)";
    $params = array($name, $phone, $card_info, $service);
    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt) {
        $sqlUpdate = "UPDATE hotels SET empty_rooms = empty_rooms - 1 WHERE name = ?";
        $stmtUpdate = sqlsrv_query($conn, $sqlUpdate, array($service));

        if ($stmtUpdate) {
            echo "<div class='message success'>Rezervasyonunuzu aldık, bizi tercih ettiğiniz için teşekkür ederiz.</div>";
        } else {
            echo "<div class='message error'>Hata: Oda sayısı güncellenemedi. " . print_r(sqlsrv_errors(), true) . "</div>";
        }
    } else {
        echo "<div class='message error'>Hata: " . print_r(sqlsrv_errors(), true) . "</div>";
    }

    sqlsrv_close($conn);
} else {
    echo "<div class='message error'>Hata: Formdan veri gelmedi.</div>";
}
?>

</body>
</html>
