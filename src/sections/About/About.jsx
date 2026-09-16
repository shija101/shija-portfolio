import { useEffect, useState } from "react";
import { getAbout } from "../../services/api";

const About = () => {
  const [about, setAbout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAbout = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAbout();

        if (!mounted) {
          return;
        }

        setAbout(data?.about || []);
      } catch (err) {
        console.error("Failed to load About information:", err);

        if (mounted) {
          setError(
            err.message ||
              "Failed to load About information."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="about" className="portfolio-section">
      <div className="section-container">
        <p className="section-label">
          ABOUT ME
        </p>

        <h2>About</h2>

        {loading ? (
          <div className="about-grid">
            <div className="about-card">
              <p>Loading About information...</p>
            </div>
          </div>
        ) : error ? (
          <div className="about-grid">
            <div className="about-card">
              <p>{error}</p>
            </div>
          </div>
        ) : about.length === 0 ? (
          <div className="about-grid">
            <div className="about-card">
              <p>
                About information is currently
                unavailable.
              </p>
            </div>
          </div>
        ) : (
          about.map((item) => (
            <div
              className="about-grid"
              key={item.id}
            >
              <div className="about-card">
                {item.introduction && (
                  <p>
                    {item.introduction}
                  </p>
                )}

                {item.goal && (
                  <p>
                    {item.goal}
                  </p>
                )}
              </div>

              <div className="about-card">
                {item.field && (
                  <div className="profile-stat">
                    <span>Field</span>
                    <span>{item.field}</span>
                  </div>
                )}

                {item.specialization && (
                  <div className="profile-stat">
                    <span>
                      Specialization
                    </span>
                    <span>
                      {item.specialization}
                    </span>
                  </div>
                )}

                {item.focus && (
                  <div className="profile-stat">
                    <span>Focus</span>
                    <span>{item.focus}</span>
                  </div>
                )}

                {item.status && (
                  <div className="profile-stat">
                    <span>Status</span>
                    <span>{item.status}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default About;
