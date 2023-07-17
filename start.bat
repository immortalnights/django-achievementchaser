:: docker-compose up
:: .\.venv\Scripts\activate.bat
cd src\
start python .\manage.py runserver
start celery --app achievementchaser worker --loglevel INFO -P solo
cd ..\ui\
start npm run dev
