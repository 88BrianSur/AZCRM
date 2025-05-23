// Mock data for the application
// This simulates a database until you can connect to a real database service

// Users
export const users = [
  {
    id: "1",
    email: "admin@azhouse.org",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2023-01-01").toISOString(),
  },
  {
    id: "2",
    email: "staff@azhouse.org",
    name: "Staff Member",
    role: "staff",
    createdAt: new Date("2023-01-15").toISOString(),
  },
  {
    id: "3",
    email: "support@azhouse.org",
    name: "Support Staff",
    role: "support",
    createdAt: new Date("2023-02-01").toISOString(),
  },
]

// Clients
export const clients = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1985-06-15",
    gender: "male",
    email: "john.doe@example.com",
    phone: "480-555-1234",
    address: "123 Recovery Rd, Phoenix, AZ 85001",
    status: "active",
    programType: "residential",
    admissionDate: "2023-03-10",
    emergencyContact: "Jane Doe (Sister) - 480-555-5678",
    insuranceProvider: "Blue Cross Blue Shield",
    insuranceNumber: "BCBS12345678",
    medicalConditions: "None",
    medications: "Antabuse 250mg daily",
    allergies: "Penicillin",
    legalStatus: "Probation until 2024",
    assignedCounselor: "Dr. Smith",
    notes: "Making good progress in group therapy sessions.",
    createdAt: new Date("2023-03-10").toISOString(),
    updatedAt: new Date("2023-05-15").toISOString(),
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1990-08-22",
    gender: "female",
    email: "jane.smith@example.com",
    phone: "480-555-4321",
    address: "456 Healing Ave, Tempe, AZ 85281",
    status: "active",
    programType: "outpatient",
    admissionDate: "2023-04-05",
    emergencyContact: "Robert Smith (Brother) - 480-555-8765",
    insuranceProvider: "Aetna",
    insuranceNumber: "AET87654321",
    medicalConditions: "Anxiety, Depression",
    medications: "Prozac 20mg daily, Xanax 0.5mg as needed",
    allergies: "None",
    legalStatus: "Clean record",
    assignedCounselor: "Dr. Johnson",
    notes: "Attending all scheduled sessions, showing commitment to recovery.",
    createdAt: new Date("2023-04-05").toISOString(),
    updatedAt: new Date("2023-05-20").toISOString(),
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    dateOfBirth: "1978-11-30",
    gender: "male",
    email: "michael.johnson@example.com",
    phone: "480-555-9876",
    address: "789 Sober St, Scottsdale, AZ 85250",
    status: "completed",
    programType: "residential",
    admissionDate: "2023-01-15",
    dischargeDate: "2023-04-15",
    emergencyContact: "Sarah Johnson (Wife) - 480-555-6543",
    insuranceProvider: "UnitedHealthcare",
    insuranceNumber: "UHC45678901",
    medicalConditions: "Hypertension",
    medications: "Lisinopril 10mg daily",
    allergies: "Sulfa drugs",
    legalStatus: "Completed probation",
    assignedCounselor: "Dr. Williams",
    notes: "Successfully completed 90-day program. Recommended for aftercare.",
    createdAt: new Date("2023-01-15").toISOString(),
    updatedAt: new Date("2023-04-15").toISOString(),
  },
]

// Progress Notes
export const progressNotes = [
  {
    id: "1",
    clientId: "1",
    authorId: "2",
    authorName: "Staff Member",
    noteType: "individual",
    content:
      "Client participated actively in individual session today. Discussed triggers and coping strategies. Client identified family gatherings as a major trigger and we developed a plan for the upcoming family reunion.",
    createdAt: new Date("2023-04-10T10:30:00").toISOString(),
  },
  {
    id: "2",
    clientId: "1",
    authorId: "2",
    authorName: "Staff Member",
    noteType: "group",
    content:
      "Client shared his story in group therapy for the first time. Showed vulnerability and received positive feedback from peers. Appears to be building trust with the group.",
    createdAt: new Date("2023-04-12T14:00:00").toISOString(),
  },
  {
    id: "3",
    clientId: "2",
    authorId: "3",
    authorName: "Support Staff",
    noteType: "individual",
    content:
      "Client reported increased anxiety this week due to job interview. We practiced relaxation techniques and prepared for potential stress during the interview process. Client demonstrated good use of breathing exercises.",
    createdAt: new Date("2023-04-15T11:15:00").toISOString(),
  },
]

