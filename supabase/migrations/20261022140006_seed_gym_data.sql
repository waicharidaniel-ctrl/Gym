/*
# Seed Initial Data

1. Inserts
- 4 membership plans (Basic, Premium, Elite, Pro Athlete)
- 8 nutrition supplements across categories
- 4 workout programs with weekly progression
- Weekly workout schedules for each program (4 weeks each)
- Sample revenue data for the gym money dashboard

2. Notes
- Uses ON CONFLICT DO NOTHING to be idempotent.
*/

-- MEMBERSHIP PLANS
INSERT INTO membership_plans (name, description, price, duration_months, features, is_premium, sort_order) VALUES
('Basic', 'Get started with full gym access and group classes.', 2500.00, 1, ARRAY['Full gym access','Group fitness classes','Locker room access','Fitness assessment'], false, 1),
('Premium', 'Everything in Basic plus premium services and personalized plans.', 5500.00, 3, ARRAY['Everything in Basic','Personalized workout plan','Nutrition consultation','2 PT sessions/month','Sauna & steam room','Progress tracking'], true, 2),
('Elite', 'Our most popular plan with unlimited personal training.', 12000.00, 6, ARRAY['Everything in Premium','Unlimited personal training','Custom nutrition plan','Monthly body composition scan','Massage therapy (2x/month)','Priority booking'], true, 3),
('Pro Athlete', 'Comprehensive athletic development program.', 24000.00, 12, ARRAY['Everything in Elite','Sports performance testing','Recovery & physio sessions','Competition prep coaching','Dedicated trainer','Custom supplement plan'], true, 4)
ON CONFLICT DO NOTHING;

-- SUPPLEMENTS
INSERT INTO supplements (name, category, price, stock, description, image_url, sort_order) VALUES
('Whey Protein Isolate', 'Protein', 3200.00, 50, 'High-quality whey protein isolate with 25g protein per scoop. Supports muscle recovery and growth.', NULL, 1),
('Creatine Monohydrate', 'Performance', 1800.00, 40, 'Pure creatine monohydrate for increased strength, power output and muscle volume.', NULL, 2),
('BCAA Recovery', 'Recovery', 2400.00, 35, 'Branched-chain amino acids for intra-workout recovery and reduced muscle soreness.', NULL, 3),
('Pre-Workout Energy', 'Performance', 2800.00, 30, 'Explosive energy and focus blend with beta-alanine, caffeine, and citrulline.', NULL, 4),
('Mass Gainer', 'Protein', 4500.00, 20, 'High-calorie mass gainer with 50g protein and 250g carbs per serving for serious bulk.', NULL, 5),
('Multivitamin Complex', 'Health', 1500.00, 60, 'Complete daily multivitamin and mineral complex for optimal health and performance.', NULL, 6),
('Omega-3 Fish Oil', 'Health', 1200.00, 55, 'High-potency omega-3 fish oil with EPA and DHA for joint and heart health.', NULL, 7),
('Fat Burner Pro', 'Weight Loss', 2600.00, 25, 'Thermogenic fat burner with green tea extract and L-carnitine for lean physique.', NULL, 8)
ON CONFLICT DO NOTHING;

-- WORKOUT PROGRAMS
INSERT INTO workout_programs (name, level, description, duration_weeks, category, sort_order) VALUES
('Strength Foundation', 'beginner', 'Build a solid strength foundation with compound movements and progressive overload. Perfect for those new to weightlifting.', 4, 'strength', 1),
('Hypertrophy Builder', 'intermediate', 'Maximize muscle growth with volume training and targeted splits. Designed for lifters with 6+ months experience.', 4, 'hypertrophy', 2),
('Fat Loss Accelerator', 'beginner', 'High-intensity circuit training to torch calories and build endurance. Ideal for fat loss and cardiovascular health.', 4, 'cardio', 3),
('Athletic Performance', 'advanced', 'Explosive power, agility, and functional strength for serious athletes. Sport-specific training methodology.', 4, 'performance', 4)
ON CONFLICT DO NOTHING;

