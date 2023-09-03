:: docker-compose up
:: .\.venv\Scripts\activate.bat
cd src\
start python .\manage.py runserver
@REM start celery --app achievementchaser worker --loglevel INFO -P solo
@REM start celery --app achievementchaser beat
cd ..\ui\
start npm run dev
