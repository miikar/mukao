import React, { Component } from 'react';
import {Howl, Howler} from 'howler';
import './App.css';

const numNotes = 49;
const intervals = [1,2,3,4,5,6,7,8,9,10,11,12];
const loopLength = 3000;
const getRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

class App extends Component {

  constructor(props) {
    super(props);
    const savedStatistics = JSON.parse(window.localStorage.getItem('statistics')) || {};
    this.state = {
      baseNote: null,
      intervalNote: null,
      points: 0,
      pressedIndex: null,
      pressSuccess: true,
      gamestate: 'guessNote',
      statistics: savedStatistics
    }

    // Init notes
    const noteTiming = {};
    for (let i = 0; i< numNotes; i++) {
      noteTiming[i] = [i*2000, 1600];
    }

    this.notes = new Howl({ 
      src: ['notes.mp3'],
      volume: 0.6,
      sprite: noteTiming,
      loop: false,
    });
  }

  componentDidMount() {
    // Start the game
    //this.loop = window.setInterval(this.progress, loopLength);
  }

  progress = () => {
    //if (!this.state.pressedIndex) {
    //  const points = this.checkPoints();
    //  
    //  window.setTimeout(this.continueGuessing, 1500);
    //  //window.clearInterval(this.loop);
    //}

    // Play the selected interval
    const notes = this.nextSound()
    this.playSound(notes.baseNote);

    window.setTimeout(() => {
      this.playSound(notes.intervalNote);
    }, 700)

    this.setState(notes);
  }

  nextSound = () => {
    const baseNote = Math.floor(Math.random() * numNotes);
    let direction = getRandom([-1, 1]);
    if (baseNote < 12) direction = 1;
    if (baseNote > 36) direction = -1;
    const noteDistance = getRandom(intervals) * direction;

    return { 
      baseNote: baseNote,
      intervalNote: baseNote + noteDistance
    }
  }

  checkPoints = (index) => {
    const { points, baseNote, intervalNote, statistics } = this.state;
    const interval = Math.abs(intervalNote - baseNote);
    if (index === intervalNote) {
      return {
        points: points + 1,
        pressSuccess: true,
        pressedIndex: index,
        gamestate: 'showAnswer',
        statistics: {
          ...statistics,
          [interval]: statistics[interval] ? statistics[interval].concat(1) : [1]
        }
      }
    } else {
      return {
        points: points - 1,
        pressSuccess: false,
        pressedIndex: index,
        gamestate: 'showAnswer',
        statistics: {
          ...statistics,
          [interval]: statistics[interval] ? statistics[interval].concat(0) : [0]
        }
      }
    }
  }

  continueGuessing = () => {
    this.setState({
      gamestate: 'guessNote',
      pressedIndex: null,
      pressSuccess: false,
    });
    this.progress()
    //this.loop = window.setInterval(this.progress, loopLength);
  }

  playSound = (index) => {
    this.notes.play('' + index);
  }

  handleKeyPress = (index) => () => {
    if (this.state.gamestate === 'showAnswer') {
      this.playSound(index);
      return;
    }
    this.playSound(index);
    const points = this.checkPoints(index);
    this.setState(points);
    window.localStorage.setItem('statistics', JSON.stringify(points.statistics));

    window.setTimeout(this.continueGuessing, 2000);
    //window.clearInterval(this.loop);
  }

  render() {
    const { started, baseNote, intervalNote, points, pressedIndex, pressSuccess, gamestate } = this.state;
    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Points: {points}</h1>
          {gamestate === 'showAnswer' && <h1 className="App-title">Interval: {intervalNote - baseNote}</h1>}
        </header>
        <Keyboard
          baseNote={baseNote} 
          handleKeyPress={this.handleKeyPress} 
          pressedIndex={pressedIndex}
          pressSuccess={pressSuccess}
          answerNote={gamestate === 'showAnswer' ? intervalNote : ''}
        />
        <Statistics statistics={this.state.statistics} />
        <button onClick={() => {window.localStorage.clear(); this.setState({statistics: {}})}}>Forget statistics</button>
      </div>
    );
  }
}

export default App;

const Key = ({index, isBasenote, handleKeyPress, pressedIndex, pressSuccess, answerNote}) => {
  const isBlack = [1, 3, 6, 8, 10].includes(index % 12);
  return (
    <div 
      className={'note' +
        (isBasenote ? ' isBasenote' : '') +
        (isBlack ? ' black' : '') +
        (pressSuccess && pressedIndex === index ? ' success' : '') +
        (!pressSuccess && pressedIndex === index ? ' failure' : '') +
        ((answerNote === index && !pressSuccess) ? ' answer' : '')
      } 
      onClick={handleKeyPress(index)}>
    </div>
  )
}

const Keyboard = ({ baseNote, handleKeyPress, pressedIndex, pressSuccess, answerNote }) => {
  const keys = [];
  for (let i = 0; i < numNotes; i++) {
    keys.push(
      <Key 
        key={i} 
        index={i} 
        isBasenote={baseNote == i} 
        handleKeyPress={handleKeyPress}
        pressedIndex={pressedIndex}
        pressSuccess={pressSuccess}
        answerNote={answerNote}
      />
    );
  }
  return (
    <div className="keyboard-scroll-container">
      <div className="keyboard-container">
        {keys}
      </div>
    </div>
  );
}

const Statistics = ({ statistics }) => {
  return (
    <div className="statistics">
      { Object.keys(statistics).map((interval, i) => (
        <div className="statistic">
          <div>{interval}</div> 
          <div>{(getCorrectAnswers(statistics[interval]) / statistics[interval].length * 100).toFixed(0)}%</div>
        </div>
      ))}
    </div>
  )
}

const getCorrectAnswers = (intervalStatistic) => intervalStatistic.reduce(
  (acc, answer) => {
    if (answer === 1) return acc + 1;
    return acc;
  }, 0
)