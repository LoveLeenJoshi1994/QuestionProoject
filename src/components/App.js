import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from './Error';
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SEC_PER_Question = 30;
const initialState = {
  questions: [],
  //loading  error  active  ready  finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining:null
}
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status:"ready"
      }
    case "dataFailed":
      return {
        ...state,
        status:"error"
      }
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_Question
      }
    case "newAnswer":
      const curQuestion=state.questions.at(state.index)
      return {
        ...state,
        answer: action.payload,
        points:action.payload===curQuestion.correctOption?state.points+curQuestion.points:state.points
      }
    case "NextQuestion":
      return{...state,index:state.index+1,answer:null}
      
    case "finish":
      return { ...state, status: "finished" ,highscore:state.points>state.highscore?state.points:state.highscore}
    
    case "restart":
      return{...initialState,status:"ready",questions:state.questions}
    case "tick":
      return{...state,secondsRemaining:state.secondsRemaining-1,status:state.secondsRemaining===0?"finished":state.status}
    
    default:
      throw new Error("Unknown Action")
  }
}
export default function App() {
  const [{questions,status,index,answer,points,highscore,secondsRemaining}, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints=questions.reduce((prev,cur)=>prev+cur.points,0)
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then(res => res.json())
      .then(data => dispatch({ type: "dataReceived", payload: data }))
    .catch((err)=>dispatch({type:"dataFailed"}))
  },[])
  return (
    <div className="app">
      <Header />
      <Main>
        {status==="loading" && <Loader/>}
        {status==="error" && <Error/>}
        {status ==="ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch } />}
        {status === "active" &&
          <>
          <Progress answer={answer} index={index} numQuestions={numQuestions} points={ points} maxPossiblePoints={maxPossiblePoints} />
          <Question question={questions.at(index)} answer={answer} dispatch={dispatch} />
          
          <Footer>
            <Timer dispatch={dispatch } secondsRemaining={ secondsRemaining} />
          <NextQuestion index={index} numQuestions={numQuestions} dispatch={dispatch} answer={answer} />
          </Footer>
          </>
        }
        {status === "finished" && <FinishScreen dispatch={dispatch} highscore={highscore } points={ points} maxPossiblePoints={maxPossiblePoints} />}
        </Main>
    </div>
  )
}