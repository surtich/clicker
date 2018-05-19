import React, { Component } from "react";
import { render } from "react-dom";
import R from "ramda";

import Order from "./Order";

const initialOrder = [
  {
    name: "Patatas",
    quantity: 2
  },
  {
    name: "Cerveza",
    quantity: 4
  },
  {
    name: "Croquetas",
    quantity: 4
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: initialOrder,
      ordersHistory: [initialOrder]
    };
  }

  confirmOrder = order => {
    const ordersHistory = R.append(order, this.state.ordersHistory);
    this.setState({
      order: R.filter(({ quantity }) => quantity > 0, order),
      ordersHistory
    });
  };

  render() {
    const { order, ordersHistory } = this.state;
    return (
      <div>
        <Order order={order} confirmOrder={this.confirmOrder} />
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
    );
  }
}

render(<App />, document.getElementById("root"));
