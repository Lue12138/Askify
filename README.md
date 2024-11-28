
# Askify: Intelligent User Intent Classification

Askify is an interactive web application that helps categorize user intents when visiting a website. By entering a URL, Askify scrapes the content of the page, generates questions with multiple-choice options based on key themes, and classifies the user's purpose through iterative interactions. It leverages AI to make dynamic decisions, ensuring an engaging and accurate user experience.

## Features
- **Content Scraping**: Extract text content from any URL using BeautifulSoup.
- **Dynamic Question Generation**: Use OpenAI's GPT API to create contextually relevant questions.
- **User Intent Classification**: Analyze user responses to determine their purpose for visiting the website.
- **Feedback Mechanism**: Collect user ratings to improve the system's accuracy and performance.
- **Data Persistence**: Store conversations securely in AWS S3 for analysis and auditing.

## Tech Stack
### Backend
- **Flask**: Python framework for building APIs.
- **BeautifulSoup**: Web scraping tool for extracting content from websites.
- **OpenAI GPT-3.5 Turbo**: AI-powered natural language processing.
- **AWS S3**: Cloud storage for conversation logs.

### Frontend
- **React**: User interface framework.
- **Axios**: HTTP client for communicating with the backend.
- **CSS**: Styling for responsive and interactive design.

### Tools
- **Boto3**: AWS SDK for Python for S3 integration.
- **uuid**: Generate unique conversation IDs.
- **CORS**: Enable cross-origin requests.

## Getting Started

### Prerequisites
- Python 3.7+
- Node.js 16+
- AWS account with S3 bucket configured
- OpenAI API Key

### Installation

#### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/askify.git
   cd askify-backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows, use `env\Scripts\activate`
   ```
3. Configure environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key.
   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: Your AWS credentials.
   - `AWS_BUCKET_NAME`: Your S3 bucket name.

4. Run the backend server:
   ```bash
   flask run -p 8000
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd askify
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Enter a website URL and click **Next**.
3. Answer the AI-generated questions to classify your intent.
4. Rate the classification accuracy and restart as needed.

## Project Structure
```
askify/
│
├── backend/
│   ├── app.py                 # Flask application
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # React application
│   │   ├── App.css            # Application styles
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
│
└── README.md                  # Project documentation
```

## API Endpoints
### `/scrape`
- **Method**: POST
- **Request**: `{ "url": "https://example.com" }`
- **Response**:
  ```json
  {
    "question": "What are you looking for?",
    "options": { "A": "Option 1", "B": "Option 2", "C": "Option 3" },
    "conversationId": "unique-id"
  }
  ```

### `/optionSelected`
- **Method**: POST
- **Request**: `{ "selectedOption": "A", "conversationId": "unique-id" }`
- **Response**:
  ```json
  {
    "question": "Next question?",
    "options": { "A": "Option 1", "B": "Option 2", "C": "Option 3" },
    "conversationId": "unique-id"
  }
  ```

### `/feedback`
- **Method**: POST
- **Request**: `{ "rating": 5, "conversationId": "unique-id" }`
- **Response**:
  ```json
  { "message": "Feedback received and conversation saved." }
  ```

## Future Enhancements
- Integrate support for additional languages.
- Implement user authentication for personalized experiences.
- Enable advanced analytics for administrators.

## License
This project is licensed under the [MIT License](LICENSE).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any feature requests or bug fixes.
