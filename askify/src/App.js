import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/scrape", {
        url: url,
      });

      console.log("Response from backend:", response.data);
      setQuestionData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOptionClick = async (option) => {
    setSelectedOption(option);
    try {
      const response = await axios.post(
        "http://localhost:8000/optionSelected",
        {
          selectedOption: option,
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
    }
  };

  return (
    <div>
      <h1>Welcome to Askify! Enter the URL and click next to get started!</h1>
      {!questionData && !finalResult && (
        <form onSubmit={handleSubmit}>
          <input
            name="query"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
          />
          <button type="submit">Next</button>
        </form>
      )}

      {questionData && (
        <div>
          <h2>{questionData.question}</h2>
          <ul>
            {Object.entries(questionData.options).map(([key, option]) => (
              <li
                key={key}
                onClick={() => handleOptionClick(option)}
                style={{
                  cursor: "pointer",
                  color: selectedOption === option ? "blue" : "black",
                }}
              >
                {key}. {option}
              </li>
            ))}
          </ul>
        </div>
      )}

      {finalResult && (
        <div>
          <h2>Your Purpose:</h2>
          <p>{finalResult}</p>
          <button
            onClick={() => {
              setUrl("");
              setQuestionData(null);
              setSelectedOption(null);
              setFinalResult(null);
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
