
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'employee' | 'trainer' | 'receptionist';
  email: string;
  startDate?: string;
  status: 'active' | 'inactive';
}

export type MembershipPlan = 'basico' | 'pro' | 'vip';

export interface Customer {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  membershipType: MembershipPlan;
  amountPaid: number;
  expiryDate: string;
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
