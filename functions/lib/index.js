"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe_1 = require("stripe");
const express = require("express");
admin.initializeApp();
const firestore = admin.firestore();
const stripe = new stripe_1.default(functions.config().stripe.secret, {
    apiVersion: "2024-06-20",
});
const app = express();
app.use(express.raw({ type: "application/json" }));
exports.getBook = functions.https.onRequest(async (req, res) => {
    try {
        const bookId = req.query.id;
        if (!bookId || typeof bookId !== "string") {
            throw new Error("Missing or invalid book ID");
        }
        const bookRef = firestore.collection("books").doc(bookId);
        const bookSnapshot = await bookRef.get();
        if (!bookSnapshot.exists) {
            throw new Error("Book not found");
        }
        const bookData = bookSnapshot.data();
        res.status(200).json(bookData);
    }
    catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ error: "Failed to fetch book details" });
    }
});
app.post("/handleStripeWebhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = functions.config().stripe.webhook_secret;
    if (!req.body || !sig || !webhookSecret) {
        console.error("Invalid request, missing body, signature, or webhook secret");
        res.status(400).send("Invalid request, missing body, signature, or webhook secret");
        return;
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.log("Webhook event constructed:", event);
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    const eventType = event.type;
    const eventData = event.data.object;
    try {
        if (eventType === "invoice.payment_succeeded") {
            console.log("Handling invoice.payment_succeeded event");
            const invoice = eventData;
            const customerId = invoice.customer;
            const userQuery = firestore
                .collection("users")
                .where("stripeCustomerId", "==", customerId)
                .limit(1);
            const userSnapshot = await userQuery.get();
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                await userDoc.ref.update({
                    subscriptionStatus: "active",
                    stripeSubscriptionId: invoice.subscription,
                });
                console.log("Subscription status updated to 'active' for Customer ID:", customerId);
            }
            else {
                console.error("No user found for Customer ID:", customerId);
            }
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error("Error handling Stripe webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.handleStripeWebhook = functions.https.onRequest(app);
exports.createCustomer = functions.auth.user().onCreate(async (user) => {
    try {
        const customer = await stripe.customers.create({
            email: user.email,
        });
        await firestore.collection("users").doc(user.uid).set({
            stripeCustomerId: customer.id,
        }, { merge: true });
        console.log(`Stripe customer created: ${customer.id} for user ${user.uid}`);
    }
    catch (error) {
        console.error("Error creating Stripe customer:", error);
    }
});
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
    }
    const userId = context.auth.uid;
    const userDoc = await firestore.collection("users").doc(userId).get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError("not-found", "User not found");
    }
    const customerId = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: customerId,
            line_items: data.items,
            mode: "subscription",
            success_url: data.success_url,
            cancel_url: data.cancel_url,
        });
        return { id: session.id };
    }
    catch (error) {
        console.error("Error creating Checkout session:", error);
        throw new functions.https.HttpsError("internal", "Unable to create Checkout session");
    }
});
exports.createPortalLink = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
    }
    const userId = context.auth.uid;
    const userDoc = await firestore.collection("users").doc(userId).get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError("not-found", "User not found");
    }
    const customerId = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: data.return_url,
        });
        return { url: session.url };
    }
    catch (error) {
        console.error("Error creating Portal session:", error);
        throw new functions.https.HttpsError("internal", "Unable to create Portal session");
    }
});
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
    var _a;
    const userDoc = await firestore.collection("users").doc(user.uid).get();
    const customerId = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
    if (customerId) {
        try {
            await stripe.customers.del(customerId);
            console.log(`Stripe customer deleted: ${customerId} for user ${user.uid}`);
        }
        catch (error) {
            console.error("Error deleting Stripe customer:", error);
        }
    }
});
exports.onCustomerDataDeleted = functions.firestore
    .document("users/{userId}")
    .onDelete(async (snap, context) => {
    var _a;
    const customerId = (_a = snap.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
    if (customerId) {
        try {
            await stripe.customers.del(customerId);
            console.log(`Stripe customer deleted: ${customerId} for user ` +
                `${context.params.userId}`);
        }
        catch (error) {
            console.error("Error deleting Stripe customer:", error);
        }
    }
});
//# sourceMappingURL=index.js.map