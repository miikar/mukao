import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Key } from "./key";
import * as actions from "../actions/index";

// const Keyboard = ({ baseNote, handleKeyPress, pressedIndex, pressSuccess, answerNote }) =>

//const loopLength = 3000;
const getRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

class Keyboard extends Component {
  constructor(props) {
    super(props)
      this.state = {
        keyboardState: 'PLAY_SOUND'
      }
  }

  componentDidMount() {
    console.log(this.state)
    this.props.actions.startChallenge(this.nextSound())
      .then(() => {
        return this.props.playNotes([
          this.props.notes.baseNote, 
          this.props.notes.targetNote,
          //5,6,7
        ])
      })
      .then(() => {
        this.setState({ keyboardState: 'MAKE_GUESS' })
      })
  }

  nextSound = () => {
    const baseNote = Math.floor(Math.random() * this.props.numNotes);
    let direction = getRandom([-1, 1]);
    if (baseNote < 12) direction = 1;
    if (baseNote > 36) direction = -1;
    const noteDistance = getRandom(this.props.intervals) * direction;
    return {
        baseNote: baseNote,
        targetNote: baseNote + noteDistance,
        guessedNote: null
    }
  }

  handleKeyPress = (index) => () => {
    if (this.state.keyboardState === 'PLAY_SOUND' || this.state.keyboardState === 'SHOW_ANSWER') return;
    if (this.state.keyboardState === 'MAKE_GUESS') {
      if (index === this.props.notes.baseNote) {
        this.props.playNotes([this.props.notes.baseNote, this.props.notes.targetNote])
      } else {
        this.setState({ keyboardState: 'SHOW_ANSWER' })
        this.props.playNotes([index])
          .then(() => { return this.props.actions.makeGuess({ guessedNote: index }) })
          .then(() => { return this.props.playNotes([this.props.targetNote]) })
          //.then(() => { return this.props.actions.updatePoints() })
          .then(() => {
            // automatically start next challenge after a delay
            window.setTimeout(() => {
              this.props.actions.startChallenge(this.nextSound())
                .then(() => {
                  return this.props.playNotes([
                    this.props.notes.baseNote, 
                    this.props.notes.targetNote,
                  ])
                })
                .then(() => this.setState({ keyboardState: 'MAKE_GUESS' }))
              }, 1000);
          })
      }
    }
    //this.setState(points);
    //window.localStorage.setItem('statistics', JSON.stringify(points.statistics));
  }

  render() {
    const keys = [];
    for (let i = 0; i < this.props.numNotes; i++) {
      keys.push(
        <Key 
          key={i}
          index={i}
          isBasenote={this.props.notes.baseNote === i}
          isTargetNote={this.props.notes.targetNote === i}
          handleKeyPress={this.handleKeyPress}
          pressedIndex={this.guessedNote}
          pressSuccess={this.guessedNote === this.props.notes.targetNote}
          //answerNote={this.state.keyboardState === 'showAnswer' ? intervalNote : ''}
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
}

const mapStateToProps = state => {
    return { notes: state.notes }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

const KeyboardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Keyboard)

export default KeyboardContainer