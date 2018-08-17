import React from 'react';

const getCorrectAnswers = (intervalStatistic=[]) => intervalStatistic.reduce(
  (acc, answer) => {
    if (answer === 1) return acc + 1;
    return acc;
  }, 0
)

const Statistics = ({ statistics }) => {
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
  


// getLowestAccuracy = (statistics={}) => {
//   const playedIntervals = Object.keys(statistics);

//   // Get lowest accuracy only when all intervals have been played
//   if (playedIntervals.length < intervals.length) return getRandom(intervals);

//   return playedIntervals.reduce((lowest, interval) => {
//     if (getCorrectAnswers(statistics[interval]) < getCorrectAnswers(statistics[lowest])) {
//       console.log('lowest', interval)
//       return interval;
//     }
//     return lowest;
//   }, 1
// )};

export default Statistics;