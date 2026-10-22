import { render, screen } from '@testing-library/react';
import ProfilePage from '../ProfilePage';

describe('Responsive Design', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.dispatchEvent(new Event('resize'));
  });

  it('should render correctly on mobile (< 768px)', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    const container = screen.getByRole('main');
    expect(container).toHaveClass('mobile-layout');
  });

  it('should render correctly on tablet (768px - 1024px)', () => {
    window.innerWidth = 768;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    const container = screen.getByRole('main');
    expect(container).toHaveClass('tablet-layout');
  });

  it('should render correctly on desktop (> 1024px)', () => {
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    const container = screen.getByRole('main');
    expect(container).toHaveClass('desktop-layout');
  });

  it('should show hamburger menu on mobile', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('should show full navigation on desktop', () => {
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should stack columns on mobile', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    const formContainer = screen.getByTestId('form-container');
    expect(formContainer).toHaveStyle({ flexDirection: 'column' });
  });

  it('should use grid layout on desktop', () => {
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    const formContainer = screen.getByTestId('form-container');
    expect(formContainer).toHaveStyle({ display: 'grid' });
  });

  it('should adjust font sizes based on viewport', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));

    const { rerender } = render(<ProfilePage />);

    let heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveStyle({ fontSize: '1.5rem' });

    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));
    rerender(<ProfilePage />);

    heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveStyle({ fontSize: '2.5rem' });
  });

  it('should show sidebar on desktop, hide on mobile', () => {
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));

    const { rerender } = render(<ProfilePage />);

    expect(screen.getByTestId('sidebar')).toBeVisible();

    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    rerender(<ProfilePage />);

    expect(screen.getByTestId('sidebar')).not.toBeVisible();
  });

  it('should handle orientation change', () => {
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));

    const { rerender } = render(<ProfilePage />);

    // Portrait
    expect(screen.getByTestId('content-area')).toHaveStyle({ height: '100vh' });

    // Landscape
    window.innerWidth = 667;
    window.innerHeight = 375;
    window.dispatchEvent(new Event('resize'));
    rerender(<ProfilePage />);

    expect(screen.getByTestId('content-area')).toHaveStyle({ height: '100vh' });
  });

  it('should support touch gestures on mobile', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage />);

    const touchableElement = screen.getByTestId('touchable-element');
    expect(touchableElement).toHaveAttribute('touch-action', 'manipulation');
  });
});
