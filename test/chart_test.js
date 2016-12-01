const test = require('tape')
const { mount } = require('enzyme')
const { createElement: el } = require('react')
const { Provider } = require('react-redux')
const { createStore } = require('redux')

const proxyquire = require('proxyquireify')(require)

const Chart = require('../src/chart')

const rootReducer = proxyquire('../src/store/reducers', {
  '@noCallThru': true,
  './initial_state/devices': {
    1: {
      transients: ['1']
    }
  },
  './initial_state/transients': {
    1: new Map(require('../src/store/initial_state/transient_snippets/1'))
  }
})

const styles = require('../src/chart/styles.css')

test('should display correct number of series', (assert) => {
  assert.plan(1)

  const store = createStore(rootReducer)
  const chart = el(Provider, { store }, el(Chart))
  const wrapper = mount(chart)

  assert.equals(wrapper.find(`.${styles.series}`).length, 1)
})
