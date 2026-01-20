# Scheduling

Laravel's task scheduler replaces many cron entries with a single cron job that runs `schedule:run`.

Define schedules in `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('reports:daily')->dailyAt('02:00');
    $schedule->job(new ProcessReport(1))->hourly();
}
```

System cron entry:

```bash
* * * * * php /path/to/app/artisan schedule:run >> /dev/null 2>&1
```
