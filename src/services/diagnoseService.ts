import diagnoses from '../../data/diagnoses.json';
import { Diagnosis } from '../types';


const getEntries = (): Diagnosis[] => {
    return diagnoses as Diagnosis[];
};

export default {
    getEntries,
};