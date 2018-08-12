import React, { Component } from 'react';
import {Howl} from 'howler';
import { sendIntervalData } from './Analytics';
import './App.css';

import Keyboard from './components/keyboard'
import { Statistics } from './components/statistics'

const numNotes = 49;
const intervals = [1,2,3,4,5,6,7,8,9,10,11,12];
//const loopLength = 3000;

const getOrSetUserID = () => {
  let userID = window.localStorage.getItem('userID');
  if (!userID) {
    userID = Math.floor(Math.random()*99999999);
    window.localStorage.setItem('userID', userID);
  }
  return userID;
}

class App extends Component {

  constructor(props) {
    super(props);
    const savedStatistics = JSON.parse(window.localStorage.getItem('statistics')) || {};
    this.userID = getOrSetUserID();
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
      volume: 0.8,
      sprite: noteTiming,
      loop: false,
    });

  }

  componentDidMount() {
    this.notes.once('load', this.progress);
  }

  playNotes = (notes) => {
    const n = notes.length - 1;
    return notes.reduce((promise, note, index) => {
      return promise.then(() => {
        return new Promise((resolve) => {
          this.playsound(note)
          if (index === n) resolve()
          else setTimeout(() => resolve(), 700)
        })
      })
    }, Promise.resolve())
  }

  playsound = (index) => {
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
    this.lastPlayed = Date.now();
  }

  checkPoints = (guessedNote) => {
    const { points, baseNote, intervalNote, statistics } = this.state;
    const interval = Math.abs(intervalNote - baseNote);
    sendIntervalData({
      userID: this.userID,
      baseNote,
      intervalNote,
      guessedNote,
      timestamp: Date.now(),
      guessTime: Date.now() - this.lastPlayed,
    });
    this.lastPlayed = Date.now();
    if (guessedNote === intervalNote) {
      return {
        points: points + 1,
        pressSuccess: true,
        pressedIndex: guessedNote,
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
        pressedIndex: guessedNote,
        gamestate: 'showAnswer',
        statistics: {
          ...statistics,
          [interval]: statistics[interval] ? statistics[interval].concat(0) : [0]
        }
      }
    }
  }

  render() {
    const { started, baseNote, intervalNote, points, pressedIndex, pressSuccess, gamestate, statistics } = this.state;
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
          playNotes={this.playNotes}
          //baseNote={baseNote} 
          //handleKeyPress={this.handleKeyPress} 
          //pressedIndex={pressedIndex}
          //pressSuccess={pressSuccess}
          //answerNote={gamestate === 'showAnswer' ? intervalNote : ''}
        />
        <Statistics statistics={statistics} />
        <button onClick={() => {window.localStorage.clear(); this.setState({statistics: {}})}}>Reset statistics</button>
      </div>
    );
  }
}

export default App;
