package com.opd.opd_management.appointment;

import com.opd.opd_management.patient.Patient;
import com.opd.opd_management.patient.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    // Constructor injection
    public AppointmentController(AppointmentRepository appointmentRepository, PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    // 1. POST /api/appointments - Book a new appointment
    @PostMapping
    public ResponseEntity<?> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        Optional<Patient> patientOptional = patientRepository.findById(request.getPatientId());

        if (patientOptional.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Patient not found with ID: " + request.getPatientId());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        Patient patient = patientOptional.get();
        Appointment appointment = new Appointment(
                patient,
                request.getDoctorName(),
                request.getAppointmentDateTime(),
                "BOOKED"
        );

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
    }

    // 2. GET /api/appointments - List all appointments
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 3. GET /api/appointments/today - List today's appointments
    @GetMapping("/today")
    public List<Appointment> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        return appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay);
    }
}
