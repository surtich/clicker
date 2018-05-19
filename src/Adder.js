import React, { Component } from "react";

class Adder extends Component {
  render() {
    const { next } = this.props;
    return (
      <div>
        <button onClick={() => next(1)}>Add</button>
      </div>
    );
  }
}

export default Adder;
