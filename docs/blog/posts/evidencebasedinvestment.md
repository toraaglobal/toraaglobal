---
date: 2023-08-31
authors: [tabdulazeez]
description: >
    Evidence-Based Investment Using  Monte Carlo Simulations
categories:
  - Data Science
---

#  Evidence-Based Investment Using  Monte Carlo Simulations
In the dynamic world of finance, making informed investment decisions can be quite challenging. Fortunately, advancements in technology and mathematical modeling have given rise to powerful tools that enable investors to gain a deeper understanding of potential outcomes. One such tool is the Monte Carlo Simulation, a technique that harnesses the power of randomness to forecast various scenarios and make evidence-based investment choices. In this article, we'll delve into the realm of evidence-based investing using a Monte Carlo Simulation, building upon the insightful notebook developed by Matt Macarty.

<!-- more -->

## Installing the Essentials
Before we embark on our journey into the world of evidence-based investment, let's ensure we have all the necessary tools at our disposal. We'll be using Python with popular libraries like NumPy, Pandas, and Matplotlib for data manipulation, analysis, and visualization. To begin, make sure you have these libraries installed in your Python environment.

```py
import numpy as np
from pandas import Series, DataFrame
import matplotlib.pyplot as plt
from babel.numbers import format_currency

plt.style.use('fivethirtyeight')

```

## Calculating Growth: A Solid Foundation
At the heart of every investment is the growth of capital over time. Let's start by building a base investment and calculating its growth. We'll consider an initial principal value (PV) of $10,000, an annual interest rate (i) of 7%, and annual additions of $10,000. With these parameters in place, we can compute the investment's value over a 30-year time horizon.

```py
pv = 10000
time_horizon = 30
i = 0.07
additions = 10000

for year in range(time_horizon):
    ending = pv * (1 + i) + additions
    print(format_currency(ending, 'USD'))
    pv = ending

```


## Incorporating Market Variation
In reality, investment returns are subject to market fluctuations. Let's introduce random variation based on market history to simulate the uncertainty investors face. Assuming an expected annual return of 7.1% and a volatility of 10% (typical of the S&P 500), we can explore how an investment of $10,000 would fare over a 30-year period.

```py
pv = 10000
expected_return = 0.071
volatility = 0.10
time_horizon = 30
annual_addition = 10000

print("\tReturn", "\t\tEnding Value".rjust(18))
for year in range(time_horizon):
    market_return = np.random.normal(expected_return, volatility)
    fv = pv * (1 + market_return) + annual_addition
    print("\t{}".ljust(10).format(round(market_return, 4)), "\t{}".rjust(10).format(format_currency(fv, 'USD')))
    pv = fv

```

## Simulating Multiple Outcomes
Now, let's take a step further and simulate multiple investment outcomes using the Monte Carlo Simulation technique. By running the simulation multiple times, each with slight variations in market returns, we can gain insights into the range of potential investment scenarios.

```py
sim = DataFrame()
iterations = 5000

for x in range(iterations):
    expected_return = 0.071
    volatility = 0.15
    time_horizon = 30
    pv = 10000
    annual_investment = 10000
    stream = []
    for i in range(time_horizon):
        end = round(pv * (1 + np.random.normal(expected_return, volatility)) + annual_investment, 2)
        stream.append(end)
        pv = end

    sim[x] = stream

```

## Exploring Simulated Portfolios
Visualizing data is essential for understanding trends and patterns. Let's explore a sample of annual ending values from our simulated portfolios and visualize them using line plots.

```py 
first_five = list(range(5))
sim[first_five]

plt.plot(sim[first_five])
plt.show()

```


## Analyzing and Interpreting Results
With our simulations in place, it's time to dive into data analysis and interpretation. We'll calculate summary statistics to provide a comprehensive overview of the simulated investment outcomes.

```py
ending_values = sim.loc[29]

print("Count:", len(ending_values))
print("Mean: ", format_currency(np.mean(ending_values), 'USD'))
print("SD: ", format_currency(np.std(ending_values), 'USD'))
print("Max: ", format_currency(np.max(ending_values), 'USD'))
print("Min: ", format_currency(np.min(ending_values), 'USD'))

```


## Probability and Percentiles
We can also explore the likelihood of achieving specific investment outcomes. For instance, what's the probability of ending with more than $1,000,000?

```py
probability = len(ending_values[ending_values > 1000000]) / len(ending_values)
print("Probability of ending with more than $1,000,000:", round(probability, 4))

```

Additionally, calculating percentiles provides a clearer picture of the potential range of outcomes.

```py
p_tiles = np.percentile(ending_values, [5, 10, 15, 25, 75, 85, 90, 95])
for p in range(len(p_tiles)):
    l = [5, 10, 15, 25, 75, 85, 90, 95]
    print("{}%-ile: ".format(l[p]).rjust(15), "{}".format(format_currency(p_tiles[p], 'USD')))

```

## Empowering Investment Decisions
Monte Carlo Simulations are a valuable tool for evidence-based investment decision-making. By simulating a wide range of scenarios and analyzing potential outcomes, investors can gain a better understanding of the risks and rewards associated with different investment strategies. Remember that the key to successful investing lies in staying informed, being adaptable, and leveraging data-driven insights to make the best decisions for your financial future.


## Colab

<a href="https://colab.research.google.com/github/toraaglobal/Case_Studies/blob/master/EvidenceBasedInvesting.ipynb" target="_blank">Open Source Code In Colab </a>







