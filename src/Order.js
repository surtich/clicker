import React, { Component } from "react";
import R from "ramda";

import OrderProduct from "./OrderProduct";
import Button from "./Button";
import WithClicker from "./WithClicker";

const createOrder = ({
  endOrder,
  order,
  modifyOrder,
  confirmOrder,
  undoOrder,
  showConfirm = true,
  hideZeroes = false
}) => {
  const filterOrder = hideZeroes
    ? endOrder.filter(({ quantity }) => quantity > 0)
    : endOrder;
  return (
    <div>
      {filterOrder.map(({ name, quantity }) => (
        <OrderProduct
          key={name}
          name={name}
          quantity={quantity}
          modifyOrder={modifyOrder}
        />
      ))}
      <Button
        title="undo"
        disabled={R.equals(endOrder, order)}
        handleClick={undoOrder}
      />
      <Button
        title="confirm"
        disabled={R.equals(endOrder, order)}
        visible={showConfirm}
        handleClick={() => confirmOrder(endOrder)}
      />
    </div>
  );
};

export const OrderWithAddProducts = createOrder;

export const OrderWithAutoConfirm = WithClicker(
  ({ endOrder, order, modifyOrder, confirmOrder, undoOrder, next, stop }) => {
    return createOrder({
      showConfirm: false,
      hideZeroes: true,
      endOrder,
      order,
      modifyOrder: order => {
        next();
        modifyOrder(order);
      },
      confirmOrder: () => {
        stop("cancel");
        confirmOrder(endOrder);
      },
      undoOrder: () => {
        stop("cancel");
        undoOrder();
      }
    });
  }
);

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOrder: R.clone(props.order),
      lastPos: R.reduce(
        (max, orderProduct) =>
          "pos" in orderProduct ? Math.max(max, orderProduct.pos) : max,
        0,
        props.order
      )
    };
  }

  static getDerivedStateFromProps({ order }, { endOrder }) {
    return order !== endOrder ? { endOrder: order } : null;
  }

  modifyOrder = ({ name, quantity }) => {
    const { endOrder, lastPos } = this.state;
    let nextPos = lastPos + 1;
    const modifier = R.map(
      R.ifElse(
        R.propEq("name", name),
        R.assoc("quantity", quantity),
        product => product
      )
    );

    this.setState(
      {
        endOrder: modifier(endOrder).map(orderProduct => {
          if (!("pos" in orderProduct && orderProduct !== 0)) {
            orderProduct.pos = nextPos++;
          }
          return orderProduct;
        })
      },
      () => {
        this.setState({
          lastPos: nextPos - 1
        });
      }
    );
  };

  undoOrder = () => {
    this.setState({
      endOrder: this.props.order
    });
  };

  render() {
    const {
      order,
      confirmOrder,
      Component = OrderWithAutoConfirm
    } = this.props;
    return (
      <div>
        <div>
          <Component
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
