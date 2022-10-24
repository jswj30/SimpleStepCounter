export default class ChartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* use animation for bars, set initial values */
      animatedTop: new Animated.Value(1000),
      /* current to max value ratio */
      value: props.value / props.maxValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value / nextProps.maxValue,
      animatedTop: new Animated.Value(1000),
    });
  }

  render() {
    const {color, barInterval} = this.props;
    /* animation is fired up when rendering */
    Animated.timing(this.state.animatedTop, {toValue: 0, timing: 2000}).start();

    return (
      <View style={[styles.item, {marginHorizontal: barInterval}]}>
        <Animated.View
          style={[styles.animatedElement, {top: this.state.animatedTop}]}>
          <View style={{flex: 1 - this.state.value}} />
          <View style={{flex: this.state.value, backgroundColor: color}} />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    overflow: 'hidden',
    width: 1,
    alignItems: 'center',
  },
  animatedElement: {
    flex: 1,
    left: 0,
    width: 50,
  },
});
