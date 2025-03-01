import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('changes tab name to TicTacToe React', () => {
  render(<App />);
  expect(document.title).toBe('TicTacToe React');
});
