import React, { Component } from "react";
import Button from "./Button";

class OrderProduct extends Component {
  modifyOrderProduct = inc => {
    const { name, quantity, modifyOrder } = this.props;
    modifyOrder({ name, quantity: quantity + inc });
  };
  removeOrderProduct = () => {
    const { name, modifyOrder } = this.props;
    modifyOrder({ name, quantity: 0 });
  };
  setOrderProduct = event => {
    const { name, modifyOrder } = this.props;
    modifyOrder({ name, quantity: +event.target.value });
  };
  render() {
    const { name, quantity, diff = 0 } = this.props;
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
          <span
            style={{
              marginLeft: "10px"
            }}
          >
            {diff > 0 ? "+" + diff : diff < 0 ? diff : null}
          </span>
        </div>

        <Button title="+" handleClick={() => this.modifyOrderProduct(+1)} />
        <Button
          title="-"
          disabled={quantity <= 0}
          handleClick={() => this.modifyOrderProduct(-1)}
        />
        <input size={5} value={quantity} onChange={this.setOrderProduct} />
        <Button
          title="remove"
          visible={quantity > 0}
          handleClick={this.removeOrderProduct}
        />
      </div>
    );
  }
}

export default OrderProduct;
