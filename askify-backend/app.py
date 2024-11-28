from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import openai
from openai import OpenAI
import os
import json
import re

app = Flask(__name__)
CORS(app)

# Ensure your OpenAI API key is set in your environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()

def generate_question(conversation_content):
    messages = [
        {
            "role": "system",
            "content": """
            Based on the following content, generate a question with THREE multiple-choice 
            options based on key themes to help categorize users visiting the site.\n\n
            You should use the following format:\n
            Question: your question here\n
            Options: A. option1 B. option2 C. option3
            """,
        },
        {"role": "user", "content": conversation_content},
    ]
    response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
    )

    generated_text = response.choices[0].message.content.strip()

    # Parse the response to separate question and options
    parts = generated_text.split("Options:", 1)
    question = parts[0].replace("Question:", "").strip()
    options_text = parts[1].strip() if len(parts) > 1 else ""

    # Extract options using regex
    options = {}
    matches = re.findall(r"([A-Z])\. (.*?)(?=[A-Z]\. |$)", options_text)
    for letter, option_text in matches:
        options[letter] = option_text.strip()

    return question, options

def generate_user_purpose(conversation_content):
    messages = [
        {
            "role": "system",
            "content": """
            Based on the following conversation, analyze the user's responses and determine the user's purpose for visiting the website. Provide a concise summary of the user's intent.
            """,
        },
        {"role": "user", "content": conversation_content},
    ]

    response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
    )

    generated_text = response.choices[0].message.content.strip()
    return generated_text

@app.route('/scrape', methods=['POST', 'OPTIONS'])
def scrape():
    if request.method == "OPTIONS":
        return jsonify({"status": "Preflight request successful"}), 200

    data = request.get_json()
    url = data.get('url')

    if url:
        try:
            # Step 1: Fetch and scrape the URL content
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            scraped_content = soup.get_text(separator=' ')

            # Step 2: Save the scraped content to a file
            with open("conversation.txt", "w", encoding="utf-8") as file:
                file.write(scraped_content)

            # Step 3: Generate question and append to conversation.txt
            question, options = generate_question(scraped_content)

            with open("conversation.txt", "a", encoding="utf-8") as file:
                file.write("\nQuestion: " + question + "\n")
                for key, option in options.items():
                    file.write(f"{key}. {option}\n")

            # Prepare the response data
            parsed_data = {
                "question": question,
                "options": options
            }

            return jsonify(parsed_data), 200

        except requests.exceptions.RequestException as e:
            return jsonify({"error":
                            f"Failed to retrieve content from URL: {e}"}), 500
        except Exception as e:
            return jsonify({"error": f"Failed to generate question: {e}"}), 501
    else:
        return jsonify({"error": "No URL provided"}), 400

@app.route('/optionSelected', methods=['POST'])
def option_selected():
    data = request.get_json()
    selected_option = data.get('selectedOption')

    if selected_option:
        print(f"User selected: {selected_option}")

        # Append selected option to conversation.txt
        with open("conversation.txt", "a", encoding="utf-8") as file:
            file.write("Selected Option: " + selected_option + "\n")

        # Check the number of questions asked so far
        with open("conversation.txt", "r", encoding="utf-8") as file:
            content = file.read()
            num_questions = content.count("Question:")

        if num_questions < 3:
            # Generate another question
            question, options = generate_question(content)

            with open("conversation.txt", "a", encoding="utf-8") as file:
                file.write("\nQuestion: " + question + "\n")
                for key, option in options.items():
                    file.write(f"{key}. {option}\n")

            # Prepare the response data
            parsed_data = {
                "question": question,
                "options": options
            }

            return jsonify(parsed_data), 200

        else:
            # Generate user's purpose based on conversation.txt
            user_purpose = generate_user_purpose(content)

            return jsonify({"finalResult": user_purpose}), 200

    else:
        return jsonify({"error": "No option provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
