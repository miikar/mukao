import Sounds from './Sounds';

const getRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

class GameLogic {
  constructor(numNotes, intervals=[]) {
    this.numNotes = numNotes;
    this.state = 'waiting';
    this.intervals = intervals;
    this.answerTime = 2000;
    this.currentInterval = 24;
    this.targetInterval = 24;
    this.points = 0;
    this.highScore = 0;
    this.notes = this.getInitNotes();
    this.sounds = new Sounds(numNotes);
    console.log(this.notes);
  }

  getInitNotes = () => [this.getNewInterval()];

  start = async () => {
    this.state = 'started';
    await this.sounds.playNotes([24, this.notes], 1000);
    this.answerTimeout = setTimeout(this.continue, this.answerTime);
  }

  continue = () => {
    if (this.notes.length >= 3) {
      this.failedAnswer();
      return;
    }
    this.answerTime *= 0.99;
    const newInterval = this.getNewInterval(this.currentInterval);
    this.sounds.playNotes([newInterval]);
    this.notes.push(newInterval);
    this.answerTimeout = setTimeout(this.continue, this.answerTime);
  }

  handleAnswer = (interval) => {
    console.log(interval, this.currentInterval, this.notes, this.answerTime)

    if ((this.state === 'waiting' || this.state === 'showAnswer')) {
      if (interval === 24) {
        this.start();
        return true;
      }
      this.sounds.playNotes([interval])
      return false;
    }

    this.sounds.playNotes([interval])

    this.targetInterval = this.notes.shift();
    if (interval === this.targetInterval) {
      this.correctAnswer();
    } else {
      this.failedAnswer();
    }
    return interval === this.targetInterval;
  }

  correctAnswer = () => {
    this.points++;
  }

  failedAnswer = () => {
    clearTimeout(this.answerTimeout)
    this.state = 'showAnswer';
    this.highScore = Math.max(this.points, this.highScore);
    this.points = 0;
    this.currentInterval = 24;
    this.answerTime = 2000;
    this.notes = this.getInitNotes();
  }

  getNewInterval = () => {
    const baseNote = this.currentInterval;
    let direction = getRandom([-1, 1]);
    if (baseNote < 12) direction = 1;
    if (baseNote >= this.numNotes - 12) direction = -1;
    const noteDistance = getRandom(this.intervals) * direction;
    this.currentInterval = baseNote + noteDistance;

    return baseNote + noteDistance;
  }

  getLastNote = () => {
    if (this.notes && this.notes.length > 0) {
      return this.notes[this.notes.length - 1];
    }
    return Math.floor(Math.random() * this.numNotes);
  }
}

export default GameLogic;