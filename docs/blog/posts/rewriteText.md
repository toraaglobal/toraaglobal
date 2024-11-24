---
date: 2024-11-24
authors: [tabdulazeez]
description: >
 Crafting Expert-Level Text Redaction with Generative AI: A Step-by-Step Guide
categories:
  - Generative AI
  - Data Science
---

# Crafting Expert-Level Text Redaction with Generative AI: A Step-by-Step Guide
Generative AI continues to redefine how we handle text processing, making it possible to transform raw, unstructured drafts into polished, tone-appropriate, and dialect-specific outputs. Whether you need a formal British redaction for a professional email or an informal American rewrite for a casual blog post, AI-powered tools streamline this process with remarkable efficiency.

In this blog post, we’ll explore how to build a Text Redaction and Conversion Application using Streamlit, LangChain, and OpenAI. Let’s dive into the nitty-gritty!

<!-- more -->

## The Vision Behind the Application
Imagine being able to input a rough draft and, with a few clicks, receive a perfectly rewritten text tailored to your preferred tone and dialect. This application is ideal for:

- Content creators refining their drafts.
- Business professionals preparing communication for international audiences.
- Writers and bloggers adapting their style for different audiences.

Our app simplifies this task by:

- Redacting poorly worded drafts.
- Customizing the text’s tone (formal or informal).
- Adapting the text to American or British English.

## The Tech Stack
To achieve this functionality, we’ll use:

- Streamlit: A simple and intuitive framework for building web apps.
- LangChain: A framework to handle AI prompts and chain logic.
- OpenAI API: The engine powering the language model for text rewriting.

## Building the Application

### Setting Up Streamlit
Streamlit is the foundation of our app, offering an interactive interface for user input and output.

```
import streamlit as st

st.set_page_config(
    page_title="Re-write Text",
    page_icon="🧊",
    layout="centered",
    initial_sidebar_state="expanded",
    menu_items={
        "Get Help": "https://genaiexpertise.com/contact/",
        "Report a bug": "https://github.com/genaiexpertise/RAGApps/issues",
        "About": "https://genaiexpertise.com",
    },
)

st.header("Redact and Convert Text to a Specified Tone and Dialect")

```

###  Creating the Prompt Template
A prompt template defines how the text redaction process operates. It includes instructions for redacting, selecting tones, and adapting dialects.

```
from langchain import PromptTemplate

template = """
    Below is a draft text that may be poorly worded.
    Your goal is to:
    - Properly redact the draft text
    - Convert the draft text to a specified tone
    - Convert the draft text to a specified dialect

    Here are some examples:

    Tones:
    - Formal: Greetings! OpenAI has announced Sam Altman is rejoining the company.
    - Informal: Hey everyone, Sam Altman is back at OpenAI! 

    Dialects:
    - American: apartment, garbage, cookie
    - British: flat, rubbish, biscuit

    Draft: {draft}
    TONE: {tone}
    DIALECT: {dialect}

    YOUR {dialect} RESPONSE:
"""
prompt = PromptTemplate(
    input_variables=["tone", "dialect", "draft"],
    template=template,
)


```

### Integrating OpenAI for Text Redaction
To process user inputs, we integrate OpenAI’s API with a function that loads the LLM.

```
from langchain_openai import OpenAI

def load_LLM(openai_api_key):
    llm = OpenAI(temperature=0.7, openai_api_key=openai_api_key)
    return llm

```


### User Inputs for Tone and Dialect
The app collects the draft, tone, and dialect preferences using Streamlit widgets.

```
# Draft text input
draft_input = st.text_area(label="Enter your draft text", placeholder="Your Text...", key="draft_input")

# Tone and dialect selection
col1, col2 = st.columns(2)
with col1:
    option_tone = st.selectbox('Select Tone', ['Formal', 'Informal'])
with col2:
    option_dialect = st.selectbox('Select Dialect', ['American', 'British'])

```

### Generating Rewritten Text
When the user clicks the "Re-write" button, the app processes the input using the prompt and displays the output.

```
if st.button("Re-write"):
    if draft_input:
        openai_api_key = st.sidebar.text_input("Enter OpenAI API Key", type="password")
        if not openai_api_key:
            st.warning("Please provide your OpenAI API Key.")
            st.stop()

        llm = load_LLM(openai_api_key=openai_api_key)
        prompt_with_draft = prompt.format(
            tone=option_tone,
            dialect=option_dialect,
            draft=draft_input
        )
        improved_redaction = llm(prompt_with_draft)
        st.markdown("### Your Re-written Text:")
        st.write(improved_redaction)

```

## Features of the Application
1. Real-Time Interaction
The app processes drafts instantly, providing real-time feedback and allowing users to iterate on their text quickly.

2. Customization Options
Users can choose between formal and informal tones and adapt the text for American or British audiences.

3. Accessibility
The user-friendly interface makes it simple for non-technical users to leverage advanced AI capabilities.

## Why This Matters

Generative AI is a game-changer for text editing and adaptation. Whether you're a professional writer or a casual user, this tool saves time and ensures your text is tailored to your audience’s preferences.

## Build Your Own Generative AI Solutions
Ready to integrate generative AI into your projects? [GenAIExpertise](https://genaiexpertise.com) specializes in crafting bespoke AI solutions tailored to your needs. Let’s bring your ideas to life!

