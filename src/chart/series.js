const { createElement: el, Component } = require('react')
const { line } = require('d3-shape')

const styles = require('./styles.css')

class Series extends Component {
  render() {
    const { transient, xScale, yScale } = this.props

    const lineGenerator = line()
      .x(([time, pressure]) => {
        return xScale(time)
      })
      .y(([time, pressure]) => {
        return yScale(pressure)
      })

    return el('path', { className: styles.series, d: lineGenerator([...transient]) })
  }
}

module.exports = Series