import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';

describe('Landing Page', () => {
  it('renders the form', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/Paste your long URL/i)).toBeInTheDocument();
    expect(screen.getByText(/Shorten/)).toBeInTheDocument();
  });

  it('shows error on invalid url', async () => {
    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText(/Paste your long URL/i), { target: { value: 'bad' } });
    fireEvent.click(screen.getByText(/Shorten/));
    await waitFor(() => {
      expect(screen.getByText(/Failed to shorten link/i)).toBeInTheDocument();
    });
  });
}); 