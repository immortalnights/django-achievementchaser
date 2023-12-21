# Achievement Chaser with Django

## Running

Core

```
docker-compose up
```

Server

```
python .\src\manage.py runserver
```

UI

```
cd ui
npm run dev
```

## Requirements

- python
- docker

### Dev Credentials

db "postgres:password"

superuser "admin:password" (.\manage.py createsuperuser)

pgadmin "admin@example.com:password"

### Environment variables

Server (src/achievementchaser/.env)

- MODE
- STEAM_API_KEY
- POSTGRES_PASSWORD

## Migrations

`python .\src\manage.py makemigrations games`

`python .\src\manage.py sqlmigrate games xxxx`

`python .\src\manage.py migrate`

## Trouble Shooting

> CommandError: You must set settings.ALLOWED_HOSTS if DEBUG is False.

Ensure `MODE=development` is set in the src/achievementchaser/.env
