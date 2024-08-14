---
date: 2023-09-03
authors: [tabdulazeez]
description: >
    Analyzing Congressional Floor Debates with LDA Topic Modeling
categories:
  - Data Mining  
---

# Analyzing Congressional Floor Debates with LDA Topic Modeling

Topic modeling is a powerful technique in natural language processing (NLP) that helps us discover the underlying themes or topics within a collection of texts. In this blog post, we will explore the application of Latent Dirichlet Allocation (LDA) topic modeling to analyze the floor debates of the 110th Congress, focusing exclusively on the House of Representatives. The dataset is divided into subfolders, with "m" representing male speakers, "f" for female speakers, "d" for Democrats, and "r" for Republicans. Let's dive into the process of topic modeling and uncover the main themes of these congressional debates.

<!-- more -->

## The Tools and Libraries

Before we delve into the topic modeling process, let's understand the tools and libraries we'll be using:

- Python: We'll be using Python as our programming language for this analysis.
- Gensim: Gensim is a popular Python library for topic modeling and document similarity analysis. We will use it to build our LDA model.
- NLTK: NLTK (Natural Language Toolkit) is a comprehensive library for working with human language data. We'll use it for text preprocessing tasks.
- PyLDAvis: PyLDAvis is a Python library that helps visualize the topics extracted by an LDA model.
- Pandas: Pandas is a data manipulation library in Python that will assist us in managing our data.
- Matplotlib: We'll use Matplotlib for data visualization.


## Data Collection
The data for this analysis is organized in subfolders, each representing a different category (male, female, Democrat, Republican) of congressional speakers. We will read all the text files from these subfolders and store them in a dataframe for further analysis.

```py
# Folder directory
folder = "../../data/110"

# Read all the files in the folder and store them as a dataframe
alltext = []
for sub in os.listdir(folder):
    temp = folder + '/' + sub
    for file in os.listdir(temp):
        filedir = temp + '/' + file
        try:
            with open(filedir) as f:
                text = f.read()
                alltext.append(text)
        except Exception as e:
            print(str(e))
            print("Error reading : {}".format(filedir))

# Create a dataframe
doc = pd.DataFrame(alltext).reset_index()
documents = doc[[0]].values


```

## Data Preprocessing
Text data is usually messy and noisy, so we need to preprocess it before applying topic modeling techniques. Our preprocessing steps include:

- Tokenization: Splitting text into words or tokens.
- Removing Stopwords: Eliminating common words (e.g., "and," "the," "is") that don't provide much meaningful information.
- Lemmatization and Stemming: Reducing words to their base or root form to consolidate similar words.

```py
# Preprocessing functions
def lemmatize_stemming(text):
    return stemmer.stem(WordNetLemmatizer().lemmatize(text, pos='v'))

def preprocess(text):
    result = []
    for token in gensim.utils.simple_preprocess(text):
        if token not in gensim.parsing.preprocessing.STOPWORDS and len(token) > 3:
            result.append(lemmatize_stemming(token))
    return result

# Apply preprocessing to the documents
processed_docs = doc[0].map(preprocess)


```

## Building a Dictionary and Corpus
To perform LDA, we need to create a dictionary that maps words to unique IDs and a corpus that represents each document as a list of word frequency tuples.

```py
# Create a dictionary
dictionary = gensim.corpora.Dictionary(processed_docs)

# Create a Bag of Words (BoW) corpus
bow_corpus = [dictionary.doc2bow(doc) for doc in processed_docs]

```

## TF-IDF Transformation
We can further enhance our LDA model by applying TF-IDF (Term Frequency-Inverse Document Frequency) transformation to the BoW corpus. TF-IDF assigns weights to words based on their importance in individual documents and across the entire corpus.

```py
# Create a TF-IDF model
tfidf = models.TfidfModel(bow_corpus)
corpus_tfidf = tfidf[bow_corpus]

```


## Running LDA
Now that we have prepared our data, it's time to run the LDA model. LDA aims to identify topics in the text data and assign words to these topics. We specify the number of topics as a parameter.

```py
# Run LDA with the Bag of Words corpus
lda_model = gensim.models.LdaMulticore(bow_corpus, num_topics=10, id2word=dictionary, passes=10)
```

## Interpreting LDA Results
LDA provides us with a set of topics, each represented by a list of keywords. These keywords help us understand the main themes in the data. Additionally, we can calculate perplexity to evaluate how well our model fits the data.

```py
# Print the topics and their keywords
pprint(lda_model.print_topics())

# Compute Perplexity
perplexity = lda_model.log_perplexity(bow_corpus)
print('Perplexity:', perplexity)


```

## Visualizing LDA Topics
To gain a better understanding of the topics generated by LDA, we can use PyLDAvis to create an interactive visualization.

```py
# Visualize LDA topics
vis = pyLDAvis.gensim_models.prepare(lda_model, bow_corpus, dictionary)
pyLDAvis.save_html(vis, '../../data/10_gensim_110.html')


```



## Conclusion
In this blog post, we explored the use of LDA topic modeling to analyze the floor debates of the 110th Congress in the House of Representatives. By preprocessing the data, building a dictionary and corpus, and running LDA, we were able to identify and interpret topics within the congressional debates. This analysis provides valuable insights into the major themes discussed during this legislative session.

Topic modeling is a versatile technique that can be applied to various text datasets to uncover hidden patterns and extract meaningful information. Whether in politics, academia, or business, topic modeling can help researchers and analysts make sense of large volumes of text data and draw meaningful conclusions.


[Click here to Visualize the  LDA Topics](./10_gensim_110.html)


