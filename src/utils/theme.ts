export const theme = {
  colors: {
    primary: '#4CAF50', // Fresh Green
    primaryDark: '#388E3C',
    primaryLight: '#C8E6C9',
    secondary: '#FF9800', // Appetizing Orange
    accent: '#FF5722', // Deep Orange
    background: '#F5F7FA', // Light grayish blue
    surface: '#FFFFFF',
    text: '#2C3E50', // Dark Slate
    textSecondary: '#7F8C8D', // Gray
    border: '#E0E0E0',
    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#F1C40F',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: '#2C3E50',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: '#2C3E50',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: '#2C3E50',
    },
    body: {
      fontSize: 16,
      color: '#2C3E50',
    },
    bodySmall: {
      fontSize: 14,
      color: '#7F8C8D',
    },
    label: {
      fontSize: 12,
      fontWeight: 'bold' as const,
      textTransform: 'uppercase' as const,
      color: '#7F8C8D',
    },
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    }
  }
};
