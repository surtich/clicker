import React, { Component } from "react";

class Button extends Component {
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
