// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA45O40uOHBp5Yr8ktaXLsTA9IAVPpYdqM",
    authDomain: "student-teacher-appointm-b4dc4.firebaseapp.com",
    projectId: "student-teacher-appointm-b4dc4",
    storageBucket: "student-teacher-appointm-b4dc4.appspot.com",
    messagingSenderId: "594315525087",
    appId: "1:594315525087:web:c895afdb1ac562bc69226a"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to book an appointment with concurrency management
document.getElementById('book-appointment-button').addEventListener('click', async (event) => {
    event.preventDefault();  // Prevent the form from submitting

    // Get input values
    const email = document.getElementById('appointment-email').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const teacherName = document.getElementById('teacher-name').value;
    const studentName = document.getElementById('student-name').value;

    // Validate input
    if (!email || !date || !time || !teacherName || !studentName) {
        document.getElementById('booking-message').innerText = 'Please fill in all fields.';
        return;
    }

    const appointmentData = {
        email,
        appointmentDate: date,
        appointmentTime: time,
        teacherName,
        studentName,
        status: "Pending"
    };

    try {
        // Simulate concurrency using a lock to avoid race conditions
        const lock = new Mutex();
        await lock.runExclusive(async () => {
            // Add appointment to Firestore
            await addDoc(collection(db, "appointments"), appointmentData);
            document.getElementById('booking-message').innerText = 'Appointment booked successfully!';
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        document.getElementById('booking-message').innerText = `Error: ${error.message}`;
    }
});

// Mutex implementation for managing concurrency
class Mutex {
    constructor() {
        this._locked = false;
        this._waiting = [];
    }

    async lock() {
        if (this._locked) {
            await new Promise(resolve => this._waiting.push(resolve));
        }
        this._locked = true;
    }

    unlock() {
        this._locked = false;
        if (this._waiting.length > 0) {
            const resolve = this._waiting.shift();
            resolve();
        }
    }

    async runExclusive(callback) {
        await this.lock();
        try {
            return await callback();
        } finally {
            this.unlock();
        }
    }
}
