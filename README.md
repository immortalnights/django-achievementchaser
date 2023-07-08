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
superuser "admin:password" (.\manage.py createsuperuser)
pgadmin "admin@example.com:password"

## Migrations

`python .\src\manage.py makemigrations games`

`python .\src\manage.py sqlmigrate games xxxx`

`python .\src\manage.py migrate`

## Importing Mongodb Data

* Connect to host
* Create new directory for database dump, cd into directory
* Run

```
mongodump --gzip
```

* Use WinSCP (or similar) to download dump files to local system.
* Import dump files to docker container (may need to make target directory first) using cmd prompt

```
docker cp players.bson.gz mongo-achievementchaser:/home/dump
docker cp players.metadata.gz mongo-achievementchaser:/home/dump
docker cp games.bson.gz mongo-achievementchaser:/home/dump
docker cp games.metadata.gz mongo-achievementchaser:/home/dump
```

* Restore databases to mongo (from _root_ home, might need to go up a few directories)

```
cd ~/
mongorestore dump/players.bson.gz --gzip --drop
mongorestore dump/games.bson.gz --gzip --drop
```

That will upload the data to a "dump" database, replacing what may have already existed.


## Trouble Shooting

> CommandError: You must set settings.ALLOWED_HOSTS if DEBUG is False.

Ensure MODE is set in the src/achievementchaser/.env
