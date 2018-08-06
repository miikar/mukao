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
    
  }

  componentDidMount() {
    this.props.actions.startChallenge(this.nextSound())
      .then(() => {
        this.props.playNotes([
          this.props.notes.baseNote, 
          this.props.notes.targetNote,
          //5,6,7
        ])
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
    if (this.state.gamestate === 'PLAY_SOUND' || this.state.gamestate === 'SHOW_ANSWER') return;
    if (this.state.gamestate === 'MAKE_GUESS') {
      this.props.playsound(index)
      switch (index) {
        case index === this.props.notes.baseNote:
          //this.props.playsound(this.props.notes.baseNote);

          window.setTimeout(() => {
            this.props.playsound(this.props.notes.targetNote);
          }, 700)
          break;
        case index !== this.props.notes.baseNote:
          this.props.make_guess(index)
            //.then(() => this.props.actions.updatePoints(index))
          this.props.playsound(this.props.notes.targetNote)
          break;
        default:
          break;
      }
    }
    //this.setState(points);
    //window.localStorage.setItem('statistics', JSON.stringify(points.statistics));
    this.setState({ gamestate: 'SHOW_ANSWER' })
    window.setTimeout(
      this.props.startChallenge(this.nextSound())
        .then(() => {
          this.props.playsound(this.props.notes.baseNote)
          window.setTimeout(() => {
            this.props.playsound(this.props.notes.targetNote);
          }, 700)
        })
        .then(() => this.setState({ gamestate: 'MAKE_GUESS' })),
      2000);
    //window.clearInterval(this.loop);
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
          //answerNote={this.state.gamestate === 'showAnswer' ? intervalNote : ''}
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