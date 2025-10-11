import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Statisticsline = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value} {props.unit}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  if (all === 0) {
    return <div>No feedback given</div>
  }
  return (
    <div>
      <table>
        <tbody>
          <Statisticsline text="good" value={props.good} />
          <Statisticsline text="neutral" value={props.neutral} />
          <Statisticsline text="bad" value={props.bad} />
          <Statisticsline text="all" value={all} />
          <Statisticsline text="average" value={((props.good * 1 + props.neutral * 0 + props.bad * (-1)) / all).toFixed(1)} />
          <Statisticsline text="positive" value={(props.good / all * 100).toFixed(1)} unit={"%"} />
        </tbody>
      </table>
    </div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = (newValue) => setGood(newValue)
  const handleNeutral = (newValue) => setNeutral(newValue)
  const handleBad = (newValue) => setBad(newValue)

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={() => handleGood(good + 1)} text="good" />
      <Button onClick={() => handleNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => handleBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App