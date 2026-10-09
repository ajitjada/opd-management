package com.opd.opd_management.consultation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    // Check if a consultation already exists for a specific appointment
    boolean existsByAppointmentId(Long appointmentId);

    // Find all completed consultations for a specific patient
    List<Consultation> findByAppointmentPatientId(Long patientId);
}
