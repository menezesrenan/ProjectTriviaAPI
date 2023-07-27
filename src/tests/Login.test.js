import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App'
import { onButtonClick } from './mocks/submitButton';

const API = {
  response_code: 0,
  response_message: "Token Generated Successfully!",
  token: "f00cb469ce38726ee00a7c6836761b0a4fb808181a125dcde6d50a9f3c9127b6"
}

describe('Testa a pagina de login', () => {
    it('Se a rota é "/"', () => {
      const { history } = renderWithRouterAndRedux(<App />);
      const { pathname } = history.location;

      expect(pathname).toBe('/');
    });

    it('Testa se os componentes aparece na tela', () => {
        renderWithRouterAndRedux(<App />)
        const heading = screen.getByRole('heading', {
          name: /login/i
        })
        const inputName = screen.getByTestId('input-player-name')
        const inputEmail = screen.getByTestId('input-gravatar-email')
        const btnPlay = screen.getByRole('button', { name: /play/i })
        const btnSettings = screen.getByRole('button', { name: /settings/i })

        expect(heading).toBeInTheDocument();
        expect(inputName).toBeInTheDocument();
        expect(inputEmail).toBeInTheDocument();
        expect(btnPlay).toBeInTheDocument();
        expect(btnSettings).toBeInTheDocument();
    })
    
    it('Testa a interação dos elementos', async () => {
      renderWithRouterAndRedux(<App />)
      const inputName = screen.getByTestId('input-player-name')
      const inputEmail = screen.getByTestId('input-gravatar-email')
      const btnPlay = screen.getByRole('button', { name: /play/i })
      
      userEvent.type(inputName, 'Reges')
      userEvent.type(inputEmail, 'test@test.com')
      
      expect(inputName).toHaveValue('Reges')
      expect(inputEmail).toHaveValue('test@test.com')
      
      expect(btnPlay).toBeEnabled();
    })

    it('testa se ao clicar no botão acontece uma requisição', () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(API),
      });
      renderWithRouterAndRedux(<App />)

      const btnPlay = screen.getByRole('button', { name: /Play/i })
      const inputName = screen.getByTestId('input-player-name')
      const inputEmail = screen.getByTestId('input-gravatar-email')
      
      userEvent.type(inputName, 'Reges')
      userEvent.type(inputEmail, 'test@test.com')
      userEvent.click(btnPlay)
      
      // jest.spyOn(global, 'fetch');
      // global.fetch.mockResolvedValue({
      //   json: jest.fn().mockResolvedValue(onButtonClick()),
      // });

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toBeCalledWith('https://opentdb.com/api_token.php?command=request')
    })

    it('Testa se ao clicar em setting é redirecionado', () => {
      const { history } = renderWithRouterAndRedux(<App />)
      const btnSettings = screen.getByRole('button', { name: /settings/i })

      userEvent.click(btnSettings)

      expect(history.location.pathname).toBe('/settings')
    })
})