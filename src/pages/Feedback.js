import React, { Component } from 'react';
import Header from '../components/Header';

export default class Feedback extends Component {
  render() {
    return (
      <div>
        <title
          data-testid="feedback-title"
        >
          Feedback

        </title>
        <Header />
        <p data-testid="feedback-text">
          Feedback text
        </p>
      </div>
    );
  }
}
