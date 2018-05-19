import React, { Component } from "react";
import Button from "./Button";

class OrderProduct extends Component {
  modyfyOrderProduct(inc) {
    const { name, quantity, modifyOrder } = this.props;
    modifyOrder({ name, quantity: quantity + inc });
  }
  render() {
    const { name, quantity } = this.props;
    return (
      <div>
        <div style={{ display: "inline-block" }}>{name}</div>
        <div
          style={{
            marginLeft: "10px",
            marginTop: "10px",
            display: "inline-block"
          }}
        >
          {quantity}
        </div>

        <Button title="+" handleClick={() => this.modyfyOrderProduct(+1)} />
        <Button
          title="-"
          disabled={quantity <= 0}
          handleClick={() => this.modyfyOrderProduct(-1)}
        />
      </div>
    );
  }
}

export default OrderProduct;
