import { useEffect, useState } from "react";
import { getExperience } from "../../services/api";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExperience = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getExperience();

      if (data.success) {
        setExperiences(data.experience || []);
      } else {
        setError("Unable to load experience.");
      }
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Unable to load experience."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  return (
    <section id="experience" className="portfolio-section">
      <div className="section-container">
        <p className="section-label">PRACTICAL EXPERIENCE</p>

        <h2>Experience</h2>

        <p className="section-intro">
          Practical and professional experience in information
          technology, cybersecurity, networking, systems, and
          digital forensics.
        </p>

        {loading ? (
          <div className="experience-state">
            <span>⏳</span>
            <p>Loading experience...</p>
          </div>
        ) : error ? (
          <div className="experience-state experience-error">
            <span>⚠</span>
            <p>{error}</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="experience-state">
            <span>💼</span>
            <p>No experience records available.</p>
          </div>
        ) : (
          <div className="experience-timeline">
            {experiences.map((experience, index) => {
              const activities = Array.isArray(
                experience.activities
              )
                ? experience.activities
                : [];

              return (
                <article
                  className="experience-card"
                  key={experience.id}
                >
                  <div className="experience-marker">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <div className="experience-card-content">
                    <div className="experience-card-header">
                      <span className="experience-date">
                        {experience.date_range}
                      </span>

                      <span className="experience-status">
                        EXPERIENCE
                      </span>
                    </div>

                    <h3>{experience.role}</h3>

                    <div className="experience-company">
                      {experience.company}
                    </div>

                    {experience.description && (
                      <p className="experience-description">
                        {experience.description}
                      </p>
                    )}

                    {activities.length > 0 && (
                      <div className="experience-activities-wrapper">
                        <h4>Key Activities</h4>

                        <ul className="experience-activities">
                          {activities.map((activity, activityIndex) => (
                            <li key={`${experience.id}-${activityIndex}`}>
                              <span className="experience-bullet">
                                ›
                              </span>

                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
