import React, { Component } from "react";
import R from "ramda";

import OrderDetails, { OrderDetailsWithAddProducts } from "./OrderDetails";
import Button from "./Button";

const products = [
  {
    name: "Agua"
  },
  {
    name: "Cerveza"
  },
  {
    name: "Croquetas"
  },
  {
    name: "Patatas"
  },
  {
    name: "Pollo"
  },
  {
    name: "Tarta"
  }
];

const initialOrder = [
  {
    name: "Patatas",
    quantity: 2,
    pos: 1
  },
  {
    name: "Cerveza",
    quantity: 4,
    pos: 3
  },
  {
    name: "Croquetas",
    quantity: 4,
    pos: 2
  }
];

class Order extends Component {
  constructor(props) {
    super(props);
    const order = R.sortBy(R.prop("pos"), initialOrder);
    this.state = {
      order,
      endOrder: order,
      haveChanges: false,
      ordersHistory: [order],
      showOrder: true,
      lastPos: R.reduce(
        (max, orderProduct) =>
          "pos" in orderProduct ? Math.max(max, orderProduct.pos) : max,
        0,
        order
      )
    };
  }

  confirmOrder = () => {
    const { endOrder, order } = this.state;
    if (R.equals(order, endOrder)) {
      return;
    }
    const newOrder = endOrder.filter(({ quantity }) => quantity > 0);
    const ordersHistory = R.append(newOrder, this.state.ordersHistory);
    this.setState({
      endOrder: newOrder,
      order: newOrder,
      ordersHistory,
      showOrder: true,
      haveChanges: false
    });
  };

  modifyOrder = ({ name, quantity }) => {
    const { order, endOrder, lastPos } = this.state;
    let nextPos = lastPos + 1;

    const newOrderProduct = R.map(
      R.when(
        R.propEq("name", name),
        R.pipe(
          R.assoc("quantity", quantity),
          orderProduct =>
            "pos" in orderProduct
              ? orderProduct
              : { ...orderProduct, ...{ pos: nextPos++ } }
        )
      ),
      endOrder
    );

    const haveChanges = !R.equals(
      R.sortBy(R.prop("name"), order),
      R.sortBy(R.prop("name"), newOrderProduct).filter(
        ({ quantity }) => quantity > 0
      )
    );

    this.setState({
      endOrder: newOrderProduct,
      haveChanges,
      lastPos: nextPos - 1
    });

    return haveChanges;
  };

  cancelOrder = () => {
    this.setState({
      endOrder: this.state.order,
      showOrder: true,
      haveChanges: false
    });
  };

  navigate = () => {
    const { showOrder, endOrder } = this.state;
    this.setState({
      showOrder: !showOrder,
      endOrder: !showOrder
        ? endOrder.filter(({ quantity }) => quantity > 0)
        : this.mergeProducts()
    });
  };

  mergeProducts = () => {
    const { endOrder } = this.state;
    return products.map(({ name }) => {
      const orderProduct = endOrder.find(
        ({ name: nameProduct }) => name === nameProduct
      );
      if (orderProduct) {
        return orderProduct;
      }
      return { name, quantity: 0 };
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !R.equals(nextState.endOrder, this.state.endOrder) ||
      !R.equals(nextState.order !== this.state.order) ||
      nextState.haveChanges !== this.state.haveChanges ||
      nextState.showOrder !== this.state.showOrder
    );
  }

  render() {
    const {
      order,
      endOrder,
      haveChanges,
      ordersHistory,
      showOrder
    } = this.state;

    const { confirmOrder, modifyOrder, cancelOrder } = this;

    const commonProps = {
      endOrder,
      order,
      confirmOrder,
      modifyOrder,
      cancelOrder,
      haveChanges
    };

    return (
      <div>
        {showOrder ? (
          <OrderDetails {...commonProps} onComplete={this.confirmOrder} />
        ) : (
          <OrderDetails
            {...commonProps}
            Component={OrderDetailsWithAddProducts}
          />
        )}
        <Button
          title={showOrder ? "add products" : "back"}
          handleClick={this.navigate}
          visible={showOrder || (!showOrder && !haveChanges)}
        />
        <div>
          <textarea
            cols={80}
            rows={20}
            disabled
            value={ordersHistory.reduce(
              (orders, order) =>
                "*** " +
                (orders ? "Order modified" : "Initial Order") +
                ": " +
                JSON.stringify(order) +
                "\n" +
                orders,
              ""
            )}
          />
        </div>
      </div>
    );
  }
}

export default Order;
