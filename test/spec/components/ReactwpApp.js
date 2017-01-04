'use strict';

describe('ReactwpApp', () => {
  let React = require('react/addons');
  let ReactwpApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactwpApp = require('components/ReactwpApp.js');
    component = React.createElement(ReactwpApp);
  });

  it('should create a new instance of ReactwpApp', () => {
    expect(component).toBeDefined();
  });
});
