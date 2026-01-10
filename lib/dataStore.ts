// Shared data store (in-memory for now, can be replaced with MongoDB later)
export type ClassData = {
  id: number;
  name: string;
  status: 'ongoing' | 'upcoming';
  schedule: string;
  time: string;
  university: string;
  college?: string;
  branch: string;
  semester: string;
};

export type ResourceData = {
  id: string;
  name: string;
  university: string;
  college?: string;
  branch?: string;
  semester?: string;
  type: 'notes' | 'pyq' | 'handwritten';
  fileUrl: string;
  uploadedAt: Date;
};

// In-memory storage (will persist during runtime)
let classesStore: ClassData[] = [
  { id: 1, name: 'Advanced Mathematics IV', status: 'ongoing', schedule: 'Mon, Wed, Fri', time: '6:00 PM - 7:30 PM', university: 'vtu', branch: 'cse', semester: '4th' },
  { id: 2, name: 'Digital Signal Processing', status: 'ongoing', schedule: 'Tue, Thu', time: '5:00 PM - 6:30 PM', university: 'vtu', branch: 'ece', semester: '5th' },
  { id: 3, name: 'Data Structures & Algorithms', status: 'upcoming', schedule: 'Starts Jan 15', time: 'Weekend Batch', university: 'vtu', branch: 'cse', semester: '3rd' },
  { id: 4, name: 'Engineering Mechanics', status: 'ongoing', schedule: 'Mon, Wed', time: '4:00 PM - 5:30 PM', university: 'vtu', branch: 'mech', semester: '3rd' },
  { id: 5, name: 'Object Oriented Programming', status: 'upcoming', schedule: 'Starts Jan 20', time: 'Weekday Evening', university: 'autonomous', college: 'bms', branch: 'cse', semester: '3rd' },
  { id: 6, name: 'Analog Electronics', status: 'ongoing', schedule: 'Tue, Fri', time: '6:00 PM - 7:30 PM', university: 'autonomous', college: 'rv', branch: 'ece', semester: '4th' },
];

let resourcesStore: ResourceData[] = [
  { id: 'math1', name: 'Engineering Mathematics I', university: 'vtu', semester: '1st', type: 'notes', fileUrl: '#', uploadedAt: new Date('2026-01-01') },
  { id: 'phy', name: 'Engineering Physics', university: 'vtu', semester: '1st', type: 'pyq', fileUrl: '#', uploadedAt: new Date('2026-01-02') },
  { id: 'dsa', name: 'Data Structures', university: 'vtu', branch: 'cse', semester: '3rd', type: 'notes', fileUrl: '#', uploadedAt: new Date('2026-01-03') },
];

// Classes CRUD
export const getClasses = () => classesStore;
export const addClass = (classData: Omit<ClassData, 'id'>) => {
  const newClass = { ...classData, id: Date.now() };
  classesStore.push(newClass);
  return newClass;
};
export const updateClass = (id: number, updates: Partial<ClassData>) => {
  const index = classesStore.findIndex(c => c.id === id);
  if (index !== -1) {
    classesStore[index] = { ...classesStore[index], ...updates };
    return classesStore[index];
  }
  return null;
};
export const deleteClass = (id: number) => {
  classesStore = classesStore.filter(c => c.id !== id);
};

// Resources CRUD
export const getResources = () => resourcesStore;
export const addResource = (resource: Omit<ResourceData, 'id' | 'uploadedAt'>) => {
  const newResource = { ...resource, id: Date.now().toString(), uploadedAt: new Date() };
  resourcesStore.push(newResource);
  return newResource;
};
export const deleteResource = (id: string) => {
  resourcesStore = resourcesStore.filter(r => r.id !== id);
};
