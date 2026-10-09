package com.opd.opd_management.consultation;

import com.opd.opd_management.appointment.Appointment;
import com.opd.opd_management.appointment.AppointmentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;

    // Constructor injection
    public ConsultationController(ConsultationRepository consultationRepository, AppointmentRepository appointmentRepository) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // 1. POST /api/consultations - Create consultation for an appointment
    @PostMapping
    public ResponseEntity<?> createConsultation(@Valid @RequestBody ConsultationRequest request) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(request.getAppointmentId());

        if (appointmentOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Appointment not found with ID: " + request.getAppointmentId());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        // Prevent duplicate consultations for the same appointment
        if (consultationRepository.existsByAppointmentId(request.getAppointmentId())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "A consultation has already been recorded for Appointment ID: " + request.getAppointmentId());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        Appointment appointment = appointmentOpt.get();

        Consultation consultation = new Consultation(
                appointment,
                request.getBloodPressure(),
                request.getTemperature(),
                request.getNotes()
        );

        Consultation savedConsultation = consultationRepository.save(consultation);

        // Update appointment status to COMPLETED
        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);

        return new ResponseEntity<>(savedConsultation, HttpStatus.CREATED);
    }

    // 2. GET /api/consultations - List all consultations
    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    // 3. GET /api/consultations/patient/{patientId} - View completed consultations for a patient
    @GetMapping("/patient/{patientId}")
    public List<Consultation> getPatientConsultations(@PathVariable Long patientId) {
        return consultationRepository.findByAppointmentPatientId(patientId);
    }
}
