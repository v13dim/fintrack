import { createElement, ElementType } from 'react';

export const mockCreateReactElement = (component: string, props: Record<string, any> = {}) => {
  return createElement(component as ElementType, props);
};
