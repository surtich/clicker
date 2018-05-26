import React from "react";
import { render } from "react-dom";
import Order from "./Order";

if (process.env.NODE_ENV !== "production") {
  const { whyDidYouUpdate } = require("why-did-you-update");
  whyDidYouUpdate(React);
}
render(<Order />, document.getElementById("root"));
