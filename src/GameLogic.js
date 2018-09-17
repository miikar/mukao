import Sounds from './Sounds';
import Statistics from './Statistics';

const UserStatistics = new Statistics();

const getRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}



class GameLogic {
  constructor(numNotes, intervals=[], scale) {
    this.numNotes = numNotes;
    this.state = 'waiting';
    this.intervals = intervals;
    this.scale = scale;
    this.answerTime = 2000;
    this.previousInterval = 24;
    this.currentInterval = 24;
    this.currentStep = 0
    this.didGuess = false;
    this.points = 0;
    this.highScore = 0;
    this.sounds = new Sounds(numNotes);
    console.log(this.notes);
  }

  start = async () => {
    this.state = 'started';
    this.didGuess = false;
    this.currentInterval = this.getNewInterval(this.currentInterval);
    await this.selectAndPlayChord();
    await this.sounds.playNotes([24, this.currentInterval], 1000);
    this.answerTimeout = setTimeout(this.continue, this.answerTime);
  }

  continue = async () => {
    if (!this.didGuess) {
      this.failedAnswer();
      return;
    }
    const newInterval = this.getNewInterval(this.currentInterval);
    await this.selectAndPlayChord();
    this.sounds.playNotes([newInterval]);
    this.answerTimeout = setTimeout(this.continue, this.answerTime);
    this.didGuess = false;
  }

  selectAndPlayChord = async () => {
    let chordBaseNote = getRandom(this.intervals);
    const isBlack = [1, 3, 6, 8, 10].includes(chordBaseNote % 12);
    if (isBlack) chordBaseNote = chordBaseNote + 1;
    const chordNotes = [chordBaseNote];
    for (let i = 1; i<3; i++) {
      const previousNote = chordNotes[i-1];
      let nextNote = previousNote + 3;
      const isBlack = [1, 3, 6, 8, 10].includes(nextNote % 12);
      if (isBlack) nextNote = nextNote + 1;
      chordNotes.push(nextNote);
    }
    console.log(chordNotes)
    chordNotes.forEach(n => {
      this.sounds.playNotes([n])
    });
  }

  handleAnswer = (interval) => {
    // console.log(interval, this.previousInterval, this.currentInterval, this.answerTime)
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
    this.currentStep = 0;
    this.answerTime = 2000;
  }

  getNewInterval = () => {
    const baseNote = this.currentInterval;
    let direction = getRandom([-1, 1]);
    if (baseNote < 24) direction = 1;
    if (baseNote >= this.numNotes - 12) direction = -1;

    const interval = getRandom(this.intervals) * direction;
    let newInterval = baseNote + interval;
    const isBlack = [1, 3, 6, 8, 10].includes(newInterval % 12);
    if (isBlack) newInterval = newInterval + 1;

    // const stepAmount = getRandom([1,2,3,4,5,6,7])

    // let targetNote = baseNote;
    // let tempStep = 0;
    // if (direction === 1) {
    //   for(let i = 0; i < stepAmount; i++) {
    //     tempStep = (i + this.currentStep) % this.scale.steps.length;
    //     targetNote += this.scale.steps[tempStep]
    //     console.log(this.currentStep, tempStep, stepAmount, targetNote)
    //   }
    // } else {
    //   for(let i = 1; i < stepAmount + 1; i++) {
    //     tempStep = (this.currentStep - i) % this.scale.steps.length;
    //     if (tempStep < 0){
    //       tempStep = this.scale.steps.length - 1;
    //       this.currentStep = tempStep;
    //     }
    //     targetNote -= this.scale.steps[tempStep]
    //     console.log(tempStep, stepAmount, targetNote)
    //   }
    // }
    // this.currentStep = tempStep;
    // console.log({baseNote}, {targetNote}, this.currentStep);
    this.currentInterval = newInterval;
    this.previousInterval = baseNote;

    return this.currentInterval;
  }
}

export default GameLogic;