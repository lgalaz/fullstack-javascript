# Streams, Files, and IO

## Streams

PHP uses a unified stream API for files, network sockets, and in-memory buffers.

```php
<?php

declare(strict_types=1);

$handle = fopen('php://temp', 'rb+');
fwrite($handle, "line1\nline2\n"); // Write content to the stream.
// Move the file pointer back to the start so fgets reads from the beginning.
rewind($handle);

while (($line = fgets($handle)) !== false) {
    echo $line;
}
fclose($handle);
```

Reading from a file on disk:

```php
<?php

declare(strict_types=1);

$handle = fopen('src/files/myfile.txt', 'rb');
// Pointer starts at the beginning for a fresh read.
while (($line = fgets($handle)) !== false) {
    echo $line;
}
fclose($handle);
```

## Stream Contexts

Contexts let you configure stream behavior (headers, timeouts, SSL options).

```php
<?php

declare(strict_types=1);

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 5,
        'header' => "Accept: application/json\r\n",
    ],
]);

$json = file_get_contents('https://example.com/api/user/1', false, $context); // $json = '{"name":"luis"}'
$user = json_decode($json);
// $user is stdClass, e.g. $user->name === 'luis'
```

Server-sent events (SSE) stream example:

```php
<?php

declare(strict_types=1);

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 0, // Keep the connection open.
        'header' => "Accept: text/event-stream\r\n",
    ],
]);

$handle = fopen('https://example.com/sse', 'rb', false, $context);
if ($handle === false) {
    throw new RuntimeException('Cannot open SSE stream');
}

while (!feof($handle)) {
    $line = fgets($handle);
    if ($line === false) {
        usleep(50_000);
        continue;
    }
    echo $line;
}

fclose($handle);
```

## Atomic Writes

For safe updates, write to a temp file and rename (rename is atomic on most filesystems).

```php
<?php

declare(strict_types=1);

$tmp = 'report.tmp';
file_put_contents($tmp, $data, LOCK_EX);
rename($tmp, 'report.txt');
```

LOCK_EX tells file_put_contents to take an exclusive lock while writing, so other processes won’t read/modify the file mid‑write.
Atomic means the rename happens as a single, indivisible filesystem operation: readers see either the old file or the new file, never a partially written file. This reduces corruption if a crash happens during the update.
