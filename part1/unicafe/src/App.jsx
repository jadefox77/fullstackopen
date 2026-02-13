import { useState } from 'react'

const Statistics = ({ good, neutral, bad, total, average, percentage }) => {
  if (total === 0) {
    return <p>No feedback given</p>
  }
  return (
    <div>
      <StatisticsLine text='good' value={good} />
      <StatisticsLine text='neutral' value={neutral} />
      <StatisticsLine text='bad' value={bad} />
      <StatisticsLine text='total' value={total} />
      <StatisticsLine text='average' value={average} />
      <StatisticsLine text='positive' value={percentage} />
    </div>
  )
}

const StatisticsLine = ({text, value}) => {
 return (
 <table>
  <tbody>
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
  </tbody>
 </table>
)
}

const Button = (props) => {
  return (
  <button onClick={props.onClick}>
    {props.text}
  </button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
 
  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const percentage = total === 0 ? 0 : good / total * 100 

  const handlegoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    
  }
  const handleneutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    
  }

  const handlebadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={handlegoodClick} text="good" />
      <Button onClick={handleneutralClick} text='neutral' />
      <Button onClick={handlebadClick} text='bad' />


      <h1>statistics</h1>
      <Statistics 
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        percentage={percentage} />
        

    </div>
  )
}

export default App
