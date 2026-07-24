const SUPABASE_URL = "https://bqlswfkhreryhgnlzwic.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbmF3b3dudGJmaHdoZ2V1b3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MTk5MTYsImV4cCI6MjEwMDM5NTkxNn0.CwarFveJlZtnZ2Iu0VLD3A8OM0QMQP3_6tWRZ9BcCpg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
// ===============================
// Register
// ===============================

async function register() {

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const referral = document.getElementById("referral").value.trim();

    if (!fullname || !email || !password || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Registration successful! Please login.");

    window.location.href = "login.html";
}

// ===============================
// Login
// ===============================

async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "dashboard.html";
           }
