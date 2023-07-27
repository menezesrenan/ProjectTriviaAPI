import { logout } from './user';

const INITIAL_STATE = {
  currentQuestion: 0,
  questions: [],
};

function Game(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'NEW_QUESTIONS':
    return { ...action.payload };
  case 'NEXT_QUESTION':
    return { ...state, currentQuestion: state.currentQuestion + 1 };
  default:
    return state;
  }
}

export const questionsLoaded = (payload) => ({
  type: 'NEW_QUESTIONS',
  payload: {
    questions: payload,
    currentQuestion: 0,
    score: 0,
  },
});

export const fetchQuestions = (amount = '5') => async (dispatch) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`https://opentdb.com/api.php?amount=${amount}&token=${token}`);
  const data = await res.json();
  const errorResponse = 3;
  if (data.response_code === errorResponse) {
    dispatch(logout());
    throw new Error('Token Invalid');
  } else { dispatch(questionsLoaded(data.results)); }
};

export default Game;
