import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import "./App.css";

function App() {
  // =========================
  // AUTH STATE
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [authTab, setAuthTab] = useState("login");

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // =========================
  // DATA
  // =========================

  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);

  // Client profile
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSessions, setClientSessions] = useState([]);

  // =========================
  // FORMS
  // =========================

  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    sessions: "",
    price: "",
    validityDays: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    client: "",
    package: "",
    amount: "",
  });

  const [bookingForm, setBookingForm] = useState({
    client: "",
    startTime: "",
    endTime: "",
    sessionType: "",
    notes: "",
  });

  // =========================
  // UI STATE
  // =========================

  const [showClientForm, setShowClientForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // =========================
  // LOAD DATA
  // =========================

  const loadClients = async () => {
    try {
      const data = await apiRequest("/api/clients");
      setClients(data.clients || []);
    } catch (error) {
      console.log("Clients:", error.message);
    }
  };

  const loadClientProfile = async (clientId) => {
    try {
      const clientData = await apiRequest(
        `/api/clients/${clientId}`
      );

      const sessionData = await apiRequest(
        `/api/clients/${clientId}/sessions`
      );

      setSelectedClient(clientData.client);
      setClientSessions(sessionData.sessions || []);
    } catch (error) {
      alert(error.message || "Failed to load client profile");
    }
  };

  const closeClientProfile = () => {
    setSelectedClient(null);
    setClientSessions([]);
  };

  const loadSessions = async () => {
    try {
      const data = await apiRequest("/api/sessions");
      setSessions(data.sessions || []);
    } catch (error) {
      console.log("Sessions:", error.message);
    }
  };

  const loadPackages = async () => {
    try {
      const data = await apiRequest("/api/packages");
      setPackages(data.packages || []);
    } catch (error) {
      console.log("Packages:", error.message);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await apiRequest("/api/payments");
      setPayments(data.payments || []);
    } catch (error) {
      console.log("Payments:", error.message);
    }
  };

  const loadAllData = async () => {
    await Promise.all([
      loadClients(),
      loadSessions(),
      loadPackages(),
      loadPayments(),
    ]);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadAllData();
    }
  }, []);

  // =========================
  // AUTHENTICATION
  // =========================

  const registerTherapist = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest(
        "/api/therapists/register",
        {
          method: "POST",
          body: JSON.stringify(registerData),
        }
      );

      alert(data.message || "Registration successful");

      setRegisterData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        password: "",
      });

      setAuthTab("login");
    } catch (error) {
      alert(error.message || "Registration failed");
    }
  };

  const loginTherapist = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest(
        "/api/therapists/login",
        {
          method: "POST",
          body: JSON.stringify(loginData),
        }
      );

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);

      await loadAllData();
    } catch (error) {
      alert(error.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);

    setClients([]);
    setSessions([]);
    setPackages([]);
    setPayments([]);

    setSelectedClient(null);
    setClientSessions([]);
  };

  // =========================
  // CLIENT
  // =========================

  const addClient = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/clients", {
        method: "POST",
        body: JSON.stringify(clientForm),
      });

      alert(data.message || "Client added successfully");

      setClientForm({
        name: "",
        email: "",
        phone: "",
      });

      setShowClientForm(false);

      await loadClients();
    } catch (error) {
      alert(error.message || "Failed to add client");
    }
  };

  // =========================
  // PACKAGE
  // =========================

  const createPackage = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/packages", {
        method: "POST",
        body: JSON.stringify({
          name: packageForm.name,
          description: packageForm.description,
          sessions: Number(packageForm.sessions),
          price: Number(packageForm.price),
          validityDays: Number(packageForm.validityDays),
        }),
      });

      alert(data.message || "Package created successfully");

      setPackageForm({
        name: "",
        description: "",
        sessions: "",
        price: "",
        validityDays: "",
      });

      setShowPackageForm(false);

      await loadPackages();
    } catch (error) {
      alert(error.message || "Failed to create package");
    }
  };

  // =========================
  // PAYMENT
  // =========================

  const createPayment = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          client: paymentForm.client,
          package: paymentForm.package,
          amount: Number(paymentForm.amount),
        }),
      });

      alert(data.message || "Payment created successfully");

      setPaymentForm({
        client: "",
        package: "",
        amount: "",
      });

      setShowPaymentForm(false);

      await loadPayments();
    } catch (error) {
      alert(error.message || "Failed to create payment");
    }
  };

  // =========================
  // SESSION
  // =========================

  const bookSession = async (e) => {
    e.preventDefault();
    if (
  new Date(bookingForm.endTime) <=
  new Date(bookingForm.startTime)
) {
  alert("End time must be after start time.");
  return;
}

    try {
      const data = await apiRequest("/api/sessions", {
        method: "POST",
        body: JSON.stringify({
          client: bookingForm.client,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          sessionType: Number(bookingForm.sessionType),
          notes: bookingForm.notes,
        }),
      });

      alert(data.message || "Session booked successfully");

      setBookingForm({
        client: "",
        startTime: "",
        endTime: "",
        sessionType: "",
        notes: "",
      });

      setShowBookingForm(false);

      await loadSessions();
    } catch (error) {
      alert(error.message || "Failed to book session");
    }
  };

  const cancelSession = async (sessionId) => {
    try {
      const data = await apiRequest(
        `/api/sessions/${sessionId}/cancel`,
        {
          method: "PATCH",
        }
      );

      alert(data.message || "Session cancelled successfully");

      await loadSessions();

      if (selectedClient) {
        await loadClientProfile(selectedClient._id);
      }
    } catch (error) {
      alert(error.message || "Failed to cancel session");
    }
  };

  const completeSession = async (sessionId) => {
    try {
      const data = await apiRequest(
        `/api/sessions/${sessionId}/complete`,
        {
          method: "PATCH",
        }
      );

      alert(data.message || "Session completed successfully");

      await loadSessions();

      if (selectedClient) {
        await loadClientProfile(selectedClient._id);
      }
    } catch (error) {
      alert(error.message || "Failed to complete session");
    }
  };

  // =========================
  // SCROLL
  // =========================

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =========================
  // LANDING + LOGIN
  // =========================

  if (!isLoggedIn) {
    return (
      <div className="auth-page">

        <section className="auth-hero">

          <div className="brand-logo">U</div>

          <p className="auth-label">
            Therapist management platform
          </p>

          <h1>
            Run your practice,
            <br />
            <span>not your paperwork.</span>
          </h1>

          <p>
            Unfazed keeps your clients, sessions, packages and
            payments together in one calm workspace.
          </p>

          <div className="hero-features">

            <div className="hero-feature">
              <strong>✓ Client records</strong>

              <span>
                Keep client information organized and easy to access.
              </span>
            </div>

            <div className="hero-feature">
              <strong>◷ Scheduling</strong>

              <span>
                Book and track sessions without unnecessary paperwork.
              </span>
            </div>

            <div className="hero-feature">
              <strong>₹ Payments</strong>

              <span>
                Keep packages and payment records together.
              </span>
            </div>

          </div>

        </section>

        <section className="auth-panel">

          <div className="auth-card">

            <div className="auth-card-header">

              <div className="auth-card-logo">U</div>

              <p className="auth-label">
                Therapist access
              </p>

              <h2>
                {authTab === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="auth-card-subtitle">
                {authTab === "login"
                  ? "Sign in to your Unfazed workspace"
                  : "Start managing your practice with Unfazed"}
              </p>

            </div>

            <div className="auth-tabs">

              <button
                type="button"
                className={
                  authTab === "login"
                    ? "auth-tab active"
                    : "auth-tab"
                }
                onClick={() => setAuthTab("login")}
              >
                Log in
              </button>

              <button
                type="button"
                className={
                  authTab === "register"
                    ? "auth-tab active"
                    : "auth-tab"
                }
                onClick={() => setAuthTab("register")}
              >
                Create account
              </button>

            </div>

            {authTab === "login" ? (

              <form
                className="auth-form"
                onSubmit={loginTherapist}
              >

                <div className="form-group">

                  <label>Email address</label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        email: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Log in to dashboard →
                </button>

                <p className="auth-switch">
                  New to Unfazed?{" "}

                  <button
                    type="button"
                    onClick={() => setAuthTab("register")}
                  >
                    Create an account
                  </button>

                </p>

              </form>

            ) : (

              <form
                className="auth-form"
                onSubmit={registerTherapist}
              >

                <div className="form-group">

                  <label>Full name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Email address</label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Phone number</label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Specialization</label>

                  <input
                    type="text"
                    placeholder="e.g. Clinical Psychology"
                    value={registerData.specialization}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        specialization: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create account →
                </button>

                <p className="auth-switch">
                  Already have an account?{" "}

                  <button
                    type="button"
                    onClick={() => setAuthTab("login")}
                  >
                    Log in instead
                  </button>

                </p>

              </form>

            )}

          </div>

        </section>

      </div>
    );
  }

  // =========================
  // DASHBOARD CALCULATIONS
  // =========================

  const now = new Date();

  const upcomingSessions = sessions
    .filter(
      (session) =>
        session.status === "booked" &&
        session.startTime &&
        new Date(session.startTime) >= now
    )
    .sort(
      (a, b) =>
        new Date(a.startTime) - new Date(b.startTime)
    );

  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  );

  const totalRevenue = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">U</div>

          <span>Unfazed</span>

        </div>

        <nav className="sidebar-nav">

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            ⌂ &nbsp; Dashboard
          </button>

          <button
            onClick={() => scrollToSection("clients")}
          >
            ♙ &nbsp; Clients
          </button>

          <button
            onClick={() => scrollToSection("sessions")}
          >
            ◷ &nbsp; Sessions
          </button>

          <button
            onClick={() => scrollToSection("packages")}
          >
            ◫ &nbsp; Packages
          </button>

          <button
            onClick={() => scrollToSection("payments")}
          >
            ₹ &nbsp; Payments
          </button>

          <button
            onClick={() => scrollToSection("schedule")}
          >
            ▣ &nbsp; Schedule
          </button>

        </nav>

        <div className="sidebar-footer">

          <button
            className="logout-button"
            onClick={logout}
          >
            ⇥ &nbsp; Log out
          </button>

        </div>

      </aside>

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="auth-label">
              YOUR WORKSPACE
            </p>

            <h1>
              Good to see you.
            </h1>

            <p>
              Here's what's happening with your practice today.
            </p>

          </div>

          <div className="status">
            ● Therapist workspace
          </div>

        </header>

        {/* WELCOME BANNER */}

        <div className="welcome-banner">

          <p className="auth-label">
            YOUR PRACTICE AT A GLANCE
          </p>

          <h2>
            A calmer way to manage your practice.
          </h2>

          <p>
            Everything you need to keep your practice organized,
            in one place.
          </p>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-card-label">
              CLIENTS
            </div>

            <p className="stat-card-value">
              {clients.length}
            </p>

            <p className="stat-card-label">
              Total clients
            </p>

          </div>

          <div className="stat-card">

            <div className="stat-card-label">
              UPCOMING
            </div>

            <p className="stat-card-value">
              {upcomingSessions.length}
            </p>

            <p className="stat-card-label">
              Upcoming sessions
            </p>

          </div>

          <div className="stat-card">

            <div className="stat-card-label">
              COMPLETED
            </div>

            <p className="stat-card-value">
              {completedSessions.length}
            </p>

            <p className="stat-card-label">
              Completed sessions
            </p>

          </div>

          <div className="stat-card">

            <div className="stat-card-label">
              REVENUE
            </div>

            <p className="stat-card-value">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>

            <p className="stat-card-label">
              Recorded payments
            </p>

          </div>

        </div>

        {/* UPCOMING SESSIONS */}

        <div className="dashboard-overview">

          <div className="overview-card">

            <div className="overview-card-header">

              <div>

                <p className="auth-label">
                  UP NEXT
                </p>

                <h2>
                  Upcoming sessions
                </h2>

              </div>

              <button
                className="overview-link"
                onClick={() =>
                  scrollToSection("sessions")
                }
              >
                View sessions →
              </button>

            </div>

            {upcomingSessions.length === 0 ? (

              <div className="empty-overview">

                <p>
                  No upcoming sessions.
                </p>

                <span>
                  Your next booked session will appear here.
                </span>

              </div>

            ) : (

              <div className="upcoming-list">

                {upcomingSessions
                  .slice(0, 3)
                  .map((session) => (

                    <div
                      className="upcoming-item"
                      key={session._id}
                    >

                      <div className="upcoming-date">

                        <strong>
                          {new Date(
                            session.startTime
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )}
                        </strong>

                        <span>
                          {new Date(
                            session.startTime
                          ).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>

                      </div>

                      <div className="upcoming-info">

                        <strong>
                          {session.client?.name ||
                            "Client"}
                        </strong>

                        <span>
                          {session.sessionType || "N/A"} minute session
                        </span>

                      </div>

                      <span className="upcoming-status">
                        Booked
                      </span>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </div>

        {/* CLIENTS */}

        <section
          id="clients"
          className="content-section"
        >

          <div className="section-header">

            <div>

              <h2>
                Clients
              </h2>

              <p>
                Manage your client records and contact details.
              </p>

            </div>

            <button
              className="add-button"
              onClick={() =>
                setShowClientForm(!showClientForm)
              }
            >
              {showClientForm
                ? "Close"
                : "+ Add client"}
            </button>

          </div>

          {showClientForm && (

            <form
              className="dashboard-form"
              onSubmit={addClient}
            >

              <div className="form-group">

                <label>
                  Client name
                </label>

                <input
                  type="text"
                  placeholder="Client name"
                  value={clientForm.name}
                  onChange={(e) =>
                    setClientForm({
                      ...clientForm,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Email address"
                  value={clientForm.email}
                  onChange={(e) =>
                    setClientForm({
                      ...clientForm,
                      email: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  placeholder="Phone number"
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm({
                      ...clientForm,
                      phone: e.target.value,
                    })
                  }
                />

              </div>

              <div className="dashboard-form-actions">

                <button type="submit">
                  Save client
                </button>

              </div>

            </form>

          )}

          {clients.length === 0 ? (

            <div className="empty-state">
              No clients yet — add your first client above.
            </div>

          ) : (

            <div className="data-list">

              {clients.map((client) => (

                <div
                  className="data-item"
                  key={client._id}
                >

                  <div className="data-item-top">

                    <strong>
                      {client.name}
                    </strong>

                    <span className="status">
                      Active
                    </span>

                  </div>

                  <p>
                    {client.email}
                  </p>

                  <p>
                    {client.phone ||
                      "Phone not provided"}
                  </p>

                  <button
                    className="profile-button"
                    onClick={() =>
                      loadClientProfile(client._id)
                    }
                  >
                    View profile →
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      


        {/* CLIENT PROFILE */}

        {selectedClient && (

          <section
            className="content-section client-profile-section"
          >

            <div className="section-header">

              <div>

                <p className="auth-label">
                  CLIENT PROFILE
                </p>

                <h2>
                  {selectedClient.name}
                </h2>

                <p>
                  View client information, intake details and
                  session history.
                </p>

              </div>

              <button
                className="add-button"
                onClick={closeClientProfile}
              >
                ← Back to clients
              </button>

            </div>

            <div className="profile-grid">

              {/* BASIC INFORMATION */}

              <div className="profile-card">

                <div className="profile-card-header">

                  <h3>
                    Basic information
                  </h3>

                </div>

                <div className="profile-details">

                  <div>

                    <span>
                      Name
                    </span>

                    <strong>
                      {selectedClient.name ||
                        "Not provided"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedClient.email ||
                        "Not provided"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Phone
                    </span>

                    <strong>
                      {selectedClient.phone ||
                        "Not provided"}
                    </strong>

                  </div>

                </div>

              </div>

              {/* INTAKE */}

              <div className="profile-card">

                <div className="profile-card-header">

                  <h3>
                    Intake information
                  </h3>
                  <button
  className="profile-button"
  onClick={() => alert("Intake editing can be added next.")}
>
  Edit Intake
</button>

                </div>

                <div className="profile-details">

                  <div>

                    <span>
                      Age
                    </span>

                    <strong>
                      {selectedClient.intake?.age ||
                        "Not provided"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Gender
                    </span>

                    <strong>
                      {selectedClient.intake?.gender ||
                        "Not provided"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Reason for consultation
                    </span>

                    <strong>
                      {selectedClient.intake
                        ?.reasonForConsultation ||
                        "Not provided"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Emergency contact
                    </span>

                    <strong>
                      {selectedClient.intake
                        ?.emergencyContact ||
                        "Not provided"}
                    </strong>

                  </div>

                </div>

              </div>

              {/* CONSENT */}

              <div className="profile-card">

                <div className="profile-card-header">

                  <h3>
                    Consent
                  </h3>

                </div>

                <div className="consent-box">

                  <span
                    className={
                      selectedClient.consent?.given
                        ? "consent-status given"
                        : "consent-status pending"
                    }
                  >
                    {selectedClient.consent?.given
                      ? "Consent given"
                      : "Consent not given"}
                  </span>

                  {selectedClient.consent?.givenAt && (

                    <p>

                      Given on{" "}

                      {new Date(
                        selectedClient.consent.givenAt
                      ).toLocaleDateString()}

                    </p>

                  )}

                </div>

              </div>

              {/* SESSION HISTORY */}

              <div className="profile-card profile-card-wide">

                <div className="profile-card-header">

                  <div>

                    <h3>
                      Session history
                    </h3>

                    <p>
                      Previous and upcoming sessions for this client.
                    </p>

                  </div>

                  <span className="session-count">
                    {clientSessions.length} sessions
                  </span>

                </div>

                {clientSessions.length === 0 ? (

                  <div className="empty-state">
                    No sessions found for this client.
                  </div>

                ) : (

                  <div className="profile-session-list">

                    {clientSessions.map((session) => (

                      <div
                        className="profile-session-item"
                        key={session._id}
                      >

                        <div>

                          <strong>

                            {session.startTime
                              ? new Date(
                                  session.startTime
                                ).toLocaleDateString()
                              : "No date"}

                          </strong>

                          <span>

                            {session.startTime
                              ? new Date(
                                  session.startTime
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "No time"}

                          </span>

                        </div>

                        <div>

                          <span>
                            Duration
                          </span>

                          <strong>
                            {session.sessionType ||
                              "N/A"} minutes
                          </strong>

                        </div>

                        <div>

                          <span>
                            Status
                          </span>

                          <strong
                            className={`profile-session-status ${session.status}`}
                          >
                            {session.status ||
                              "booked"}
                          </strong>

                        </div>

                        <div className="profile-session-notes">

                          <span>
                            Notes
                          </span>

                          <strong>
                            {session.notes ||
                              "No notes"}
                          </strong>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </section>

        )}

        {/* SESSIONS */}

        <section
          id="sessions"
          className="content-section"
        >

          <div className="section-header">

            <div>

              <h2>
                Sessions
              </h2>

              <p>
                Book and keep track of upcoming sessions.
              </p>

            </div>

            <button
              className="add-button"
              onClick={() =>
                setShowBookingForm(!showBookingForm)
              }
            >
              {showBookingForm
                ? "Close"
                : "+ Book session"}
            </button>

          </div>

          {showBookingForm && (

            <form
              className="dashboard-form"
              onSubmit={bookSession}
            >

              <div className="form-group">

                <label>
                  Client
                </label>

                <select
                  value={bookingForm.client}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      client: e.target.value,
                    })
                  }
                  required
                >

                  <option value="">
                    Select client
                  </option>

                  {clients.map((client) => (

                    <option
                      key={client._id}
                      value={client._id}
                    >
                      {client.name}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Start time
                </label>

                <input
                  type="datetime-local"
                  value={bookingForm.startTime}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      startTime: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  End time
                </label>

                <input
                  type="datetime-local"
                  value={bookingForm.endTime}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      endTime: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Session duration
                </label>

                <select
                  value={bookingForm.sessionType}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      sessionType: e.target.value,
                    })
                  }
                  required
                >

                  <option value="">
                    Select duration
                  </option>

                  <option value="30">
                    30 minutes
                  </option>

                  <option value="45">
                    45 minutes
                  </option>

                  <option value="60">
                    60 minutes
                  </option>

                  <option value="90">
                    90 minutes
                  </option>

                </select>

              </div>

              <div className="form-group full">

                <label>
                  Notes
                </label>

                <textarea
                  placeholder="Session notes"
                  value={bookingForm.notes}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      notes: e.target.value,
                    })
                  }
                />

              </div>

              <div className="dashboard-form-actions">

                <button type="submit">
                  Book session
                </button>

              </div>

            </form>

          )}

          {sessions.length === 0 ? (

            <div className="empty-state">
              No sessions yet — book your first one above.
            </div>

          ) : (

            <div className="data-list">

              {sessions.map((session) => (

                <div
                  className="data-item"
                  key={session._id}
                >

                  <div className="data-item-top">

                    <strong>
                      {session.client?.name ||
                        session.client ||
                        "Unknown client"}
                    </strong>

                    <span className="status">
                      {session.status ||
                        "booked"}
                    </span>

                  </div>

                  <p>

                    Start:{" "}

                    {session.startTime
                      ? new Date(
                          session.startTime
                        ).toLocaleString()
                      : "N/A"}

                  </p>

                  <p>

                    End:{" "}

                    {session.endTime
                      ? new Date(
                          session.endTime
                        ).toLocaleString()
                      : "N/A"}

                  </p>

                  <p>
                    Duration:{" "}
                    {session.sessionType ||
                      "N/A"} minutes
                  </p>

                  <p>
                    Notes:{" "}
                    {session.notes ||
                      "No notes"}
                  </p>

                  <div className="session-actions">

                    {session.status === "booked" && (

                      <>

                        <button
                          className="complete-btn"
                          onClick={() =>
                            completeSession(
                              session._id
                            )
                          }
                        >
                          Complete
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() =>
                            cancelSession(
                              session._id
                            )
                          }
                        >
                          Cancel
                        </button>

                      </>

                    )}

                    {session.status === "completed" && (

                      <span className="session-status completed">
                        Completed
                      </span>

                    )}

                    {session.status === "cancelled" && (

                      <span className="session-status cancelled">
                        Cancelled
                      </span>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* PACKAGES */}

        <section
          id="packages"
          className="content-section"
        >

          <div className="section-header">

            <div>

              <h2>
                Packages
              </h2>

              <p>
                Create treatment or session packages.
              </p>

            </div>

            <button
              className="add-button"
              onClick={() =>
                setShowPackageForm(!showPackageForm)
              }
            >
              {showPackageForm
                ? "Close"
                : "+ Add package"}
            </button>

          </div>

          {showPackageForm && (

            <form
              className="dashboard-form"
              onSubmit={createPackage}
            >

              <div className="form-group">

                <label>
                  Package name
                </label>

                <input
                  type="text"
                  placeholder="Package name"
                  value={packageForm.name}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Description
                </label>

                <input
                  type="text"
                  placeholder="Description"
                  value={packageForm.description}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      description: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Sessions
                </label>

                <input
                  type="number"
                  placeholder="Number of sessions"
                  value={packageForm.sessions}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      sessions: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  placeholder="Price"
                  value={packageForm.price}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      price: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Validity
                </label>

                <input
                  type="number"
                  placeholder="Validity in days"
                  value={packageForm.validityDays}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      validityDays: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="dashboard-form-actions">

                <button type="submit">
                  Save package
                </button>

              </div>

            </form>

          )}

          {packages.length === 0 ? (

            <div className="empty-state">
              No packages yet — create your first one above.
            </div>

          ) : (

            <div className="data-list">

              {packages.map((pkg) => (

                <div
                  className="data-item"
                  key={pkg._id}
                >

                  <div className="data-item-top">

                    <strong>
                      {pkg.name}
                    </strong>

                    <span className="status">
                      Active
                    </span>

                  </div>

                  <p>
                    {pkg.description ||
                      "No description"}
                  </p>

                  <p>
                    {pkg.sessions} sessions
                  </p>

                  <p>
                    ₹{pkg.price}
                  </p>

                  <p>
                    Valid for {pkg.validityDays} days
                  </p>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* PAYMENTS */}

        <section
          id="payments"
          className="content-section"
        >

          <div className="section-header">

            <div>

              <h2>
                Payments
              </h2>

              <p>
                Record and review client payments.
              </p>

            </div>

            <button
              className="add-button"
              onClick={async () => {

                await loadClients();
                await loadPackages();

                setShowPaymentForm(
                  !showPaymentForm
                );

              }}
            >
              {showPaymentForm
                ? "Close"
                : "+ Add payment"}
            </button>

          </div>

          {showPaymentForm && (

            <form
              className="dashboard-form"
              onSubmit={createPayment}
            >

              <div className="form-group">

                <label>
                  Client
                </label>

                <select
                  value={paymentForm.client}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      client: e.target.value,
                    })
                  }
                  required
                >

                  <option value="">
                    Select client
                  </option>

                  {clients.map((client) => (

                    <option
                      key={client._id}
                      value={client._id}
                    >
                      {client.name}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Package
                </label>

                <select
                  value={paymentForm.package}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      package: e.target.value,
                    })
                  }
                  required
                >

                  <option value="">
                    Select package
                  </option>

                  {packages.map((pkg) => (

                    <option
                      key={pkg._id}
                      value={pkg._id}
                    >
                      {pkg.name}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Amount
                </label>

                <input
                  type="number"
                  placeholder="Amount"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="dashboard-form-actions">

                <button type="submit">
                  Save payment
                </button>

              </div>

            </form>

          )}

          {payments.length === 0 ? (

            <div className="empty-state">
              No payments yet — record your first one above.
            </div>

          ) : (

            <div className="data-list">

              {payments.map((payment) => (

                <div
                  className="data-item"
                  key={payment._id}
                >

                  <div className="data-item-top">

                    <strong>
                      ₹{payment.amount}
                    </strong>

                    <span className="status">
                      {payment.status ||
                        "created"}
                    </span>

                  </div>

                  <p>
                    Client:{" "}
                    {payment.client?.name ||
                      "Unknown"}
                  </p>

                  <p>
                    Package:{" "}
                    {payment.package?.name ||
                      "Unknown"}
                  </p>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* SCHEDULE */}

        <section
          id="schedule"
          className="content-section"
        >

          <div className="section-header">

            <div>

              <h2>
                Schedule
              </h2>

              <p>
                See your booked sessions in one place.
              </p>

            </div>

            <button
              className="add-button"
              onClick={() =>
                setShowSchedule(!showSchedule)
              }
            >
              {showSchedule
                ? "Hide schedule"
                : "Show schedule"}
            </button>

          </div>

          {showSchedule && (

            sessions.length === 0 ? (

              <div className="empty-state">
                No scheduled sessions.
              </div>

            ) : (

              <div className="schedule-list">

                {sessions.map((session) => (

                  <div
                    className="schedule-item"
                    key={session._id}
                  >

                    <div className="schedule-time">

                      {session.startTime
                        ? new Date(
                            session.startTime
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "--:--"}

                    </div>

                    <div className="schedule-info">

                      <strong>

                        {session.client?.name ||
                          session.client ||
                          "Unknown client"}

                      </strong>

                      <span>

                        {session.startTime
                          ? new Date(
                              session.startTime
                            ).toLocaleDateString()
                          : "No date"}

                      </span>

                    </div>

                    <span className="status">

                      {session.status ||
                        "booked"}

                    </span>

                  </div>

                ))}

              </div>

            )

          )}

        </section>

        {/* FOOTER */}

        <footer className="dashboard-footer">

          <strong>
            Unfazed
          </strong>

          {" — "}

          Practice management, made calmer.

        </footer>

      </main>

    </div>
  );
}

export default App;