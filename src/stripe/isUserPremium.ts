import { User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default async function isUserPremium(user: User): Promise<boolean> {
  const db = getFirestore();
  const customerDoc = await getDoc(doc(db, "users", user.uid));
  const customerData = customerDoc.data();

  if (customerData?.subscriptions) {
    const activeSubscription = Object.values(customerData.subscriptions).find(
      (sub: any) => sub.status === "active" || sub.status === "trialing"
    );
    return !!activeSubscription;
  }

  return false;
}
