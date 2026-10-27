import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProfilePage from './ProfilePage';

const authServiceMocks = vi.hoisted(() => ({
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  deleteAccount: vi.fn(),
  logoutUser: vi.fn(),
}));

vi.mock('../services/authService', () => authServiceMocks);
vi.mock('./Dashboard', () => ({
  Dashboard: () => <div>Dashboard content</div>,
}));
vi.mock('./Education', () => ({
  default: () => <div>Education content</div>,
}));

describe('ProfilePage viewport rendering', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    authServiceMocks.getProfile.mockResolvedValue({
      user: { id: 'user-1', email: 'user@example.com' },
      profile: {},
    });
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.dispatchEvent(new Event('resize'));
  });

  it.each([375, 768, 1440])('renders the profile navigation at %i pixels', async (width) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));

    render(<ProfilePage onLogout={vi.fn()} />);

    expect(await screen.findByText('Dashboard content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tổng quan/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng xuất/i })).toBeInTheDocument();
  });
});
