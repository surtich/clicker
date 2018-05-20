import React, { Component } from "react";
import { render } from "react-dom";
import R from "ramda";

import Order, { OrderWithAddProducts } from "./Order";
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

class App extends Component {
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
      ),
      hasNavigated: false
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
      showOrder: true,
      hasNavigated: false
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

  undoOrder = () => {
    this.setState({
      endOrder: this.state.order
    });
  };

  navigate = () => {
    this.setState({
      showOrder: !this.state.showOrder,
      hasNavigated: true
    });
  };

  resetHasNavigated = () => {
    this.setState({
      hasNavigated: false
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
    const {
      order,
      endOrder,
      ordersHistory,
      showOrder,
      hasNavigated
    } = this.state;
    const haveChanges = !R.equals(
      R.sortBy(R.prop("pos"), endOrder.filter(({ quantity }) => quantity > 0)),
      order
    );
    const {
      confirmOrder,
      modifyOrder,
      undoOrder,
      resetHasNavigated,
      mergeProducts
    } = this;
    const commonProps = {
      order,
      confirmOrder,
      modifyOrder,
      undoOrder,
      resetHasNavigated,
      haveChanges,
      hasNavigated
    };
    return (
      <div>
        {showOrder ? (
          <Order
            {...commonProps}
            endOrder={endOrder}
            onComplete={() => this.confirmOrder(endOrder)}
          />
        ) : (
          <Order
            {...commonProps}
            endOrder={mergeProducts()}
            Component={OrderWithAddProducts}
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
                (orders ? "New order" : "Initial Order") +
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

render(<App />, document.getElementById("root"));
