import React, { Component } from "react";
import R from "ramda";

import OrderProduct from "./OrderProduct";
import Button from "./Button";
import WithClicker from "./WithClicker";

const OrderWithAutoConfirm = WithClicker(
  ({ endOrder, order, modifyOrder, confirmOrder, undoOrder, next, stop }) => {
    return (
      <div>
        {endOrder.map(({ name, quantity }) => (
          <OrderProduct
            key={name}
            name={name}
            quantity={quantity}
            modifyOrder={order => {
              next();
              modifyOrder(order);
            }}
          />
        ))}
        <Button
          title="undo"
          disabled={R.equals(endOrder, order)}
          handleClick={() => {
            stop("cancel");
            undoOrder();
          }}
        />
        <Button
          title="confirm"
          disabled={R.equals(endOrder, order)}
          handleClick={() => {
            stop("cancel");
            confirmOrder(endOrder);
          }}
        />
      </div>
    );
  }
);

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

  undoOrder = () => {
    this.setState({
      endOrder: this.props.order
    });
  };

  render() {
    const { order, confirmOrder } = this.props;
    return (
      <div>
        <div>
          <OrderWithAutoConfirm
            order={order}
            endOrder={this.state.endOrder}
            modifyOrder={this.modifyOrder}
            confirmOrder={confirmOrder}
            undoOrder={this.undoOrder}
            onComplete={() => confirmOrder(this.state.endOrder)}
          />
        </div>
      </div>
    );
  }
}

export default Order;
