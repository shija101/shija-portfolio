import { useEffect, useMemo, useState } from "react";
import { getSkills } from "../../services/api";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSkills();

        if (mounted) {
          setSkills(Array.isArray(data?.skills) ? data.skills : []);
        }
      } catch (err) {
        console.error("Failed to load skills:", err);

        if (mounted) {
          setError("Unable to load skills.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  const groupedSkills = useMemo(() => {
    return skills.reduce((groups, skill) => {
      const category = skill.category?.trim() || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    }, {});
  }, [skills]);

  const categories = Object.entries(groupedSkills);

  return (
    <section id="skills" className="portfolio-section">
      <div className="section-container">
        <p className="section-label">TECHNICAL CAPABILITIES</p>

        <h2>Skills</h2>

        {loading && (
          <div className="skills-grid">
            <article className="skill-card">
              <p>Loading skills...</p>
            </article>
          </div>
        )}

        {!loading && error && (
          <div className="skills-grid">
            <article className="skill-card">
              <p>{error}</p>
            </article>
          </div>
        )}

        {!loading && !error && skills.length === 0 && (
          <div className="skills-grid">
            <article className="skill-card">
              <p>No skills available.</p>
            </article>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="skills-grid">
            {categories.map(([category, categorySkills]) => (
              <article className="skill-card" key={category}>
                <div className="skill-card-header">
                  <span className="skill-category">
                    {category.toUpperCase()}
                  </span>

                  <span className="skill-count">
                    {categorySkills.length}
                  </span>
                </div>

                <div className="skill-list">
                  {categorySkills.map((skill) => (
                    <div className="skill-item" key={skill.id}>
                      <div className="skill-item-name">
                        <span className="skill-marker">&gt;</span>
                        <span>{skill.name}</span>
                      </div>

                      {skill.description && (
                        <p>{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
