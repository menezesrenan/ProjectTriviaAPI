const INITIAL_STATE = {
  score: 0,
};

function Player(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'UPDATE_SCORE':
    return { ...state, score: action.payload };
  default:
    return state;
  }
}

export const updateScore = (payload) => ({
  type: 'UPDATE_SCORE',
  payload,
});

export default Player;
