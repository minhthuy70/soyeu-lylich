import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authServiceMocks.getProfile.mockResolvedValue({
      user: { id: 'user-1', email: 'user@example.com' },
      profile: {},
    });
    authServiceMocks.logoutUser.mockResolvedValue(undefined);
  });

  it('loads the profile shell and its default dashboard', async () => {
    render(<ProfilePage onLogout={vi.fn()} />);

    expect(await screen.findByText('Dashboard content')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hệ thống Sơ yếu lý lịch' })).toBeInTheDocument();
    expect(authServiceMocks.getProfile).toHaveBeenCalledOnce();
  });

  it('updates the active section when a navigation item is selected', async () => {
    render(<ProfilePage onLogout={vi.fn()} />);

    const educationButton = await screen.findByRole('button', { name: /học vấn/i });
    fireEvent.click(educationButton);

    expect(educationButton).toHaveClass('active');
  });

  it('logs out and notifies the parent', async () => {
    const onLogout = vi.fn();
    render(<ProfilePage onLogout={onLogout} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Đăng xuất' }));

    await waitFor(() => {
      expect(authServiceMocks.logoutUser).toHaveBeenCalledOnce();
      expect(onLogout).toHaveBeenCalledOnce();
    });
  });
});
