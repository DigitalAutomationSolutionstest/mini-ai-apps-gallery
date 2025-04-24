-- Crea tabella stripe_user_subscriptions
CREATE TABLE if not exists stripe_user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text NOT NULL,
  plan text,
  status text default 'active',
  created_at timestamp default now()
);

-- Abilita RLS
ALTER TABLE stripe_user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Crea policy per permettere agli utenti di vedere solo i propri abbonamenti
CREATE POLICY "Users can view their own subscriptions"
  ON stripe_user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Crea policy per permettere al service role di inserire/aggiornare abbonamenti
CREATE POLICY "Service role can manage subscriptions"
  ON stripe_user_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Crea indice per migliorare le performance delle query
CREATE INDEX idx_stripe_user_subscriptions_user_id ON stripe_user_subscriptions(user_id);
CREATE INDEX idx_stripe_user_subscriptions_stripe_customer_id ON stripe_user_subscriptions(stripe_customer_id);
CREATE INDEX idx_stripe_user_subscriptions_stripe_subscription_id ON stripe_user_subscriptions(stripe_subscription_id); 