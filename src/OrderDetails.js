import React, { Component } from "react";
import R from "ramda";

import OrderProduct from "./OrderProduct";
import Button from "./Button";
import WithClicker from "./WithClicker";

const createOrderDetails = ({
  endOrder,
  order,
  modifyOrder,
  confirmOrder,
  cancelOrder,
  withConfirm = true,
  hideZeroes = false,
  haveChanges = false
}) => {
  const filterOrder = hideZeroes
    ? endOrder.filter(({ quantity }) => quantity > 0)
    : endOrder;
  const calcDiff = ({ name, quantity }) => {
    const quantityProduct = R.prop(
      "quantity",
      R.find(({ name: nameProduct }) => nameProduct === name, order)
    );
    return quantityProduct ? quantity - quantityProduct : quantity;
  };
  return (
    <div>
      {filterOrder.map(({ name, quantity }) => (
        <OrderProduct
          key={name}
          name={name}
          quantity={quantity}
          diff={calcDiff({ name, quantity })}
          modifyOrder={modifyOrder}
          lockSlowActions={!withConfirm}
        />
      ))}
      <Button
        title="cancel"
        disabled={!haveChanges}
        visible={haveChanges}
        handleClick={cancelOrder}
      />
      <Button
        title="confirm"
        disabled={!haveChanges}
        visible={withConfirm && haveChanges}
        handleClick={confirmOrder}
      />
    </div>
  );
};

export const OrderDetailsWithAddProducts = createOrderDetails;

export const OrderDetailsWithAutoConfirm = WithClicker(
  ({
    endOrder,
    order,
    modifyOrder,
    cancelOrder,
    haveChanges,
    emitClick,
    emitStop
  }) => {
    return createOrderDetails({
      withConfirm: false,
      hideZeroes: true,
      endOrder: R.sortBy(R.prop("pos"), endOrder),
      order,
      haveChanges,
      modifyOrder: orderProduct => {
        const newHaveChanges = modifyOrder(orderProduct);
        newHaveChanges ? emitClick() : emitStop();
      },
      cancelOrder: () => {
        emitStop();
        cancelOrder();
      }
    });
  }
);

class OrderDetails extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      !R.equals(nextProps.endOrder, this.props.endOrder) ||
      !R.equals(nextProps.order !== this.props.order) ||
      nextProps.haveChanges !== this.props.haveChanges
    );
  }
  render() {
    const { Component = OrderDetailsWithAutoConfirm, ...props } = this.props;
    return (
      <div>
        <div>
          <Component {...props} />
        </div>
      </div>
    );
  }
}

export default OrderDetails;
