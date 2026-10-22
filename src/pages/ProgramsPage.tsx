import { useEffect, useState } from 'react';
import { Loader2, Dumbbell, Calendar, TrendingUp, Award, Flame, Target, Play, X, Clock, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { WorkoutProgram, WeeklyWorkout, ExerciseGuide } from '@/types';

interface ProgramsPageProps {
  onNavigate: (page: string) => void;
}

const programImages: Record<string, string> = {
  'Strength Foundation': 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Hypertrophy Builder': 'https://images.pexels.com/photos/3888405/pexels-photo-3888405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Fat Loss Accelerator': 'https://images.pexels.com/photos/12600523/pexels-photo-12600523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Athletic Performance': 'https://images.pexels.com/photos/4944006/pexels-photo-4944006.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const levelColors: Record<string, string> = {
  beginner: 'bg-green-500/15 text-green-400 border-green-500/30',
  intermediate: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  advanced: 'bg-primary-500/15 text-primary-400 border-primary-500/30',
};

const difficultyBadge: Record<string, string> = {
  beginner: 'bg-green-500/15 text-green-400',
  intermediate: 'bg-accent-500/15 text-accent-400',
  advanced: 'bg-primary-500/15 text-primary-400',
};

const categoryIcons: Record<string, typeof Dumbbell> = {
  strength: Dumbbell,
  hypertrophy: TrendingUp,
  cardio: Flame,
  performance: Target,
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProgramsPage({ onNavigate }: ProgramsPageProps) {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [workouts, setWorkouts] = useState<Record<string, WeeklyWorkout[]>>({});
  const [guides, setGuides] = useState<Record<string, ExerciseGuide>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [activeGuide, setActiveGuide] = useState<ExerciseGuide | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: progData } = await supabase
        .from('workout_programs')
        .select('*')
        .order('sort_order');
      setPrograms(progData as WorkoutProgram[]);

      const { data: guideData } = await supabase
        .from('exercise_guides')
        .select('*');
      const guideMap: Record<string, ExerciseGuide> = {};
      for (const g of (guideData || []) as ExerciseGuide[]) {
        guideMap[g.exercise_name] = g;
      }
      setGuides(guideMap);

      if (progData && progData.length > 0) {
        const { data: workoutData } = await supabase
          .from('weekly_workouts')
          .select('*')
          .in('program_id', progData.map((p) => p.id));

        const grouped: Record<string, WeeklyWorkout[]> = {};
        for (const w of (workoutData || []) as WeeklyWorkout[]) {
          if (!grouped[w.program_id]) grouped[w.program_id] = [];
          grouped[w.program_id].push(w);
        }
        setWorkouts(grouped);
        setSelectedProgram(progData[0].id);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const activeProgram = programs.find((p) => p.id === selectedProgram);
  const programWorkouts = selectedProgram ? workouts[selectedProgram] || [] : [];
  const weeks = Array.from(new Set(programWorkouts.map((w) => w.week_number))).sort((a, b) => a - b);
  const weekWorkouts = programWorkouts.filter((w) => w.week_number === selectedWeek);
  const groupedByDay = days.map((day) => ({
    day,
    exercises: weekWorkouts.filter((w) => w.day_of_week === day),
  })).filter((d) => d.exercises.length > 0);

  return (
    <div className="pt-16">
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-4">
            <Dumbbell className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-400 font-medium">Fitness Techniques</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            Structured <span className="text-primary-500">Training Programs</span>
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Expert-designed workout programs with weekly progression. Every exercise includes a video demonstration and form guide so you can train with confidence.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Program selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {programs.map((prog) => {
            const Icon = categoryIcons[prog.category] || Dumbbell;
            const isActive = selectedProgram === prog.id;
            return (
              <button
                key={prog.id}
                onClick={() => {
                  setSelectedProgram(prog.id);
                  setSelectedWeek(1);
                }}
                className={`relative rounded-2xl overflow-hidden text-left transition-all animate-fade-in ${
                  isActive ? 'ring-2 ring-primary-500 scale-[1.02]' : 'hover:scale-[1.01] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={programImages[prog.name] || 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'}
                    alt={prog.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary-500" />
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${levelColors[prog.level]}`}>
                        {prog.level}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{prog.name}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{prog.duration_weeks} weeks</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Program detail */}
        {activeProgram && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-800">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{activeProgram.name}</h2>
                  <p className="text-neutral-400 mt-2 max-w-2xl">{activeProgram.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                      <Award className="w-4 h-4 text-primary-500" />
                      <span className="capitalize">{activeProgram.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span>{activeProgram.duration_weeks} weeks</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                      <TrendingUp className="w-4 h-4 text-primary-500" />
                      <span className="capitalize">{activeProgram.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Week selector */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-sm font-medium text-neutral-400 flex-shrink-0">Week:</span>
              {weeks.map((week) => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                    selectedWeek === week
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {week}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500 flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Workload increases weekly</span>
              </div>
            </div>

            {/* Workouts */}
            <div className="p-6">
              {groupedByDay.length === 0 ? (
                <p className="text-center text-neutral-500 py-8">No workouts scheduled for this week.</p>
              ) : (
                <div className="space-y-6">
                  {groupedByDay.map(({ day, exercises }) => (
                    <div key={day}>
                      <h4 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {day}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {exercises.map((ex) => {
                          const guide = guides[ex.exercise_name];
                          return (
                            <div
                              key={ex.id}
                              className="group bg-neutral-800/50 border border-neutral-800 rounded-xl overflow-hidden hover:border-primary-500/30 transition-all"
                            >
                              {/* Video preview header */}
                              <button
                                onClick={() => guide && setActiveGuide(guide)}
                                className="w-full relative aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-12 h-12 bg-primary-600/80 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                                  <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                </div>
                                <span className="absolute bottom-2 left-2 text-xs text-neutral-400 font-medium">
                                  {guide ? 'Watch Demo' : 'Demo Video'}
                                </span>
                                {guide && (
                                  <span className={`absolute bottom-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full ${difficultyBadge[guide.difficulty]}`}>
                                    {guide.difficulty}
                                  </span>
                                )}
                              </button>

                              {/* Exercise info */}
                              <div className="p-4">
                                <h5 className="font-semibold text-white">{ex.exercise_name}</h5>
                                {guide && (
                                  <p className="text-xs text-primary-500 mt-1">{guide.target_muscles}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-400">
                                  <span><strong className="text-white">{ex.sets}</strong> sets</span>
                                  <span><strong className="text-white">{ex.reps}</strong> reps</span>
                                  <span><strong className="text-white">{ex.rest_seconds}s</strong> rest</span>
                                </div>
                                {ex.notes && (
                                  <p className="text-xs text-neutral-500 mt-2 italic">{ex.notes}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progression info */}
            <div className="px-6 py-4 bg-neutral-800/30 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>
                  <strong className="text-white">Weekly Progression:</strong> Each week increases volume, intensity, or weight. Click any exercise to watch the demonstration video and read form instructions.
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Video Guide Modal */}
      {activeGuide && (
        <VideoGuideModal guide={activeGuide} onClose={() => setActiveGuide(null)} />
      )}
    </div>
  );
}

function VideoGuideModal({ guide, onClose }: { guide: ExerciseGuide; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div>
            <h3 className="text-xl font-bold">{guide.exercise_name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${difficultyBadge[guide.difficulty]}`}>
                {guide.difficulty}
              </span>
              <span className="text-sm text-primary-500 flex items-center gap-1">
                <Target className="w-4 h-4" />
                {guide.target_muscles}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video */}
        <div className="p-5">
          <div className="relative aspect-video bg-neutral-800 rounded-xl overflow-hidden group">
            <a
              href={guide.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary-500/15 to-neutral-900 hover:from-primary-500/25 transition-all"
            >
              <div className="w-16 h-16 bg-primary-600 group-hover:bg-primary-500 rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
              <p className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                Click to watch demonstration video
              </p>
              <span className="text-xs text-neutral-500">Opens in new tab</span>
            </a>
          </div>

          {/* Instructions */}
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary-500" />
              How to Perform
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">{guide.instructions}</p>
          </div>

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="bg-neutral-800/50 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p className="text-xs text-neutral-500">Level</p>
              <p className="text-sm font-semibold capitalize">{guide.difficulty}</p>
            </div>
            <div className="bg-neutral-800/50 rounded-xl p-3 text-center">
              <Target className="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p className="text-xs text-neutral-500">Target</p>
              <p className="text-sm font-semibold">{guide.target_muscles}</p>
            </div>
            <div className="bg-neutral-800/50 rounded-xl p-3 text-center">
              <Play className="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p className="text-xs text-neutral-500">Guide</p>
              <p className="text-sm font-semibold">Video + Text</p>
            </div>
          </div>

          {/* CTA */}
          <a
            href={guide.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" fill="white" />
            Watch Full Video Tutorial
          </a>
        </div>
      </div>
    </div>
  );
}
