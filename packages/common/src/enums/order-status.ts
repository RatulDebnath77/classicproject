const _OrderStatus = Object.freeze({
  Cancelled: "Cancelled",
  Disputed: "Disputed",
  InProcess: "In Process",
  OnHold: "On Hold",
  Resolved: "Resolved",
  Shipped: "Shipped",
});

export type OrderStatus = (typeof _OrderStatus)[keyof typeof _OrderStatus];
