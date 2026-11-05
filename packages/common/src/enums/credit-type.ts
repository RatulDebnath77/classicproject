const _CreditType = Object.freeze({
  Credit: "credit",
  Debit: "debit",
});

export type CreditType = (typeof _CreditType)[keyof typeof _CreditType];
