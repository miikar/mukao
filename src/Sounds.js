import {Howl} from 'howler';


class Sounds {
  constructor(numNotes = 49, ready) {
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

    this.notes.once('load', ready);
  }

  playNotes = async (notes=[], duration=700) => {
    for (const note of notes) {
      await this.playSound(note, duration);
    };
  }

  playSound = (index, duration) => new Promise(
    (resolve) => {
      this.notes.play('' + index);
      window.setTimeout(resolve, duration);
    }
  );

}

export default Sounds;