<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = $_POST;
$raw = file_get_contents('php://input');
if (empty($input) && is_string($raw) && $raw !== '') {
    $json = json_decode($raw, true);
    if (is_array($json)) {
        $input = $json;
    }
}

$name = trim((string)($input['name'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$message = trim((string)($input['message'] ?? ''));
$website = trim((string)($input['website'] ?? ''));

if ($website !== '') {
    echo json_encode(['ok' => true, 'message' => 'Message received']);
    exit;
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Please provide a valid name, email, and message.']);
    exit;
}

$to = 'chibunduawandu@gmail.com';
$subject = 'New portfolio inquiry from ' . $name;
$body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Portfolio Site <no-reply@chibunduawandu.com>',
    'Reply-To: ' . $email
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Message could not be sent right now. Please email chibunduawandu@gmail.com directly.'
    ]);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Message sent successfully.']);
