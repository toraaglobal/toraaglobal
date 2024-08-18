---
date: 2024-08-17
authors: [tabdulazeez]
description: >
    Deploying a Wine Prediction Model Using FastAPI on Railway
categories:
  - Machine Learning
  - Railway
  - FastAPI 
---

## Deploying a Wine Prediction Model Using FastAPI on Railway
In the world of data science, creating a machine learning model is only half the battle. The real challenge lies in deploying that model so it can be accessed and utilized by end users. In this blog post, I'll walk you through how to deploy a wine prediction model using FastAPI and Railway, an efficient and modern web framework for Python that allows you to easily build APIs. We'll also reference the GitHub repository where the code for this project is hosted: [Toraaglobal/deploy-model-using-fastapi.](https://github.com/toraaglobal/deploy-model-using-fastapi)

<!-- more -->

## Overview of the Wine Prediction Model
The wine prediction model is built using a classifier that predicts the class of a wine based on various chemical properties. The model is saved as a pickle file and loaded into a FastAPI application to serve predictions via a RESTful API.


## Setting Up the FastAPI Application
First, let's dive into the code. Below is the FastAPI application that handles predictions:

```
import pickle
import numpy as np
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel, conlist

app = FastAPI(title="Predicting Wine Class")

# Represents a particular wine (or datapoint)
class Wine(BaseModel):
    alcohol: float
    malic_acid: float
    ash: float
    alcalinity_of_ash: float
    magnesium: float
    total_phenols: float
    flavanoids: float
    nonflavanoid_phenols: float
    proanthocyanins: float
    color_intensity: float
    hue: float
    od280_od315_of_diluted_wines: float
    proline: float

# Represents a batch of wines
class WineBatch(BaseModel):
    batches: List[conlist(item_type=float, min_length=13, max_length=13)]

@app.on_event("startup")
def load_clf():
    # Load classifier from pickle file
    with open("./models/wine.pkl", "rb") as file:
        global clf
        clf = pickle.load(file)

@app.get("/")
def home():
    return "Congratulations! Your API is working as expected. Now head over /docs for the API docs"

@app.post("/predict")
def predict(wine: Wine):
    data_point = np.array(
        [
            [
                wine.alcohol,
                wine.malic_acid,
                wine.ash,
                wine.alcalinity_of_ash,
                wine.magnesium,
                wine.total_phenols,
                wine.flavanoids,
                wine.nonflavanoid_phenols,
                wine.proanthocyanins,
                wine.color_intensity,
                wine.hue,
                wine.od280_od315_of_diluted_wines,
                wine.proline,
            ]
        ]
    )

    pred = clf.predict(data_point).tolist()
    pred = pred[0]
    print(pred)
    return {"Prediction": pred}

@app.post("/batch/predict")
def predict(wine: WineBatch):
    batches = wine.batches
    np_batches = np.array(batches)
    pred = clf.predict(np_batches).tolist()
    return {"Prediction": pred}


```

## Code Explanation

### Wine and WineBatch Classes:

- The Wine class represents a single wine instance with 13 attributes (e.g., alcohol, malic acid, etc.).
- The WineBatch class handles batches of wine instances. It ensures that each batch contains exactly 13 float values corresponding to the features.


### Model Loading:
- The load_clf function is triggered during the startup of the FastAPI application. It loads the pre-trained wine classification model from a pickle file, making it available globally within the app.

### Endpoints:
- Home (/): A simple GET endpoint to verify that the API is running.
- Predict (/predict): A POST endpoint that takes a single wine instance and returns the predicted class.
- Batch Predict (/batch/predict): A POST endpoint for predicting the classes of multiple wine instances in a single request.


## Deployment on Railway
Railway is a platform that allows you to deploy applications with ease. Follow these steps to deploy the Toraaglobal website on Railway:

- Sign Up/Log In to Railway: If you don't already have an account, sign up at Railway.

- Create a New Project:

    - After logging in, click on "New Project" from the dashboard.
    - Select "Deploy from GitHub repo" and connect your GitHub account if you haven't done so already.
    - Choose the Toraaglobal repository from your list of repositories.


- Configure Environment Variables:
    - Railway will automatically detect your requirements.txt and manage.py file.
    - Set up the following environment variables in the Railway dashboard:
        - DJANGO_SECRET_KEY: Your Django secret key.
        - DATABASE_URL: The URL of your PostgreSQL database.
        - DEBUG: Set to False for production.
    - You may also need to add any other environment variables your project depends on, such as ALLOWED_HOSTS, STATIC_URL, etc.

- Deployment Settings:
Railway will handle the deployment automatically. Ensure your Procfile is set up to run Django migrations and start the application:
```
release: python manage.py migrate
web: gunicorn main.wsgi
```

- Deploy the Project:
    - Once everything is configured, click "Deploy" to start the deployment process.
    - After deployment, you can access your site via the domain provided by Railway, or you can set up a custom domain (e.g., www.toraaglobal.com).

- Monitor and Manage:
Railway provides logs and metrics to help you monitor the performance of your site. Use these tools to ensure everything is running smoothly.

## Conclusion

By following this guide, you should now have a good understanding of how to deploy a machine learning model using FastAPI and Rail. This setup allows you to easily serve predictions through a RESTful API, making your model accessible to users or other systems. For the complete code and more details, visit the [GitHub repository.](https://github.com/toraaglobal/deploy-model-using-fastapi)

Happy coding!