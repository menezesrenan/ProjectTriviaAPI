const INITIAL_STATE = {
  email: '',
  name: '',
};

function User(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'ACTION_LOGIN':
    return { ...action.payload };
  case 'ACTION_LOGOUT':
    return INITIAL_STATE;
  default:
    return state;
  }
}

export const login = (payload) => ({
  type: 'ACTION_LOGIN',
  payload: { ...payload },
});

export const logout = () => ({
  type: 'ACTION_LOGOUT',
});

export default User;
