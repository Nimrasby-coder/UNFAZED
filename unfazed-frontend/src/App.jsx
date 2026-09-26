import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  // Registration
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Dashboard data
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
const [packageName, setPackageName] = useState("");
const [packageDescription, setPackageDescription] = useState("");
const [packageSessions, setPackageSessions] = useState("");
const [packagePrice, setPackagePrice] = useState("");
const [packageValidityDays, setPackageValidityDays] = useState("");
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
const [paymentClient, setPaymentClient] = useState("");
const [paymentPackage, setPaymentPackage] = useState("");
const [paymentAmount, setPaymentAmount] = useState("");

  // Client form
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Schedule
  const [showSchedule, setShowSchedule] = useState(false);

  // Booking form
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sessionType, setSessionType] = useState("45");
  const [notes, setNotes] = useState("");

  // Check backend
  useEffect(() => {
    apiRequest("/")
      .then((data) => {
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus("Backend connection failed");
      });
  }, []);

  // Register therapist
  const registerTherapist = () => {
    if (!name || !email || !password || !phone || !specialization) {
      alert("Please fill all registration fields");
      return;
    }

    apiRequest("/api/therapists/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        specialization,
      }),
    })
      .then((data) => {
        alert(data.message || "Therapist registered successfully");

        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setSpecialization("");
      })
      .catch((error) => {
        alert(error.message || "Registration failed");
      });
  };

  // Load clients
  const loadClients = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    apiRequest("/api/clients", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        console.log("CLIENT DATA:", data);
        setClients(data.clients || []);
      })
      .catch((error) => {
        console.error("Failed to load clients:", error.message);
        alert(error.message || "Failed to load clients");
      });
  };

  // Create client
  const createClient = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!clientName || !clientEmail || !clientPhone) {
      alert("Please fill all client fields");
      return;
    }

    apiRequest("/api/clients", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
      }),
    })
      .then((data) => {
        alert(data.message || "Client created successfully");

        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setShowClientForm(false);

        loadClients();
      })
      .catch((error) => {
        alert(error.message || "Failed to create client");
      });
  };

  // Load sessions
  const loadSessions = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    apiRequest("/api/sessions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        console.log("SESSION DATA:", data);
        setSessions(data.sessions || []);
      })
      .catch((error) => {
        console.error("Failed to load sessions:", error.message);
      });
  };

  // Load packages
  const loadPackages = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    apiRequest("/api/packages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        console.log("PACKAGE DATA:", data);
        setPackages(data.packages || []);
      })
      .catch((error) => {
        console.error("Failed to load packages:", error.message);
      });
  };

  // Create package
const createPackage = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  if (
    !packageName ||
    !packageDescription ||
    !packageSessions ||
    !packagePrice ||
    !packageValidityDays
  ) {
    alert("Please fill all package fields");
    return;
  }

  apiRequest("/api/packages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: packageName,
      description: packageDescription,
      sessions: Number(packageSessions),
      price: Number(packagePrice),
      validityDays: Number(packageValidityDays),
    }),
  })
    .then((data) => {
      alert(data.message || "Package created successfully");

      setPackageName("");
      setPackageDescription("");
      setPackageSessions("");
      setPackagePrice("");
      setPackageValidityDays("");
      setShowPackageForm(false);

      loadPackages();
    })
    .catch((error) => {
      alert(error.message || "Failed to create package");
    });
};

  // Load payments
  const loadPayments = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    apiRequest("/api/payments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        console.log("PAYMENT DATA:", data);
        setPayments(data.payments || []);
      })
      .catch((error) => {
        console.error("Failed to load payments:", error.message);
      });
  };

  // Create payment
