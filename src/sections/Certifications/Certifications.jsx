import { useEffect, useState } from "react";
import {
  getCertifications,
  getPublicCertificateUrl,
} from "../../services/api";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCertifications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCertifications();

        if (mounted) {
          setCertifications(data?.certifications || []);
        }
      } catch (err) {
        console.error("Failed to load certifications:", err);

        if (mounted) {
          setError("Unable to load certifications.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCertifications();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="certifications" className="portfolio-section">
      <div className="section-container">
        <p className="section-label">
          CERTIFICATIONS & TRAINING
        </p>

        <h2>Certifications</h2>

        {loading && (
          <div className="certifications-grid">
            <article className="certification-card">
              <p>Loading certifications...</p>
            </article>
          </div>
        )}

        {!loading && error && (
          <div className="certifications-grid">
            <article className="certification-card">
              <p>{error}</p>
            </article>
          </div>
        )}

        {!loading && !error && certifications.length === 0 && (
          <div className="certifications-grid">
            <article className="certification-card">
              <p>No certifications available.</p>
            </article>
          </div>
        )}

        {!loading && !error && certifications.length > 0 && (
          <div className="certifications-grid">
            {certifications.map((item) => {
              const certificateUrl = item.certificate_path
                ? getPublicCertificateUrl(item.id)
                : null;

              return (
                <article
                  className="certification-card"
                  key={item.id}
                >
                  <span className="certification-status">
                    {item.status}
                  </span>

                  <h3>{item.title}</h3>

                  <p className="certification-issuer">
                    {item.issuer}
                  </p>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  {certificateUrl && (
                    <a
                      href={certificateUrl}
                      className="btn btn-secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
