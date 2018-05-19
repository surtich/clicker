import React, { Component } from "react";

class Remover extends Component {
  render() {
    const { next, canRemove } = this.props;
    return (
      <div>
        <button disabled={!canRemove} onClick={() => next(-1)}>
          Remove
        </button>
      </div>
    );
  }
}

export default Remover;
