import React, { Component } from 'react';
import {Howl} from 'howler';
import { sendIntervalData } from './Analytics';
import './App.css';

import Keyboard from './Keyboard';
import Statistics from './Statistics';

const numNotes = 49;
const intervals = [1,2,3,4,5,6,7,8,9,10,11,12];
const loopLength = 3000;
const getRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}
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
      numNotes: 49,
      baseNote: null,
      intervalNote: null,
      points: 0,
      pressedIndex: null,
      pressSuccess: true,
      gamestate: 'guessNote',
      statistics: savedStatistics,
      notes: [],
    }

    // Init notes
    const noteTiming = {};
    for (let i = 0; i< numNotes; i++) {
      noteTiming[i] = [i*2000, 1600];
    }

    this.notes = new Howl({ 
      src: ['notes.mp3'],
      volume: 0.8,
      sprite: noteTiming,
      loop: false,
    });

    this.successSound = new Howl({
      src: ['success.wav'],
      volume: 0.9
    })

  }

  componentDidMount() {
    this.notes.once('load', this.progress);
  }

  playNotes = async () => {
    const { notes=[] } = this.state;
    for (const note of notes) {
      await this.playSound(note);
    };
    this.lastPlayed = Date.now();
  }

  playSound = (index, duration=700) => new Promise(
    (resolve) => {
      this.notes.play('' + index);
      window.setTimeout(resolve, duration);
    }
  );

  progress = () => {
    //if (!this.state.pressedIndex) {
    //  const points = this.checkPoints();
    //  
    //  window.setTimeout(this.continueGuessing, 1500);
    //  //window.clearInterval(this.loop);
    //}

    // Play the selected interval
    this.setState(this.getNewInterval(), this.playNotes);
  }

  getNewInterval = () => {
    const baseNote = Math.floor(Math.random() * numNotes);
    let direction = getRandom([-1, 1]);
    if (baseNote < 12) direction = 1;
    if (baseNote >= numNotes - 12) direction = -1;
    const noteDistance = getRandom(intervals) * direction;

    return { 
      baseNote: baseNote,
      intervalNote: baseNote + noteDistance,
      notes: [baseNote, baseNote + noteDistance]
    }
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

  continueGuessing = () => {
    this.setState({
      gamestate: 'guessNote',
      pressedIndex: null,
      pressSuccess: false,
    });
    this.progress()
    //this.loop = window.setInterval(this.progress, loopLength);
  }



  handleKeyPress = (index) => () => {
    const { baseNote, intervalNote, gamestate } = this.state;

    if (index === baseNote) {
      this.playNotes();
      return;
    }
    if (gamestate === 'showAnswer' ) {
      this.playSound(index);
      return;
    }
    this.playSound(index);
    // Continue only if player pressed correctly
    if (index !== intervalNote) {
      this.setState({
        pressSuccess: false,
        pressedIndex: index,
      });
    } else {
      const points = this.checkPoints(index);
      this.setState(points);
      window.setTimeout(this.continueGuessing, 2000);
      this.successSound.play();
      this.successSound.rate(Math.max(0.2, Math.random()));
    }


    //window.clearInterval(this.loop);
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
          intervalNote={intervalNote}
          numNotes={numNotes}
          baseNote={baseNote} 
          handleKeyPress={this.handleKeyPress} 
          pressedIndex={pressedIndex}
          pressSuccess={pressSuccess}
          answerNote={gamestate === 'showAnswer' ? intervalNote : ''}
        />
        {/* <Statistics statistics={statistics} /> */}
        {/* <button onClick={() => {window.localStorage.clear(); this.setState({statistics: {}})}}>Reset statistics</button> */}
      </div>
    );
  }
}

export default App;