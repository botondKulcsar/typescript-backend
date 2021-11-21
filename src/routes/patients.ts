import express from "express";
import patientService from "../services/patientService";
import { Entry, HealthCheckRating, Patient } from "../types";
import toNewPatientEntry from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getEntries());
});

router.get("/:id", (req, res) => {
  const foundPatient = patientService.getPatientById(req.params.id);
  if (foundPatient) {
    res.send(foundPatient);
  } else {
    res.sendStatus(404);
  }
});

router.post("/:id/entries", (req, res): void => {
  if (!req.params.id) {
    res.sendStatus(400);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const entry: Entry = req.body;
  const { type, description, date, specialist, diagnosisCodes = [] } = entry;
  if (!type || !description || !date || !specialist) {
    res.sendStatus(400);
    return;
  }

  let savedPatient: Patient | null = null;

  switch (type) {
    case "HealthCheck": {
      const {
        healthCheckRating = null,
      }: { healthCheckRating: HealthCheckRating | null } = entry;
      if (healthCheckRating === null) {
        res.sendStatus(400);
        return;
      }
      savedPatient = patientService.addEntry(req.params.id, {
        type,
        description,
        date,
        specialist,
        diagnosisCodes,
        healthCheckRating,
      });
      break;
    }
    case "OccupationalHealthcare": {
      const { employerName, sickLeave = { startDate: "", endDate: "" } } =
        entry;
      if (!employerName) {
        res.sendStatus(400);
        return;
      }
      savedPatient = patientService.addEntry(req.params.id, {
        type,
        description,
        date,
        specialist,
        diagnosisCodes,
        employerName,
        sickLeave,
      });
      break;
    }
    case "Hospital": {
      const { discharge = { date: "", criteria: "" } } = entry;
      if (!discharge.date || !discharge.criteria) {
        res.sendStatus(400);
        return;
      }
      savedPatient = patientService.addEntry(req.params.id, {
        type,
        description,
        date,
        specialist,
        diagnosisCodes,
        discharge,
      });
      break;
    }
    default: {
      res.sendStatus(400);
      return;
    }
  }

  if (!savedPatient) {
    res.sendStatus(404);
    return;
  }

  res.json(savedPatient);
});

router.post("/", (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatient = toNewPatientEntry(req.body);
    const savedPatient = patientService.addPatient(newPatient);
    res.json(savedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
