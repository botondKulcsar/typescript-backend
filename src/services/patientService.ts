import patients from '../../data/patients.json';
import { NewPatient, NonSensitivePatient, Patient } from '../types';
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
            ...foundPatient,
            entries: []
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

export default {
    getEntries,
    addPatient,
    getPatientById
};