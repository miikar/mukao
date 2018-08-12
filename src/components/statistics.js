import React from 'react'
import { connect } from "react-redux"

const Statistics = ({statistics}) => {
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

const mapStateToProps = state => {
  return { statistics: state.statistics }
}

const StatisticsContainer = connect(
  mapStateToProps
)(Statistics)

export default StatisticsContainer;