package com.opd.opd_management.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Case-insensitive search by name or phone containing the given query string
    List<Patient> findByNameContainingIgnoreCaseOrPhoneContainingIgnoreCase(String name, String phone);
}
