from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import openai
import os
from openai import OpenAI

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

            # step3: generate question
            openai.api_key = os.getenv("OPENAI_API_KEY")
            client = OpenAI()
            m = [{"role": "system", "content": "Analyze the following content and generate a question with multiple-choice options based on key themes:\n\n"}]
            dic = {}
            dic["role"] = "user"
            dic["content"] = scraped_content
            m.append(dic)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=m
            )
            print(response.choices[0].message.content.strip())
            generated_text = response.choices[0].message.content.strip()
            return jsonify({"question_and_choices": generated_text,
                            "received_url": url}), 200

        except requests.exceptions.RequestException as e:
            return jsonify({"error":
                            f"Failed to retrieve content from URL: {e}"}), 500
        except Exception as e:
            return jsonify({"error": f"Failed to generate question: {e}"}), 501
    else:
        return jsonify({"error": "No URL provided"}), 400


if __name__ == '__main__':
    app.run(debug=True)
