import React from 'react'

export const Statistics = ({ statistics }) => {
    return (
      <div className="statistics">
        { Object.keys(statistics).map((interval, i) => (
          <div className="statistic">
            <div>{interval}</div> 
            <div>{(getCorrectAnswers(statistics[interval]) / statistics[interval].length * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
    )
}
  
const getCorrectAnswers = (intervalStatistic) => intervalStatistic.reduce(
    (acc, answer) => {
        if (answer === 1) return acc + 1;
        return acc;
    }, 0
)