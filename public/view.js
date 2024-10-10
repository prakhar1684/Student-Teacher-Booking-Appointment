// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA45O40uOHBp5Yr8ktaXLsTA9IAVPpYdqM",
    authDomain: "student-teacher-appointm-b4dc4.firebaseapp.com",
    projectId: "student-teacher-appointm-b4dc4",
    storageBucket: "student-teacher-appointm-b4dc4.appspot.com",
    messagingSenderId: "594315525087",
    appId: "1:594315525087:web:c895afdb1ac562bc69226a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore initialization

// Display appointments from Firestore
async function displayAppointments() {
    try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        let appointments = [];
        
        querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() });
        });

        const tableBody = document.getElementById('appointments-list');
        tableBody.innerHTML = '';  // Clear existing rows

        appointments.forEach((appointment) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.studentName}</td>
                <td>${appointment.teacherName}</td>
                <td>${appointment.appointmentDate}</td>
                <td>${appointment.appointmentTime}</td>
                <td>${appointment.status}</td>
                <td>
                    <button onclick="approveAppointment('${appointment.id}')">Approve</button>
                    <button onclick="deleteAppointment('${appointment.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

// Approve an appointment
async function approveAppointment(id) {
    try {
        const appointmentRef = doc(db, "appointments", id);
        await updateDoc(appointmentRef, { status: 'Approved' });
        displayAppointments();  // Refresh the list
    } catch (error) {
        console.error('Error approving appointment:', error);
    }
}

// Delete an appointment
async function deleteAppointment(id) {
    try {
        await deleteDoc(doc(db, "appointments", id));
        displayAppointments();  // Refresh the list
    } catch (error) {
        console.error('Error deleting appointment:', error);
    }
}

// Call displayAppointments when the page loads
window.onload = displayAppointments;
