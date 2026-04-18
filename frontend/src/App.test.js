import { render, screen } from '@testing-library/react';
import App from './App';

test('renders facilities and assets heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /facilities & assets catalogue/i });
  expect(headingElement).toBeInTheDocument();
});
