import React, { Component } from 'react';

const createGuessMatrix = (numberOfIntervals) => {
  const statistics = [];
  for (let i = 0; i <= numberOfIntervals; i++) {
    statistics[i] = [];
    for (let y = 0; y <= numberOfIntervals; y++) {
      statistics[i].push(0);
    }
  };
  return statistics;
}

class Statistics {
  constructor (numberOfIntervals=12) {
    this.numberOfIntervals = numberOfIntervals;
    this.previousInterval = 0;
    this.statistics = JSON.parse(window.localStorage.getItem('userStatistics'));
    if (!this.statistics) this.statistics = createGuessMatrix(numberOfIntervals);
    console.table(this.statistics);
  }

  getNewInterval = () => {
    let newInterval = this.getLowestAccuracyInterval();
    if (newInterval === this.previousInterval) {
      newInterval = this.getMostConfusedInterval(newInterval);
    }
    this.previousInterval = newInterval;
    return newInterval;
  }

  getMostConfusedInterval = (interval) => {
    let mostGuesses = 0;
    let mostGuessedInterval = 1;
    this.statistics[interval].forEach((guesses, i) => {
      if (i !== 0 && i !== interval){
        if (guesses > mostGuesses) {
          mostGuesses = guesses;
          mostGuessedInterval = i;
        }
      }
    });
    return mostGuessedInterval;
  }

  getLowestAccuracyInterval = () => this.statistics.reduce(
    (lowest, guesses, index) => {
      if (index === 0) return lowest;
      if (this.getAccuracy(index) < this.getAccuracy(lowest)) {
        return index;
      }
      return lowest;
    }, 1);

  getAccuracy = (interval) => {
    if (this.statistics[interval][interval] === 0) return 0.0;

    const totalGuesses = this.statistics[interval].reduce(
      (acc, guess) => {
        return acc + guess;
      }, 0
    );
    return this.statistics[interval][interval] / totalGuesses;
  }

  update = (baseNote, intervalNote, guessedNote, guessTime) => {
    if (!baseNote || !intervalNote || !guessedNote) return;
    
    const interval = Math.abs(baseNote - intervalNote);
    const guessInterval = Math.abs(baseNote - guessedNote);
    if (guessInterval > this.numberOfIntervals) return;

    const totalGuesses = this.statistics[interval][guessInterval];

    this.statistics[interval][guessInterval] = totalGuesses + 1;
    this.save();
  }

  save = () => {
    window.localStorage.setItem('userStatistics', JSON.stringify(this.statistics));
  }
}

export default Statistics;