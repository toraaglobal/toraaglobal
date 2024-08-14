---
date: 2024-07-21
authors: [tabdulazeez]
description: >
  Uncovering School Performance Patterns: A Comprehensive Data Analysis
categories:
  - R
  - Data Science
---

# Uncovering School Performance Patterns: A Comprehensive Data Analysis
Exploring educational data can provide deep insights into student performance and school effectiveness. In this blog post, I will guide you through a detailed analysis of a school dataset, explaining each step and the insights we gain from the data. This comprehensive analysis will help in understanding the distribution of student performance across different schools and identifying key areas for improvement.

<!-- more -->

## Reading and Exploring the Dataset
To begin, we read the dataset into a dataframe and examine the structure and initial rows:
```
Filename <- '../data/data-storyteller.csv'
school_df <- read.csv(Filename, na.strings = c(""))
head(school_df, n=7)
str(school_df)

```

The dataset contains columns with different data types, such as integers and factors. Notably, the Section column is an integer but should be converted to a categorical (ordered factor) type. The rest of the columns have the correct data types.

## Data Preparation
We start by converting the Section column to an ordered factor:

```
school_df$Section <- as.ordered(school_df$Section)
str(school_df$Section)

```

Next, we check for any missing values using a custom function:

```
checkMissingData <- function(TestData){
  for(colname in names(TestData)){
    cat("\n Looking at column...", colname, "\n")
    NAcount <- sum(is.na(TestData[colname]))
    cat("\nThe number of missing values in column ", colname, "is ", NAcount)
  }
}
checkMissingData(school_df)


```
We find that there are no missing values in the dataset.

## Summarizing the Data
We summarize the dataset to get an overview of its structure:
```
summary(school_df)

```
The summary reveals that schools D and E have only one record each, while school C has three, school B has twelve, and school A has thirteen. There are no students who are very ahead in any school.

## Renaming Columns
For better readability, we rename the columns:

```
new_col_name <- c('School', 'Section', 'Very_Ahead', 'Middling', 'Behind', 'More_Behind', 'Very_Behind', 'Completed')
colnames(school_df) <- new_col_name
head(school_df, n=5)

```

## Checking for Duplicates
We check for duplicate records in the dataset:

```
nrow(school_df) # total number of rows
nrow(school_df[duplicated(school_df),]) # duplicate check

```
There are no duplicate records in the dataset.

## Analyzing Outliers
We use boxplots to check for any incorrect records or outliers:

```
boxplot(school_df[,-c(1,2)])

```
We find that the Completed and More_Behind columns have outliers. A deeper dive into the Completed column shows an unusual record with 27 completions, which stands out compared to other schools. Similarly, school A has an abnormally high number of students who are more behind compared to other schools.


## Data Distribution
We visualize the data distribution for each numeric column using various plots. For instance, the distribution of sessions is shown below:

```
d <- ggplot(school_df, aes(Section)) + geom_bar(color='green', fill='blue') + theme_classic() + ggtitle('Frequency Distribution of Sessions')
d

```
We create similar plots for Middling, Behind, More_Behind, Very_Behind, and Completed using ggplot2.

### School and Section Analysis
We analyze the relationship between schools and sections using count plots:

```
p <- ggplot(school_df, aes(School, Section)) + geom_count(color='red', fill='blue', size=7) + theme_classic()
p

```

## Detailed Analysis by School
We create various plots to analyze each school’s performance in different categories such as Middling, Behind, More_Behind, Very_Behind, and Completed.

```
plot_grid(m, n, o, p, nrow = 2, ncol = 2, labels = 'AUTO')

```

## Correlation Analysis
We perform correlation tests between different variables to understand their relationships:

```
cor.test(school_df$Middling, school_df$Completed)
cor.test(school_df$Behind, school_df$Very_Behind)

```

## Aggregation and Summary
We aggregate the data by school to get a summary of total students and the percentage of students who have completed their studies:

```
df_agg <- aggregate(df_new[,-c(1,2)], by = list(df_new[,1]), FUN = sum)
per_completed <- (df_agg[,7]/df_agg[,8]) * 100
df_new <- data.frame(df_agg, per_completed)
df_new

```

## Conclusion
Through this detailed analysis, we have uncovered various insights into the school dataset. From identifying outliers to understanding the distribution and correlations within the data, we have highlighted key areas that could help improve educational strategies and student performance tracking.

Stay tuned for more data-driven stories and insights!
















