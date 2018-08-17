import React, { Component } from 'react';


class Keyboard extends Component{
    keyboard = React.createRef();

    componentDidUpdate({baseNote: prevBasenote}) {
        const { baseNote } = this.props;
        if (baseNote !== prevBasenote) {

            const baseNoteKey = this.keyboard ? this.keyboard.current.children[baseNote] : 0;
            baseNoteKey.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            })
        }
    }

    render() {
        const { numNotes, baseNote, handleKeyPress, pressedIndex, pressSuccess, answerNote } = this.props;
        const keys = [];
        for (let i = 0; i < numNotes; i++) {
            keys.push(
                <Key 
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
                <div className="keyboard-container" ref={this.keyboard}>
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
        className={'note' +
            (isBasenote ? ' isBasenote' : '') +
            (isBlack ? ' black' : '') +
            (pressSuccess && pressedIndex === index ? ' success' : '') +
            (!pressSuccess && pressedIndex === index ? ' failure' : '') +
            ((answerNote === index && !pressSuccess) ? ' answer' : '')
        } 
        onClick={handleKeyPress(index)}>
        </div>
    )
}

export default Keyboard;