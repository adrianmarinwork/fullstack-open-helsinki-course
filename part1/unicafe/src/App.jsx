import { useState } from "react";

const Button = ({ text, onClick }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  if (!good && !neutral && !bad) {
    return <>No feedback given</>;
  }

  const positiveValue = `${(good * 100) / (good + neutral + bad)} %`;

  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="Total" value={good + neutral + bad} />
          <StatisticLine
            text="Average"
            value={(good * 1 + (bad * -1) / 3) / 10}
          />
          <StatisticLine text="Positive" value={positiveValue} />
        </tbody>
      </table>
    </>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodOnClick = function () {
    setGood(good + 1);
  };

  const neutralOnClick = function () {
    setNeutral(neutral + 1);
  };

  const badOnClick = function () {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={goodOnClick} />
      <Button text="neutral" onClick={neutralOnClick} />
      <Button text="bad" onClick={badOnClick} />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
