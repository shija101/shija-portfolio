import { useEffect, useMemo, useState } from "react";
import {
  getProfile,
  getEducation,
  getCertifications,
  getSkills,
  getExperience,
  getProjects,
  getProfessionalSkills,
  getLanguages,
  getInterests,
} from "../../services/api";

const CV = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [professionalSkills, setProfessionalSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCVData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          profileResponse,
          educationResponse,
          certificationsResponse,
          skillsResponse,
          experienceResponse,
          projectsResponse,
          professionalSkillsResponse,
          languagesResponse,
          interestsResponse,
        ] = await Promise.all([
          getProfile(),
          getEducation(),
          getCertifications(),
          getSkills(),
          getExperience(),
          getProjects(),
          getProfessionalSkills(),
          getLanguages(),
          getInterests(),
        ]);

        if (!mounted) return;

        setProfile(
          profileResponse?.profile ||
            profileResponse ||
            null
        );

        setEducation(
          Array.isArray(educationResponse?.education)
            ? educationResponse.education
            : []
        );

        setCertifications(
          Array.isArray(
            certificationsResponse?.certifications
          )
            ? certificationsResponse.certifications
            : []
        );

        setSkills(
          Array.isArray(skillsResponse?.skills)
            ? skillsResponse.skills
            : []
        );

        setExperience(
          Array.isArray(experienceResponse?.experience)
            ? experienceResponse.experience
            : []
        );

        setProjects(
          Array.isArray(projectsResponse?.projects)
            ? projectsResponse.projects
            : []
        );

        setProfessionalSkills(
          Array.isArray(
            professionalSkillsResponse?.professional_skills
          )
            ? professionalSkillsResponse.professional_skills
            : []
        );

        setLanguages(
          Array.isArray(languagesResponse?.languages)
            ? languagesResponse.languages
            : []
        );

        setInterests(
          Array.isArray(interestsResponse?.interests)
            ? interestsResponse.interests
            : []
        );
      } catch (err) {
        console.error("Failed to load CV data:", err);

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load CV information."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCVData();

    return () => {
      mounted = false;
    };
  }, []);

  const groupedSkills = useMemo(() => {
    return skills.reduce((groups, skill) => {
      const category =
        skill.category?.trim() || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    }, {});
  }, [skills]);

  const fullName = profile?.full_name || "";
  const professionalTitle =
    profile?.professional_title || "";
  const bio = profile?.bio || "";
  const phone = profile?.phone || "";
  const email = profile?.email || "";
  const location = profile?.location || "";

  const hasContactInformation =
    phone || email || location;

  return (
    <section id="cv" className="portfolio-section">
      <div className="section-container">
        <div className="cv-document">
          <header className="cv-document-header">
            <div className="cv-header-main">
              <p className="section-label">
                CURRICULUM VITAE
              </p>

              {loading ? (
                <h2>Loading...</h2>
              ) : (
                <h2>
                  {fullName || "Curriculum Vitae"}
                </h2>
              )}

              {professionalTitle && (
                <p className="cv-professional-title">
                  {professionalTitle}
                </p>
              )}
            </div>

            <div className="cv-header-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                Print / Save PDF
              </button>
            </div>
          </header>

          {!loading &&
            hasContactInformation && (
              <div className="cv-contact-bar">
                {email && (
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone.replace(
                      /\s+/g,
                      ""
                    )}`}
                  >
                    {phone}
                  </a>
                )}

                {location && (
                  <span>{location}</span>
                )}
              </div>
            )}

          {loading && (
            <div className="cv-loading">
              Loading CV information...
            </div>
          )}

          {!loading && error && (
            <div className="cv-error">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {bio && (
                <section className="cv-section">
                  <div className="cv-section-heading">
                    <span>01</span>
                    <h3>Profile</h3>
                  </div>

                  <div className="cv-section-content">
                    <p className="cv-profile-text">
                      {bio}
                    </p>
                  </div>
                </section>
              )}

              {education.length > 0 && (
                <section className="cv-section">
                  <div className="cv-section-heading">
                    <span>02</span>
                    <h3>Education</h3>
                  </div>

                  <div className="cv-section-content">
                    <div className="cv-table-wrapper">
                      <table className="cv-table">
                        <thead>
                          <tr>
                            <th>Period</th>
                            <th>Qualification</th>
                            <th>Institution</th>
                          </tr>
                        </thead>

                        <tbody>
                          {education.map((item) => (
                            <tr key={item.id}>
                              <td>
                                {item.period || "—"}
                              </td>

                              <td>
                                <strong>
                                  {item.qualification ||
                                    "—"}
                                </strong>

                                {item.description && (
                                  <small>
                                    {item.description}
                                  </small>
                                )}
                              </td>

                              <td>
                                {item.institution ||
                                  "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {certifications.length > 0 && (
                <section className="cv-section">
                  <div className="cv-section-heading">
                    <span>03</span>
                    <h3>
                      Certifications & Training
                    </h3>
                  </div>

                  <div className="cv-section-content">
                    <div className="cv-table-wrapper">
                      <table className="cv-table">
                        <thead>
                          <tr>
                            <th>
                              Certification / Training
                            </th>
                            <th>Issuer</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {certifications.map(
                            (item) => (
                              <tr key={item.id}>
                                <td>
                                  <strong>
                                    {item.title ||
                                      "—"}
                                  </strong>

                                  {item.description && (
                                    <small>
                                      {
                                        item.description
                                      }
                                    </small>
                                  )}
                                </td>

                                <td>
                                  {item.issuer ||
                                    "—"}
                                </td>

                                <td>
                                  <span className="cv-status">
                                    {item.status ||
                                      "—"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {Object.keys(groupedSkills).length >
                0 && (
                <section className="cv-section">
                  <div className="cv-section-heading">
                    <span>04</span>
                    <h3>Technical Skills</h3>
                  </div>

                  <div className="cv-section-content">
                    <div className="cv-skills-table">
                      {Object.entries(
                        groupedSkills
                      ).map(
                        ([
                          category,
                          categorySkills,
                        ]) => (
                          <div
                            className="cv-skill-row"
                            key={category}
                          >
                            <div className="cv-skill-category">
                              {category}
                            </div>

                            <div className="cv-skill-items">
                              {categorySkills.map(
                                (skill) => (
                                  <span
                                    className="cv-skill-tag"
                                    key={skill.id}
                                    title={
                                      skill.description ||
                                      ""
                                    }
                                  >
                                    {skill.name}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}

              {experience.length > 0 && (
                <section className="cv-section">
                  <div className="cv-section-heading">
                    <span>05</span>
                    <h3>
                      Practical Experience
                    </h3>
                  </div>

                  <div className="cv-section-content">
                    <div className="cv-experience-list">
                      {experience.map((item) => (
                        <article
                          className="cv-experience-item"
                          key={item.id}
                        >
                          <div className="cv-experience-period">
                            {item.period || "—"}
                          </div>

                          <div className="cv-experience-body">
                            <h4>
                              {item.position ||
                                item.title ||
                                "Experience"}
                            </h4>

                            {item.organization && (
                              <p className="cv-experience-company">
                                {item.organization}
                              </p>
                            )}

                            {item.description && (
                              <p>
                                {item.description}
                              </p>
                            )}

                            {Array.isArray(
                              item.responsibilities
                            ) &&
                              item.responsibilities
                                .length > 0 && (
                                <ul>
                                  {item.responsibilities.map(
                                    (
                                      responsibility,
                                      index
                                    ) => (
                                      <li
                                        key={`${item.id}-responsibility-${index}`}
                                      >
                                        {
                                          responsibility
                                        }
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {projects.length > 0 && (
                <section className="cv-section">
                  <div className="cv-section-heading">
                    <span>06</span>
                    <h3>Selected Projects</h3>
                  </div>

                  <div className="cv-section-content">
                    <div className="cv-projects-list">
                      {projects.map((project) => (
                        <article
                          className="cv-project-item"
                          key={project.id}
                        >
                          <div className="cv-project-heading">
                            <div>
                              <h4>
                                {project.title}
                              </h4>

                              {project.category && (
                                <span>
                                  {project.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {project.description && (
                            <p>
                              {project.description}
                            </p>
                          )}

                          {Array.isArray(
                            project.technologies
                          ) &&
                            project.technologies
                              .length > 0 && (
                              <div className="cv-project-technologies">
                                {project.technologies.map(
                                  (
                                    technology,
                                    index
                                  ) => (
                                    <span
                                      key={`${project.id}-${technology}-${index}`}
                                    >
                                      {technology}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {professionalSkills.length > 0 && (
                <section className="cv-section">
                  <div className="cv-section-heading">
                    <span>07</span>
                    <h3>
                      Professional Skills
                    </h3>
                  </div>

                  <div className="cv-section-content">
                    <div className="cv-professional-skills">
                      {professionalSkills.map(
                        (skill) => (
                          <span
                            key={skill.id}
                            title={
                              skill.description || ""
                            }
                          >
                            {skill.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}

              {languages.length > 0 && (
                <section className="cv-section cv-compact-section">
                  <div className="cv-section-heading">
                    <span>08</span>
                    <h3>Languages</h3>
                  </div>

                  <div className="cv-section-content">
                    <p className="cv-inline-content">
                      {languages.map(
                        (language, index) => (
                          <span
                            key={language.id}
                          >
                            {language.name}
                            {language.proficiency
                              ? ` — ${language.proficiency}`
                              : ""}
                            {index <
                            languages.length - 1
                              ? " · "
                              : ""}
                          </span>
                        )
                      )}
                    </p>
                  </div>
                </section>
              )}

              {interests.length > 0 && (
                <section className="cv-section cv-compact-section">
                  <div className="cv-section-heading">
                    <span>09</span>
                    <h3>Interests</h3>
                  </div>

                  <div className="cv-section-content">
                    <p className="cv-inline-content">
                      {interests.map(
                        (interest, index) => (
                          <span
                            key={interest.id}
                            title={
                              interest.description ||
                              ""
                            }
                          >
                            {interest.name}
                            {index <
                            interests.length - 1
                              ? " · "
                              : ""}
                          </span>
                        )
                      )}
                    </p>
                  </div>
                </section>
              )}
            </>
          )}

          <footer className="cv-document-footer">
            <span>
              {fullName || "Curriculum Vitae"}
            </span>

            <span>
              Professional Portfolio
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default CV;
