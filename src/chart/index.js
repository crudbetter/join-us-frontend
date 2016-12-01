const { createElement: el, Component } = require('react')
const { connect } = require('react-redux')
const { scaleLinear, scaleTime } = require('d3-scale')
const { timeMinute } = require('d3-time')

const Series = require('./series')
const XAxis = require('./x_axis')
const styles = require('./styles.css')

class Chart extends Component {
  render() {
    const { start, end, snippets, height, width } = this.props

    const axis_height = 20

    const xScale = scaleTime()
      .domain([start, end])
      .range([width * 0.05, width * 0.95])
      .nice(timeMinute, 1)

    const yScale_length = (height - axis_height) / snippets.length

    const snippet_els = snippets.reduce((els, { min_transient_value, max_transient_value, transients }, i) => {
      const padding = 2

      const yScale = scaleLinear()
        .domain([max_transient_value, min_transient_value])
        .range([i * yScale_length + padding, (i + 1) * yScale_length - padding])
        .nice()

      const seriesList = Object.values(transients).map(([id, transient]) => {
        return el(Series, { key: `series_${id}`, transient, xScale, yScale })
      })

      return els.concat(seriesList)
    }, [])

    const x_axis = el(XAxis, { scale: xScale, top: height - axis_height })

    // For viewBox see: https://css-tricks.com/scale-svg/#article-header-id-3
    const viewBox = `0 0 ${width} ${height}`

    return( 
      el('svg', { height: '100%', width: '100%', viewBox }, 
        el('g', { className: styles.chart }, snippet_els, x_axis)
      )
    )
  }
}

Chart.defaultProps = {
  height: 600,
  width: 800
}

function mapStateToProps({ transients, devices }) {
  const snippets = Object.values(devices).reduce((snippets, device) => {
    const device_transients = Object.entries(transients).filter(([id, [times, values]]) => {
      return device.transients.includes(id)
    })

    const [all_device_transients_times, all_device_transients_values] =
      device_transients.reduce(([times, values], [id, transient]) => {
        return [
          times.concat([...transient.keys()]),
          values.concat([...transient.values()])
        ]
      }, [ [], [] ])

    return snippets.concat({
      start: Math.min.apply(null, all_device_transients_times),
      end: Math.max.apply(null, all_device_transients_times),
      min_transient_value: Math.min.apply(null, all_device_transients_values),
      max_transient_value: Math.max.apply(null, all_device_transients_values),
      transients: device_transients
    })
  }, [])

  return {
    start: Math.min.apply(null, snippets.map(({ start }) => start)),
    end: Math.max.apply(null, snippets.map(({ end }) => end)),
    snippets
  }
}

module.exports = connect(mapStateToProps)(Chart)