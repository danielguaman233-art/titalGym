
export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
  role: 'admin' | 'employee' | 'trainer' | 'receptionist' | 'client';
  email: string;
  startDate?: string;
  status: 'active' | 'inactive';
  gymDays?: number;
  activeRoutineId?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  authorId: string;
  authorName: string;
  isPublic: boolean;
}

export type MembershipPlan = 'basico' | 'pro' | 'vip';

export interface Customer extends User {
  registrationDate: string;
  membershipType: MembershipPlan;
  amountPaid: number;
  expiryDate: string;
}

export interface ScheduledExercise {
  id: string;
  name: string;
  sets: number;
  weight: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  isPublic: boolean;
  assignedToId?: string;
  schedule: { [key: string]: ScheduledExercise[] };
  createdAt: string;
}

export interface SetLog {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  name: string;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  routineId: string;
  date: string;
  dayName: string;
  exercises: ExerciseLog[];
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'in' | 'out';
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Suggestion {
  id: string;
  customerId: string;
  customerName: string;
  text: string;
  date: string;
  category: string;
}

export interface Activity {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}
