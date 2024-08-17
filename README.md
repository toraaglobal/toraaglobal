***
## Toraaglobal
***
***

Welcome to the Toraaglobal repository! This project is built using Django and serves as the official portfolio website for [Tajudeen Abdulazeez](https://www.linkedin.com/in/tajudeenolarewajuabdulazeez/). The website showcases a comprehensive portfolio of personal projects, professional achievements, and other relevant content to present the expertise and capabilities of Tajudeen Abdulazeez.


### Overview
***
The website is designed to provide a professional and accessible platform for potential clients, collaborators, and employers to explore the work done by Tajudeen Abdulazeez. It includes detailed sections for various projects, a blog, and other relevant information about his professional skills and expertise.


### Features
***

**Home Page**: A welcoming page with an introduction to Tajudeen Abdulazeez.

**Portfolio**: A section dedicated to showcasing various personal and professional projects, with detailed 
descriptions and links to relevant resources.

**Blog**: Regular updates, articles, and insights related to data engineering, data science, and other topics of interest.

**About**: Information about Tajudeen Abdulazeez, its mission, vision, and his professional background.

**Contact**: A contact form and details for reaching out to Tajudeen Abdulazeez for inquiries or collaboration.


### Technologies Used
***
**Django**: A high-level Python web framework that encourages rapid development and clean, pragmatic design.

**HTML/CSS/JavaScript**: For the front-end development and ensuring a responsive and user-friendly interface.

**PostgreSQL**: The database used for storing project details, blog posts, and other dynamic content.

**Bootstrap**: For styling and responsive design to ensure the website looks great on all devices.

**mkdocs**: MkDocs is a fast, simple and downright gorgeous static site generator that's geared towards building project documentation.





### Installation
***
#### To set up the project locally, follow these steps:
- Clone the repository:
```
git clone https://github.com/your-username/toraaglobal.git
cd toraaglobal
```

- Create a virtual environment:
```
python3 -m venv env
source env/bin/activate
```

- Install dependencies:
```
pip install -r requirements.txt
```

- Apply migrations:
```
python manage.py migrate
```

- Run the development server:
```
python manage.py runserver
```

The website should now be accessible at http://127.0.0.1:8000/.


### Deployment on Namecheap Shared Hosting
Deploying a Django project on Namecheap shared hosting requires some additional steps due to the limitations of shared hosting environments. Here’s how to do it:

####  Set Up Python on Namecheap
- Log In to cPanel: Access your Namecheap account and log in to your cPanel.
- Select Setup Python App: In the Software section, select Setup Python App.
- Create a New Application:
    - Choose your Python version (e.g., Python 3.x).
    - Set the application root directory (e.g., /home/username/toraaglobal).
    - Set the application URL (e.g., www.toraaglobal.com).
    - Set the application startup file (usually passenger_wsgi.py).

#### Prepare Your Django Project
- Create passenger_wsgi.py:
In the root directory of your Django project, create a passenger_wsgi.py file with the following content:
```
import sys
import os

# Add your project directory to the sys.path
sys.path.insert(0, '/home/username/toraaglobal')

# Set the settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'toraaglobal.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

- Install Dependencies:

 - In cPanel’s Python App settings, navigate to your app and open the terminal.

 - Install your dependencies using pip:
    ```
    pip install -r /home/username/toraaglobal/requirements.txt

    ```

- Configure Database:
    - Namecheap shared hosting typically uses MySQL, so update your DATABASES setting in settings.py to use MySQL:
    ```
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'database_name',
            'USER': 'database_user',
            'PASSWORD': 'database_password',
            'HOST': 'localhost',
            'PORT': '3306',
        }
    }
    ```

- Migrate the Database:
Run the migrations to set up the database:

```
python manage.py migrate

```

- Configure Static Files
    - Collect Static Files:Run the command to collect static files:
        ```
        python manage.py collectstatic

        ```
    - Serve Static Files: You may need to configure your .htaccess file to serve static files correctly. Add the following in your .htaccess file located in the public_html directory:
        ```
        Alias /static/ /home/username/toraaglobal/static/

        <Directory /home/username/toraaglobal/static>
            Require all granted
        </Directory>
        ```

-  Final Steps
    - Update ALLOWED_HOSTS: In your settings.py, ensure that ALLOWED_HOSTS includes your domain name:
        ```
        ALLOWED_HOSTS = ['www.toraaglobal.com']

        ```
    - Restart Your Application:
    In cPanel, go to the Python App settings and restart your application to apply all changes.
Once completed, your Django project should be live and running on Namecheap shared hosting.



### License
***
This project is licensed under the MIT License. See the LICENSE file for more details.

### Contact
***
For any inquiries or further information, please visit [my website](https://toraaglobal.com/)  or reach out via the contact form on the website.

