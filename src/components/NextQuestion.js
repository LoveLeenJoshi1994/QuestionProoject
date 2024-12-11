function NextQuestion({ dispatch, answer,index,numQuestions }) {
  if (answer === null) return;
  
  if(index<numQuestions-1)
  return (
    
    <button className="btn btn-ui"
      onClick={() => dispatch({ type: "NextQuestion" })}>Next</button>
  )
  return (
    
    <button className="btn btn-ui"
    onClick={() => dispatch({ type: "finish" })}>Finish</button>
)
}

export default NextQuestion
