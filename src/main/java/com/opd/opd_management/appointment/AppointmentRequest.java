package com.opd.opd_management.appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AppointmentRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotNull(message = "Appointment date and time is required")
    private LocalDateTime appointmentDateTime;

    public AppointmentRequest() {
    }

    public AppointmentRequest(Long patientId, String doctorName, LocalDateTime appointmentDateTime) {
        this.patientId = patientId;
        this.doctorName = doctorName;
        this.appointmentDateTime = appointmentDateTime;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }
}
