# OPD Management System

A simple, clean, and robust Out-Patient Department (OPD) Management System built with **Java Spring Boot**, **Spring Data JPA**, **H2 In-Memory Database**, and a **Dark-Theme Vanilla JavaScript Web UI**.

---

## 🌟 Key Features

1. **Dashboard Overview**
   - Real-time stat cards (Total Patients, Total Appointments, Today's Appointments, Completed Consultations).
   - Today's appointment schedule preview.
   - Recent patient registrations preview.

2. **Patient Management**
   - Patient registration with validation (Name, Gender, Age, Phone).
   - List all registered patients.
   - Instant search by Name or Phone number (case-insensitive).

3. **Appointment Booking**
   - Book appointments by selecting registered patients.
   - Specify Doctor Name and Appointment Date & Time.
   - Filter appointments by "All" or "Today Only".

4. **Clinical Consultations**
   - Record clinical consultation details for active appointments (Blood Pressure, Temperature, Clinical Notes).
   - Automatically marks appointment status as `COMPLETED`.
   - Prevents duplicate consultations for the same appointment.
   - View completed consultation history per patient.

---

## 🛠️ Technology Stack

- **Backend:** Java 21 / 24, Spring Boot (Spring MVC, Spring Data JPA, Jakarta Validation)
- **Database:** H2 In-Memory Database (`jdbc:h2:mem:...`)
- **Frontend:** Plain HTML5, Vanilla CSS3 (Dark Theme), Vanilla JavaScript (served via Spring Boot static resources)
- **Build Tool:** Apache Maven (via Maven Wrapper `mvnw` / `mvnw.cmd`)

---

## 🚀 Getting Started

### Prerequisites
- JDK 21 or higher installed (`java -version`).
- No local Maven installation required (uses embedded `./mvnw`).

### Build & Run Instructions

1. **Compile & Run Unit Tests:**
   ```bash
   ./mvnw clean test
   ```

2. **Run the Spring Boot Application:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Access the Web Portal:**
   Open your browser and navigate to:
   ```text
   http://localhost:8080/
   ```

---

## 📡 REST API Documentation

### 1. Patient APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/patients` | Register a new patient |
| `GET` | `/api/patients` | List all registered patients |
| `GET` | `/api/patients/search?query=Rahul` | Search patients by name or phone |

#### **Register Patient Request Sample:**
```json
{
  "name": "Rahul Sharma",
  "gender": "Male",
  "age": 30,
  "phone": "9876543210"
}
```

---

### 2. Appointment APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/appointments` | Book a new appointment |
| `GET` | `/api/appointments` | List all appointments |
| `GET` | `/api/appointments/today` | List today's appointments |

#### **Book Appointment Request Sample:**
```json
{
  "patientId": 1,
  "doctorName": "Dr. Shah",
  "appointmentDateTime": "2026-10-09T16:00:00"
}
```

---

### 3. Consultation APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/consultations` | Record consultation & complete appointment |
| `GET` | `/api/consultations` | List all completed consultations |
| `GET` | `/api/consultations/patient/{patientId}` | View consultation history for a patient |

#### **Record Consultation Request Sample:**
```json
{
  "appointmentId": 1,
  "bloodPressure": "120/80",
  "temperature": 98.6,
  "notes": "Mild fever. Prescribed Paracetamol 500mg."
}
```
