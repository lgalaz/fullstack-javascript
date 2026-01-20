# Broadcasting and WebSockets

Laravel broadcasting lets server-side events push real-time updates to clients.

Common drivers:
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
