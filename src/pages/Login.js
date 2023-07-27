import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../redux/reducers/user';

class Login extends Component {
  state = {
    name: '',
    email: '',
    token: '',
    disabled: true,
  };

  getValues = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, this.submitButton());
  };

  submitButton = () => {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  };

  onButtonClick = async () => {
    const { history, sendValues } = this.props;
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await response.json();
    const { token } = data;
    const { name, email } = this.state;
    sendValues(name, email);
    localStorage.setItem('token', token);
    this.setState({ token });
    history.push('/games');
  };

  render() {
    const { disabled, token } = this.state;
    console.log(token);
    return (
      <div>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="nome"
          name="name"
          id="name"
          onChange={ this.getValues }
          data-testid="input-player-name"
        />
        <input
          type="email"
          name="email"
          id="email"
          onChange={ this.getValues }
          placeholder="email"
          data-testid="input-gravatar-email"
        />
        <button
          type="button"
          disabled={ disabled }
          data-testid="btn-play"
          onClick={ this.onButtonClick }
        >
          Play
        </button>
        <Link to="/settings">
          <button
            type="button"
            data-testid="btn-settings"
          >
            Settings
          </button>
        </Link>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

const mapDispatchToProps = (dispatch) => ({
  sendValues: (name, email) => dispatch(login({ name, email })),
});

export default connect(null, mapDispatchToProps)(Login);
