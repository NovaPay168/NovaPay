alert("script loaded");
// ================================
// NovaPay
// Supabase Config
// ================================

const SUPABASE_URL = "https://eolbdusxixkkfrgainlc.supabase.co";

const SUPABASE_KEY = "sb_publishable_PxTBl0SHkEUtSp8tFz9Icw_cGmuYfEb";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ================================
// Register
// ================================

async function register() {

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const referral = document.getElementById("referral").value.trim();

    if (!fullname || !email || !password || !confirmPassword) {
        alert("Please fill all fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
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

    const user = data.user;

    if (user) {

        await supabase
            .from("profiles")
            .insert({
                id: user.id,
                full_name: fullname,
                email: email,
                balance: 1,
                total_profit: 0,
                referral_code: Math.random().toString(36).substring(2,8).toUpperCase(),
                referred_by: referral || null
            });

    }

    alert("Register Success");

    window.location.href = "login.html";

}
// ================================
// Login
// ================================

async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "dashboard.html";
}

// ================================
// Logout
// ================================

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "login.html";
}

// ================================
// Check Session
// ================================

async function checkSession() {

    const { data } = await supabase.auth.getSession();

    if (!data.session) {

        if (window.location.pathname.includes("dashboard.html")) {
            window.location.href = "login.html";
        }

    }

}

checkSession();
// ================================
// Load Profile
// ================================

async function loadProfile() {

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return;

    const user = sessionData.session.user;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        console.log(error.message);
        return;
    }

    // Display Name
    const name = document.getElementById("userName");
    if (name) {
        name.innerText = data.full_name;
    }

    // Display Balance
    const balance = document.getElementById("balance");
    if (balance) {
        balance.innerText = "$" + Number(data.balance).toFixed(2);
    }

}

// Run on Dashboard
if (window.location.pathname.includes("dashboard.html")) {
    loadProfile();
}
// =========================
// Deposit
// =========================

async function deposit() {

    const amount = Number(
        document.getElementById("depositAmount").value
    );

    if (amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
        alert("Please login first.");
        return;
    }

    const user = sessionData.session.user;

    const { error } = await supabase
        .from("deposits")
        .insert({
            user_id: user.id,
            amount: amount,
            status: "pending"
        });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Deposit request submitted successfully!");
}
// =========================
// Withdraw
// =========================

async function withdrawMoney() {

    const wallet = document.getElementById("wallet").value.trim();
    const amount = Number(document.getElementById("withdrawAmount").value);

    if (!wallet || amount <= 0) {
        alert("Please enter wallet and amount.");
        return;
    }

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
        alert("Please login first.");
        return;
    }

    const user = sessionData.session.user;

    const { error } = await supabase
        .from("withdraws")
        .insert({
            user_id: user.id,
            wallet: wallet,
            amount: amount,
            status: "pending"
        });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Withdraw request submitted successfully!");
}