const createPayment = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  if (!paymentClient || !paymentPackage || !paymentAmount) {
    alert("Please fill all payment fields");
    return;
  }

  apiRequest("/api/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      client: paymentClient,
      package: paymentPackage,
      amount: Number(paymentAmount),
    }),
  })
    .then((data) => {
      alert(data.message || "Payment created successfully");

      setPaymentClient("");
      setPaymentPackage("");
      setPaymentAmount("");
      setShowPaymentForm(false);

      loadPayments();
    })
    .catch((error) => {
      alert(error.message || "Failed to create payment");
    });
};

  // Login therapist
  const loginTherapist = () => {
    apiRequest("/api/therapists/login", {
      method: "POST",
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then((data) => {
        alert(data.message || "Login successful");

        if (data.token) {
          localStorage.setItem("token", data.token);

          loadClients();
          loadSessions();
          loadPackages();
          loadPayments();
        }

        setLoginEmail("");
        setLoginPassword("");
      })
      .catch((error) => {
        alert(error.message || "Login failed");
      });
  };

  // View profile
  const viewProfile = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    apiRequest("/api/therapists/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        alert(
          `Name: ${data.therapist.name}\n` +
            `Email: ${data.therapist.email}\n` +
            `Phone: ${data.therapist.phone}\n` +
            `Specialization: ${data.therapist.specialization}`
        );
      })
      .catch((error) => {
        alert(error.message || "Failed to fetch profile");
      });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setClients([]);
    setSessions([]);
    setPackages([]);
    setPayments([]);
    alert("Logged out successfully");
  };

  // Open schedule
  const openSchedule = () => {
    loadSessions();
    setShowSchedule(true);
  };

  // Open booking form
  const bookSession = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    loadClients();
    setShowBookingForm(true);
  };

  // Submit booking
  const submitBooking = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!selectedClient || !startTime || !endTime) {
      alert("Please fill all required fields");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      alert("End time must be after start time");
      return;
    }

    apiRequest("/api/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        client: selectedClient,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        sessionType: Number(sessionType),
        notes,
      }),
    })
      .then((data) => {
        alert(data.message || "Session booked successfully");

        setShowBookingForm(false);
        setSelectedClient("");
        setStartTime("");
        setEndTime("");
        setSessionType("45");
        setNotes("");

        loadSessions();
      })
      .catch((error) => {
        alert(error.message || "Failed to book session");
      });
  };

  // Cancel session
  const cancelSession = (sessionId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this session?"
    );

    if (!confirmCancel) {
      return;
    }

    apiRequest(`/api/sessions/${sessionId}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        alert(data.message || "Session cancelled successfully");
        loadSessions();
      })
      .catch((error) => {
        alert(error.message || "Failed to cancel session");
      });
  };

  // Complete session
  const completeSession = (sessionId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    apiRequest(`/api/sessions/${sessionId}/complete`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        alert(data.message || "Session completed successfully");
        loadSessions();
      })
      .catch((error) => {
        alert(error.message || "Failed to complete session");
      });
  };

  return (
    <div>
      <header className="app-header">
        <div>
          <h1>UNFAZED</h1>
          <p>Therapist Management Dashboard</p>
        </div>
      </header>

      <nav>
        <button onClick={() => window.scrollTo(0, 0)}>Dashboard</button>

        <button
          onClick={() => {
            loadClients();
            window.scrollTo(0, 0);
          }}
        >
          Clients
        </button>

        <button
          onClick={() => {
            loadSessions();
            window.scrollTo(0, 0);
          }}
        >
          Sessions
        </button>

        <button
          onClick={() => {
            loadPackages();
            window.scrollTo(0, 0);
          }}
        >
          Packages
        </button>

        <button onClick={openSchedule}>Schedule</button>

        <button
          onClick={() => {
            loadPayments();
            window.scrollTo(0, 0);
          }}
        >
          Payments
        </button>
      </nav>

      <hr />

      <div className="welcome-section">
        <h2>Welcome, Therapist 👋</h2>

        <p className="backend-status">
          Backend status: {backendStatus}
        </p>
      </div>

      {/* Dashboard Summary */}
      <div>
        <h3>Dashboard Summary</h3>

        <p>Total Clients: {clients.length}</p>
        <p>Total Sessions: {sessions.length}</p>
        <p>Total Packages: {packages.length}</p>
        <p>Total Payments: {payments.length}</p>
      </div>

      <hr />

      {/* Registration */}
      <h3>Therapist Registration</h3>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
      />

      <br />
      <br />

      <button onClick={registerTherapist}>Register Therapist</button>

      <hr />

      {/* Login */}
      <h3>Therapist Login</h3>

      <input
        type="email"
        placeholder="Login Email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Login Password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={loginTherapist}>Login Therapist</button>

      <br />
      <br />

      <button onClick={viewProfile}>View My Profile</button>

      <button onClick={logout}>Logout</button>

      <hr />

      {/* Clients */}
      <h3>Clients</h3>

      <button onClick={() => setShowClientForm(!showClientForm)}>
        {showClientForm ? "Close Client Form" : "Add Client"}
      </button>

      <button onClick={loadClients}>Load Clients</button>

      {showClientForm && (
        <div className="data-card">
          <h4>Add New Client</h4>

          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <br />
          <br />

          <input
            type="email"
            placeholder="Client Email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />

          <br />
          <br />

          <input
            type="tel"
            placeholder="Client Phone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />

          <br />
          <br />

          <button onClick={createClient}>Create Client</button>

          <button onClick={() => setShowClientForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        clients.map((client) => (
          <div className="data-card" key={client._id}>
            <h4>{client.name}</h4>
            <p>Email: {client.email}</p>
            <p>Phone: {client.phone}</p>
          </div>
        ))
      )}

      <hr />
{/* Sessions */}
<h3>Sessions</h3>

<button onClick={loadSessions}>Load Sessions</button>

<button onClick={bookSession}>Book New Session</button>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map((session) => (
          <div className="data-card" key={session._id}>
            <h4>
              Client: {session.client?.name || "Unknown"}
            </h4>

            <p>Email: {session.client?.email || "N/A"}</p>
            <p>Phone: {session.client?.phone || "N/A"}</p>

            <p>
              Start: {new Date(session.startTime).toLocaleString()}
            </p>

            <p>
              End: {new Date(session.endTime).toLocaleString()}
            </p>

            <p>Duration: {session.sessionType} minutes</p>
            <p>Status: {session.status}</p>
            <p>Notes: {session.notes || "No notes"}</p>

            {session.status === "booked" && (
              <>
                <button onClick={() => cancelSession(session._id)}>
                  Cancel Session
                </button>

                <button onClick={() => completeSession(session._id)}>
                  Complete Session
                </button>
              </>
            )}
          </div>
        ))
      )}

      <hr />

      {/* Packages */}
      <h3>Packages</h3>

      <button onClick={loadPackages}>Load Packages</button>

      <button onClick={() => setShowPackageForm(!showPackageForm)}>
  {showPackageForm ? "Close Package Form" : "Add Package"}
</button>

{showPackageForm && (
  <div className="data-card">
    <h4>Create New Package</h4>

    <input
      type="text"
      placeholder="Package Name"
      value={packageName}
      onChange={(e) => setPackageName(e.target.value)}
    />

    <br />
    <br />

    <input
      type="text"
      placeholder="Description"
      value={packageDescription}
      onChange={(e) => setPackageDescription(e.target.value)}
    />

    <br />
    <br />

    <input
      type="number"
      placeholder="Number of Sessions"
      value={packageSessions}
      onChange={(e) => setPackageSessions(e.target.value)}
    />

    <br />
    <br />

    <input
      type="number"
      placeholder="Price"
      value={packagePrice}
      onChange={(e) => setPackagePrice(e.target.value)}
    />

    <br />
    <br />

    <input
      type="number"
      placeholder="Validity in Days"
      value={packageValidityDays}
      onChange={(e) => setPackageValidityDays(e.target.value)}
    />

    <br />
    <br />

    <button onClick={createPackage}>Create Package</button>

    <button onClick={() => setShowPackageForm(false)}>
      Cancel
    </button>
  </div>
)}
      <button onClick={() => setShowPackageForm(!showPackageForm)}>
  {showPackageForm ? "Close Package Form" : "Add Package"}
</button>
      {packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        packages.map((pkg) => (
          <div className="data-card" key={pkg._id}>
            <h4>{pkg.name}</h4>

            <p>Description: {pkg.description}</p>
            <p>Sessions: {pkg.sessions}</p>
            <p>Price: ₹{pkg.price}</p>
            <p>Validity: {pkg.validityDays} days</p>
          </div>
        ))
      )}

      <hr />

      {/* Payments */}
      <h3>Payments</h3>

      <button onClick={loadPayments}>Load Payments</button>
  <button
  onClick={() => {
    loadClients();
    loadPackages();
    setShowPaymentForm(!showPaymentForm);
  }}
>
  {showPaymentForm ? "Close Payment Form" : "Add Payment"}
</button>

{showPaymentForm && (
  <div className="data-card">
    <h4>Create New Payment</h4>

    <label>Client:</label>
    <br />

    <select
      value={paymentClient}
      onChange={(e) => setPaymentClient(e.target.value)}
    >
      <option value="">Select Client</option>

      {clients.map((client) => (
        <option key={client._id} value={client._id}>
          {client.name}
        </option>
      ))}
    </select>

    <br />
    <br />

    <label>Package:</label>
    <br />

    <select
      value={paymentPackage}
      onChange={(e) => setPaymentPackage(e.target.value)}
    >
      <option value="">Select Package</option>

      {packages.map((pkg) => (
        <option key={pkg._id} value={pkg._id}>
          {pkg.name}
        </option>
      ))}
    </select>

    <br />
    <br />

    <label>Amount:</label>
    <br />

    <input
      type="number"
      placeholder="Enter amount"
      value={paymentAmount}
      onChange={(e) => setPaymentAmount(e.target.value)}
    />

    <br />
    <br />

    <button onClick={createPayment}>Create Payment</button>

    <button onClick={() => setShowPaymentForm(false)}>
      Cancel
    </button>
  </div>
)}
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        payments.map((payment) => (
          <div className="data-card" key={payment._id}>
            <h4>Payment</h4>

            <p>Amount: ₹{payment.amount}</p>
            <p>Status: {payment.status}</p>

            <p>
              Date: {new Date(payment.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}

      <hr />

      {/* Schedule */}
      {(showSchedule || showBookingForm) && (
        <div>
          <h3>Schedule</h3>

          <button onClick={bookSession}>Book New Session</button>

          <br />
          <br />

          {showBookingForm && (
            <div>
              <h4>Book New Session</h4>

              <label>Client:</label>
              <br />

              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">Select Client</option>

                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>

              <br />
              <br />

              <label>Start Time:</label>
              <br />

              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />

              <br />
              <br />

              <label>End Time:</label>
              <br />

              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />

              <br />
              <br />

              <label>Session Duration:</label>
              <br />

              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>

              <br />
              <br />

              <label>Notes:</label>
              <br />

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter session notes"
                rows="4"
                cols="40"
              />

              <br />
              <br />

              <button onClick={submitBooking}>Book Session</button>

              <button onClick={() => setShowBookingForm(false)}>
                Cancel
              </button>

              <hr />
            </div>
          )}

          {sessions.length === 0 ? (
            <p>No scheduled sessions found.</p>
          ) : (
            sessions.map((session) => (
              <div className="data-card" key={session._id}>
                <h4>
                  Client: {session.client?.name || "Unknown"}
                </h4>

                <p>
                  Date:{" "}
                  {new Date(session.startTime).toLocaleDateString()}
                </p>

                <p>
                  Start:{" "}
                  {new Date(session.startTime).toLocaleTimeString()}
                </p>

                <p>
                  End:{" "}
                  {new Date(session.endTime).toLocaleTimeString()}
                </p>

                <p>Duration: {session.sessionType} minutes</p>
                <p>Status: {session.status}</p>
                <p>Notes: {session.notes || "No notes"}</p>

                {session.status === "booked" && (
                  <>
                    <button
                      onClick={() => cancelSession(session._id)}
                    >
                      Cancel Session
                    </button>

                    <button
                      onClick={() => completeSession(session._id)}
                    >
                      Complete Session
                    </button>
                  </>
                )}

                <hr />
              </div>
            ))
          )}

          <button onClick={() => setShowSchedule(false)}>
            Close Schedule
          </button>
        </div>
      )}
    </div>
  );
}

export default App;