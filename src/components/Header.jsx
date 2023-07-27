import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MD5 } from 'crypto-js';

class Header extends Component {
  render() {
    const { name, email, score } = this.props;
    return (
      <header>
        <h3 data-testid="header-player-name">{name}</h3>
        <h3 data-testid="header-score">{score}</h3>
        <img src={ `https://www.gravatar.com/avatar/${MD5(email)}` } data-testid="header-profile-picture" alt="avatar" />
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.user.name,
  email: state.user.email,
  score: state.player.score,
});

Header.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, null)(Header);