-- WEEKLY WORKOUTS for Strength Foundation (beginner)
INSERT INTO weekly_workouts (program_id, week_number, day_of_week, exercise_name, sets, reps, rest_seconds, notes) VALUES
-- Week 1
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Monday', 'Barbell Squat', 3, 10, 90, 'Focus on depth and form'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Monday', 'Bench Press', 3, 10, 90, 'Control the descent'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Monday', 'Bent-Over Row', 3, 10, 90, 'Squeeze shoulder blades'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Wednesday', 'Deadlift', 3, 8, 120, 'Keep back straight'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Wednesday', 'Overhead Press', 3, 10, 90, 'Brace core'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Wednesday', 'Pull-Ups (assisted)', 3, 8, 90, 'Full range of motion'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Friday', 'Leg Press', 3, 12, 90, 'Full depth'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Friday', 'Dumbbell Shoulder Press', 3, 10, 60, 'Stable base'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 1, 'Friday', 'Plank', 3, 30, 45, 'Hold for 30 seconds'),
-- Week 2 (increase sets)
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Monday', 'Barbell Squat', 4, 10, 90, 'Add 5kg from last week'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Monday', 'Bench Press', 4, 10, 90, 'Increase weight 2.5kg'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Monday', 'Bent-Over Row', 4, 10, 90, 'Focus on tempo'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Wednesday', 'Deadlift', 4, 8, 120, 'Increase weight 5kg'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Wednesday', 'Overhead Press', 4, 10, 90, 'Drive through legs'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Wednesday', 'Pull-Ups', 3, 10, 90, 'Reduce assistance'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Friday', 'Leg Press', 4, 12, 90, 'Increase weight'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Friday', 'Dumbbell Shoulder Press', 4, 10, 60, 'Increase weight'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 2, 'Friday', 'Plank', 3, 45, 45, 'Hold longer'),
-- Week 3
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Monday', 'Barbell Squat', 4, 12, 90, 'Increase weight again'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Monday', 'Bench Press', 4, 12, 90, 'Progressive overload'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Monday', 'Bent-Over Row', 4, 12, 90, 'Control eccentric'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Wednesday', 'Deadlift', 5, 5, 180, 'Heavy day - 5 reps'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Wednesday', 'Overhead Press', 4, 12, 90, 'Strict form'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Wednesday', 'Weighted Pull-Ups', 4, 6, 120, 'Add light weight'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Friday', 'Bulgarian Split Squat', 3, 10, 90, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Friday', 'Arnold Press', 3, 12, 60, 'Full rotation'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 3, 'Friday', 'Hanging Leg Raises', 3, 12, 60, 'Control the swing'),
-- Week 4 (peak week)
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Monday', 'Barbell Squat', 5, 5, 180, 'Max strength test'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Monday', 'Bench Press', 5, 5, 180, 'Heavy 5s'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Monday', 'Pendlay Row', 5, 5, 180, 'Explosive pulls'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Wednesday', 'Deadlift', 5, 3, 240, 'Max effort'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Wednesday', 'Push Press', 4, 8, 120, 'Use leg drive'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Wednesday', 'Weighted Pull-Ups', 4, 8, 120, 'Increase weight'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Friday', 'Front Squat', 4, 8, 120, 'Core stability'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Friday', 'Incline Dumbbell Press', 4, 10, 90, 'Upper chest'),
((SELECT id FROM workout_programs WHERE name='Strength Foundation'), 4, 'Friday', 'Cable Woodchops', 3, 15, 60, 'Core rotation')
ON CONFLICT DO NOTHING;

