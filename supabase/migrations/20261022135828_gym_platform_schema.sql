/*
# Gym Platform Schema

1. New Tables
- `profiles` — member profile data (full_name, phone, goal, fitness_level)
- `membership_plans` — gym membership tiers (name, price, features, duration_months)
- `member_subscriptions` — active memberships linking members to plans with payment status
- `supplements` — nutrition supplements catalog (name, category, price, stock, description, image_url)
- `supplement_orders` — orders placed by members for supplements
- `supplement_order_items` — line items in a supplement order
- `progress_entries` — weekly progress checkups (weight, body_fat, muscle_mass, notes, workout_date)
- `workout_programs` — fitness technique programs (name, level, description, duration_weeks)
- `weekly_workouts` — individual weekly schedules within a program (week_number, day, exercises, sets, reps)
- `payments` — payment records (amount, method: mpesa/paypal, status, reference, payable_for: membership/supplement)
- `revenue` — aggregated gym revenue tracking (monthly totals by source)

2. Security
- Enable RLS on all tables.
- `membership_plans`, `supplements`, `workout_programs`, `weekly_workouts` are public-readable (anon + authenticated).
- `profiles`, `member_subscriptions`, `supplement_orders`, `supplement_order_items`, `progress_entries`, `payments` are owner-scoped to authenticated users.
- `revenue` is authenticated-readable (members can see gym revenue dashboard).
- All owner-scoped tables have user_id DEFAULT auth.uid().

3. Notes
- Email/password auth, email confirmation OFF.
- Owner columns default to auth.uid() so inserts work without passing user_id.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  goal text DEFAULT 'general fitness',
  fitness_level text DEFAULT 'beginner' CHECK (fitness_level IN ('beginner','intermediate','advanced')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- MEMBERSHIP PLANS (public catalog)
CREATE TABLE IF NOT EXISTS membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  duration_months int NOT NULL DEFAULT 1,
  features text[] NOT NULL DEFAULT '{}',
  is_premium boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON membership_plans TO anon, authenticated;

DROP POLICY IF EXISTS "read_plans_public" ON membership_plans;
CREATE POLICY "read_plans_public" ON membership_plans FOR SELECT TO anon, authenticated USING (true);

-- MEMBER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS member_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES membership_plans(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','expired','cancelled')),
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE member_subscriptions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON member_subscriptions TO authenticated;

DROP POLICY IF EXISTS "select_own_subs" ON member_subscriptions;
CREATE POLICY "select_own_subs" ON member_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_subs" ON member_subscriptions;
CREATE POLICY "insert_own_subs" ON member_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_subs" ON member_subscriptions;
CREATE POLICY "update_own_subs" ON member_subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SUPPLEMENTS (public catalog)
CREATE TABLE IF NOT EXISTS supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON supplements TO anon, authenticated;

DROP POLICY IF EXISTS "read_supplements_public" ON supplements;
CREATE POLICY "read_supplements_public" ON supplements FOR SELECT TO anon, authenticated USING (true);

-- SUPPLEMENT ORDERS
CREATE TABLE IF NOT EXISTS supplement_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text CHECK (payment_method IN ('mpesa','paypal')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','delivered','cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supplement_orders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON supplement_orders TO authenticated;

DROP POLICY IF EXISTS "select_own_orders" ON supplement_orders;
CREATE POLICY "select_own_orders" ON supplement_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_orders" ON supplement_orders;
CREATE POLICY "insert_own_orders" ON supplement_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_orders" ON supplement_orders;
CREATE POLICY "update_own_orders" ON supplement_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SUPPLEMENT ORDER ITEMS
CREATE TABLE IF NOT EXISTS supplement_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES supplement_orders(id) ON DELETE CASCADE,
  supplement_id uuid NOT NULL REFERENCES supplements(id),
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supplement_order_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON supplement_order_items TO authenticated;

DROP POLICY IF EXISTS "select_own_order_items" ON supplement_order_items;
CREATE POLICY "select_own_order_items" ON supplement_order_items FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM supplement_orders WHERE supplement_orders.id = supplement_order_items.order_id AND supplement_orders.user_id = auth.uid()));
DROP POLICY IF EXISTS "insert_own_order_items" ON supplement_order_items;
CREATE POLICY "insert_own_order_items" ON supplement_order_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM supplement_orders WHERE supplement_orders.id = supplement_order_items.order_id AND supplement_orders.user_id = auth.uid()));

-- PROGRESS ENTRIES
CREATE TABLE IF NOT EXISTS progress_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  muscle_mass_kg numeric(5,2),
  workout_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  week_number int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON progress_entries TO authenticated;

DROP POLICY IF EXISTS "select_own_progress" ON progress_entries;
CREATE POLICY "select_own_progress" ON progress_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_progress" ON progress_entries;
CREATE POLICY "insert_own_progress" ON progress_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_progress" ON progress_entries;
CREATE POLICY "update_own_progress" ON progress_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_progress" ON progress_entries;
CREATE POLICY "delete_own_progress" ON progress_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- WORKOUT PROGRAMS (public catalog)
CREATE TABLE IF NOT EXISTS workout_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced')),
  description text NOT NULL DEFAULT '',
  duration_weeks int NOT NULL DEFAULT 4,
  category text NOT NULL DEFAULT 'strength',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON workout_programs TO anon, authenticated;

DROP POLICY IF EXISTS "read_programs_public" ON workout_programs;
CREATE POLICY "read_programs_public" ON workout_programs FOR SELECT TO anon, authenticated USING (true);

-- WEEKLY WORKOUTS (public)
CREATE TABLE IF NOT EXISTS weekly_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES workout_programs(id) ON DELETE CASCADE,
  week_number int NOT NULL DEFAULT 1,
  day_of_week text NOT NULL DEFAULT 'Monday',
  exercise_name text NOT NULL,
  sets int NOT NULL DEFAULT 3,
  reps int NOT NULL DEFAULT 10,
  rest_seconds int NOT NULL DEFAULT 60,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_workouts ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON weekly_workouts TO anon, authenticated;

DROP POLICY IF EXISTS "read_weekly_public" ON weekly_workouts;
CREATE POLICY "read_weekly_public" ON weekly_workouts FOR SELECT TO anon, authenticated USING (true);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  method text NOT NULL CHECK (method IN ('mpesa','paypal')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  reference text,
  payable_for text NOT NULL DEFAULT 'membership' CHECK (payable_for IN ('membership','supplement','premium')),
  related_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON payments TO authenticated;

DROP POLICY IF EXISTS "select_own_payments" ON payments;
CREATE POLICY "select_own_payments" ON payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_payments" ON payments;
CREATE POLICY "insert_own_payments" ON payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- REVENUE (gym money tracking — readable by authenticated members)
CREATE TABLE IF NOT EXISTS revenue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_year text NOT NULL,
  source text NOT NULL CHECK (source IN ('membership','supplement','premium','personal_training')),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  transaction_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON revenue TO authenticated;

DROP POLICY IF EXISTS "read_revenue_authenticated" ON revenue;
CREATE POLICY "read_revenue_authenticated" ON revenue FOR SELECT TO authenticated USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_user_id ON member_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_orders_user_id ON supplement_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_id ON progress_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_workouts_program_id ON weekly_workouts(program_id);
