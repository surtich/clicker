import React, { Component } from "react";
import R from "ramda";

class Button extends Component {
  shouldComponentUpdate(nextProps) {
    return R.any(prop => !R.eqProps(prop, nextProps, this.props), [
      "title",
      "disabled",
      "visible"
    ]);
  }
  render() {
    const {
      title = "click",
      handleClick = _ => _,
      disabled = false,
      visible = true
    } = this.props;
    return (
      visible && (
        <div style={{ display: "inline-block", margin: "10px" }}>
          <button
            disabled={disabled}
            onClick={handleClick}
            style={{ padding: "10px" }}
          >
            {title}
          </button>
        </div>
      )
    );
  }
}

export default Button;
