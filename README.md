# Achievement Chaser with Django

## Running

```
docker-compose up
```

```
python .\src\manage.py runserver
```

```
cd src
celery --app achievementchaser worker --loglevel DEBUG -P solo
```

## Requirements

* python
* docker

### Dev Credentials

db "postgres:password"
superuser "admin:password"

## Migrations

`python .\src\manage.py makemigrations games`

`python .\src\manage.py sqlmigrate games xxxx`

`python .\src\manage.py migrate`