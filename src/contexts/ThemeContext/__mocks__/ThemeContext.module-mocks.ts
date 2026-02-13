import { ITheme } from 'theme/theme.types';

const mockLightTheme: ITheme = {
  spacing: {} as ITheme['spacing'],
  colors: {
    background: { primary: '#mock-bg', secondary: '', tertiary: '', body: '' },
    text: { primary: '', secondary: '', tertiary: '' },
    border: { color: '', divider: '' },
    accent: {} as ITheme['colors']['accent'],
    category: {} as ITheme['colors']['category'],
    status: {} as ITheme['colors']['status'],
    white: '',
    black: '',
    shadow: {} as ITheme['colors']['shadow'],
    toggleInactive: '',
  },
  typography: {} as ITheme['typography'],
  shadows: {} as ITheme['shadows'],
  commonColors: {
    white: '',
    black: '',
    transparent: '',
    shadow: {} as ITheme['commonColors']['shadow'],
  },
};

jest.mock('theme/lightTheme', () => ({
  lightTheme: mockLightTheme,
}));