-- WEEKLY WORKOUTS for Hypertrophy Builder (intermediate)
INSERT INTO weekly_workouts (program_id, week_number, day_of_week, exercise_name, sets, reps, rest_seconds, notes) VALUES
-- Week 1
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Monday', 'Incline Bench Press', 4, 12, 75, 'Chest focus'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Monday', 'Cable Flyes', 3, 15, 60, 'Squeeze at top'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Monday', 'Tricep Pushdowns', 4, 15, 45, 'Strict form'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Tuesday', 'Lat Pulldown', 4, 12, 75, 'Full stretch'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Tuesday', 'Barbell Row', 4, 10, 75, 'Explosive pull'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Tuesday', 'Barbell Curl', 4, 12, 45, 'No swinging'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Thursday', 'Leg Extension', 4, 15, 60, 'Quad isolation'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Thursday', 'Leg Curl', 4, 15, 60, 'Hamstring focus'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Thursday', 'Calf Raises', 4, 20, 45, 'Full stretch'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Friday', 'Lateral Raises', 4, 15, 45, 'Side delts'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Friday', 'Face Pulls', 3, 20, 45, 'Rear delts'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 1, 'Friday', 'Shrugs', 4, 15, 45, 'Hold at top'),
-- Week 2 (increase volume)
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Monday', 'Flat Dumbbell Press', 5, 12, 75, 'Deep stretch'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Monday', 'Incline Flyes', 4, 15, 60, 'Slow eccentric'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Monday', 'Overhead Tricep Extension', 4, 15, 45, 'Full range'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Tuesday', 'Weighted Pull-Ups', 4, 10, 75, 'Add weight'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Tuesday', 'Seated Cable Row', 5, 12, 75, 'Squeeze back'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Tuesday', 'Hammer Curls', 4, 12, 45, 'Brachialis focus'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Thursday', 'Hack Squat', 4, 12, 90, 'Deep and controlled'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Thursday', 'Romanian Deadlift', 4, 12, 90, 'Hamstring stretch'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Thursday', 'Seated Calf Raises', 4, 20, 45, 'Soleus focus'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Friday', 'Cable Lateral Raises', 5, 15, 45, 'Constant tension'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Friday', 'Reverse Pec Deck', 4, 15, 45, 'Rear delts'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 2, 'Friday', 'Upright Rows', 4, 12, 45, 'Traps and delts'),
-- Week 3 (intensity techniques)
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Monday', 'Barbell Bench Press', 5, 10, 60, 'Rest-pause on last set'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Monday', 'Dips (weighted)', 4, 12, 60, 'Chest and triceps'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Monday', 'Skull Crushers', 4, 12, 45, 'Drop set on last'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Tuesday', 'T-Bar Row', 5, 12, 75, 'Heavy controlled'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Tuesday', 'Single-Arm Lat Pulldown', 4, 12, 60, 'Address imbalances'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Tuesday', 'Preacher Curls', 4, 12, 45, 'Drop set finish'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Thursday', 'Walking Lunges', 4, 20, 90, 'Each leg, weighted'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Thursday', 'Stiff-Leg Deadlift', 4, 12, 75, 'Hamstrings'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Thursday', 'Standing Calf Raises', 5, 15, 45, 'Gastrocnemius'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Friday', 'Arnold Press', 5, 12, 60, 'Full shoulder activation'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Friday', 'Cable Reverse Flyes', 4, 15, 45, 'Rear delt burnout'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 3, 'Friday', 'Farmer Walks', 3, 60, 60, '60 seconds, heavy'),
-- Week 4 (peak volume)
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Monday', 'Incline Barbell Press', 5, 12, 60, 'Max volume'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Monday', 'Machine Chest Press', 4, 15, 45, 'Drop set x2'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Monday', 'Rope Pushdowns', 5, 15, 45, 'Spread rope at bottom'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Tuesday', 'Deadlift (sumo)', 4, 8, 120, 'Heavy back day'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Tuesday', 'Meadows Row', 4, 12, 75, 'Lat sweep'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Tuesday', 'Concentration Curls', 5, 12, 45, 'Mind-muscle connection'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Thursday', 'Leg Press (feet high)', 5, 15, 90, 'Hamstring emphasis'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Thursday', 'Glute Ham Raises', 4, 12, 60, 'Posterior chain'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Thursday', 'Donkey Calf Raises', 5, 20, 45, 'Partner or machine'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Friday', 'Dumbbell Lateral Raises', 6, 15, 45, 'High volume delts'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Friday', 'Band Pull-Aparts', 4, 25, 30, 'Rear delts and health'),
((SELECT id FROM workout_programs WHERE name='Hypertrophy Builder'), 4, 'Friday', 'Barbell Shrugs', 5, 15, 45, 'Heavy traps')
ON CONFLICT DO NOTHING;

