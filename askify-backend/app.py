from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import openai
import os
from openai import OpenAI
import json
import re

app = Flask(__name__)
CORS(app)

@app.route('/classify', methods=['POST', 'OPTIONS'])
def classify():
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
            scraped_content = soup.get_text()

            # Step 2: Save the scraped content to a file
            with open("scrape_result.txt", "w", encoding="utf-8") as file:
                file.write(scraped_content)

            # Step 3: generate question
            openai.api_key = os.getenv("OPENAI_API_KEY")
            client = OpenAI()
            m = [{"role": "system", "content": """
            Analyze the following content and generate a question with THREE multiple-choice 
            options based on key themes to help categorize users visiting the site.\n\n
            You should use the following format:\n
            Question: your question here\n
            Options: A. option1 B. option2 C. option3"""}]
            dic = {}
            dic["role"] = "user"
            dic["content"] = scraped_content
            m.append(dic)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=m
            )
            generated_text = response.choices[0].message.content.strip()

            # Step 4: Parse the response to separate question and options
            parts = generated_text.split("Options:", 1)
            question = parts[0].replace("Question:", "").strip()
            options_text = parts[1].strip() if len(parts) > 1 else ""

            # Extract options using regex to find each option pattern (e.g., "A. option1")
            options = {}
            matches = re.findall(r"([A-Z])\. (.*?)(?=[A-Z]\. |$)", options_text)
            for letter, option_text in matches:
                options[letter] = option_text.strip()

            # Create the structured JSON object
            parsed_data = {
                "question": question,
                "options": options
            }
            print(parsed_data)

            # Step 5: Return as structured JSON
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
        # Process the selected option as needed
        return jsonify({"status": "Option received"}), 200
    else:
        return jsonify({"error": "No option provided"}), 400


if __name__ == '__main__':
    app.run(debug=True)
