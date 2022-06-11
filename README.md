# Achievement Chaser with Django

## Running

`docker-compose up`

`python .\manage.py runserver`

`celery --app achievementchaser worker --loglevel DEBUG -P solo`

## Requirements

* python
* docker

### Dev Credentials

db "postgres:password"
superuser "admin:password"

## Migrations
`python .\manage.py makemigrations games`

`python .\manage.py sqlmigrate games xxxx`

`python .\manage.py migrate`