import React, { useState, useEffect, useCallback } from 'react';
import '../App.css';
import Navbar from './Navbar';

const Tetris = () => {

  <Navbar></Navbar>
  const [grid, setGrid] = useState(Array.from({ length: 200 }, () => ({ filled: false, color: 'transparent' })));
  const [currentBlock, setCurrentBlock] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(4);
  const [isGameOver, setIsGameOver] = useState(false);
  const [blockInterval, setBlockInterval] = useState(null);

  const blocks = [
    {
      shape: [[1, 1], [1, 1]],
      color: 'cyan',
    },
    {
      shape: [[0, 1], [1, 1]],
      color: 'blue',
    },
    {
      shape: [[1, 1, 0], [0, 1, 1]],
      color: 'orange',
    },
    {
      shape: [[1, 1], [0, 1]],
      color: 'yellow',
    },
    {
      shape: [[0, 1], [0, 1]],
      color: 'green',
    },
  ];

  const randomBlock = () => {
    const randomIndex = Math.floor(Math.random() * blocks.length);
    return blocks[randomIndex];
  };

  const drawBlock = useCallback(() => {
    const blockData = randomBlock();
    setCurrentBlock(blockData);
    setCurrentPosition(4);
  }, []);

  const isCollision = (block, position) => {
    if (!block) return false;
    for (let row = 0; row < block.shape.length; row++) {
      for (let col = 0; col < block.shape[row].length; col++) {
        if (block.shape[row][col] && (grid[row * 10 + col + position] || row * 10 + col + position >= 200)) {
          return true;
        }
      }
    }
    return false;
  };

  const moveBlock = (direction) => {
    if (!isGameOver && currentBlock) {
      const newPosition = direction === 'left' ? currentPosition - 1 : currentPosition + 1;
      if (!isCollision(currentBlock, newPosition)) {
        setCurrentPosition(newPosition);
      } else {
        updateGrid();
        checkRows();
        drawBlock();
      }
    }
  };

  const rotateBlock = () => {
    if (!isGameOver && currentBlock) {
      const rotatedShape = currentBlock.shape[0].map((_, col) =>
        currentBlock.shape.map((row) => row[col]).reverse()
      );
      if (!isCollision({ ...currentBlock, shape: rotatedShape }, currentPosition)) {
        setCurrentBlock({ ...currentBlock, shape: rotatedShape });
      }
    }
  };

  const dropBlock = () => {
    if (!isGameOver && currentBlock) {
      let newPosition = currentPosition;
      while (!isCollision(currentBlock, newPosition + 10)) {
        newPosition += 10;
      }
      setCurrentPosition(newPosition);
    }
  };

  const startNewBlockInterval = () => {
    clearInterval(blockInterval);
    const intervalId = setInterval(() => {
      if (!isCollision(currentBlock, currentPosition + 10)) {
        setCurrentPosition(currentPosition + 10);
      } else {
        stopBlockInterval();
        updateGrid();
        checkRows();
        drawBlock();
        startNewBlockInterval();
      }
    }, 500);
    setBlockInterval(intervalId);
  };

  const stopBlockInterval = () => {
    clearInterval(blockInterval);
  };

  useEffect(() => {
    if (!isGameOver && currentBlock) {
      startNewBlockInterval();
    }
    return () => {
      stopBlockInterval();
    };
  }, [currentBlock]);

  const updateGrid = () => {
    if (!currentBlock) return;
    const newGrid = [...grid];
    for (let row = 0; row < currentBlock.shape.length; row++) {
      for (let col = 0; col < currentBlock.shape[row].length; col++) {
        if (currentBlock.shape[row][col]) {
          newGrid[row * 10 + col + currentPosition].filled = true;
          newGrid[row * 10 + col + currentPosition].color = currentBlock.color;
        }
      }
    }
    setGrid(newGrid);
  };

  const checkRows = () => {
    const rowsToRemove = [];
    for (let row = 0; row < 20; row++) {
      let isFull = true;
      for (let col = 0; col < 10; col++) {
        if (!grid[row * 10 + col].filled) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        rowsToRemove.push(row);
      }
    }

    if (rowsToRemove.length > 0) {
      const newGrid = [...grid];
      rowsToRemove.forEach((row) => {
        newGrid.splice(row * 10, 10);
        newGrid.unshift(...Array(10).fill({ filled: false, color: 'transparent' }));
      });
      setGrid(newGrid);
    }
  };

  const gameOver = () => {
    setIsGameOver(true);
    clearInterval(blockInterval);
  };

  const startGame = () => {
    setGrid(Array.from({ length: 200 }, () => ({ filled: false, color: 'transparent' })));
    setCurrentBlock(null);
    setCurrentPosition(4);
    setIsGameOver(false);
    drawBlock();
    const interval = setInterval(() => {
      moveBlock('down');
    }, 500);
    setBlockInterval(interval);
  };

  useEffect(() => {
    if (!isGameOver && currentBlock) {
      if (isCollision(currentBlock, currentPosition + 10)) {
        updateGrid();
        checkRows();
        drawBlock();
      }
    }
  }, [currentPosition, currentBlock, isCollision, updateGrid, checkRows, drawBlock, isGameOver]);

  useEffect(() => {
    if (!isGameOver) {
      startGame();
    }
  }, [isGameOver]);

  useEffect(() => {
    if (currentBlock && isCollision(currentBlock, currentPosition)) {
      gameOver();
    }
  }, [currentPosition, currentBlock]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isGameOver) {
        switch (e.key) {
          case 'ArrowLeft':
            moveBlock('left');
            break;
          case 'ArrowRight':
            moveBlock('right');
            break;
          case 'ArrowUp':
            rotateBlock();
            break;
          case 'ArrowDown':
            dropBlock();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isGameOver, moveBlock, rotateBlock, dropBlock]);

  return (
    <div className="tetris-wrapper">
      <div className="tetris-grid">
        {grid.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell.filled ? 'filled' : ''}`}
            style={{ backgroundColor: cell.color }}
          />
        ))}
      </div>
      {isGameOver && (
        <div className="game-over">
          <button onClick={startGame}>Pokusaj ponovo</button>
        </div>
      )}
    </div>
  );
};

export default Tetris;
