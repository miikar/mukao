import React, { Component } from 'react';
import { Howl } from 'howler';
import './App.css';

import Keyboard from './components/keyboard'
import { Statistics } from './components/statistics'

const numNotes = 49;
const intervals = [1,2,3,4,5,6,7,8,9,10,11,12];

class App extends Component {

  constructor(props) {
    super(props);
    const savedStatistics = JSON.parse(window.localStorage.getItem('statistics')) || {};
    this.state = {
    //  baseNote: null,
    //  intervalNote: null,
      points: 0,
    //  pressedIndex: null,
    //  pressSuccess: true,
    //  gamestate: 'guessNote',
      statistics: savedStatistics
    }

    const noteTiming = {}
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

  playsound = (index) => {
    console.log("index" + index)
    this.notes.play('' + index);
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

    this.setState(notes);
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

  render() {
    const { baseNote, intervalNote, points, pressedIndex, pressSuccess, gamestate } = this.state;
    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Points: {points}</h1>
          {gamestate === 'showAnswer' && <h1 className="App-title">Interval: {intervalNote - baseNote}</h1>}
        </header>
        <Keyboard
          numNotes={numNotes}
          intervals={intervals}
          playsound={this.playsound}
          //baseNote={baseNote} 
          //handleKeyPress={this.handleKeyPress} 
          //pressedIndex={pressedIndex}
          //pressSuccess={pressSuccess}
          //answerNote={gamestate === 'showAnswer' ? intervalNote : ''}
        />
        <Statistics statistics={this.state.statistics} />
        <button onClick={() => {window.localStorage.clear(); this.setState({statistics: {}})}}>Forget statistics</button>
      </div>
    );
  }
}

export default App;