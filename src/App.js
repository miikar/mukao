import React, { Component } from 'react';
import GameLogic from './GameLogic';

import './App.css';

import Keyboard from './Keyboard';
import Statistics from './Statistics';

const numNotes = 49;
const intervals = [1,2,3,4,5,6,7,8,9,10,11,12];

const UserStatistics = new Statistics();

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
    // const targetInterval = this.game.targetInterval;
    const wasCorrect = this.game.handleAnswer(index);
    this.setState({
      pressedIndex: index,
      pressSuccess: wasCorrect,
      // baseNote: targetInterval,
      // intervalNote: this.game.targetInterval,
    })
  }

  render() {
    const { started, baseNote, pressedIndex, pressSuccess, gamestate } = this.state;
    const intervalNote = this.game.targetInterval;
    // console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Points: {this.game.points}</h1>
          <h1 className="App-title">Highscore: {this.game.highScore}</h1>
          {this.game.state === 'showAnswer' && <h1 className="App-title">Interval: {intervalNote - pressedIndex}</h1>}
        </header>
        <Keyboard
          numNotes={numNotes}
          baseNote={baseNote} 
          intervalNote={intervalNote}
          handleKeyPress={this.handleKeyPress} 
          pressedIndex={pressedIndex}
          pressSuccess={pressSuccess}
          answerNote={this.game.state === 'showAnswer' ? intervalNote : ''}
        />
      </div>
    );
  }
}

export default App;