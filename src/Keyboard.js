import React, { Component } from 'react';
import initMidihandler from './midihandler';

class Keyboard extends Component{
    keyboard = React.createRef();

    componentDidMount() {
        initMidihandler(this.props.handleKeyPress);

        // Register event handlers
        this.keyboard.current.addEventListener("touchstart", this.props.handleTouch, false);
        this.keyboard.current.addEventListener("touchmove", this.props.handleTouch, false);
        this.keyboard.current.addEventListener("touchend", this.props.handleTouch, false);

    }

    componentDidUpdate({baseNote: prevBasenote}) {
        const { baseNote, intervalNote } = this.props;
        if (baseNote !== prevBasenote) {

            const baseNoteKey = this.keyboard ? this.keyboard.current.children[baseNote] : 0;
            baseNoteKey.scrollIntoView({
                behavior: 'smooth',
                inline: baseNote > intervalNote ? 'end': 'start',
                block: baseNote > intervalNote ? 'end': 'start',
            })
        }
    }

    render() {
        const { numNotes, baseNote, handleTouch, handleKeyPress, pressedIndex, pressSuccess, answerNote } = this.props;
        const keys = [];
        for (let i = 0; i < numNotes; i++) {
            keys.push(
                <Key 
                    // handleTouch={handleTouch}
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
            <div className="keyboard-scroll-container" ref={this.scrollContainer}>
                <div className="keyboard-container" ref={this.keyboard}
                    // onTouchStart={handleTouch}
                    // onTouchMove={handleTouch}
                    // onTouchEnd={handleTouch}
                    >
                    {keys}
                </div>
            </div>
        );
    }
}

const Key = ({index, isBasenote, handleKeyPress, pressedIndex, pressSuccess, answerNote}) => {
    const isBlack = [1, 3, 6, 8, 10].includes(index % 12);
    return (
        <div 
        id={index}
        className={'note' +
            (isBasenote ? ' isBasenote' : '') +
            (isBlack ? ' black' : '') +
            (pressSuccess && pressedIndex === index ? ' success' : '') +
            (!pressSuccess && pressedIndex === index ? ' failure' : '') +
            ((answerNote === index && !pressSuccess) ? ' answer' : '')
        } 
        // onMouseOver={() => console.log(index)}
        // onTouchStart={handleTouch(index)}
        // onTouchEnd={handleTouch(index)}
        // onTouchMove={handleTouch(index)}
        onClick={handleKeyPress(index)}
        >
        </div>
    )
}

export default Keyboard;