function FinishScreen({ points, maxPossiblePoints,highscore,dispatch }) {
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);
  
  let emoji="";
  if (percentage === 100) emoji = "🥇";
  else if (percentage >= 80 && percentage < 100) emoji = "🎉";
  else if (percentage >= 50 && percentage < 80) emoji = "😊";
  else if(percentage > 0 && percentage < 50) emoji = "🤦";
  
  return (
    <>
    <p className="result"><span>{emoji}</span>  You Scored <strong>{ points}</strong> out of {maxPossiblePoints} points ({percentage}%)</p>
      <p className="highscore"> Highscore:{ highscore} points</p>
    <button className="btn btn-ui" onClick={()=>dispatch({type:"restart"})}>Restart Quiz</button>
    </>
  )
}

export default FinishScreen
