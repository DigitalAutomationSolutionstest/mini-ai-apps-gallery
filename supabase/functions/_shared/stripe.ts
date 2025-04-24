// @deno-types="https://deno.land/x/types/deno.ns.d.ts"

import Stripe from "https://esm.sh/stripe@14.17.0?target=deno";
import { ENV } from "./env.ts";

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}); 