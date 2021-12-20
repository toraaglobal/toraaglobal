***Run web locally***

clone the repo
```
git clone https://github.com/toraaglobal/toraaglobal
```
Navigate to the web directory
```
cd web
```
create virtual environment 
```
virtualenv venv
```
activate virtaul environment
```
source venv/bin/activate
```

install requirements

```
pip install -r requirements.txt
```

migrate database
```
python manage.py migrate
```

run the app
```
python manage.py runserver
```
visit `http://127.0.0.1:8000/` on your browser