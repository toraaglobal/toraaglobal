---
date: 2023-09-10
authors: [tabdulazeez]
description: >
    Building Scalable Time Series Models with Facebook Prophet
categories:
  - Data Science
  - Time Series
---

# Building Scalable Time Series Models with Facebook Prophet
In the ever-evolving world of data science and forecasting, having a reliable tool that can quickly generate high-quality forecasts at scale is crucial. One such tool that has gained popularity in recent years is Facebook Prophet. In this blog post, we'll explore how Prophet can be used to build time series models for forecasting and dive into the process of preparing and analyzing time series data. We'll also provide a link to a Colab notebook for hands-on experience.

<!-- more -->

**Installing Prophet**

Before we dive into the details, make sure you have Prophet installed. You can install it using pip:

```sh
pip install fbprophet
```

Once you have Prophet installed, you're ready to get started.

## Getting the Data
To demonstrate the capabilities of Prophet, we'll use a sample time series dataset that represents weekly sales of beverages. You can obtain the dataset from the following URL:

[Dataset Link](https://raw.githubusercontent.com/2SUBDA/On-Campus/master/Dept1.csv)

We'll use Pandas to load the data into a DataFrame and take a look at the first few rows:

```py
import pandas as pd

# Load the data
df = pd.read_csv('https://raw.githubusercontent.com/2SUBDA/On-Campus/master/Dept1.csv', sep=',', error_bad_lines=False, encoding="ISO-8859-1")

# Rename the 'Sales' column to 'BevSales' for clarity
df = df.rename(index=str, columns={"Sales": "BevSales"})

# Rename columns for Prophet
df = df.rename(index=str, columns={"BevSales": "y", "Date": "ds"})

# Display the first few rows
df.head()

```

## Data Preparation
Prophet requires a specific naming convention for input columns, where the date column should be named 'ds,' and the value column should be named 'y.' As you can see from the code above, we've prepared our data accordingly.


## Visualizing the Data
Before building our model, let's visualize the time series data to get a better understanding of its patterns. We'll use Matplotlib for this purpose:

```py
import matplotlib.pyplot as plt

# Set the date column as the index
ax = df.set_index('ds').plot(figsize=(12, 8))
ax.set_ylabel('Weekly Sales of Beverages')
ax.set_xlabel('Date')

plt.show()

```

## Building the Model
Now that we have our data ready, we can proceed with building the Prophet model. We'll set the uncertainty interval to 95% to create a more robust forecast:

```py
from fbprophet import Prophet

# Create the Prophet model
bev_model = Prophet(interval_width=0.95)

# Fit the model to the data
bev_model.fit(df)

```

## Generating Forecasts
To generate forecasts, we need to create a dataframe containing future dates. We'll use the make_future_dataframe function for this:

```py
# Create a dataframe with future dates
future_dates = bev_model.make_future_dataframe(periods=13, freq='W')

# Display the last few rows of the future dates dataframe
future_dates.tail()

```

Now, let's use our trained model to make forecasts:

```py
# Generate forecasts
forecast = bev_model.predict(future_dates)

# Display the last few rows of the forecast data
forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

```

## Visualizing the Forecast
We can visualize the forecasted values along with uncertainty intervals using the following code:

```py
# Visualize the forecast
bev_model.plot(forecast, uncertainty=True)

```

## Interpreting the Results
Prophet also provides valuable insights into the components of the time series. You can visualize trends, seasonality, and holidays using the following code:

```py
# Visualize components of the forecast
bev_model.plot_components(forecast)

```

## Conclusion
Facebook Prophet is a powerful tool for building time series models at scale. In this blog post, we've covered the basic steps of using Prophet to prepare and analyze time series data, build forecasts, and visualize the results. If you're interested in trying it out yourself, you can access the Colab notebook with the complete code and examples here:

[Colab Notebook Link](https://colab.research.google.com/github/toraaglobal/CaseStudies/blob/master/Time_Series_BeverageTimeForProphet.ipynb)

With Prophet, you can efficiently tackle time series forecasting tasks and gain valuable insights from your data. Give it a try and see how it can enhance your forecasting capabilities. Happy forecasting!



