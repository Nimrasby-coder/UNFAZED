import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);

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
    duration: "",
    notes: "",
  });

  const [showClientForm, setShowClientForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const loadClients = async () => {
    try {
      const data = await apiRequest("/api/clients");
      setClients(data.clients || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await apiRequest("/api/sessions");
      setSessions(data.sessions || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadPackages = async () => {
    try {
      const data = await apiRequest("/api/packages");
      setPackages(data.packages || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await apiRequest("/api/payments");
      setPayments(data.payments || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadAllData = async () => {
    await loadClients();
    await loadSessions();
    await loadPackages();
    await loadPayments();
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadAllData();
    }
  }, []);

  const registerTherapist = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/therapists/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      alert(data.message || "Registration successful");

      setRegisterData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      alert(error.message || "Registration failed");
    }
  };

  const loginTherapist = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/therapists/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);

      alert(data.message || "Login successful");

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

    alert("Logged out successfully");
  };

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

  const bookSession = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/sessions", {
        method: "POST",
        body: JSON.stringify({
          client: bookingForm.client,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          duration: Number(bookingForm.duration),
          notes: bookingForm.notes,
          status: "booked",
        }),
      });

      alert(data.message || "Session booked successfully");

      setBookingForm({
        client: "",
        startTime: "",
        endTime: "",
        duration: "",
        notes: "",
      });

      setShowBookingForm(false);
      await loadSessions();
    } catch (error) {
      alert(error.message || "Failed to book session");
    }
  };

  return (
    <div className="app-container">
      <h1>UNFAZED</h1>

     {!isLoggedIn && (
  <div className="auth-page">
    <div className="auth-brand">
      <h1>UNFAZED</h1>

      <p className="tagline">
        A smarter way to manage therapy sessions
      </p>

      <div className="brand-info">
        <div>
          <span>✓</span>
          Manage your clients
        </div>

        <div>
          <span>✓</span>
          Schedule sessions
        </div>

        <div>
          <span>✓</span>
          Manage packages & payments
        </div>
      </div>
    </div>

    <div className="auth-card">
      <div className="auth-tabs">
        <span className="active-tab">Therapist Access</span>
      </div>

      <section>
        <h2>Welcome back</h2>
        <p className="form-subtitle">
          Login to your UNFAZED dashboard
        </p>

        <form onSubmit={loginTherapist}>
          <input
            type="email"
            placeholder="Email address"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value,
              })
            }
          />

          <button type="submit">Login to Dashboard</button>
        </form>
      </section>

      <section className="register-card">
        <h2>Create therapist account</h2>

        <p className="form-subtitle">
          New to UNFAZED? Create your account below.
        </p>

        <form onSubmit={registerTherapist}>
          <input
            type="text"
            placeholder="Full name"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email address"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Create password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                password: e.target.value,
              })
            }
          />

          <button type="submit">Create Account</button>
        </form>
      </section>
    </div>
  </div>
)}

      {isLoggedIn && (
        <>
          <button onClick={logout}>Logout</button>

          <h2>Dashboard Summary</h2>

          <div className="dashboard">
            <div>
              <h3>Total Clients</h3>
              <p>{clients.length}</p>
            </div>

            <div>
              <h3>Total Sessions</h3>
              <p>{sessions.length}</p>
            </div>

            <div>
              <h3>Total Packages</h3>
              <p>{packages.length}</p>
            </div>

            <div>
              <h3>Total Payments</h3>
              <p>{payments.length}</p>
            </div>
          </div>

          <section>
            <h2>Clients</h2>

            <button onClick={() => setShowClientForm(!showClientForm)}>
              {showClientForm ? "Close Client Form" : "Add Client"}
            </button>

            {showClientForm && (
              <form onSubmit={addClient}>
                <input
                  type="text"
                  placeholder="Name"
                  value={clientForm.name}
                  onChange={(e) =>
                    setClientForm({
                      ...clientForm,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={clientForm.email}
                  onChange={(e) =>
                    setClientForm({
                      ...clientForm,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm({
                      ...clientForm,
                      phone: e.target.value,
                    })
                  }
                />

                <button type="submit">Save Client</button>
              </form>
            )}

            <button onClick={loadClients}>Load Clients</button>

            {clients.length === 0 ? (
              <p>No clients found.</p>
            ) : (
              clients.map((client) => (
                <div key={client._id}>
                  <p>Name: {client.name}</p>
                  <p>Email: {client.email}</p>
                  <p>Phone: {client.phone}</p>
                  <hr />
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Sessions</h2>

            <button onClick={() => setShowBookingForm(!showBookingForm)}>
              {showBookingForm ? "Close Booking Form" : "Book Session"}
            </button>

            {showBookingForm && (
              <form onSubmit={bookSession}>
                <select
                  value={bookingForm.client}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      client: e.target.value,
                    })
                  }
                >
                  <option value="">Select Client</option>

                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>

                <input
                  type="datetime-local"
                  value={bookingForm.startTime}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      startTime: e.target.value,
                    })
                  }
                />

                <input
                  type="datetime-local"
                  value={bookingForm.endTime}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      endTime: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Duration in minutes"
                  value={bookingForm.duration}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      duration: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Notes"
                  value={bookingForm.notes}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      notes: e.target.value,
                    })
                  }
                />

                <button type="submit">Book Session</button>
              </form>
            )}

            <button onClick={loadSessions}>Load Sessions</button>

            {sessions.length === 0 ? (
              <p>No sessions found.</p>
            ) : (
              sessions.map((session) => (
                <div key={session._id}>
                  <p>
                    Client:{" "}
                    {session.client?.name || session.client || "Unknown"}
                  </p>

                  <p>
                    Start:{" "}
                    {session.startTime
                      ? new Date(session.startTime).toLocaleString()
                      : "N/A"}
                  </p>

                  <p>
                    End:{" "}
                    {session.endTime
                      ? new Date(session.endTime).toLocaleString()
                      : "N/A"}
                  </p>

                  <p>
  Duration: {session.duration || 45} minutes
</p>
                  <p>Status: {session.status}</p>
                  <p>Notes: {session.notes}</p>

                  <hr />
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Packages</h2>

            <button
              onClick={() => setShowPackageForm(!showPackageForm)}
            >
              {showPackageForm ? "Close Package Form" : "Add Package"}
            </button>

            {showPackageForm && (
              <form onSubmit={createPackage}>
                <input
                  type="text"
                  placeholder="Package Name"
                  value={packageForm.name}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      name: e.target.value,
                    })
                  }
                />

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

                <input
                  type="number"
                  placeholder="Number of Sessions"
                  value={packageForm.sessions}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      sessions: e.target.value,
                    })
                  }
                />

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
                />

                <input
                  type="number"
                  placeholder="Validity in Days"
                  value={packageForm.validityDays}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      validityDays: e.target.value,
                    })
                  }
                />

                <button type="submit">Save Package</button>
              </form>
            )}

            <button onClick={loadPackages}>Load Packages</button>

            {packages.length === 0 ? (
              <p>No packages found.</p>
            ) : (
              packages.map((pkg) => (
                <div key={pkg._id}>
                  <p>Name: {pkg.name}</p>
                  <p>Description: {pkg.description}</p>
                  <p>Sessions: {pkg.sessions}</p>
                  <p>Price: ₹{pkg.price}</p>
                  <p>Validity: {pkg.validityDays} days</p>
                  <hr />
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Payments</h2>

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
              <form onSubmit={createPayment}>
                <select
                  value={paymentForm.client}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      client: e.target.value,
                    })
                  }
                >
                  <option value="">Select Client</option>

                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>

                <select
                  value={paymentForm.package}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      package: e.target.value,
                    })
                  }
                >
                  <option value="">Select Package</option>

                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>

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
                />

                <button type="submit">Save Payment</button>
              </form>
            )}

            <button onClick={loadPayments}>Load Payments</button>

            {payments.length === 0 ? (
              <p>No payments found.</p>
            ) : (
              payments.map((payment) => (
                <div key={payment._id}>
                  <p>Client: {payment.client?.name || "Unknown"}</p>
                  <p>Package: {payment.package?.name || "Unknown"}</p>
                  <p>Amount: ₹{payment.amount}</p>
                  <p>Status: {payment.status || "created"}</p>
                  <hr />
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Schedule</h2>

            <button onClick={() => setShowSchedule(!showSchedule)}>
              {showSchedule ? "Hide Schedule" : "Show Schedule"}
            </button>

            {showSchedule && (
              <div>
                {sessions.length === 0 ? (
                  <p>No scheduled sessions.</p>
                ) : (
                  sessions.map((session) => (
                    <div key={session._id}>
                      <p>
                        Client:{" "}
                        {session.client?.name || session.client || "Unknown"}
                      </p>

                      <p>
                        {session.startTime
                          ? new Date(session.startTime).toLocaleString()
                          : "N/A"}
                      </p>

                      <p>Status: {session.status}</p>

                      <hr />
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default App;