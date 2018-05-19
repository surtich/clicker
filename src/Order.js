import React, { Component } from "react";
import R from "ramda";

import OrderProduct from "./OrderProduct";
import Button from "./Button";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOrder: R.clone(props.order)
    };
  }

  static getDerivedStateFromProps({ order }, { endOrder }) {
    return order !== endOrder ? { endOrder: order } : null;
  }

  modifyOrder = ({ name, quantity }) => {
    const modifier = R.map(
      R.ifElse(
        R.propEq("name", name),
        R.assoc("quantity", quantity),
        product => product
      )
    );
    const { endOrder } = this.state;
    this.setState({
      endOrder: modifier(endOrder)
    });
  };

  reset = () => {
    this.setState({
      endOrder: this.props.order
    });
  };

  render() {
    const { endOrder } = this.state;
    const { order, confirmOrder } = this.props;
    return (
      <div>
        <div>
          {endOrder.map(({ name, quantity }) => (
            <OrderProduct
              name={name}
              quantity={quantity}
              modifyOrder={this.modifyOrder}
            />
          ))}
        </div>
        <Button
          title="reset"
          disabled={R.equals(endOrder, order)}
          handleClick={this.reset}
        />
        <Button
          title="confirm"
          disabled={R.equals(endOrder, order)}
          handleClick={() => confirmOrder(endOrder)}
        />
      </div>
    );
  }
}

export default Order;
