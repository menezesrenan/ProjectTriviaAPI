import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchQuestions } from '../redux/reducers/game';
import { updateScore } from '../redux/reducers/player';

class TriviaGame extends Component {
  state = {
    selectedAnswer: null,
    shuffledAnswers: [],
    time: 30,
  };

  async componentDidMount() {
    console.log(this.props);
    const { fetchTrivia, logoutFunc } = this.props;
    await fetchTrivia().catch((e) => {
      console.log(e);
      logoutFunc();
    });
    this.shuffleAnswers();

    const second = 1000;
    setInterval(() => {
      const { time, selectedAnswer } = this.state;
      if (time - 1 <= 0) {
        this.setState({
          selectedAnswer: -1,
        });
      }
      if (selectedAnswer === null) {
        this.setState({
          time: Math.max(0, time - 1),
        });
      }
    }, second);
  }

  nextQuestion = async () => {
    const maxQuestionsIndex = 4;
    const { currentQuestion } = this.props;
    if (currentQuestion >= maxQuestionsIndex) {
      const { onFinish } = this.props;
      onFinish();
      return;
    }

    const { nextQuestion } = this.props;
    await nextQuestion();
    this.setState({
      selectedAnswer: null,
    }, this.shuffleAnswers());
  };

  shuffleAnswers = () => {
    const { questions, currentQuestion } = this.props;
    const half = 0.5;
    const shuffledAnswers = questions.length
      ? [questions[currentQuestion].correct_answer,
        ...questions[currentQuestion].incorrect_answers]
        .sort(() => Math.random() - half)
      : [];
    this.setState({
      shuffledAnswers,
    });
  };

  selectAnswer = (index) => {
    const { questions, currentQuestion, score, updatePlayerScore } = this.props;
    const { selectedAnswer, shuffledAnswers, time } = this.state;
    if (selectedAnswer !== null) return;
    this.setState({
      selectedAnswer: index,
    });
    const table = {
      easy: 1,
      medium: 2,
      hard: 3,
    };
    if (shuffledAnswers[index] === questions[currentQuestion].correct_answer) {
      const ten = 10;
      updatePlayerScore(score + (ten
        + time * table[questions[currentQuestion].difficulty]));
    }
  };

  render() {
    const { questions, currentQuestion } = this.props;
    const { selectedAnswer, shuffledAnswers, time } = this.state;

    if (!shuffledAnswers.length) this.shuffleAnswers();

    return (
      <div>
        <h1>{time}</h1>
        { questions.length && (
          <div>
            <h3 data-testid="question-category">
              { questions[currentQuestion].category }
            </h3>
            <p data-testid="question-text">
              { questions[currentQuestion].question}
            </p>
            <div data-testid="answer-options" style={ { display: 'flex' } }>
              {
                shuffledAnswers.map((answer, i) => (
                  <button
                    key={ answer }
                    type="button"
                    disabled={ selectedAnswer !== null }
                    style={ selectedAnswer !== null ? {
                      border: answer === questions[currentQuestion].correct_answer
                        ? '3px solid rgb(6, 240, 15)' : '3px solid red',
                    } : null }
                    onClick={ () => this.selectAnswer(i) }
                    data-testid={ answer === questions[currentQuestion].correct_answer
                      ? 'correct-answer' : `wrong-answer-${i}` }
                  >
                    {answer}
                  </button>
                ))
              }
            </div>
          </div>
        )}
        {
          (selectedAnswer !== null) && (
            <button type="button" data-testid="btn-next" onClick={ this.nextQuestion }>
              Next
            </button>
          )
        }
      </div>
    );
  }
}

TriviaGame.propTypes = {
  fetchTrivia: PropTypes.func.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  logoutFunc: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
  updatePlayerScore: PropTypes.func.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    question: PropTypes.string,
    difficulty: PropTypes.string,
    correct_answer: PropTypes.string,
    incorrect_answers: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  fetchTrivia: () => dispatch(fetchQuestions()),
  updatePlayerScore: (amount) => dispatch(updateScore(amount)),
  nextQuestion: () => dispatch({ type: 'NEXT_QUESTION' }),
});

const mapStateToProps = (state) => ({
  questions: state.game.questions,
  currentQuestion: state.game.currentQuestion,
  score: state.player.score,
});

export default connect(mapStateToProps, mapDispatchToProps)(TriviaGame);
