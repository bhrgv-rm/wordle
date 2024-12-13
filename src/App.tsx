import { useEffect, useState } from "react";
import "./App.css";
import { TiBackspace } from "react-icons/ti";
import { HiArrowTurnDownLeft } from "react-icons/hi2";
import Grid from "./Grid";

const App = () => {
  const KEYBOARD = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const [ENTERED, setEntered] = useState<string>("");
  const [words, setWords] = useState<{ word: string; classes: string[] }[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false); // New state to track game over

  const getLetterClass = (word: string) => {
    const wordArray = word.split("");
    const answerArray = answer.split("");

    return wordArray.map((letter, index) => {
      if (letter === answerArray[index]) return "exact";
      else if (answerArray.includes(letter)) return "present";
      else return "absent";
    });
  };

  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await fetch(
          "https://random-word-api.herokuapp.com/word?length=5"
        );
        let data = await response.json();
        data = data[0].toUpperCase();
        setAnswer(data);
      } catch (error) {
        console.error("Failed to fetch word:", error);
      }
    };

    fetchRandomWord();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (gameOver || words.length > 7) {
        return;
      }

      const key = e.key.toUpperCase();
      setEntered((prev) => {
        if (key === "BACKSPACE") {
          return prev.slice(0, -1);
        } else if (key.length === 1 && key.match(/[A-Z]/) && prev.length < 5) {
          return prev + key;
        } else if (key === "ENTER" && prev.length === 5) {
          if (prev === answer) {
            setGameOver(true);
          }
          setWords((prevWords) => [
            ...prevWords,
            { word: prev, classes: getLetterClass(prev) },
          ]);
          return "";
        }
        return prev;
      });
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ENTERED, words.length, gameOver, answer]);

  const handleButtonClick = (key: string) => {
    if (gameOver || words.length >= 7 || ENTERED.length >= 5) {
      return;
    }
    setEntered((prev) => prev + key);
  };

  const handleBackspaceClick = () => {
    if (gameOver || words.length >= 7) {
      return; // Stop if the game is over
    }
    setEntered((prev) => prev.slice(0, -1));
  };

  const handleEnterClick = () => {
    if (gameOver || words.length >= 7 || ENTERED.length !== 5) {
      return;
    }
    if (ENTERED === answer) {
      setGameOver(true);
    }
    setWords((prev) => [
      ...prev,
      { word: ENTERED, classes: getLetterClass(ENTERED) },
    ]);
    setEntered("");
  };
  return (
    <>
      <Grid guesses={words} currentGuess={ENTERED} />
      {gameOver && <div className="game-over-message">You guessed it!</div>}
      <div className="keyboard">
        {KEYBOARD.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.split("").map((key, keyIndex) => (
              <button
                className="key"
                key={keyIndex}
                onClick={() => handleButtonClick(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div>
          <button className="key" onClick={handleBackspaceClick}>
            <TiBackspace />
          </button>
          <button className="key" onClick={handleEnterClick}>
            <HiArrowTurnDownLeft />
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
