import chartItem from './chart-item';
import chartLabel from './chart-label';

class Chart extends Component {
  constructor(props) {
    super(props);
    let data = props.data || [];

    this.state = {
      data: data,
      maxValue: this.countMaxValue(data);
    }
  }

  /* function to calculate the max value of the transmitted data .*/
  countMaxValue(data) {
    return data.reduce((prev, curn) => (curn.value >= prev) ? curn.value : prev, 0);
  }

  componentWillReceiveProps(newProps) {
    let data = newProps.data || [];
    this.setState({
      data: data,
      maxValue: this.countMaxValue(data)
    });
  }

  /* function to render the array of bar components */
  renderBars() {
    return this.state.data.map((value, index) => (
        <ChartItem
          value={value.value}
          color={value.color}
          key={index}
          barInterval={this.props.barInterval}
          maxValue={this.state.maxValue}/>
    ));
  }

  /* function to render the array of components for bar labels */
  renderLabels() {
    return this.state.data.map((value, index) => (
        <ChartLabel
          label={value.label}
          barInterval={this.props.barInterval}
          key={index}
          labelFontSize={this.props.labelFontSize}
          labelColor={this.props.labelFontColor}/>
    ));
  }

  render() {
    let labelStyles = {
      fontSize: this.props.labelFontSize,
      color: this.props.labelFontColor
    };

    return(
      <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
        <View style={styles.labelContainer}>
          <Text style={labelStyles}>
            {this.state.maxValue}
          </Text>
        </View>
        <View style={styles.itemsContainer}>
          <View style={[styles.polygonContainer, {borderColor: this.props.borderColor}]}>
            {this.renderBars()}
          </View>
          <View style={styles.itemsLabelContainer}>
            {this.renderLabels()}
          </View>
        </View>
      </View>
    );
  }
}

/* validate the transmitted data */
Chart.propTypes = {
  data: PropTypes.arrayOf(React.PropTypes.shape({
    value: PropTypes.number,
    label: PropTypes.string,
    color: PropTypes.string
  })), // array of displayed data
  barInterval: PropTypes.number, // interval between the bars
  labelFontSize: PropTypes.number, // label’s font size
  labelFontColor: PropTypes.string, // label’s font color
  borderColor: PropTypes.string, // axis color
  backgroundColor: PropTypes.string // diagram’s background color
}

export default Chart;