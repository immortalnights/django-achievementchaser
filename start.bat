:: docker-compose up
:: .\.venv\Scripts\activate.bat
cd src\
start python .\manage.py runserver
cd ..\ui\
start npm run dev
