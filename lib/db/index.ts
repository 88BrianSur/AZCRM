import { users, clients, progressNotes, sobrietyData, staffSchedules, alumni, alerts } from "./mock-data"

// Simple in-memory database implementation
// This can be replaced with a real database connection later

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

// Users
export const getUsers = async () => {
  return [...users]
}

export const getUserById = async (id: string) => {
  return users.find((user) => user.id === id)
}

export const getUserByEmail = async (email: string) => {
  return users.find((user) => user.email === email)
}

// Clients
export const getClients = async () => {
  return [...clients]
}

export const getClientById = async (id: string) => {
  return clients.find((client) => client.id === id)
}

export const createClient = async (clientData: any) => {
  const newClient = {
    id: generateId(),
    ...clientData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  clients.push(newClient)
  return newClient
}

export const updateClient = async (id: string, clientData: any) => {
  const index = clients.findIndex((client) => client.id === id)
  if (index === -1) return null

  const updatedClient = {
    ...clients[index],
    ...clientData,
    updatedAt: new Date().toISOString(),
  }

  clients[index] = updatedClient
  return updatedClient
}

export const deleteClient = async (id: string) => {
  const index = clients.findIndex((client) => client.id === id)
  if (index === -1) return false

  clients.splice(index, 1)
  return true
}

// Progress Notes
export const getNotes = async () => {
  return [...progressNotes]
}

export const getNotesByClientId = async (clientId: string) => {
  return progressNotes.filter((note) => note.clientId === clientId)
}

export const createNote = async (noteData: any) => {
  const newNote = {
    id: generateId(),
    ...noteData,
    createdAt: new Date().toISOString(),
  }
  progressNotes.push(newNote)
  return newNote
}

// Sobriety Data
export const getSobrietyData = async () => {
  return [...sobrietyData]
}

export const getSobrietyDataByClientId = async (clientId: string) => {
  return sobrietyData.filter((data) => data.clientId === clientId)
}

export const createSobrietyCheckIn = async (checkInData: any) => {
  const newCheckIn = {
    id: generateId(),
    ...checkInData,
    checkInDate: new Date().toISOString(),
  }
  sobrietyData.push(newCheckIn)
  return newCheckIn
}

// Staff Scheduling
export const getStaffSchedules = async () => {
  return [...staffSchedules]
}

export const getSchedulesByStaffId = async (staffId: string) => {
  return staffSchedules.filter((schedule) => schedule.staffId === staffId)
}

export const createSchedule = async (scheduleData: any) => {
  const newSchedule = {
    id: generateId(),
    ...scheduleData,
  }
  staffSchedules.push(newSchedule)
  return newSchedule
}

// Alumni
export const getAlumni = async () => {
  return [...alumni]
}

export const getAlumniById = async (id: string) => {
  return alumni.find((a) => a.id === id)
}

export const createAlumni = async (alumniData: any) => {
  const newAlumni = {
    id: generateId(),
    ...alumniData,
  }
  alumni.push(newAlumni)
  return newAlumni
}

export const updateAlumni = async (id: string, alumniData: any) => {
  const index = alumni.findIndex((a) => a.id === id)
  if (index === -1) return null

  const updatedAlumni = {
    ...alumni[index],
    ...alumniData,
  }

  alumni[index] = updatedAlumni
  return updatedAlumni
}

// Alerts
export const getAlerts = async () => {
  return [...alerts]
}

export const getAlertById = async (id: string) => {
  return alerts.find((alert) => alert.id === id)
}

export const createAlert = async (alertData: any) => {
  const newAlert = {
    id: generateId(),
    ...alertData,
    createdAt: new Date().toISOString(),
  }
  alerts.push(newAlert)
  return newAlert
}

export const updateAlert = async (id: string, alertData: any) => {
  const index = alerts.findIndex((alert) => alert.id === id)
  if (index === -1) return null

  const updatedAlert = {
    ...alerts[index],
    ...alertData,
  }

  alerts[index] = updatedAlert
  return updatedAlert
}

export const deleteAlert = async (id: string) => {
  const index = alerts.findIndex((alert) => alert.id === id)
  if (index === -1) return false

  alerts.splice(index, 1)
  return true
}
