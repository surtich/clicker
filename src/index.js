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
      ordersHistory: [order],
      showOrder: true
    };
  }

  confirmOrder = order => {
    const orderWithoutZeroes = R.filter(({ quantity }) => quantity > 0, order);
    const sortedOrder = R.sortBy(
      orderProduct => orderProduct.pos || orderProduct.name,
      orderWithoutZeroes
    );
    const ordersHistory = R.append(sortedOrder, this.state.ordersHistory);
    if (R.equals(this.state.order, sortedOrder)) {
      return;
    }
    this.setState({
      order: sortedOrder,
      ordersHistory,
      showOrder: true
    });
  };

  navigate = () => {
    this.setState({
      showOrder: !this.state.showOrder
    });
  };

  mergeProducts = () => {
    const { order } = this.state;
    return products.map(({ name }) => {
      const orderProduct = order.find(
        ({ name: nameProduct }) => name === nameProduct
      );
      if (orderProduct) {
        return orderProduct;
      }
      return { name, quantity: 0 };
    });
  };

  render() {
    const { order, ordersHistory, showOrder } = this.state;
    return (
      <div>
        {showOrder ? (
          <Order order={order} confirmOrder={this.confirmOrder} />
        ) : (
          <Order
            order={this.mergeProducts()}
            confirmOrder={this.confirmOrder}
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
