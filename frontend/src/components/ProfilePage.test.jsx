import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../ProfilePage';

describe('Form Validation', () => {
  it('should validate required fields', () => {
    render(<ProfilePage />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Should show validation errors for required fields
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it('should validate email format', () => {
    render(<ProfilePage />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('should validate phone number format', () => {
    render(<ProfilePage />);

    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.change(phoneInput, { target: { value: '123' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText(/invalid phone/i)).toBeInTheDocument();
  });

  it('should validate URL format', () => {
    render(<ProfilePage />);

    const websiteInput = screen.getByLabelText(/website/i);
    fireEvent.change(websiteInput, { target: { value: 'not-a-url' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText(/invalid url/i)).toBeInTheDocument();
  });

  it('should validate password strength', () => {
    render(<ProfilePage />);

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('should show inline validation errors', () => {
    render(<ProfilePage />);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  it('should clear validation errors on valid input', () => {
    render(<ProfilePage />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.blur(emailInput);

    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });

  it('should prevent form submission with invalid data', () => {
    const mockSubmit = jest.fn();
    render(<ProfilePage onSubmit={mockSubmit} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should allow form submission with valid data', () => {
    const mockSubmit = jest.fn();
    render(<ProfilePage onSubmit={mockSubmit} />);

    // Fill all required fields with valid data
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '+1234567890' },
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockSubmit).toHaveBeenCalled();
  });
});
