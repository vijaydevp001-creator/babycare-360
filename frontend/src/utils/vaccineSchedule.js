/**
 * Indian Pediatric Vaccination Schedule (Simplified)
 * Based on IAP (Indian Academy of Pediatrics) recommendations.
 */
export const VACCINE_SCHEDULE = [
  {
    age: 'Birth',
    vaccines: [
      { name: 'BCG', description: 'Tuberculosis' },
      { name: 'OPV 0', description: 'Oral Polio Vaccine' },
      { name: 'Hep B 1', description: 'Hepatitis B' }
    ]
  },
  {
    age: '6 Weeks',
    vaccines: [
      { name: 'DTwP 1', description: 'Diphtheria, Tetanus, Pertussis' },
      { name: 'IPV 1', description: 'Inactivated Polio Vaccine' },
      { name: 'Hep B 2', description: 'Hepatitis B' },
      { name: 'Hib 1', description: 'Haemophilus influenzae type b' },
      { name: 'Rotavirus 1', description: 'Rotavirus' },
      { name: 'PCV 1', description: 'Pneumococcal Conjugate Vaccine' }
    ]
  },
  {
    age: '10 Weeks',
    vaccines: [
      { name: 'DTwP 2', description: 'Diphtheria, Tetanus, Pertussis' },
      { name: 'IPV 2', description: 'Inactivated Polio Vaccine' },
      { name: 'Hib 2', description: 'Haemophilus influenzae type b' },
      { name: 'Rotavirus 2', description: 'Rotavirus' },
      { name: 'PCV 2', description: 'Pneumococcal Conjugate Vaccine' }
    ]
  },
  {
    age: '14 Weeks',
    vaccines: [
      { name: 'DTwP 3', description: 'Diphtheria, Tetanus, Pertussis' },
      { name: 'IPV 3', description: 'Inactivated Polio Vaccine' },
      { name: 'Hib 3', description: 'Haemophilus influenzae type b' },
      { name: 'Rotavirus 3', description: 'Rotavirus' },
      { name: 'PCV 3', description: 'Pneumococcal Conjugate Vaccine' }
    ]
  },
  {
    age: '6 Months',
    vaccines: [
      { name: 'OPV 1', description: 'Oral Polio Vaccine' },
      { name: 'Hep B 3', description: 'Hepatitis B' }
    ]
  },
  {
    age: '9 Months',
    vaccines: [
      { name: 'MMR 1', description: 'Measles, Mumps, Rubella' },
      { name: 'OPV 2', description: 'Oral Polio Vaccine' }
    ]
  },
  {
    age: '12 Months',
    vaccines: [
      { name: 'Hepatitis A 1', description: 'Hepatitis A' }
    ]
  },
  {
    age: '15 Months',
    vaccines: [
      { name: 'MMR 2', description: 'Measles, Mumps, Rubella' },
      { name: 'Varicella 1', description: 'Chickenpox' },
      { name: 'PCV Booster', description: 'Pneumococcal Booster' }
    ]
  },
  {
    age: '18 Months',
    vaccines: [
      { name: 'DTwP B1', description: 'DTP Booster 1' },
      { name: 'IPV B1', description: 'Polio Booster 1' },
      { name: 'Hib B1', description: 'Hib Booster 1' }
    ]
  },
  {
    age: '2 Years',
    vaccines: [
      { name: 'Typhoid Conjugate', description: 'Typhoid' }
    ]
  }
];

export const calculateDueDate = (dob, ageLabel) => {
  const date = new Date(dob);
  const match = ageLabel.match(/(\d+)\s+(Week|Month|Year)s?/i);
  if (!match) return date;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.startsWith('week')) {
    date.setDate(date.getDate() + value * 7);
  } else if (unit.startsWith('month')) {
    date.setMonth(date.getMonth() + value);
  } else if (unit.startsWith('year')) {
    date.setFullYear(date.getFullYear() + value);
  }

  return date;
};

export const getVaccineStatus = (dueDate, isCompleted) => {
  if (isCompleted) return 'completed';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < today) return 'overdue';
  return 'upcoming';
};
