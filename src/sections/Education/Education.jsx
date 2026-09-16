import { useEffect, useState } from "react";
import {
  getEducation,
  getPublicEducationCertificateUrl,
} from "../../services/api";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadEducation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEducation();

        if (mounted) {
          setEducation(data?.education || []);
        }
      } catch (err) {
        console.error("Failed to load education:", err);

        if (mounted) {
          setError(
            "Unable to load education information."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEducation();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="education"
      className="portfolio-section"
    >
      <div className="section-container">
        <p className="section-label">
          ACADEMIC BACKGROUND
        </p>

        <h2>Education</h2>

        {loading && (
          <div className="education-grid">
            <article className="education-card">
              <p>
                Loading education information...
              </p>
            </article>
          </div>
        )}

        {!loading && error && (
          <div className="education-grid">
            <article className="education-card">
              <p>{error}</p>
            </article>
          </div>
        )}

        {!loading &&
          !error &&
          education.length === 0 && (
            <div className="education-grid">
              <article className="education-card">
                <p>
                  No education information available.
                </p>
              </article>
            </div>
          )}

        {!loading &&
          !error &&
          education.length > 0 && (
            <div className="education-grid">
              {education.map((item) => (
                <article
                  className="education-card"
                  key={item.id}
                >
                  <span className="education-year">
                    {item.period}
                  </span>

                  <h3>{item.qualification}</h3>

                  <p className="education-institution">
                    {item.institution}
                  </p>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  {item.certificate_path && (
                    <a
                      href={getPublicEducationCertificateUrl(
                        item.id
                      )}
                      className="btn btn-secondary education-certificate-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
      </div>
    </section>
  );
};

export default Education;
