import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UIPreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPreferences(userId: number) {
    // In production, store in a user_preferences table
    return {
      userId,
      theme: {
        mode: 'light', // 'light' or 'dark'
        highContrast: false,
      },
      colors: {
        primary: '#007bff',
        accent: '#007bff',
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 'medium', // 'small', 'medium', 'large'
      },
      layout: {
        sidebarPosition: 'left', // 'left', 'right', 'full-width', 'centered'
        contentWidth: 'normal', // 'narrow', 'normal', 'wide', 'full'
        sidebarWidth: 240, // in pixels
      },
      spacing: {
        spacing: 'medium', // 'small', 'medium', 'large'
        borderRadius: 'medium', // 'small', 'medium', 'large'
      },
      animations: {
        enabled: true,
      },
    };
  }

  async updateUserPreferences(userId: number, preferences: any) {
    // In production, store in a user_preferences table
    return {
      message: 'Đã cập nhật preferences giao diện',
      preferences: {
        ...preferences,
        userId,
        updatedAt: new Date(),
      },
    };
  }

  async resetToDefaults(userId: number) {
    const defaultPreferences = {
      theme: {
        mode: 'light',
        highContrast: false,
      },
      colors: {
        primary: '#007bff',
        accent: '#007bff',
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 'medium',
      },
      layout: {
        sidebarPosition: 'left',
        contentWidth: 'normal',
        sidebarWidth: 240,
      },
      spacing: {
        spacing: 'medium',
        borderRadius: 'medium',
      },
      animations: {
        enabled: true,
      },
    };

    return {
      message: 'Đã đặt lại giao diện mặc định',
      preferences: {
        ...defaultPreferences,
        userId,
        updatedAt: new Date(),
      },
    };
  }

  async getAvailableThemes() {
    return {
      themes: [
        {
          id: 'light',
          name: 'Light',
          description: 'Theme sáng',
          preview: '#ffffff',
        },
        {
          id: 'dark',
          name: 'Dark',
          description: 'Theme tối',
          preview: '#1a1a1a',
        },
        {
          id: 'high-contrast',
          name: 'High Contrast',
          description: 'Tương phản cao',
          preview: '#000000',
        },
      ],
    };
  }

  async getAvailableColors() {
    return {
      colors: [
        { id: '#007bff', name: 'Blue', preview: '#007bff' },
        { id: '#28a745', name: 'Green', preview: '#28a745' },
        { id: '#dc3545', name: 'Red', preview: '#dc3545' },
        { id: '#6f42c1', name: 'Purple', preview: '#6f42c1' },
        { id: '#fd7e14', name: 'Orange', preview: '#fd7e14' },
        { id: '#20c997', name: 'Teal', preview: '#20c997' },
        { id: '#e83e8c', name: 'Pink', preview: '#e83e8c' },
        { id: '#6610f2', name: 'Indigo', preview: '#6610f2' },
      ],
    };
  }

  async getAvailableFonts() {
    return {
      fonts: [
        { id: 'Inter', name: 'Inter', preview: 'Inter' },
        { id: 'Roboto', name: 'Roboto', preview: 'Roboto' },
        { id: 'Open Sans', name: 'Open Sans', preview: 'Open Sans' },
        { id: 'Lato', name: 'Lato', preview: 'Lato' },
        { id: 'Montserrat', name: 'Montserrat', preview: 'Montserrat' },
      ],
    };
  }

  async getAvailableLayouts() {
    return {
      sidebarPositions: [
        { id: 'left', name: 'Left', icon: 'sidebar-left' },
        { id: 'right', name: 'Right', icon: 'sidebar-right' },
        { id: 'full-width', name: 'Full Width', icon: 'sidebar-full' },
        { id: 'centered', name: 'Centered', icon: 'sidebar-center' },
      ],
      contentWidths: [
        { id: 'narrow', name: 'Narrow', width: '800px' },
        { id: 'normal', name: 'Normal', width: '1200px' },
        { id: 'wide', name: 'Wide', width: '1400px' },
        { id: 'full', name: 'Full', width: '100%' },
      ],
    };
  }
}
