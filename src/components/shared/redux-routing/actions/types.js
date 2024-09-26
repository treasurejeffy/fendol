// actions.js
export const loginSuccess = (token) => ({
  type: 'LOGIN_USER',
  payload: token,
});

export const logout = () => ({
  type: 'LOGOUT_USER',
});
