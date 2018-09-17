import Sounds from './Sounds';
import Statistics from './Statistics';

const UserStatistics = new Statistics();

const getRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}



class GameLogic {
  constructor(numNotes, intervals=[]) {
    this.numNotes = numNotes;
    this.state = 'waiting';
    this.intervals = intervals;
    this.answerTime = 2000;
    this.previousInterval = 24;
    this.currentInterval = 24;
    this.didGuess = false;
    this.points = 0;
    this.highScore = 0;
    this.sounds = new Sounds(numNotes);
    console.log(this.notes);
  }

  start = async () => {
    this.state = 'started';
    this.currentInterval = this.getNewInterval(this.currentInterval);
    await this.sounds.playNotes([24, this.currentInterval], 1000);
    this.answerTimeout = setTimeout(this.continue, this.answerTime);
  }

  continue = () => {
    if (!this.didGuess) {
      this.failedAnswer();
      return;
    }
    const newInterval = this.getNewInterval(this.currentInterval);
    this.sounds.playNotes([newInterval]);
    this.answerTimeout = setTimeout(this.continue, this.answerTime);
    this.didGuess = false;
  }

  handleAnswer = (interval) => {
    console.log(interval, this.previousInterval, this.currentInterval, this.answerTime)
    this.didGuess = true;
    if ((this.state === 'waiting' || this.state === 'showAnswer')) {
      if (interval === 24) {
        this.start();
        return true;
      }
      this.sounds.playNotes([interval])
      return false;
    }

    this.sounds.playNotes([interval])

    UserStatistics.update(this.previousInterval, this.currentInterval, interval)

    if (interval === this.currentInterval) {
      this.correctAnswer();
    } else {
      this.failedAnswer();
    }
    return interval === this.currentInterval;
  }

  correctAnswer = () => {
    this.points++;
  }

  failedAnswer = () => {
    clearTimeout(this.answerTimeout)
    this.state = 'showAnswer';
    this.answerNote = this.currentInterval;
    this.answerInterval = this.currentInterval - this.previousInterval;
    this.highScore = Math.max(this.points, this.highScore);
    this.points = 0;
    this.previousInterval = 24;
    this.currentInterval = 24;
    this.answerTime = 2000;
  }

  getNewInterval = () => {
    const baseNote = this.currentInterval;
    let direction = getRandom([-1, 1]);
    if (baseNote < 12) direction = 1;
    if (baseNote >= this.numNotes - 12) direction = -1;
    const noteDistance = getRandom(this.intervals) * direction;
    this.currentInterval = baseNote + noteDistance;
    this.previousInterval = baseNote;

    return baseNote + noteDistance;
  }
}

export default GameLogic;