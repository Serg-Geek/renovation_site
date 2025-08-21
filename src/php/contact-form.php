<?php
// Настройки
$admin_email = 'gasanovefendi.123@bk.ru';
$site_name = 'ИП Гасанов Э.З. - Ремонт';
$from_email = 'noreply@' . $_SERVER['HTTP_HOST'];

// Защита от спама
$honeypot = isset($_POST['website']) ? $_POST['website'] : '';
if (!empty($honeypot)) {
    http_response_code(200);
    exit('OK');
}

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Получение и очистка данных
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$page = isset($_POST['page']) ? trim($_POST['page']) : 'Главная страница';

// Валидация
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Имя должно содержать минимум 2 символа';
}

if (empty($phone) || strlen($phone) < 10) {
    $errors[] = 'Введите корректный номер телефона';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Сообщение должно содержать минимум 10 символов';
}

if (strlen($message) > 2000) {
    $errors[] = 'Сообщение слишком длинное (максимум 2000 символов)';
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Подготовка данных для email
$subject = "Новая заявка с сайта - $page";
$ip_address = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$date = date('d.m.Y H:i:s');

// Создание HTML-шаблона email
$html_message = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #495057; }
        .value { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #28a745; }
        .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🛠️ Новая заявка на ремонт</h2>
            <p>С сайта: $site_name</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Имя клиента:</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>📞 Телефон:</div>
                <div class='value'>$phone</div>
            </div>
            <div class='field'>
                <div class='label'>💬 Сообщение:</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            <div class='field'>
                <div class='label'>📄 Страница:</div>
                <div class='value'>$page</div>
            </div>
            <div class='footer'>
                <p><strong>📅 Дата:</strong> $date</p>
                <p><strong>🌐 IP адрес:</strong> $ip_address</p>
                <p><strong>🔗 User Agent:</strong> " . substr($user_agent, 0, 100) . "...</p>
            </div>
        </div>
    </div>
</body>
</html>";

// Создание текстовой версии
$text_message = "
Новая заявка на ремонт
Сайт: $site_name
Страница: $page

Имя: $name
Телефон: $phone
Сообщение: $message

Дата: $date
IP: $ip_address
";

// Настройка заголовков
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . $site_name . ' <' . $from_email . '>',
    'Reply-To: ' . $from_email,
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 1',
    'X-MSMail-Priority: High'
];

// Отправка email
$mail_sent = mail($admin_email, $subject, $html_message, implode("\r\n", $headers));

if ($mail_sent) {
    // Успешная отправка
    echo json_encode([
        'success' => true,
        'message' => 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.'
    ]);
} else {
    // Ошибка отправки
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'errors' => ['Произошла ошибка при отправке. Попробуйте позже или свяжитесь с нами по телефону.']
    ]);
}
?>
