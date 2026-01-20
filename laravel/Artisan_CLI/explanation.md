# Artisan CLI

Artisan is Laravel's command-line tool for generating code and running tasks.

Common commands:

```bash
php artisan make:controller PostController
php artisan make:model Post -m
php artisan migrate
php artisan tinker
```

Custom commands:

```bash
php artisan make:command SyncReports
```

```php
class SyncReports extends Command
{
    protected $signature = 'reports:sync';

    public function handle(): int
    {
        // work
        $this->info('Synced');
        return Command::SUCCESS;
    }
}
```
