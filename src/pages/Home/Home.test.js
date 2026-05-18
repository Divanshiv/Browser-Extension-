import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserProvider } from '../../context/browser-context';
import { Home } from './Home';

const renderHome = () => {
  return render(
    <BrowserProvider>
      <Home />
    </BrowserProvider>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the heading, input, and hint', () => {
    renderHome();
    expect(screen.getByText('Browser Extension')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your name')).toBeInTheDocument();
    expect(screen.getByText('Press Enter to continue')).toBeInTheDocument();
  });

  it('saves name to localStorage on form submit', () => {
    renderHome();
    const input = screen.getByLabelText('Enter your name');
    fireEvent.change(input, { target: { value: 'Divanshiv' } });

    const form = input.closest('form');
    fireEvent.submit(form);

    expect(localStorage.getItem('name')).toBe('Divanshiv');
  });

  it('trims whitespace from name', () => {
    renderHome();
    const input = screen.getByLabelText('Enter your name');
    fireEvent.change(input, { target: { value: '  User  ' } });

    const form = input.closest('form');
    fireEvent.submit(form);

    expect(localStorage.getItem('name')).toBe('User');
  });

  it('does not save if name is empty', () => {
    renderHome();
    const input = screen.getByLabelText('Enter your name');
    fireEvent.change(input, { target: { value: '   ' } });

    const form = input.closest('form');
    fireEvent.submit(form);

    expect(localStorage.getItem('name')).toBeNull();
  });

  it('renders footer', () => {
    renderHome();
    expect(screen.getByText(/Made by/)).toBeInTheDocument();
  });
});
