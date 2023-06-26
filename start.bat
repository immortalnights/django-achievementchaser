docker-compose up
python .\manage.py runserver
celery --app achievementchaser worker --loglevel DEBUG -P solo