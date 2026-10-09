package com.opd.opd_management.patient;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // POST /api/patients - Register a new patient
    @PostMapping
    public ResponseEntity<Patient> registerPatient(@Valid @RequestBody Patient patient) {
        Patient savedPatient = patientRepository.save(patient);
        return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
    }

    // GET /api/patients - List all patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // GET /api/patients/search?query=Rahul - Search by name or phone
    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam("query") String query) {
        if (query == null || query.trim().isEmpty()) {
            return patientRepository.findAll();
        }
        return patientRepository.findByNameContainingIgnoreCaseOrPhoneContainingIgnoreCase(query.trim(), query.trim());
    }
}
