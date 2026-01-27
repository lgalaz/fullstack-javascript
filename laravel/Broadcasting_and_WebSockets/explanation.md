# Broadcasting and WebSockets

Laravel broadcasting lets server-side events push real-time updates to clients.

How it works (high level):
- Define channels in `routes/channels.php` (public/private/presence + authorization callbacks).
- Create events that implement `ShouldBroadcast` (they declare which channel to broadcast on).
- Configure a broadcaster (Reverb/Pusher/Ably) in `config/broadcasting.php` and your `.env`.
- Run a WebSocket server: start Reverb (`php artisan reverb:start`) or use a hosted provider like Pusher/Ably.
- On the client, connect with Laravel Echo and subscribe to the channel name you broadcast to.

Notes:
- Reverb needs setup/config before running (e.g., `php artisan reverb:install`, set `BROADCAST_DRIVER=reverb`, and configure host/port/scheme for Echo).
- Production typically runs Reverb as a separate service and proxies `wss://` traffic through Nginx.

Common drivers:
- Laravel Reverb
- Pusher
- Ably
- Laravel WebSockets (community)

Event example:

```php
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class OrderStatusUpdated implements ShouldBroadcast
{
    public function __construct(public Order $order) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('orders.' . $this->order->id)];
    }
}
```

Clients subscribe to channels using Echo or another WebSocket client.

Client example (Laravel Echo):

```js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    wsHost: import.meta.env.VITE_PUSHER_HOST ?? window.location.hostname,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 6001,
    forceTLS: false,
    disableStats: true,
});

echo.private(`orders.${orderId}`)
    .listen('OrderStatusUpdated', (e) => {
        console.log('Order updated', e);
    });
```