// Sobriety Tracking
export const sobrietyData = [
  {
    id: "1",
    clientId: "1",
    checkInDate: new Date("2023-04-01").toISOString(),
    sobrietyStatus: "maintained",
    mood: "good",
    stressLevel: "moderate",
    triggers: "Work stress",
    copingMechanisms: "Exercise, meditation",
    notes: "Feeling positive about progress",
  },
  {
    id: "2",
    clientId: "1",
    checkInDate: new Date("2023-04-08").toISOString(),
    sobrietyStatus: "maintained",
    mood: "excellent",
    stressLevel: "low",
    triggers: "None significant",
    copingMechanisms: "Support group, journaling",
    notes: "One week milestone achieved",
  },
  {
    id: "3",
    clientId: "2",
    checkInDate: new Date("2023-04-05").toISOString(),
    sobrietyStatus: "maintained",
    mood: "fair",
    stressLevel: "high",
    triggers: "Family conflict",
    copingMechanisms: "Called sponsor, attended meeting",
    notes: "Difficult week but maintained sobriety",
  },
]

// Staff Scheduling
export const staffSchedules = [
  {
    id: "1",
    staffId: "2",
    staffName: "Staff Member",
    date: new Date("2023-05-01").toISOString(),
    shift: "morning",
    startTime: "07:00",
    endTime: "15:00",
    notes: "Group therapy at 10:00",
  },
  {
    id: "2",
    staffId: "3",
    staffName: "Support Staff",
    date: new Date("2023-05-01").toISOString(),
    shift: "evening",
    startTime: "15:00",
    endTime: "23:00",
    notes: "New client intake scheduled",
  },
  {
    id: "3",
    staffId: "2",
    staffName: "Staff Member",
    date: new Date("2023-05-02").toISOString(),
    shift: "morning",
    startTime: "07:00",
    endTime: "15:00",
    notes: "Team meeting at 09:00",
  },
]

// Alumni
export const alumni = [
  {
    id: "1",
    clientId: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    phone: "480-555-9876",
    graduationDate: new Date("2023-04-15").toISOString(),
    programCompleted: "residential",
    currentStatus: "employed",
    sobrietyDate: new Date("2023-01-15").toISOString(),
    lastContactDate: new Date("2023-05-01").toISOString(),
    notes: "Doing well. Started new job. Attending weekly alumni support group.",
  },
  {
    id: "2",
    clientId: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    phone: "480-555-1122",
    graduationDate: new Date("2023-03-20").toISOString(),
    programCompleted: "outpatient",
    currentStatus: "employed",
    sobrietyDate: new Date("2022-12-10").toISOString(),
    lastContactDate: new Date("2023-04-25").toISOString(),
    notes: "Maintaining sobriety. Volunteering as peer mentor on weekends.",
  },
]

// Alerts
export const alerts = [
  {
    id: "1",
    title: "Missed Appointment",
    description: "John Doe missed scheduled therapy session",
    type: "client",
    priority: "medium",
    status: "active",
    clientId: "1",
    assignedTo: "2",
    createdAt: new Date("2023-05-10T09:30:00").toISOString(),
    dueDate: new Date("2023-05-12T17:00:00").toISOString(),
  },
  {
    id: "2",
    title: "Insurance Expiring",
    description: "Jane Smith's insurance coverage expires in 10 days",
    type: "administrative",
    priority: "high",
    status: "active",
    clientId: "2",
    assignedTo: "1",
    createdAt: new Date("2023-05-11T11:15:00").toISOString(),
    dueDate: new Date("2023-05-15T17:00:00").toISOString(),
  },
  {
    id: "3",
    title: "Staff Meeting",
    description: "Quarterly staff meeting to review protocols",
    type: "staff",
    priority: "low",
    status: "pending",
    assignedTo: "1",
    createdAt: new Date("2023-05-12T14:00:00").toISOString(),
    dueDate: new Date("2023-05-20T10:00:00").toISOString(),
  },
]
