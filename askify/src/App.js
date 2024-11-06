import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [questionData, setQuestionData] = useState(null); // State to store question and options
  const [selectedOption, setSelectedOption] = useState(null); // State to store the selected option

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    try {
      const response = await axios.post("http://localhost:8000/classify", {
        url: url, // Send the URL as JSON
      });

      console.log("Response from backend:", response.data);
      setQuestionData(response.data); // Set the response data to state for display
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOptionClick = async (option) => {
    setSelectedOption(option); // Update selected option in state
    try {
      // Send the selected option to the backend
      const response = await axios.post("http://localhost:8000/optionSelected", {
        selectedOption: option,
      });

      console.log("Option selection response:", response.data);
      // Optionally, handle the response (e.g., show a confirmation message or further actions)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to Askify! Enter the URL and click next to get started!</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="query"
          value={url}
          onChange={(e) => setUrl(e.target.value)} // Update state on input change
          placeholder="Enter website URL"
        />
        <button type="submit">Next</button>
      </form>

      {/* Conditionally render question and options if available */}
      {questionData && (
        <div>
          <h2>{questionData.question}</h2>
          <ul>
            {Object.entries(questionData.options).map(([key, option]) => (
              <li key={key} onClick={() => handleOptionClick(option)} style={{ cursor: "pointer", color: selectedOption === option ? "blue" : "black" }}>
                {key}. {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
