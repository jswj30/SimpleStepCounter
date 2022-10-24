import React from 'react';
import {bindActionCreators} from 'redux';
import Counter from '../components/Counter';
import * as counterActions from '../actions/counterActions';
import {connect} from 'react-redux';

class CounterApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {state, actions} = this.props;
    return <Counter counter={state.count} {...actions} />;
  }
}
/* Make the component to modify the store’s state with the action. props.state displays the current state of the counter */
export default connect(
  state => ({
    state: state.counter,
  }),
  /* Add actions to the component. Get access to actions to manipulate the counter props.actions.increment() and props.actions.decrement() */
  dispatch => ({
    actions: bindActionCreators(counterActions, dispatch),
  }),
)(CounterApp);
