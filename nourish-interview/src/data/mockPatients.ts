import { PatientProfile } from '@/types';

/**
 * Mock patient data for the interview challenge
 */
export const mockPatients: PatientProfile[] = [
  {
    id: 'patient-1',
    name: 'Sarah Johnson',
    dailyCalorieTarget: 1800,
    dietaryRestrictions: ['vegetarian', 'dairy-free'],
  },
  {
    id: 'patient-2',
    name: 'Michael Chen',
    dailyCalorieTarget: 2200,
    dietaryRestrictions: ['gluten-free'],
  },
  {
    id: 'patient-3',
    name: 'Emma Rodriguez',
    dailyCalorieTarget: 1600,
    dietaryRestrictions: ['vegan'],
  },
];

// Default patient for the demo
export const defaultPatient = mockPatients[0];
