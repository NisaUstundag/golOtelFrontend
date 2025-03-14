<?php
// SQL Server bağlantı bilgileri
$serverName = "localhost"; // Gerekirse "localhost\SQLEXPRESS" gibi düzenleyin
$connectionOptions = array(
    "Database" => "otelWeb",
    "CharacterSet" => "UTF-8"
);

$conn = sqlsrv_connect($serverName, $connectionOptions);
if (!$conn) {
    die(json_encode([
        "status" => "error", 
        "message" => "Bağlantı hatası: " . print_r(sqlsrv_errors(), true)
    ]));
}

// Eğer tablo yoksa, oluştur (resim sütunu eklenmiştir)
$tableQuery = "
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='geridonus' AND xtype='U')
BEGIN
    CREATE TABLE geridonus (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ad NVARCHAR(100) NOT NULL,
        yildiz INT NOT NULL,
        yorum NVARCHAR(MAX) NOT NULL,
        resim NVARCHAR(255) NOT NULL
    )
END
";
sqlsrv_query($conn, $tableQuery);

// Dosya yükleme dizinini belirleyelim
$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Varsayılan resim yolu
$resimPath = $uploadDir . 'avatar-default.jpg';

// POST isteği kontrolü
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Form verilerini al
    $ad     = htmlspecialchars($_POST['firstName']);
    $yildiz = intval($_POST['rating']);
    $yorum  = htmlspecialchars($_POST['comment']);

    // Dosya yükleme işlemi
    if (isset($_FILES['userImage']) && $_FILES['userImage']['error'] == UPLOAD_ERR_OK) {
        $tmpName = $_FILES['userImage']['tmp_name'];
        $fileName = basename($_FILES['userImage']['name']);
        $targetFile = $uploadDir . time() . "_" . $fileName;

        if (move_uploaded_file($tmpName, $targetFile)) {
            $resimPath = $targetFile;
        }
    }

    // Boş alan kontrolü
    if (empty($ad) || empty($yildiz) || empty($yorum)) {
        die(json_encode([
            "status" => "error", 
            "message" => "Tüm alanları doldurun!"
        ]));
    }

    // SQL sorgusu: Yorum, ad, yıldız ve resim yolu ekleniyor
    $insertQuery = "INSERT INTO geridonus (ad, yildiz, yorum, resim) VALUES (?, ?, ?, ?)";
    $params = array($ad, $yildiz, $yorum, $resimPath);
    $stmt = sqlsrv_query($conn, $insertQuery, $params);

    if ($stmt) {
        echo json_encode([
            "status" => "success", 
            "message" => "Yorum başarıyla eklendi!"
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Yorum eklenirken hata oluştu: " . print_r(sqlsrv_errors(), true)
        ]);
    }
}

sqlsrv_close($conn);
?>
