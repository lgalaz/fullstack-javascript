# Notifications and Mail

Laravel supports email, SMS, and other notification channels.

Mailables:

```bash
php artisan make:mail InvoicePaid
```

```php
class InvoicePaid extends Mailable
{
    public function __construct(public Invoice $invoice) {}

    public function build(): self
    {
        return $this->subject('Invoice paid')
            ->view('emails.invoice_paid');
    }
}
```

Send mail:

```php
Mail::to($user->email)->send(new InvoicePaid($invoice));
```

Notifications:

```bash
php artisan make:notification InvoicePaidNotification
```

```php
$user->notify(new InvoicePaidNotification($invoice));
```

Notifications can be queued for async delivery.
