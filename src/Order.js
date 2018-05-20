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
  showConfirm = true,
  hideZeroes = false,
  haveChanges = false,
  hasNavigated = false,
  hasEdited = false,
  setHasEdited
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
          setHasEdited={setHasEdited}
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
        visible={(showConfirm || hasNavigated || hasEdited) && haveChanges}
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
    confirmOrder,
    cancelOrder,
    haveChanges,
    hasNavigated,
    setHasNavigated,
    hasEdited,
    setHasEdited,
    emitClick,
    emitStop
  }) => {
    return createOrderDetails({
      showConfirm: false,
      hideZeroes: true,
      endOrder,
      order,
      haveChanges,
      hasNavigated,
      hasEdited,
      setHasEdited: hasEdited => {
        if (hasEdited) {
          emitStop("cancel");
        }
        setHasEdited(hasEdited);
      },
      modifyOrder: order => {
        setHasNavigated(false);
        if (hasEdited) {
          emitStop("cancel");
        } else {
          emitClick();
        }
        modifyOrder(order);
      },
      confirmOrder: () => {
        setHasNavigated(false);
        setHasEdited(false);
        emitStop("cancel");
        confirmOrder();
      },
      cancelOrder: () => {
        setHasNavigated(false);
        setHasEdited(false);
        emitStop("cancel");
        cancelOrder();
      }
    });
  }
);

class OrderDetails extends Component {
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
