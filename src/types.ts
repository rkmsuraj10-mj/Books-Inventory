export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  moduleNumber: number;
  category: string;
  topic: 'chronology' | 'speeches' | 'philosophy';
  prompt: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  points: number;
  explanation: {
    title: string;
    scholarlyNote: string;
    canonicalSource: string;
    historicalImpact: string;
  };
}

export interface CourseModule {
  id: number;
  numberStr: string;
  title: string;
  description: string;
  estimatedMins: number;
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  questionCount: number;
  status: 'completed' | 'in-progress' | 'up-next' | 'locked';
  scorePercent?: number;
  currentQuestionIndex?: number;
}

export interface UserAssessmentState {
  currentModuleId: number;
  currentQuestionIndex: number;
  selectedAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestions: Record<number, boolean>;
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  isSubmitted: boolean;
  score: number;
}

export interface StudentProfile {
  name: string;
  institution: string;
  certificateId: string;
  enrolledDate: string;
  aggregateScore: number;
  modulesCompleted: number;
  totalModules: number;
  honorsConferred: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  institution: string;
  score: number;
  badge: string;
  completionTime: string;
}
