---
date: 2024-11-24
authors: [tabdulazeez]
description: >
 Content Summarization with Generative AI: A Step-By-Step Guide to Building a Summarizer with Streamlit and LangChain
categories:
  - Generative AI
  - Data Science
---

# Content Summarization with Generative AI: A Step-By-Step Guide to Building a Summarizer with Streamlit and LangChain

Generative AI is transforming how we interact with content by automating complex tasks like summarizing videos and articles. Imagine distilling the key points of an hour-long YouTube lecture or a lengthy blog post into concise insights in seconds. This blog post walks you through the creation of a YouTube Video and Web Content Summarizer, leveraging tools like LangChain, Groq's Gemma-7b-It model, and Streamlit. Let's dive in!

<!-- more -->

## The Vision Behind the Summarizer

In today’s fast-paced world, spending hours sifting through video content or lengthy articles isn’t always practical. An AI-powered summarizer saves time by extracting key takeaways instantly, helping users stay informed and productive.

Our app achieves this by:

- Extracting key points from YouTube videos.
- Summarizing long-form articles and blog posts in seconds.
- Empowering professionals, students, and content enthusiasts with actionable insights.

## The Tech Stack
Here’s the arsenal of tools we’ll use:

- Streamlit: A powerful framework for building interactive web apps.
- LangChain: A framework for developing applications powered by language models.
- Groq's Gemma-7b-It Model: A high-performance LLM for natural language tasks.
- Custom Content Loaders: Tools for fetching and processing YouTube videos and website content.


## Building the App: Step-by-Step

### Setup and Configuration
Start by configuring the Streamlit app with a sleek UI and instructions for users.

```
import streamlit as st

st.set_page_config(page_title="YouTube Video and Web Content Summarizer", page_icon="🦜")
st.title("🦜YouTube Video and Web Content Summarizer")

st.sidebar.markdown("""
- Extract key takeaways from YouTube videos
- Summarize long-form articles and blog posts in seconds
- Save time and increase productivity with our fast and accurate summarization engine
""")

```

### User Inputs and API Key Integration
The app requires an API key for Groq's LLM and a URL input for content to summarize.

```
groq_api_key = st.sidebar.text_input("Groq API Key", value="", type="password")
generic_url = st.text_input("URL", label_visibility="collapsed")

```

### Content Loading and Validation
he app supports both YouTube video URLs and generic website URLs. Validation ensures users provide valid inputs.

```
import validators
from langchain_community.document_loaders import YoutubeLoader, UnstructuredURLLoader

if st.button("Summarize the Content from YT or Website"):
    if not groq_api_key.strip() or not generic_url.strip():
        st.error("Please provide the information to get started")
    elif not validators.url(generic_url):
        st.error("Please enter a valid URL.")
    else:
        try:
            with st.spinner("Waiting..."):
                if "youtube.com" in generic_url:
                    loader = YoutubeLoader.from_youtube_url(generic_url, add_video_info=True)
                else:
                    loader = UnstructuredURLLoader(urls=[generic_url], ssl_verify=False, headers={"User-Agent": "Mozilla/5.0"})
                docs = loader.load()

```

### Summarization Chain
The summarizer relies on LangChain's summarization chain to process content using a custom prompt.

```
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain_groq import ChatGroq

llm = ChatGroq(model="Gemma-7b-It", groq_api_key=groq_api_key)

prompt_template = """
Provide a detailed summary of the following content:
Content: {text}
"""
prompt = PromptTemplate(template=prompt_template, input_variables=["text"])
chain = load_summarize_chain(llm, chain_type="stuff", prompt=prompt)

output_summary = chain.run(docs)
st.success(output_summary)

```

### Exception Handling
Robust exception handling ensures that the app gracefully manages errors.

```
except Exception as e:
    st.exception(f"Exception: {e}")

```

## The Final Product
The app combines a clean, user-friendly interface with powerful backend processing to deliver fast, accurate summaries. It’s an excellent tool for:

- Researchers looking to scan large amounts of content quickly.
- Educators summarizing teaching materials.
- Professionals staying updated without reading full articles.


## Why Choose Generative AI for Summarization?
Generative AI models like Groq's Gemma-7b-It excel at understanding and condensing information. They produce summaries that are not only concise but also contextually rich, saving time without sacrificing quality.

## Bring Your AI Projects to Life
Interested in creating AI-powered applications tailored to your business needs? Contact [GenAIExpertise](https://genaiexpertise.com) and let’s build innovative solutions together.


