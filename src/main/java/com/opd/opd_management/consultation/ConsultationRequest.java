package com.opd.opd_management.consultation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ConsultationRequest {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @NotBlank(message = "Blood pressure is required")
    private String bloodPressure;

    @NotNull(message = "Temperature is required")
    private Double temperature;

    private String notes;

    public ConsultationRequest() {
    }

    public ConsultationRequest(Long appointmentId, String bloodPressure, Double temperature, String notes) {
        this.appointmentId = appointmentId;
        this.bloodPressure = bloodPressure;
        this.temperature = temperature;
        this.notes = notes;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
