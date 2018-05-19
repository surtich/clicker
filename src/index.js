import React, { Component } from "react";
import { render } from "react-dom";

import WithCounter from "./WithCounter";
import Adder from "./Adder";
import Remover from "./Remover";

const AdderRemoverWithCounter = WithCounter(({ next, canRemove }) => {
  return (
    <div>
      <Adder next={next} />
      <Remover next={next} canRemove={canRemove} />
    </div>
  );
});

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const initialState = {
  count: 0,
  acc: 0,
  actions: []
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleNext = count => {
    this.setState({
      count
    });
  };

  handleEnd = _ => {
    const { count, acc, actions } = this.state;
    if (count !== 0) {
      const newAction = `Ended new ${count} clicks. Total count ${acc + count}`;
      this.setState(
        {
          acc: acc + count
        },
        () =>
          this.setState({
            count: 0,
            actions: [...actions, newAction]
          })
      );
    }
  };

  reset = () => {
    this.setState(initialState);
  };

  render() {
    const { count, acc, actions } = this.state;
    return (
      <div style={styles}>
        <div>Count: {count}</div>
        <div>Acc: {acc + count}</div>
        <button onClick={() => this.reset()}>Reset</button>
        <AdderRemoverWithCounter
          onNext={this.handleNext}
          onComplete={this.handleEnd}
          canRemove={acc + count > 0}
        />
        <textarea
          cols={50}
          rows={20}
          disabled
          value={actions.reduce((xs, x) => x + "\n" + xs, "")}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
