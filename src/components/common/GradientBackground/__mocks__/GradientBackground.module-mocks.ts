/**
 * Co-located mocks for GradientBackground tests.
 * Mocks dependencies (Skia) so the real component can render in Jest.
 * No require() — strategy: Jest automatic mocking and manual mocks only.
 */

jest.mock('@shopify/react-native-skia');