-- WEEKLY WORKOUTS for Fat Loss Accelerator (beginner)
INSERT INTO weekly_workouts (program_id, week_number, day_of_week, exercise_name, sets, reps, rest_seconds, notes) VALUES
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Monday', 'Jumping Jacks', 4, 30, 30, 'Warm-up circuit'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Monday', 'Bodyweight Squats', 4, 20, 30, 'Keep pace up'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Monday', 'Mountain Climbers', 4, 20, 30, 'Core and cardio'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Wednesday', 'Burpees', 4, 15, 45, 'Full body burn'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Wednesday', 'Kettlebell Swings', 4, 20, 45, 'Hip drive'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Wednesday', 'Plank to Push-Up', 4, 12, 30, 'Core stability'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Friday', 'High Knees', 4, 30, 30, 'Cardio interval'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Friday', 'Box Jumps', 4, 15, 45, 'Explosive power'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 1, 'Friday', 'Battle Ropes', 4, 30, 45, '30 second intervals'),
-- Week 2
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Monday', 'Jump Rope', 5, 60, 30, '60 second rounds'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Monday', 'Walking Lunges', 4, 20, 30, 'Weighted if possible'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Monday', 'Push-Ups', 4, 15, 30, 'Chest and core'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Wednesday', 'Sprint Intervals (bike)', 6, 30, 60, '30s sprint, 60s rest'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Wednesday', 'Deadlifts', 4, 12, 60, 'Moderate weight'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Wednesday', 'Russian Twists', 4, 20, 30, 'Obliques'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Friday', 'Rowing Machine', 5, 500, 60, '500m sprints'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Friday', 'Box Step-Ups', 4, 20, 30, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 2, 'Friday', 'Bicycle Crunches', 4, 20, 30, 'Core finisher'),
-- Week 3
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Monday', 'Treadmill Sprints', 6, 30, 60, '30s all-out'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Monday', 'Goblet Squats', 5, 15, 45, 'Keep heart rate up'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Monday', 'Thrusters', 4, 12, 45, 'Squat to press'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Wednesday', 'Rowing Intervals', 8, 30, 30, 'High intensity'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Wednesday', 'Kettlebell Snatch', 4, 15, 45, 'Each arm'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Wednesday', 'V-Ups', 4, 15, 30, 'Advanced core'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Friday', 'Sled Push', 5, 20, 60, 'Full body power'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Friday', 'Box Jumps (heightened)', 5, 12, 45, 'Higher box'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 3, 'Friday', 'Toes to Bar', 4, 12, 45, 'Core strength'),
-- Week 4 (peak intensity)
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Monday', 'Burpee Broad Jumps', 5, 15, 45, 'Distance and power'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Monday', 'Wall Balls', 5, 20, 45, 'Squat and throw'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Monday', 'Push-Up to T', 4, 15, 30, 'Core rotation'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Wednesday', 'Assault Bike Sprints', 10, 20, 40, '20s max effort'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Wednesday', 'Deadlift (high rep)', 5, 15, 60, 'Light weight, high rep'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Wednesday', 'Hanging Windshield Wipers', 4, 12, 45, 'Advanced core'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Friday', 'Stair Climber', 4, 300, 60, '5 min steady'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Friday', 'Jump Squats', 5, 15, 45, 'Explosive'),
((SELECT id FROM workout_programs WHERE name='Fat Loss Accelerator'), 4, 'Friday', 'Plank Hold', 3, 60, 45, '1 minute holds')
ON CONFLICT DO NOTHING;

-- WEEKLY WORKOUTS for Athletic Performance (advanced)
INSERT INTO weekly_workouts (program_id, week_number, day_of_week, exercise_name, sets, reps, rest_seconds, notes) VALUES
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Monday', 'Power Clean', 5, 3, 180, 'Explosive power'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Monday', 'Box Jump (max height)', 5, 5, 120, 'Full recovery'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Monday', 'Med Ball Slam', 4, 8, 60, 'Full power'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Wednesday', 'Back Squat (heavy)', 5, 5, 180, 'Max strength'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Wednesday', 'Bulgarian Split Squat', 4, 8, 90, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Wednesday', 'Nordic Hamstring Curl', 4, 6, 90, 'Eccentric focus'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Friday', 'Sprint Accelerations', 6, 40, 120, '40m sprints'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Friday', 'Lateral Bounds', 4, 10, 90, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 1, 'Friday', 'Cone Drills', 4, 60, 60, 'Agility course'),
-- Week 2
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Monday', 'Snatch', 5, 3, 180, 'Technical lift'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Monday', 'Depth Jumps', 5, 5, 120, 'Shock training'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Monday', 'Rotational Med Ball Throw', 4, 8, 60, 'Each side'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Wednesday', 'Front Squat', 5, 5, 180, 'Core and quads'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Wednesday', 'Reverse Lunge (weighted)', 4, 8, 90, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Wednesday', 'Glute-Ham Raise', 4, 8, 90, 'Posterior chain'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Friday', 'Flying Sprints (30m)', 6, 30, 120, 'Build-up to sprint'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Friday', 'Single-Leg Broad Jump', 4, 5, 90, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 2, 'Friday', 'L-Drill', 5, 45, 60, 'NFL combine drill'),
-- Week 3
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Monday', 'Clean and Jerk', 5, 3, 180, 'Full lift'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Monday', 'Broad Jump', 5, 5, 120, 'Max distance'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Monday', 'Med Ball Chest Pass', 4, 8, 60, 'Power output'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Wednesday', 'Deadlift (heavy)', 5, 3, 240, 'Max strength'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Wednesday', 'Step-Up (heavy)', 4, 8, 90, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Wednesday', 'Single-Leg RDL', 4, 8, 90, 'Each leg'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Friday', 'Hill Sprints', 8, 40, 120, 'Incline power'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Friday', 'Lateral Skater Jumps', 5, 10, 60, 'Each direction'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 3, 'Friday', 'Shuttle Run (5-10-5)', 6, 30, 90, 'Agility test'),
-- Week 4 (peak power)
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Monday', 'Power Clean (max)', 5, 2, 240, 'Peak power output'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Monday', 'Box Jump (weighted)', 5, 5, 120, 'Vest or dumbbell'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Monday', 'Slam Ball (heavy)', 5, 6, 60, 'Max effort slams'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Wednesday', 'Squat (max effort)', 5, 3, 240, 'Top set of 3'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Wednesday', 'Bulgarian Split Squat (heavy)', 4, 6, 120, 'Each leg weighted'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Wednesday', 'Nordic Curl (assisted)', 5, 5, 90, 'Controlled eccentrics'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Friday', '40-Yard Dash (timed)', 6, 40, 180, 'Record times'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Friday', 'Triple Broad Jump', 4, 3, 120, '3 continuous jumps'),
((SELECT id FROM workout_programs WHERE name='Athletic Performance'), 4, 'Friday', 'T-Drill', 5, 45, 90, 'Full agility test')
ON CONFLICT DO NOTHING;

