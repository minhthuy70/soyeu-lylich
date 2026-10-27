import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FormWizard from './FormWizard';

const mockSteps = [
  {
    title: 'Step 1',
    label: 'Personal Info',
    component: ({ data, onChange }) => (
      <div>
        <input
          data-testid="name-input"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Name"
        />
      </div>
    ),
  },
  {
    title: 'Step 2',
    label: 'Contact Info',
    component: ({ data, onChange }) => (
      <div>
        <input
          data-testid="email-input"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Email"
        />
      </div>
    ),
  },
];

describe('FormWizard', () => {
  it('should render first step initially', () => {
    render(<FormWizard steps={mockSteps} onComplete={vi.fn()} />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
  });

  it('should navigate to next step when Next is clicked', () => {
    render(<FormWizard steps={mockSteps} onComplete={vi.fn()} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });

  it('should navigate to previous step when Previous is clicked', () => {
    render(<FormWizard steps={mockSteps} onComplete={vi.fn()} />);

    // Go to step 2
    fireEvent.click(screen.getByText('Next'));

    // Go back to step 1
    fireEvent.click(screen.getByText('Previous'));

    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('should call onComplete when wizard is finished', async () => {
    const onComplete = vi.fn();
    render(<FormWizard steps={mockSteps} onComplete={onComplete} />);

    // Fill step 1
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' },
    });

    // Go to step 2
    fireEvent.click(screen.getByText('Next'));

    // Fill step 2
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' },
    });

    // Complete
    fireEvent.click(screen.getByText('Complete'));

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  it('should show progress indicators', () => {
    render(<FormWizard steps={mockSteps} onComplete={vi.fn()} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should validate required fields before proceeding', () => {
    const stepsWithValidation = [
      {
        ...mockSteps[0],
        validate: (data) => data.name?.length > 0,
      },
      mockSteps[1],
    ];

    render(<FormWizard steps={stepsWithValidation} onComplete={vi.fn()} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should stay on step 1 due to validation
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });
});
