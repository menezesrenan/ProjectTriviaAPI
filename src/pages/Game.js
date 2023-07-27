import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import TriviaGame from '../components/TriviaGame';
import { logout } from '../redux/reducers/user';

class Game extends Component {
  tokenExpired = () => {
    const { dispatchLogout, history } = this.props;
    dispatchLogout();
    history.push('/');
  };

  finished = () => {
    const { history } = this.props;
    history.push('/feedback');
  };

  render() {
    return (
      <div>
        <Header />
        <TriviaGame logoutFunc={ this.tokenExpired } onFinish={ this.finished } />
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

const mapDispatchToProps = (dispatch) => ({
  dispatchLogout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(Game);
