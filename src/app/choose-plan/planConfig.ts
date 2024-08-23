// planConfig.ts

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    plans: [
      {
        id: 1,
        name: "Premium Plus Yearly",
        description: "7-day free trial included.",
        price: "99.99/year",
        stripeProductId: "prod_Qh49vea9psPMhn", // test premium yearly product id
        stripePriceId: "price_1Ppg1XRpLrmHfjrMuDkIbZGr", // test premium price id yearly
      },
      {
        id: 2,
        name: "Premium Monthly",
        description: "No trial included.",
        price: "9.99/month",
        stripeProductId: "prod_Qh4Ak2lhk3ZvIi", // test premium monthly product id
        stripePriceId: "price_1Ppg2VRpLrmHfjrMN3kq31Ux", // test premium price id monthly
      },
    ],
  },
  production: {
    plans: [
      {
        id: 1,
        name: "Premium Plus Yearly",
        description: "7-day free trial included.",
        price: "99.99/year",
        stripeProductId: "prod_QhOBQAMoYtGNRg", // live premium plus product id
        stripePriceId: "price_1PpsU8RpLrmHfjrMNkKbH9yl", // live premium price id yearly
      },
      {
        id: 2,
        name: "Premium Monthly",
        description: "No trial included.",
        price: "9.99/month",
        stripeProductId: "prod_QhOCBH8vWYXTOI", // live premium monthly product id
        stripePriceId: "price_1PpsV3RpLrmHfjrM9Cq0K4we", // live premium price id monthly
      },
    ],
  },
  test: {
    plans: [
        {
          id: 1,
          name: "Premium Plus Yearly",
          description: "7-day free trial included.",
          price: "99.99/year",
          stripeProductId: "prod_Qh49vea9psPMhn", // test premium yearly product id
          stripePriceId: "price_1Ppg1XRpLrmHfjrMuDkIbZGr", // test premium price id yearly
        },
        {
          id: 2,
          name: "Premium Monthly",
          description: "No trial included.",
          price: "9.99/month",
          stripeProductId: "prod_Qh4Ak2lhk3ZvIi", // test premium monthly product id
          stripePriceId: "price_1Ppg2VRpLrmHfjrMN3kq31Ux", // test premium price id monthly
        },
      ],
  },
};

export const plans = config[env].plans;