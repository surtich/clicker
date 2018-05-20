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
        title="undo"
        disabled={!haveChanges}
        visible={haveChanges}
        handleClick={undoOrder}
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

export const OrderWithAddProducts = createOrder;

export const OrderWithAutoConfirm = WithClicker(
  ({
    endOrder,
    order,
    modifyOrder,
    confirmOrder,
    undoOrder,
    haveChanges,
    hasNavigated,
    setHasNavigated,
    hasEdited,
    setHasEdited,
    next,
    stop
  }) => {
    return createOrder({
      showConfirm: false,
      hideZeroes: true,
      endOrder,
      order,
      haveChanges,
      hasNavigated,
      hasEdited,
      setHasEdited: hasEdited => {
        if (hasEdited) {
          stop("cancel");
        }
        setHasEdited(hasEdited);
      },
      modifyOrder: order => {
        setHasNavigated(false);
        if (hasEdited) {
          stop("cancel");
        } else {
          next();
        }
        modifyOrder(order);
      },
      confirmOrder: () => {
        setHasNavigated(false);
        setHasEdited(false);
        stop("cancel");
        confirmOrder();
      },
      undoOrder: () => {
        setHasNavigated(false);
        setHasEdited(false);
        stop("cancel");
        undoOrder();
      }
    });
  }
);

class Order extends Component {
  render() {
    const { Component = OrderWithAutoConfirm, ...props } = this.props;
    return (
      <div>
        <div>
          <Component {...props} />
        </div>
      </div>
    );
  }
}

export default Order;
