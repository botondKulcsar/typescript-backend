import patients from '../../data/patients';
import { Entry, NewPatient, NonSensitivePatient, Patient } from '../types';
import { v1 as uuid } from 'uuid';
import { parseString } from '../utils';

const getEntries = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    })) as NonSensitivePatient[];
};

const getPatientById = (id: string): Patient | undefined  => {
    const foundPatient = patients.find(p => p.id === id);
    if (foundPatient) {
        return {
            ...foundPatient
        } as Patient;
    }
    return undefined;
};

const addPatient = (newPatient: NewPatient): Patient => {
   
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const id = parseString(uuid());
    const patient = {
        id,
        ...newPatient
    };

    patients.push(patient);
    return patient;
};

const addEntry = (patientId: string, entry: Entry): Patient | null => {
    const patient = getPatientById(patientId);
    if (!patient) {
        return null;
    }
    const id = parseString(uuid());
    const newEntry = {
        id,
        ...entry
    };
    patient.entries.push(newEntry);
    return patient;
};

export default {
    getEntries,
    addPatient,
    getPatientById,
    addEntry
};