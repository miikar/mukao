import React from 'react'

export const Key = ({index, isBasenote, isTargetNote, handleKeyPress, pressedIndex, pressSuccess, showAnswer}) => {
    const isBlack = [1, 3, 6, 8, 10].includes(index % 12);
    
    return (
      <div 
        className={'note' +
          (isBasenote ? ' isBasenote' : '') +
          (isBlack ? ' black' : '') +
          (pressSuccess && pressedIndex === index ? ' success' : '') +
          (!pressSuccess && pressedIndex === index ? ' failure' : '') +
          ((isTargetNote && showAnswer) ? ' answer' : '')
        } 
        onClick={handleKeyPress(index)}>
      </div>
    )
}