import React, { Component } from 'react';
import {Howl, Howler} from 'howler';
import './App.css';

const numNotes = 49;
const intervals = [1,2,3,4,5,6,7,8,9,10,11,12];
const loopLength = 5000;
const getRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      baseNote: 0,
      noteDistance: 4,
      points: 0,
      pressedIndex: null,
      pressSuccess: true,
      state: 'guessNote'
    }

    // Init notes
    const noteTiming = {};
    for (let i = 0; i< numNotes; i++) {
      noteTiming[i] = [i*2000, 1000];
    }

    this.notes = new Howl({ 
      src: ['notes.wav'],
      volume: 0.8,
      sprite: noteTiming,
      loop: false,
      html5: true
    });
  }

  componentDidMount() {
    this.loop = window.setInterval(this.roundEnd, loopLength);
  }

  roundEnd = () => {
    if (!this.state.pressedIndex) {
      this.checkPoints();
      window.setTimeout(this.continueGuessing, 1500);
      window.clearInterval(this.loop);
    }
  }

  nextSound = () => {
    const baseNote = Math.floor(Math.random() * numNotes);
    let direction = getRandom([-1, 1]);
    if (baseNote < 12) direction = 1;
    if (baseNote > 36) direction = -1;
    const noteDistance = getRandom(intervals) * direction;

    this.playSound(baseNote);

    window.setTimeout(() => {
      this.playSound(baseNote + noteDistance);
    }, 500)

    this.setState({ 
      baseNote, 
      noteDistance,
    });
  }

  continueGuessing = () => {
    this.nextSound();
    this.setState({
      state: 'guessNote',
      pressedIndex: null,
      pressSuccess: false,
    });
    this.loop = window.setInterval(this.roundEnd, loopLength);
  }

  playSound = (index) => {
    this.notes.play('' + index);
  }

  handleKeyPress = (index) => () => {
    if (this.state.state === 'showAnswer') return;
    this.playSound(index);
    this.checkPoints(index);

    window.setTimeout(this.continueGuessing, 1500);
    window.clearInterval(this.loop);
  }

  checkPoints = (index) => {
    const { baseNote, noteDistance } = this.state;
    
    if (index === baseNote + noteDistance) {
      this.setState(({ points, pressSuccess }) => {
        return {
          points: points + 1,
          pressSuccess: true,
          pressedIndex: index,
          state: 'showAnswer'
        }
      });
    } else {
      this.setState(({ points, pressSuccess }) => {
        return {
          points: points - 1,
          pressSuccess: false,
          pressedIndex: index,
          state: 'showAnswer'
        }
      });
    }
  }

  

  render() {
    const { started, baseNote, noteDistance, points, pressedIndex, pressSuccess, state } = this.state;
    console.log(this.state)
    // this.playSound(baseNote + noteDistance);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{baseNote} Points: {points}</h1>
          <button onClick={() => {window.clearInterval(this.loop)}}>Pause</button>
        </header>
        <Keyboard
          baseNote={baseNote} 
          handleKeyPress={this.handleKeyPress} 
          pressedIndex={pressedIndex}
          pressSuccess={pressSuccess}
          answerNote={state === 'showAnswer' ? baseNote + noteDistance : ''}
        />
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
    <div className="keyboard-container">
      {keys}
    </div>
  );
}