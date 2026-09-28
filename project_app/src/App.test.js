import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the PlacementHub brand', () => {
  render(<App />);
  expect(screen.getByText(/PlacementHub/i)).toBeInTheDocument();
});
