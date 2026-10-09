package com.opd.opd_management.appointment;

import com.opd.opd_management.patient.Patient;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    private String doctorName;

    private LocalDateTime appointmentDateTime;

    private String status = "BOOKED";

    public Appointment() {
    }

    public Appointment(Patient patient, String doctorName, LocalDateTime appointmentDateTime) {
        this.patient = patient;
        this.doctorName = doctorName;
        this.appointmentDateTime = appointmentDateTime;
        this.status = "BOOKED";
    }

    public Appointment(Patient patient, String doctorName, LocalDateTime appointmentDateTime, String status) {
        this.patient = patient;
        this.doctorName = doctorName;
        this.appointmentDateTime = appointmentDateTime;
        this.status = status != null ? status : "BOOKED";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
