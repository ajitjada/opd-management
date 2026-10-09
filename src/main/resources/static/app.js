// State management
let activeTab = 'dashboard';
let appointmentFilter = 'all';

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initForms();
    initSearch();
    loadDashboard();
});

// Tab Navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    activeTab = tabName;

    // Update buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab sections
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${tabName}-tab`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update Top Title
    const titleMap = {
        'dashboard': 'Dashboard Overview',
        'patients': 'Patient Management',
        'appointments': 'Appointment Management',
        'consultations': 'Clinical Consultations'
    };
    document.getElementById('page-title').textContent = titleMap[tabName] || 'OPD Management';

    // Refresh data for selected tab
    if (tabName === 'dashboard') loadDashboard();
    if (tabName === 'patients') loadPatients();
    if (tabName === 'appointments') {
        loadPatientDropdown();
        loadAppointments(appointmentFilter);
    }
    if (tabName === 'consultations') {
        loadConsultationDropdowns();
    }
}

// Alert Banner Helper
function showAlert(message, type = 'success') {
    const banner = document.getElementById('alert-banner');
    banner.textContent = message;
    banner.className = `alert-banner ${type}`;

    setTimeout(() => {
        banner.className = 'alert-banner hidden';
    }, 4500);
}

// Init Form Listeners
function initForms() {
    // Patient Form
    const patientForm = document.getElementById('patient-form');
    patientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById('patient-name').value.trim(),
            gender: document.getElementById('patient-gender').value,
            age: parseInt(document.getElementById('patient-age').value, 10),
            phone: document.getElementById('patient-phone').value.trim()
        };

        const submitBtn = document.getElementById('patient-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        try {
            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const savedPatient = await res.json();
                showAlert(`Patient "${savedPatient.name}" registered successfully!`, 'success');
                patientForm.reset();
                loadPatients();
                loadDashboard();
            } else {
                const errData = await res.json().catch(() => ({}));
                showAlert(errData.error || errData.message || 'Failed to register patient. Check inputs.', 'error');
            }
        } catch (err) {
            showAlert('Network error reaching server.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '➕ Register Patient';
        }
    });

    // Appointment Form
    const apptForm = document.getElementById('appointment-form');
    apptForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const patientId = document.getElementById('appt-patient-select').value;
        const doctorName = document.getElementById('appt-doctor-name').value.trim();
        const rawDateTime = document.getElementById('appt-datetime').value;

        if (!patientId || !doctorName || !rawDateTime) {
            showAlert('Please complete all required fields.', 'error');
            return;
        }

        const payload = {
            patientId: parseInt(patientId, 10),
            doctorName: doctorName,
            appointmentDateTime: rawDateTime
        };

        const submitBtn = document.getElementById('appt-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Booking...';

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const savedAppt = await res.json();
                showAlert(`Appointment booked successfully for Patient #${savedAppt.patient.id}!`, 'success');
                apptForm.reset();
                loadAppointments(appointmentFilter);
                loadDashboard();
            } else {
                const errData = await res.json().catch(() => ({}));
                showAlert(errData.error || errData.message || 'Failed to book appointment.', 'error');
            }
        } catch (err) {
            showAlert('Network error reaching server.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '📅 Confirm Booking';
        }
    });

    // Consultation Form
    const consultForm = document.getElementById('consultation-form');
    consultForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const apptId = document.getElementById('consult-appt-select').value;
        const bp = document.getElementById('consult-bp').value.trim();
        const tempVal = parseFloat(document.getElementById('consult-temp').value);
        const notes = document.getElementById('consult-notes').value.trim();

        if (!apptId || !bp || isNaN(tempVal)) {
            showAlert('Please fill in appointment, BP, and temperature.', 'error');
            return;
        }

        const payload = {
            appointmentId: parseInt(apptId, 10),
            bloodPressure: bp,
            temperature: tempVal,
            notes: notes
        };

        const submitBtn = document.getElementById('consult-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Recording...';

        try {
            const res = await fetch('/api/consultations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const savedConsult = await res.json();
                showAlert(`Consultation recorded for Appointment #${savedConsult.appointment.id}!`, 'success');
                consultForm.reset();
                loadConsultationDropdowns();
                loadDashboard();
            } else {
                const errData = await res.json().catch(() => ({}));
                showAlert(errData.error || errData.message || 'Failed to record consultation.', 'error');
            }
        } catch (err) {
            showAlert('Network error reaching server.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '📋 Complete Consultation';
        }
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('patient-search-input');
    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            loadPatients(query);
        }, 300);
    });
}

