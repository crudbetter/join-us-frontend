const { combineReducers } = require('redux')

const initial_transients = require('./initial_state/transients')
const initial_devices = require('./initial_state/devices')

function transients(state = initial_transients, action) {
  switch (action.type) {
    default:
      return state
  }
}

function devices(state = initial_devices, action) {
  switch (action.type) {
    default:
      return state
  }
}

module.exports = combineReducers({
  transients,
  devices
})