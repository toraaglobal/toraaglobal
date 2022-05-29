***To run web locally***

clone the repo
```
git clone https://github.com/toraaglobal/toraaglobal
```

Navigate to the root folder and create a virtual environment

```
cd toraaglobal
virtualenv venv
```

Activate virtaul environment
```
source venv/bin/activate
```

Install requirements

```
pip install -r requirements.txt
```

Migrate database
```
python manage.py migrate
```

Run the app
```
python manage.py runserver
```
visit `http://127.0.0.1:8000/` on your browser




**Sync app without migration**
```
python manage.py migrate --run-syncdb 
```
