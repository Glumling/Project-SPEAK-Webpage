import React, { useState } from "react";
import "./App.css";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
} from "@nextui-org/react";
import 'pattern.css';

function App() {
  const [mode, setMode] = useState("talking_to_someone");
  const [keyword, setKeyword] = useState("");
  const [phrases, setPhrases] = useState([]);

  // Handle mode change
  const handleModeChange = (key) => {
    setMode(key);
    console.log("Selected Mode:", key);
  };

  // Handle keyword input change
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  // Call Flask API to generate phrases
  const generatePhrases = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate-phrases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword, mode }),
      });
      const data = await response.json();
      setPhrases(data);
    } catch (error) {
      console.error("Error generating phrases:", error);
    }
  };

  // Call Flask API to generate and play speech
  let currentAudio = null; // Global variable to track current audio instance

  const playSpeech = async (phrase) => {
    try {
      // Check if an audio is already playing
      if (currentAudio && !currentAudio.paused) {
        console.log("Audio is already playing. Please wait until it finishes.");
        return;
      }
  
      const response = await fetch("http://localhost:5000/generate-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phrase }),
      });
  
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
  
        // Create a new audio instance and set it as the current one
        currentAudio = new Audio(audioUrl);
  
        // Clear currentAudio when playback ends
        currentAudio.onended = () => {
          currentAudio = null;
          console.log("Audio playback finished.");
        };
  
        currentAudio.play();
      } else {
        console.error("Failed to generate speech");
      }
    } catch (error) {
      console.error("Error playing speech:", error);
    }
  };
  

  return (
    <div className="App min-h-screen flex flex-col items-center justify-center pattern-vertical-lines-md p-4"
    style={{
      color: '#1a73e8', // Change the pattern color using text color (currentColor)
      backgroundColor: '#e0e0e0' // Change the background color
    }}>
      
      <h1 className="text-4xl text-accent font-bold mb-6">Phrase Generator</h1>

      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md neumorphism-container">
        <div className="mb-4">
          <label className="block text-accent text-lg font-medium">Select Mode:</label>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                color="default"
                css={{
                  w: "100%",
                  justifyContent: "space-between",
                }}
              >
                {mode.replace(/_/g, " ").toUpperCase()}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Mode"
              onAction={handleModeChange}
              css={{
                backgroundColor: "#333", // Dark background
                opacity: 0.9, // Semi-transparent dark background
              }}
            >
              <DropdownItem key="talking_to_someone" textValue="talking_to_someone">
                Talking to Someone
              </DropdownItem>
              <DropdownItem key="explaining" textValue="explaining">
                Explaining
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex w-full flex-wrap md">
          <Input
            label="Enter Keyword"
            type="text"
            value={keyword}
            onChange={handleKeywordChange}
            fullWidth
            variant="bordered"
          />
        </div>

        <div className="mt-4">
          <Button
            onClick={generatePhrases}
            color="default"
            variant="ghost" // Set button style to "ghost"
            fullWidth
          >
            Generate Phrases
          </Button>
        </div>

        <div className="mt-6">
          {phrases.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-accent mb-4">Generated Phrases:</h3>
              <ul className="space-y-2">
                {phrases.map((phrase, index) => (
                  <li
                    key={index}
                    className="Generated_Phrases cursor-pointer text-accent rounded-lg hover:bg-secondary"
                    onClick={() => playSpeech(phrase)} // Play speech on click
                  >
                    {phrase}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
