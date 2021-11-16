import diagnoses from '../../data/diagnoses.json';
import { Diagnose } from '../types';


const getEntries = (): Diagnose[] => {
    return diagnoses as Diagnose[];
};

export default {
    getEntries,
};