// Dashboard Loader
async function loadDashboard() {
    try {
        const [patientsRes, apptsRes, todayRes, consultsRes] = await Promise.all([
            fetch('/api/patients'),
            fetch('/api/appointments'),
            fetch('/api/appointments/today'),
            fetch('/api/consultations').catch(() => ({ ok: false }))
        ]);

        const patients = patientsRes.ok ? await patientsRes.json() : [];
        const appts = apptsRes.ok ? await apptsRes.json() : [];
        const todayAppts = todayRes.ok ? await todayRes.json() : [];
        const consults = consultsRes.ok ? await consultsRes.json() : [];

        // Update Stat Cards
        document.getElementById('stat-total-patients').textContent = patients.length;
        document.getElementById('stat-total-appointments').textContent = appts.length;
        document.getElementById('stat-today-appointments').textContent = todayAppts.length;
        document.getElementById('stat-total-consultations').textContent = consults.length;

        // Render Today's Schedule Preview
        const todayTable = document.getElementById('dash-today-table');
        if (todayAppts.length === 0) {
            todayTable.innerHTML = `<tr><td colspan="5" class="empty-msg">No appointments scheduled for today</td></tr>`;
        } else {
            todayTable.innerHTML = todayAppts.slice(0, 5).map(a => `
                <tr>
                    <td>#${a.id}</td>
                    <td><strong>${escapeHtml(a.patient ? a.patient.name : 'Unknown')}</strong></td>
                    <td>${escapeHtml(a.doctorName)}</td>
                    <td>${formatDateTime(a.appointmentDateTime)}</td>
                    <td><span class="badge ${a.status === 'COMPLETED' ? 'badge-completed' : 'badge-booked'}">${a.status || 'BOOKED'}</span></td>
                </tr>
            `).join('');
        }

        // Render Recent Patients Preview
        const patientsTable = document.getElementById('dash-patients-table');
        if (patients.length === 0) {
            patientsTable.innerHTML = `<tr><td colspan="4" class="empty-msg">No patients registered yet</td></tr>`;
        } else {
            patientsTable.innerHTML = patients.slice(-5).reverse().map(p => `
                <tr>
                    <td>#${p.id}</td>
                    <td><strong>${escapeHtml(p.name)}</strong></td>
                    <td>${escapeHtml(p.gender)}</td>
                    <td>${escapeHtml(p.phone || '-')}</td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading dashboard stats:', err);
    }
}

// Load Patient List
async function loadPatients(query = '') {
    const tableBody = document.getElementById('patients-table-body');
    try {
        const url = query ? `/api/patients/search?query=${encodeURIComponent(query)}` : '/api/patients';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load patients');

        const patients = await res.json();
        if (patients.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="empty-msg">${query ? 'No matching patients found' : 'No patients registered yet'}</td></tr>`;
            return;
        }

        tableBody.innerHTML = patients.map(p => `
            <tr>
                <td>#${p.id}</td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td>${escapeHtml(p.gender)}</td>
                <td>${p.age} yrs</td>
                <td>${escapeHtml(p.phone || '-')}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="quickBookAppointment(${p.id})">
                        📅 Book Appt
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="6" class="empty-msg text-red">Failed to load patient records</td></tr>`;
    }
}

// Load Patient Select Dropdown in Appointment Form
async function loadPatientDropdown() {
    const select = document.getElementById('appt-patient-select');
    try {
        const res = await fetch('/api/patients');
        if (!res.ok) return;
        const patients = await res.json();

        select.innerHTML = '<option value="">-- Select Registered Patient --</option>' +
            patients.map(p => `<option value="${p.id}">#${p.id} - ${escapeHtml(p.name)} (${p.phone || 'No phone'})</option>`).join('');
    } catch (err) {
        console.error('Failed to load patient dropdown:', err);
    }
}

// Load Appointments
async function loadAppointments(filter = 'all') {
    const tableBody = document.getElementById('appointments-table-body');
    try {
        const url = filter === 'today' ? '/api/appointments/today' : '/api/appointments';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch appointments');

        const appointments = await res.json();
        if (appointments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="empty-msg">${filter === 'today' ? 'No appointments scheduled for today' : 'No appointments recorded'}</td></tr>`;
            return;
        }

        tableBody.innerHTML = appointments.map(a => `
            <tr>
                <td>#${a.id}</td>
                <td><strong>${escapeHtml(a.patient ? a.patient.name : 'Unknown')}</strong> (ID: #${a.patient ? a.patient.id : '-'})</td>
                <td>${escapeHtml(a.doctorName)}</td>
                <td>${formatDateTime(a.appointmentDateTime)}</td>
                <td><span class="badge ${a.status === 'COMPLETED' ? 'badge-completed' : 'badge-booked'}">${a.status || 'BOOKED'}</span></td>
            </tr>
        `).join('');
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="5" class="empty-msg">Failed to load appointments</td></tr>`;
    }
}

// Filter Appointments Toggle
function filterAppointments(type) {
    appointmentFilter = type;
    document.getElementById('filter-all-btn').classList.toggle('active', type === 'all');
    document.getElementById('filter-today-btn').classList.toggle('active', type === 'today');
    loadAppointments(type);
}

// Quick action from patient table
async function quickBookAppointment(patientId) {
    switchTab('appointments');
    await loadPatientDropdown();
    document.getElementById('appt-patient-select').value = patientId;
}

// Consultation Dropdowns & History
async function loadConsultationDropdowns() {
    const apptSelect = document.getElementById('consult-appt-select');
    const patientFilter = document.getElementById('consult-patient-filter');

    try {
        const [apptsRes, patientsRes] = await Promise.all([
            fetch('/api/appointments'),
            fetch('/api/patients')
        ]);

        if (apptsRes.ok) {
            const appts = await apptsRes.json();
            const activeAppts = appts.filter(a => a.status !== 'COMPLETED');

            if (activeAppts.length === 0) {
                apptSelect.innerHTML = '<option value="">-- No pending appointments --</option>';
            } else {
                apptSelect.innerHTML = '<option value="">-- Select Active Appointment --</option>' +
                    activeAppts.map(a => `<option value="${a.id}">Appt #${a.id} - ${escapeHtml(a.patient ? a.patient.name : 'Patient')} (${escapeHtml(a.doctorName)})</option>`).join('');
            }
        }

        if (patientsRes.ok) {
            const patients = await patientsRes.json();
            patientFilter.innerHTML = '<option value="">-- Select Patient History --</option>' +
                patients.map(p => `<option value="${p.id}">#${p.id} - ${escapeHtml(p.name)}</option>`).join('');
        }
    } catch (err) {
        console.error('Failed to load consultation dropdowns:', err);
    }
}

async function loadPatientConsultationHistory() {
    const patientId = document.getElementById('consult-patient-filter').value;
    const tableBody = document.getElementById('consultations-table-body');

    if (!patientId) {
        tableBody.innerHTML = `<tr><td colspan="7" class="empty-msg">Select a patient above to view history</td></tr>`;
        return;
    }

    try {
        const res = await fetch(`/api/consultations/patient/${patientId}`);
        if (!res.ok) throw new Error('Failed to load history');

        const consults = await res.json();
        if (consults.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="empty-msg">No completed consultations found for this patient</td></tr>`;
            return;
        }

        tableBody.innerHTML = consults.map(c => `
            <tr>
                <td>#${c.id}</td>
                <td>#${c.appointment ? c.appointment.id : '-'}</td>
                <td><strong>${escapeHtml(c.appointment && c.appointment.patient ? c.appointment.patient.name : 'Patient')}</strong></td>
                <td>${escapeHtml(c.appointment ? c.appointment.doctorName : '-')}</td>
                <td><span class="badge badge-booked">${escapeHtml(c.bloodPressure)}</span></td>
                <td>${c.temperature} °F</td>
                <td>${escapeHtml(c.notes || '-')}</td>
            </tr>
        `).join('');
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="7" class="empty-msg text-red">Failed to load consultation history</td></tr>`;
    }
}

// Formatting Utilities
function formatDateTime(dtStr) {
    if (!dtStr) return '-';
    try {
        const date = new Date(dtStr);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dtStr;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[match]);
}
