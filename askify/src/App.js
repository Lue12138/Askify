import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    try {
      const response = await axios.post("http://localhost:8000/classify", {
        url: url, // Send the URL as JSON
      });

      console.log("Response from backend:", response.data);
      // You can also set the response data to state and display it in the UI
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
    </div>
  );
}

export default App;
