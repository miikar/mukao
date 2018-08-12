import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Key } from "./key";
import * as actions from "../actions/index";


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

  getLowestAccuracy = (statistics={}) => {
    const playedIntervals = Object.keys(statistics);

    // Get lowest accuracy only when all intervals have been played
    if (playedIntervals.length < intervals.length) return getRandom(intervals);

    return playedIntervals.reduce((lowest, interval) => {
      if (getCorrectAnswers(statistics[interval]) < getCorrectAnswers(statistics[lowest])) {
        console.log('lowest', interval)
        return interval;
      }
      return lowest;
    }, 1
  )};

  nextSound = () => {
    const baseNote = Math.floor(Math.random() * this.props.numNotes);
    let direction = getRandom([-1, 1]);
    if (baseNote < 12) direction = 1;
    if (baseNote > 36) direction = -1;
    const noteDistance = getRandom(this.props.intervals) * direction;

    // const noteDistance = this.getLowestAccuracy(this.state.statistics) * direction;

    return {
        baseNote: baseNote,
        targetNote: baseNote + noteDistance,
        guessedNote: null
    }
  }

  checkPoints = (guessedNote) => {
    const { points, baseNote, intervalNote, statistics } = this.state;
    const interval = Math.abs(intervalNote - baseNote);
    this.lastPlayed = Date.now();
    if (guessedNote === intervalNote) {
      return {
        points: points + 1,
        //pressSuccess: true,
        //pressedIndex: guessedNote,
        //gamestate: 'showAnswer',
        statistics: {
          ...statistics,
          [interval]: statistics[interval] ? statistics[interval].concat(1) : [1]
        }
      }
    } else {
      return {
        points: points - 1,
        //pressSuccess: false,
        //pressedIndex: guessedNote,
        //gamestate: 'showAnswer',
        statistics: {
          ...statistics,
          [interval]: statistics[interval] ? statistics[interval].concat(0) : [0]
        }
      }
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
          .then(() => { 
            sendIntervalData({
              userID: this.props.userID,
              baseNote: this.props.notes.baseNote,
              intervalNote: this.props.notes.targetNote,
              guessedNote: this.props.notes.guessedNote,
              timestamp: Date.now(),
              guessTime: Date.now() - this.props.lastPlayed,
            });
            // TODO: update lastPlayed
            const interval = Math.abs(targetNote - baseNote);
            let newStatistics;
            if (guessedNote === intervalNote) {
              newStatistics = {
                [interval]: statistics[interval] ? statistics[interval].concat(1) : [1]
              }
            } else {
              newStatistics = {
                [interval]: statistics[interval] ? statistics[interval].concat(0) : [0]
              }
            }
            return this.props.actions.updateStats({ newStatistics })
          })
          .then(() => {
            // automatically start next challenge after a delay
            window.setTimeout(() => {
              this.setState({ keyboardState: 'PLAY_SOUND' })
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
          pressedIndex={this.props.notes.guessedNote}
          pressSuccess={this.props.notes.guessedNote === this.props.notes.targetNote}
          handleKeyPress={this.handleKeyPress}
          showAnswer={this.state.keyboardState === 'SHOW_ANSWER'}
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