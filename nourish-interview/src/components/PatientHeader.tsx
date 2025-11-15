import { PatientProfile } from '@/types';

interface PatientHeaderProps {
  patient: PatientProfile;
}

/**
 * Display patient information and dietary restrictions
 */
export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="patient-header">
      <div className="patient-info">
        <h2>{patient.name}</h2>
        <p className="calorie-target">
          Daily Target: <strong>{patient.dailyCalorieTarget} calories</strong>
        </p>
      </div>
      {patient.dietaryRestrictions.length > 0 && (
        <div className="dietary-restrictions">
          <span className="label">Dietary Restrictions:</span>
          <div className="tags">
            {patient.dietaryRestrictions.map((tag) => (
              <span key={tag} className="tag restriction">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
