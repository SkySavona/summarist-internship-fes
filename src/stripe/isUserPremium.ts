import { User } from "firebase/auth";

export default async function isUserPremium(user: User): Promise<boolean> {
  await user.getIdToken(true);
  const decodedToken = await user.getIdTokenResult();    

  return decodedToken?.claims?.stripeRole ? true : false;
}