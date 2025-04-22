import Stripe from "https://esm.sh/stripe@12.3.0?target=deno";
import { ENV } from "./env.ts";

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
}); 