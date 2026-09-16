import { useEffect, useState } from "react";
import { getProfile, getProfileImageUrl } from "../../services/api";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await getProfile();

        if (mounted) {
          setProfile(data?.profile || data || null);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const fullName = profile?.full_name?.trim() || "";
  const professionalTitle =
    profile?.professional_title?.trim() || "";
  const bio = profile?.bio?.trim() || "";

  const profileImage = getProfileImageUrl(
    profile?.profile_image_path
  );

  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <section id="home" className="portfolio-section">
      <div className="section-container hero-container">
        <div className="hero-content">
          {profileImage && (
            <div className="hero-profile">
              <img
                src={profileImage}
                alt={fullName || "Profile"}
                className="hero-profile-image"
              />
            </div>
          )}

          <p className="section-label">
            {loading
              ? "LOADING PROFILE..."
              : professionalTitle
                ? professionalTitle.toUpperCase()
                : "CYBERSECURITY PROFESSIONAL"}
          </p>

          <h1>
            {loading ? (
              "LOADING..."
            ) : fullName ? (
              <>
                {firstName}
                {lastName && <span>{lastName}</span>}
              </>
            ) : (
              "PROFILE"
            )}
          </h1>

          <p className="hero-description">
            {loading
              ? "Loading profile information..."
              : bio || "Welcome to my professional portfolio."}
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>

            <a href="#contact" className="btn btn-secondary">
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>

            <span className="terminal-title">
              shija@security:~
            </span>
          </div>

          <div className="terminal-body">
            <div className="terminal-line">
              <span className="prompt">$</span>
              whoami
            </div>

            <div className="terminal-output success">
              {loading
                ? "LOADING..."
                : fullName
                  ? fullName.toUpperCase()
                  : "PROFILE UNAVAILABLE"}
            </div>

            <div className="terminal-line">
              <span className="prompt">$</span>
              cat profile.txt
            </div>

            <ul className="terminal-list">
              <li>
                Role:{" "}
                {loading
                  ? "Loading..."
                  : professionalTitle || "Not specified"}
              </li>

              <li>
                Profile:{" "}
                {loading
                  ? "Loading..."
                  : fullName
                    ? "Active"
                    : "Not available"}
              </li>

              <li>
                Portfolio:{" "}
                {loading ? "Loading..." : "Online"}
              </li>

              <li>
                Status:{" "}
                {loading ? "Loading..." : "Learning & Building"}
              </li>
            </ul>

            <div className="terminal-line">
              <span className="prompt">$</span>
              security-status
            </div>

            <div className="terminal-output success">
              SYSTEM SECURE ✓
            </div>

            <div className="terminal-line">
              <span className="prompt">$</span>
              <span className="cursor">█</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
