# Events and Listeners

Events decouple actions from side effects. Listeners handle those events.

Create event and listener:

```bash
php artisan make:event OrderPlaced
php artisan make:listener SendOrderEmail --event=OrderPlaced
```

Event:

```php
class OrderPlaced
{
    public function __construct(public Order $order) {}
}
```

Listener:

```php
class SendOrderEmail
{
    public function handle(OrderPlaced $event): void
    {
        // send email
    }
}
```

Dispatch:

```php
event(new OrderPlaced($order));
```
