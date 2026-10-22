export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  goal: string;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  features: string[];
  is_premium: boolean;
  sort_order: number;
}

export interface MemberSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  plan?: MembershipPlan;
}

export interface Supplement {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image_url: string | null;
  sort_order: number;
}

export interface SupplementOrder {
  id: string;
  user_id: string;
  total_amount: number;
  payment_method: 'mpesa' | 'paypal' | null;
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface SupplementOrderItem {
  id: string;
  order_id: string;
  supplement_id: string;
  quantity: number;
  unit_price: number;
  supplement?: Supplement;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  muscle_mass_kg: number | null;
  workout_date: string;
  notes: string;
  week_number: number;
  created_at: string;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  duration_weeks: number;
  category: string;
  image_url: string | null;
  sort_order: number;
}

export interface WeeklyWorkout {
  id: string;
  program_id: string;
  week_number: number;
  day_of_week: string;
  exercise_name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  notes: string;
}

export interface ExerciseGuide {
  id: string;
  exercise_name: string;
  video_url: string;
  instructions: string;
  target_muscles: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  method: 'mpesa' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  reference: string | null;
  payable_for: 'membership' | 'supplement' | 'premium';
  related_id: string | null;
  created_at: string;
}

export interface Revenue {
  id: string;
  month_year: string;
  source: 'membership' | 'supplement' | 'premium' | 'personal_training';
  amount: number;
  transaction_count: number;
}

export interface CartItem {
  supplement: Supplement;
  quantity: number;
}
