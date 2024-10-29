"use client";
import React, { useEffect, useState } from "react";

function MemoryGame() {
  const [grid, setGrid] = useState(2);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [win, setWin] = useState(false);
  const [move, setMove] = useState(5);
  const [gridInput, setGridInput] = useState(grid);
  const handleGridSizeChange = (e) => {
    const size = e.target.value;
    setGridInput(size); // Update input value immediately

    const parsedSize = parseInt(size);
    if (parsedSize >= 2 && parsedSize <= 10) {
      setGrid(parsedSize); // Only update grid state if valid
    }
  };
  const initializeGame = () => {
    const totalCards = grid * grid;
    const pairCount = Math.floor(totalCards / 2);
    const number = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffleCards = [...number, ...number]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffleCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
    setWin(false);
    setMove(5); // Reset move count when starting a new game
  };

  useEffect(() => {
    initializeGame();
  }, [grid]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved((prevSolved) => [...prevSolved, firstId, secondId]);
    }
    setTimeout(() => {
      setFlipped([]);
      setDisabled(false);
      if (move > 0) {
        setMove((prevMove) => prevMove - 1); // Decrement moves only after checking
      }
    }, 300);
  };

  const handleClick = (id) => {
    if (disabled || win || solved.includes(id)) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      setDisabled(true);
      setFlipped((prev) => [...prev, id]);
      checkMatch(id);
    }
  };

  useEffect(() => {
    if (cards.length === solved.length && cards.length > 0) {
      setWin(true);
    }
  }, [solved, cards]);

  useEffect(() => {
    if (move === 0 && !win) {
      setDisabled(true);
    }
  }, [move, win]);

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Patta Lagam</h1>
      <div className="flex gap-4 sm:flex-row flex-col mb-4">
        <label htmlFor="grid" className="text-lg">
          Grid Size(max 10)
        </label>
        <input
          id="grid"
          type="number"
          min={2}
          max={10}
          value={gridInput}
          onChange={handleGridSizeChange}
          className="border-2 border-black rounded-lg text-center"
        />
        <label htmlFor="moves" className="text-lg">
          Enter your no. of moves
        </label>
        <input
          id="moves"
          type="number"
          min={0} // Change min to 0 to allow unlimited
          value={move}
          onChange={(e) => setMove(parseInt(e.target.value))} // Parse to integer
          className="border-2 border-black rounded-lg text-center"
        />
      </div>
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))`,
          width: `min(100%, ${grid * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`${
              isFlipped(card.id)
                ? isSolved(card.id)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-400"
            } aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300`}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>

      {win ? (
        <p className="text-center animate-bounce text-green-400 text-3xl font-bold">
          You Win
        </p>
      ) : (
        move === 0 && (
          <p className="text-center animate-bounce text-red-600 text-3xl font-bold">
            Game Over!
          </p>
        )
      )}

      <button
        onClick={initializeGame}
        className="mt-5 border-2 border-gray-400 px-4 py-2 rounded-lg bg-green-400 text-white font-bold"
      >
        {win ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}

export default MemoryGame;
