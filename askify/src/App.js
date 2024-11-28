import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [conversationId, setConversationId] = useState(null); // Store conversationId
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [rating, setRating] = useState(null); // User's rating
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); // Feedback submitted state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post("http://localhost:8000/scrape", {
        url: url,
      });

      console.log("Response from backend:", response.data);
      setQuestionData(response.data);
      setConversationId(response.data.conversationId); // Store conversationId from response
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleOptionClick = async (option) => {
    setSelectedOption(option);
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post(
        "http://localhost:8000/optionSelected",
        {
          selectedOption: option,
          conversationId: conversationId, // Include conversationId in request
        }
      );

      console.log("Option selection response:", response.data);

      if (response.data.finalResult) {
        // Final result received
        setFinalResult(response.data.finalResult);
        setQuestionData(null);
      } else if (response.data.question && response.data.options) {
        // Next question received
        setQuestionData(response.data);
        setSelectedOption(null);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleRatingSubmit = async (ratingValue) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/feedback",
        {
          rating: ratingValue,
          conversationId: conversationId, // Include conversationId in request
        }
      );

      console.log("Feedback response:", response.data);

      setRating(ratingValue);
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">
        Welcome to Askify! Enter the URL and click next to get started!
      </h1>

      {/* Display form only when not loading and no question or result is present */}
      {!questionData && !finalResult && !isLoading && !feedbackSubmitted && (
        <form className="url-form" onSubmit={handleSubmit}>
          <input
            className="url-input"
            name="query"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
          />
          <button className="next-button" type="submit">
            Next
          </button>
        </form>
      )}

      {/* Display loading animation when isLoading is true */}
      {isLoading && (
        <div className="loading-animation">
          <p>Askify is thinking...</p>
          <div className="spinner"></div>
        </div>
      )}

      {/* Display question and options when data is available and not loading */}
      {questionData && !isLoading && (
        <div className="question-container">
          <h2 className="question-title">{questionData.question}</h2>
          <ul className="options-list">
            {Object.entries(questionData.options).map(([key, option]) => (
              <li
                key={key}
                onClick={() => handleOptionClick(option)}
                className={`option-item ${
                  selectedOption === option ? "selected" : ""
                }`}
              >
                {key}. {option}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display final result when available and not loading */}
      {finalResult && !isLoading && !feedbackSubmitted && (
        <div className="result-container">
          <h2 className="result-title">Your Purpose:</h2>
          <p className="result-text">{finalResult}</p>
        </div>
      )}

      {/* Display rating input when final result is shown */}
      {finalResult && !isLoading && !feedbackSubmitted && (
        <div className="feedback-container">
          <h2 className="feedback-title">How accurate was the classification?</h2>
          <p>Please rate from 1 (totally incorrect) to 5 (perfectly correct):</p>
          <div className="rating-options">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleRatingSubmit(num)}
                className="rating-button"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display thank you message after feedback is submitted */}
      {feedbackSubmitted && !isLoading && (
        <div className="thank-you-container">
          <h2>Thank you for your feedback!</h2>
          <button
            className="restart-button"
            onClick={() => {
              setUrl("");
              setConversationId(null); // Reset conversationId
              setQuestionData(null);
              setSelectedOption(null);
              setFinalResult(null);
              setRating(null);
              setFeedbackSubmitted(false);
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
