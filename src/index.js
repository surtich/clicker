import React, { Component } from "react";
import { render } from "react-dom";
import R from "ramda";

import OrderDetails, { OrderDetailsWithAddProducts } from "./Order";
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
      endOrder: R.clone(order),
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
    const ordersHistory = R.append(endOrder, this.state.ordersHistory);
    this.setState({
      order: endOrder,
      ordersHistory,
      showOrder: true
    });
  };

  modifyOrder = ({ name, quantity }) => {
    const { endOrder, lastPos } = this.state;
    let nextPos = lastPos + 1;
    const orderProduct = {
      ...(endOrder.find(({ name: productName }) => productName === name) || {
        pos: nextPos++
      }),
      ...{ name, quantity }
    };
    this.setState(
      {
        endOrder: R.sortBy(
          R.prop("pos"),
          [
            ...endOrder.filter(({ name: productName }) => productName !== name),
            orderProduct
          ].filter(({ quantity }) => quantity > 0)
        )
      },
      () => {
        this.setState({
          lastPos: nextPos - 1
        });
      }
    );
  };

  cancelOrder = () => {
    this.setState({
      endOrder: this.state.order,
      showOrder: true
    });
  };

  navigate = () => {
    this.setState({
      showOrder: !this.state.showOrder
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

  render() {
    const { order, endOrder, ordersHistory, showOrder } = this.state;

    const haveChanges = !R.equals(
      R.sortBy(R.prop("pos"), endOrder.filter(({ quantity }) => quantity > 0)),
      order
    );

    const { confirmOrder, modifyOrder, cancelOrder, mergeProducts } = this;

    const commonProps = {
      order,
      confirmOrder,
      modifyOrder,
      cancelOrder,
      haveChanges
    };

    return (
      <div>
        {showOrder ? (
          <OrderDetails
            {...commonProps}
            endOrder={endOrder}
            onComplete={() => this.confirmOrder(endOrder)}
          />
        ) : (
          <OrderDetails
            {...commonProps}
            endOrder={mergeProducts()}
            Component={OrderDetailsWithAddProducts}
          />
        )}
        <Button
          title={showOrder ? "add products" : "back"}
          handleClick={this.navigate}
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

render(<Order />, document.getElementById("root"));
