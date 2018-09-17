import React, { Component } from 'react';
import GameLogic from './GameLogic';

import './App.css';

import Keyboard from './Keyboard';
import Statistics from './Statistics';

const numNotes = 49;
const intervals = [1,2,3,4,5,6,7,8,9,10,11,12];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numNotes: 49,
      baseNote: 24,
      intervalNote: null,
      points: 0,
      pressedIndex: null,
      pressSuccess: true,
      gamestate: 'guessNote',
    }

    this.game = new GameLogic(numNotes, intervals);
  }

  handleKeyPress = (index) => () => {
    const wasCorrect = this.game.handleAnswer(index);
    this.setState({
      pressedIndex: index,
      pressSuccess: wasCorrect,
      baseNote: this.game.previousInterval,
      intervalNote: this.game.currentInterval,
    })
  }

  render() {
    const { started, baseNote, pressedIndex, pressSuccess, intervalNote } = this.state;

    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Points: {this.game.points}</h1>
          <h1 className="App-title">Highscore: {this.game.highScore}</h1>
          {this.game.state === 'showAnswer' && <h1 className="App-title">Correct interval: {this.game.answerInterval}, you guessed: {pressedIndex - baseNote}</h1>}
        </header>
        <Keyboard
          numNotes={numNotes}
          baseNote={baseNote} 
          intervalNote={intervalNote}
          handleKeyPress={this.handleKeyPress} 
          pressedIndex={pressedIndex}
          pressSuccess={pressSuccess}
          answerNote={this.game.state === 'showAnswer' ? this.game.answerNote : ''}
        />
      </div>
    );
  }
}

export default App;