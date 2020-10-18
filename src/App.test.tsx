import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

it('has a link to the box creation page', () => {
  const { getByText } = render(<App />);
  const linkElement: HTMLElement = getByText(/[Cc]reate [Bb]ox/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.getAttribute('href')).toEqual('/box');
});
