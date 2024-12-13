import React from "react";
import "./App.css";

interface GridProps {
  guesses: { word: string; classes: string[] }[]; // Change this to handle both word and classes
  currentGuess: string;
}

const Row: React.FC<{
  guess: string;
  classes: string[];
  isCurrentGuess: boolean;
}> = ({ guess, classes, isCurrentGuess }) => {
  const renderLetter = (letter: string, index: number, letterClass: string) => (
    <div className={`letter ${letterClass}`} key={index}>
      {letter || (isCurrentGuess ? "" : "")}
    </div>
  );

  return (
    <div className="row">
      {Array.from({ length: 5 }).map((_, index) =>
        renderLetter(guess[index], index, classes[index] || "")
      )}
    </div>
  );
};

const Grid: React.FC<GridProps> = ({ guesses, currentGuess }) => {
  // Ensure there are exactly 6 rows
  const totalRows = 6;
  const rows = [
    ...guesses,
    { word: currentGuess, classes: Array(5).fill("") },
  ].slice(0, totalRows);

  while (rows.length < totalRows) {
    rows.push({ word: "", classes: Array(5).fill("") });
  }

  return (
    <div className="grid">
      {rows.map((guess, index) => (
        <Row
          key={index}
          guess={guess.word}
          classes={guess.classes}
          isCurrentGuess={index === rows.length - 1}
        />
      ))}
    </div>
  );
};

export default Grid;
