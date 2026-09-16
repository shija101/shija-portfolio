import { useEffect, useState } from "react";
import {
  getProfile,
  submitContactMessage,
} from "../../services/api";

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await getProfile();

        if (mounted) {
          setProfile(data?.profile || data || null);
        }
      } catch (error) {
        console.error("Failed to load contact profile:", error);

        if (mounted) {
          setProfile(null);
        }
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

  const phone = profile?.phone?.trim() || "";
  const email = profile?.email?.trim() || "";
  const location = profile?.location?.trim() || "";
  const githubUrl = profile?.github_url?.trim() || "";
  const linkedinUrl = profile?.linkedin_url?.trim() || "";

  const contactDetails = [
    ...(phone
      ? [
          {
            label: "PHONE",
            value: phone,
            href: `tel:${phone.replace(/\s+/g, "")}`,
          },
        ]
      : []),

    ...(email
      ? [
          {
            label: "EMAIL",
            value: email,
            href: `mailto:${email}`,
          },
        ]
      : []),

    ...(location
      ? [
          {
            label: "LOCATION",
            value: location,
          },
        ]
      : []),

    ...(githubUrl
      ? [
          {
            label: "GITHUB",
            value: githubUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
            href: githubUrl,
            external: true,
          },
        ]
      : []),

    ...(linkedinUrl
      ? [
          {
            label: "LINKEDIN",
            value: linkedinUrl
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, ""),
            href: linkedinUrl,
            external: true,
          },
        ]
      : []),
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }

    if (formMessage) {
      setFormMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setFormMessage("");

    const name = form.name.trim();
    const emailValue = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2) {
      setFormError("Please enter your name.");
      return;
    }

    if (name.length > 100) {
      setFormError("Name must not exceed 100 characters.");
      return;
    }

    if (!emailValue) {
      setFormError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      setFormError("Message must contain at least 10 characters.");
      return;
    }

    if (message.length > 5000) {
      setFormError("Message must not exceed 5000 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const data = await submitContactMessage({
        name,
        email: emailValue,
        message,
      });

      setFormMessage(
        data?.message || "Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit contact message:", error);

      setFormError(
        error?.data?.message ||
          error?.message ||
          "Unable to send your message right now. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="portfolio-section">
      <div className="section-container">
        <p className="section-label">GET IN TOUCH</p>

        <h2>Contact</h2>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-intro">
              <h3>Let's Connect</h3>

              <p>
                Interested in cybersecurity, security research,
                collaboration, or professional opportunities?
                Feel free to get in touch.
              </p>
            </div>

            <div className="contact-details">
              {loading ? (
                <div className="contact-item">
                  <span>STATUS</span>
                  <p>Loading contact information...</p>
                </div>
              ) : contactDetails.length > 0 ? (
                contactDetails.map((detail) => (
                  <div
                    className="contact-item"
                    key={`${detail.label}-${detail.value}`}
                  >
                    <span>{detail.label}</span>

                    {detail.href ? (
                      <a
                        href={detail.href}
                        aria-label={`${detail.label}: ${detail.value}`}
                        target={detail.external ? "_blank" : undefined}
                        rel={
                          detail.external
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p>{detail.value}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="contact-item">
                  <span>STATUS</span>
                  <p>Contact information unavailable.</p>
                </div>
              )}
            </div>

            <div className="contact-focus">
              <span>AREAS OF INTEREST</span>

              <p>
                Ethical Hacking, Network Security, Digital
                Forensics, Security Testing, Mobile Security,
                and Security Engineering.
              </p>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-group">
              <label htmlFor="name">NAME</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">EMAIL</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                maxLength={255}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>

              <textarea
                id="message"
                name="message"
                placeholder="Write your message..."
                rows="7"
                value={form.message}
                onChange={handleChange}
                maxLength={5000}
                disabled={submitting}
              />
            </div>

            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}

            {formMessage && (
              <p className="form-success" role="status">
                {formMessage}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Secure Message"}
            </button>

            <p className="form-security-note">
              Messages are submitted through a server-side
              endpoint with input validation and rate limiting.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