-- REVENUE SAMPLE DATA
INSERT INTO revenue (month_year, source, amount, transaction_count) VALUES
('2025-09', 'membership', 145000.00, 52),
('2025-09', 'supplement', 68000.00, 38),
('2025-09', 'premium', 42000.00, 15),
('2025-09', 'personal_training', 25000.00, 18),
('2025-10', 'membership', 168000.00, 61),
('2025-10', 'supplement', 72000.00, 41),
('2025-10', 'premium', 48000.00, 17),
('2025-10', 'personal_training', 31000.00, 22),
('2025-11', 'membership', 152000.00, 55),
('2025-11', 'supplement', 58000.00, 33),
('2025-11', 'premium', 39000.00, 14),
('2025-11', 'personal_training', 28000.00, 20),
('2025-12', 'membership', 185000.00, 68),
('2025-12', 'supplement', 81000.00, 47),
('2025-12', 'premium', 55000.00, 19),
('2025-12', 'personal_training', 35000.00, 25),
('2026-01', 'membership', 198000.00, 72),
('2026-01', 'supplement', 89000.00, 51),
('2026-01', 'premium', 62000.00, 22),
('2026-01', 'personal_training', 38000.00, 27),
('2026-02', 'membership', 210000.00, 76),
('2026-02', 'supplement', 95000.00, 54),
('2026-02', 'premium', 68000.00, 24),
('2026-02', 'personal_training', 42000.00, 30),
('2026-03', 'membership', 225000.00, 81),
('2026-03', 'supplement', 102000.00, 58),
('2026-03', 'premium', 72000.00, 26),
('2026-03', 'personal_training', 45000.00, 32),
('2026-04', 'membership', 238000.00, 85),
('2026-04', 'supplement', 108000.00, 61),
('2026-04', 'premium', 78000.00, 28),
('2026-04', 'personal_training', 48000.00, 34),
('2026-05', 'membership', 252000.00, 89),
('2026-05', 'supplement', 115000.00, 65),
('2026-05', 'premium', 82000.00, 30),
('2026-05', 'personal_training', 52000.00, 37),
('2026-06', 'membership', 268000.00, 94),
('2026-06', 'supplement', 122000.00, 69),
('2026-06', 'premium', 88000.00, 32),
('2026-06', 'personal_training', 55000.00, 39),
('2026-07', 'membership', 285000.00, 98),
('2026-07', 'supplement', 128000.00, 72),
('2026-07', 'premium', 92000.00, 33),
('2026-07', 'personal_training', 58000.00, 41),
('2026-08', 'membership', 298000.00, 102),
('2026-08', 'supplement', 135000.00, 76),
('2026-08', 'premium', 96000.00, 35),
('2026-08', 'personal_training', 62000.00, 44),
('2026-09', 'membership', 312000.00, 107),
('2026-09', 'supplement', 142000.00, 80),
('2026-09', 'premium', 102000.00, 37),
('2026-09', 'personal_training', 65000.00, 46),
('2026-10', 'membership', 325000.00, 112),
('2026-10', 'supplement', 148000.00, 83),
('2026-10', 'premium', 108000.00, 39),
('2026-10', 'personal_training', 68000.00, 48)
ON CONFLICT DO NOTHING;
