import { useEffect, useState } from "react";
import { getProjects } from "../../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjects();

        if (mounted) {
          setProjects(Array.isArray(data?.projects) ? data.projects : []);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);

        if (mounted) {
          setError("Unable to load projects.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const renderTechnologies = (technologies) => {
    if (!Array.isArray(technologies) || technologies.length === 0) {
      return null;
    }

    return (
      <div className="project-technologies">
        {technologies.map((technology, index) => (
          <span
            className="project-tech"
            key={`${technology}-${index}`}
          >
            {technology}
          </span>
        ))}
      </div>
    );
  };

  return (
    <section id="projects" className="portfolio-section">
      <div className="section-container">
        <p className="section-label">SELECTED WORK</p>

        <h2>Projects</h2>

        {loading && (
          <div className="projects-grid">
            <article className="project-card">
              <p>Loading projects...</p>
            </article>
          </div>
        )}

        {!loading && error && (
          <div className="projects-grid">
            <article className="project-card">
              <p>{error}</p>
            </article>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="projects-grid">
            <article className="project-card">
              <p>No projects available.</p>
            </article>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                {project.category && (
                  <span className="project-category">
                    {project.category}
                  </span>
                )}

                <h3>{project.title}</h3>

                {project.description && (
                  <p className="project-description">
                    {project.description}
                  </p>
                )}

                {renderTechnologies(project.technologies)}

                <div className="project-actions">
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  )}

                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      className="btn btn-secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Repository
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
