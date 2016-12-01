const { createElement: el, Component, PropTypes } = require('react')
const { axisBottom } = require('d3-axis')
const { select } = require('d3-selection')
const { timeMinute } = require('d3-time')
const { timeFormat } = require('d3-time-format')

const formatOuterTick = timeFormat('%H:%M')
const formatInnerTick = timeFormat('%M')

function tickFormatter(date, index, dates) {
  if (index === 0 || index === (dates.length - 1)) {
    return formatOuterTick(date)
  }

  return formatInnerTick(date)
}

class XAxis extends Component {
  componentDidMount() {
    const { scale } = this.props

    const axisGenerator = axisBottom(scale)
      .tickFormat(tickFormatter)
      .ticks(timeMinute.every(1))

    this.axis.call(axisGenerator)
  }

  render() {
    const { top } = this.props

    const transform = `translate(0, ${top})`

    return el('g', { ref: (r) => this.axis = select(r), transform })
  }
}

XAxis.defaultProps = {
  top: 0
}

XAxis.propTypes = {
  scale: PropTypes.func.isRequired,
  top: PropTypes.number
}

module.exports = XAxis