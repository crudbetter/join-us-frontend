const { createElement: el } = require('react')
const { render } = require('react-dom')
const { createStore } = require('redux')
const { Provider } = require('react-redux')

const rootReducer = require('./store/reducers')
const Chart = require('./chart')

const store = createStore(rootReducer)

render(
  el(Provider, { store }, el(Chart)),
  document.getElementById('container')
)