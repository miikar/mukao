import React from 'react'

export const Key = ({index, isBasenote, isTargetNote, handleKeyPress, pressedIndex, pressSuccess}) => {
    const isBlack = [1, 3, 6, 8, 10].includes(index % 12);
    
    return (
      <div 
        className={'note' +
          (isBasenote ? ' isBasenote' : '') +
          (isBlack ? ' black' : '') +
          (pressSuccess && pressedIndex === index ? ' success' : '') +
          (!pressSuccess && pressedIndex === index ? ' failure' : '') +
          ((isTargetNote && !pressSuccess) ? ' answer' : '')
        } 
        onClick={handleKeyPress(index)}>
      </div>
    )
}