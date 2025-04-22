create table if not exists public.quote_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'pending'::text not null
);

-- Abilita RLS
alter table public.quote_requests enable row level security;

-- Crea policy per permettere agli utenti autenticati di inserire richieste
create policy "Users can insert their own quote requests"
  on public.quote_requests for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Crea policy per permettere agli utenti di vedere solo le proprie richieste
create policy "Users can view their own quote requests"
  on public.quote_requests for select
  to authenticated
  using (auth.uid() = user_id); 