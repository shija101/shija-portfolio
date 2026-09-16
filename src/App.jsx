import { Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./sections/Home/Home";
import About from "./sections/About/About";
import Skills from "./sections/Skills/Skills";
import Education from "./sections/Education/Education";
import Certifications from "./sections/Certifications/Certifications";
import Experience from "./sections/Experience/Experience";
import Projects from "./sections/Projects/Projects";
import CV from "./sections/CV/CV";
import Contact from "./sections/Contact/Contact";

import Login from "./vault/Login/Login";
import Dashboard from "./vault/Dashboard/Dashboard";

import { useAuth } from "./context/AuthContext";

function PublicPortfolio() {
  const handleVaultOpen = () => {
    window.location.href = "/admin";
  };

  return (
    <>
      <Navbar onVaultOpen={handleVaultOpen} />

      <main>
        <Home />
        <About />
        <Skills />
        <Education />
        <Certifications />
        <Experience />
        <Projects />
        <CV />
        <Contact />
      </main>
    </>
  );
}

function AdminLogin() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-route-loading">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (user) {
    window.location.replace("/admin/dashboard");
    return null;
  }

  return (
    <main className="admin-login-route">
      <Login />
    </main>
  );
}

function ProtectedAdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-route-loading">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    window.location.replace("/admin");
    return null;
  }

  return <Dashboard />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<PublicPortfolio />}
      />

      <Route
        path="/admin"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/dashboard"
        element={<ProtectedAdminDashboard />}
      />

      <Route
        path="*"
        element={<PublicPortfolio />}
      />
    </Routes>
  );
}

export default App;
