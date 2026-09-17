import { useEffect, useState } from "react";

import {
  createSkill,
  deleteSkill,
  getDocuments,
  uploadDocument,
  getDocumentDownloadUrl,
  getAbout,
  getAdminAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  deleteDocument,
  getAdminSkills,
  updateSkill,
  getAdminCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getPublicCertificateUrl,
  getPublicEducationCertificateUrl,
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,

  getAdminEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  getAdminProfile,
  createProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  getProfileImageUrl,

  getAdminProfessionalSkills,
  createProfessionalSkill,
  updateProfessionalSkill,
  deleteProfessionalSkill,

  getAdminLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,

  getAdminInterests,
  createInterest,
  updateInterest,
  deleteInterest,

  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { id: "overview", icon: "🏠", label: "Overview" },
  { id: "home", icon: "⌂", label: "Home" },
  { id: "about", icon: "👤", label: "About" },
  { id: "skills", icon: "🛠", label: "Skills" },
  { id: "professional-skills", icon: "⭐", label: "Professional Skills" },
  { id: "education", icon: "🎓", label: "Education" },
  { id: "certifications", icon: "📜", label: "Certifications" },
  { id: "experience", icon: "💼", label: "Experience" },
  { id: "projects", icon: "🚀", label: "Projects" },
  { id: "cv", icon: "📄", label: "CV" },
  { id: "languages", icon: "🌐", label: "Languages" },
  { id: "interests", icon: "🎯", label: "Interests" },
  { id: "contact", icon: "📞", label: "Contact" },
];

const secureItems = [
  { id: "documents", icon: "🔐", label: "Private Vault" },
  { id: "security", icon: "🛡️", label: "Security" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const emptySkill = {
  category: "",
  name: "",
  description: "",
  display_order: 0,
  is_visible: true,
};

const emptyProfessionalSkill = {
  name: "",
  description: "",
  display_order: 0,
  is_visible: true,
};

const emptyLanguage = {
  name: "",
  proficiency: "",
  display_order: 0,
  is_visible: true,
};

const emptyInterest = {
  name: "",
  description: "",
  display_order: 0,
  is_visible: true,
};

const emptyCertification = {
  title: "",
  issuer: "",
  status: "Completed",
  description: "",
  display_order: 0,
  is_visible: true,
};

const emptyExperience = {
  date_range: "",
  role: "",
  company: "",
  description: "",
  activities: "",
  display_order: 0,
  is_visible: true,
};

const emptyProject = {
  title: "",
  category: "",
  description: "",
  technologies: "",
  project_url: "",
  repository_url: "",
  display_order: 0,
  is_visible: true,
};

const emptyEducation = {
  period: "",
  qualification: "",
  institution: "",
  description: "",
  display_order: 0,
  is_visible: true,
  certificate: null,
};

const emptyProfile = {
  full_name: "",
  professional_title: "",
  bio: "",
  phone: "",
  email: "",
  location: "",
  linkedin_url: "",
  github_url: "",
};

function Dashboard() {
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("overview");

  /* =========================
     DOCUMENTS
  ========================= */

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documentError, setDocumentError] = useState("");
  const [documentMessage, setDocumentMessage] = useState("");
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [documentForm, setDocumentForm] = useState({
    title: "",
    document_type: "",
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [savingDocument, setSavingDocument] = useState(false);

  /* =========================
     TECHNICAL SKILLS
  ========================= */

  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [skillError, setSkillError] = useState("");
  const [skillMessage, setSkillMessage] = useState("");
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [savingSkill, setSavingSkill] = useState(false);

  /* =========================
     PROFESSIONAL SKILLS
  ========================= */

  const [professionalSkills, setProfessionalSkills] = useState([]);
  const [loadingProfessionalSkills, setLoadingProfessionalSkills] =
    useState(false);
  const [professionalSkillError, setProfessionalSkillError] = useState("");
  const [professionalSkillMessage, setProfessionalSkillMessage] =
    useState("");
  const [showProfessionalSkillForm, setShowProfessionalSkillForm] =
    useState(false);
  const [editingProfessionalSkillId, setEditingProfessionalSkillId] =
    useState(null);
  const [professionalSkillForm, setProfessionalSkillForm] = useState(
    emptyProfessionalSkill
  );
  const [savingProfessionalSkill, setSavingProfessionalSkill] =
    useState(false);

  /* =========================
     LANGUAGES
  ========================= */

  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [languageError, setLanguageError] = useState("");
  const [languageMessage, setLanguageMessage] = useState("");
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [editingLanguageId, setEditingLanguageId] = useState(null);
  const [languageForm, setLanguageForm] = useState(emptyLanguage);
  const [savingLanguage, setSavingLanguage] = useState(false);

  /* =========================
     INTERESTS
  ========================= */

  const [interests, setInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const [interestError, setInterestError] = useState("");
  const [interestMessage, setInterestMessage] = useState("");
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [editingInterestId, setEditingInterestId] = useState(null);
  const [interestForm, setInterestForm] = useState(emptyInterest);
  const [savingInterest, setSavingInterest] = useState(false);

  /* =========================
     EDUCATION FUNCTIONS
  ========================= */

  const loadEducation = async () => {
    setLoadingEducation(true);
    setEducationError("");

    try {
      const data = await getAdminEducation();

      if (data.success) {
        setEducation(data.education || []);
      }
    } catch (error) {
      setEducationError(
        error?.data?.message ||
          error?.message ||
          "Unable to load education."
      );
    } finally {
      setLoadingEducation(false);
    }
  };

  const handleEducationSubmit = async (event) => {
    event.preventDefault();

    setSavingEducation(true);
    setEducationError("");
    setEducationMessage("");

    try {
      const payload = {
        period: educationForm.period.trim(),
        qualification: educationForm.qualification.trim(),
        institution: educationForm.institution.trim(),
        description: educationForm.description.trim(),
        display_order:
          Number(educationForm.display_order) || 0,
        is_visible: Boolean(educationForm.is_visible),
      };

      const data = editingEducationId
        ? await updateEducation(
            editingEducationId,
            payload,
            educationForm.certificate
          )
        : await createEducation(
            payload,
            educationForm.certificate
          );

      if (data.success) {
        setEducationMessage(
          editingEducationId
            ? "Education updated successfully."
            : "Education created successfully."
        );

        setEducationForm(emptyEducation);
        setEditingEducationId(null);
        setShowEducationForm(false);

        await loadEducation();
      } else {
        setEducationError(
          data.message || "Unable to save education."
        );
      }
    } catch (error) {
      setEducationError(
        error?.data?.message ||
          error?.message ||
          "Unable to save education."
      );
    } finally {
      setSavingEducation(false);
    }
  };

  const handleEditEducation = (item) => {
    setEditingEducationId(item.id);

    setEducationForm({
      period: item.period || "",
      qualification: item.qualification || "",
      institution: item.institution || "",
      description: item.description || "",
      display_order: item.display_order ?? 0,
      is_visible: Boolean(item.is_visible),
      certificate: null,
    });

    setShowEducationForm(true);
    setEducationError("");
    setEducationMessage("");
  };

  const handleDeleteEducation = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?"
    );

    if (!confirmed) {
      return;
    }

    setEducationError("");
    setEducationMessage("");

    try {
      const data = await deleteEducation(id);

      if (data.success) {
        setEducationMessage(
          "Education deleted successfully."
        );

        await loadEducation();
      } else {
        setEducationError(
          data.message || "Unable to delete education."
        );
      }
    } catch (error) {
      setEducationError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete education."
      );
    }
  };

  const handleCancelEducation = () => {
    setShowEducationForm(false);
    setEditingEducationId(null);
    setEducationForm(emptyEducation);
    setEducationError("");
    setEducationMessage("");
  };

  /* =========================
     CONTACT MESSAGES
  ========================= */

  const [contactMessages, setContactMessages] = useState([]);
  const [loadingContactMessages, setLoadingContactMessages] =
    useState(false);
  const [contactError, setContactError] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  /* =========================
     CERTIFICATIONS
  ========================= */

  const [certifications, setCertifications] = useState([]);
  const [loadingCertifications, setLoadingCertifications] = useState(false);
  const [certificationError, setCertificationError] = useState("");
  const [certificationMessage, setCertificationMessage] = useState("");
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingCertificationId, setEditingCertificationId] = useState(null);
  const [certificationForm, setCertificationForm] =
    useState(emptyCertification);
  const [certificateFile, setCertificateFile] = useState(null);
  const [savingCertification, setSavingCertification] = useState(false);

  /* =========================
     EXPERIENCE
  ========================= */

  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [experienceError, setExperienceError] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [projectMessage, setProjectMessage] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    ...emptyProject,
  });
  const [savingProject, setSavingProject] = useState(false);

  /* =========================
     EDUCATION
  ========================= */

  const [education, setEducation] = useState([]);
  const [loadingEducation, setLoadingEducation] = useState(false);
  const [educationError, setEducationError] = useState("");
  const [educationMessage, setEducationMessage] = useState("");
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [savingEducation, setSavingEducation] = useState(false);
  const [experienceMessage, setExperienceMessage] = useState("");
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [savingExperience, setSavingExperience] = useState(false);

  /* =========================
     PROFILE
  ========================= */

  const [about, setAbout] = useState([]);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [aboutError, setAboutError] = useState("");
  const [aboutMessage, setAboutMessage] = useState("");
  const [showAboutForm, setShowAboutForm] = useState(false);
  const [editingAboutId, setEditingAboutId] = useState(null);
  const [aboutForm, setAboutForm] = useState({
    introduction: "",
    goal: "",
    field: "",
    specialization: "",
    focus: "",
    status: "",
    display_order: 0,
    is_visible: true,
  });
  const [savingAbout, setSavingAbout] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */

  const loadDocuments = async () => {
    setLoadingDocuments(true);
    setDocumentError("");

    try {
      const data = await getDocuments();

      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (error) {
      setDocumentError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve protected documents."
      );
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadSkills = async () => {
    setLoadingSkills(true);
    setSkillError("");

    try {
      const data = await getAdminSkills();

      if (data.success) {
        setSkills(data.skills || []);
      }
    } catch (error) {
      setSkillError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve skills."
      );
    } finally {
      setLoadingSkills(false);
    }
  };

  const loadProfessionalSkills = async () => {
    setLoadingProfessionalSkills(true);
    setProfessionalSkillError("");

    try {
      const data = await getAdminProfessionalSkills();

      if (data.success) {
        setProfessionalSkills(data.professional_skills || []);
      }
    } catch (error) {
      setProfessionalSkillError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve professional skills."
      );
    } finally {
      setLoadingProfessionalSkills(false);
    }
  };

  const loadLanguages = async () => {
    setLoadingLanguages(true);
    setLanguageError("");

    try {
      const data = await getAdminLanguages();

      if (data.success) {
        setLanguages(data.languages || []);
      }
    } catch (error) {
      setLanguageError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve languages."
      );
    } finally {
      setLoadingLanguages(false);
    }
  };

  const loadInterests = async () => {
    setLoadingInterests(true);
    setInterestError("");

    try {
      const data = await getAdminInterests();

      if (data.success) {
        setInterests(data.interests || []);
      }
    } catch (error) {
      setInterestError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve interests."
      );
    } finally {
      setLoadingInterests(false);
    }
  };

  const loadContactMessages = async () => {
    setLoadingContactMessages(true);
    setContactError("");

    try {
      const data = await getContactMessages();

      if (data.success) {
        setContactMessages(data.data || []);
      }
    } catch (error) {
      setContactError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve contact messages."
      );
    } finally {
      setLoadingContactMessages(false);
    }
  };

  const loadCertifications = async () => {
    setLoadingCertifications(true);
    setCertificationError("");

    try {
      const data = await getAdminCertifications();

      if (data.success) {
        setCertifications(data.certifications || []);
      }
    } catch (error) {
      setCertificationError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve certifications."
      );
    } finally {
      setLoadingCertifications(false);
    }
  };

  const loadExperiences = async () => {
    setLoadingExperiences(true);
    setExperienceError("");

    try {
      const data = await getAdminExperience();

      if (data.success) {
        setExperiences(data.experience || []);
      }
    } catch (error) {
      setExperienceError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve experience."
      );
    } finally {
      setLoadingExperiences(false);
    }
  };


  const loadProjects = async () => {
    setLoadingProjects(true);
    setProjectError("");

    try {
      const data = await getAdminProjects();

      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      setProjectError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve projects."
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadAbout = async () => {
    setLoadingAbout(true);
    setAboutError("");

    try {
      const data = await getAdminAbout();
      setAbout(data?.about || []);
    } catch (error) {
      console.error("Failed to load About:", error);
      setAboutError(error.message || "Failed to load About information.");
    } finally {
      setLoadingAbout(false);
    }
  };

  const loadProfile = async () => {
    setLoadingProfile(true);
    setProfileError("");

    try {
      const data = await getAdminProfile();

      if (data.success) {
        const currentProfile = data.profile || null;

        setProfile(currentProfile);

        if (currentProfile) {
          setEditingProfileId(currentProfile.id);

          setProfileForm({
            full_name: currentProfile.full_name || "",
            professional_title: currentProfile.professional_title || "",
            bio: currentProfile.bio || "",
            phone: currentProfile.phone || "",
            email: currentProfile.email || "",
            location: currentProfile.location || "",
            linkedin_url: currentProfile.linkedin_url || "",
            github_url: currentProfile.github_url || "",
          });

          setProfileImageFile(null);
          setProfileImagePreview(
            currentProfile.profile_image_path
              ? getProfileImageUrl(currentProfile.profile_image_path)
              : ""
          );
        } else {
          setEditingProfileId(null);
          setProfileForm({ ...emptyProfile });
          setProfileImageFile(null);
          setProfileImagePreview("");
        }
      }
    } catch (error) {
      setProfileError(
        error?.data?.message ||
          error?.message ||
          "Unable to retrieve profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadSkills();
    loadProfessionalSkills();
    loadLanguages();
    loadInterests();
    loadEducation();
    loadContactMessages();
    loadCertifications();
    loadExperiences();
    loadProjects();
    loadAbout();
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /* =========================
     TECHNICAL SKILLS HANDLERS
  ========================= */

  const handleSkillInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSkillForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddSkillForm = () => {
    setEditingSkillId(null);
    setSkillForm({ ...emptySkill });
    setSkillError("");
    setSkillMessage("");
    setShowSkillForm(true);
  };

  const openEditSkillForm = (skill) => {
    setEditingSkillId(skill.id);

    setSkillForm({
      category: skill.category || "",
      name: skill.name || "",
      description: skill.description || "",
      display_order: skill.display_order ?? 0,
      is_visible: skill.is_visible !== false,
    });

    setSkillError("");
    setSkillMessage("");
    setShowSkillForm(true);
  };

  const closeSkillForm = () => {
    if (savingSkill) return;

    setShowSkillForm(false);
    setEditingSkillId(null);
    setSkillForm({ ...emptySkill });
  };

  const handleSkillSubmit = async (event) => {
    event.preventDefault();

    setSkillError("");
    setSkillMessage("");

    if (!skillForm.category.trim() || !skillForm.name.trim()) {
      setSkillError("Category and skill name are required.");
      return;
    }

    try {
      setSavingSkill(true);

      const payload = {
        category: skillForm.category.trim(),
        name: skillForm.name.trim(),
        description: skillForm.description.trim(),
        display_order: Number(skillForm.display_order),
        is_visible: skillForm.is_visible,
      };

      if (editingSkillId) {
        const data = await updateSkill(editingSkillId, payload);
        setSkillMessage(data.message || "Skill updated successfully.");
      } else {
        const data = await createSkill(payload);
        setSkillMessage(data.message || "Skill created successfully.");
      }

      await loadSkills();

      setShowSkillForm(false);
      setEditingSkillId(null);
      setSkillForm({ ...emptySkill });
    } catch (error) {
      setSkillError(
        error?.data?.message ||
          error?.message ||
          "Unable to save skill."
      );
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    const confirmed = window.confirm(
      `Delete "${skill.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setSkillError("");
    setSkillMessage("");

    try {
      const data = await deleteSkill(skill.id);

      setSkillMessage(data.message || "Skill deleted successfully.");

      await loadSkills();
    } catch (error) {
      setSkillError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete skill."
      );
    }
  };

  /* =========================
     PROFESSIONAL SKILLS
  ========================= */

  const handleProfessionalSkillInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setProfessionalSkillForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddProfessionalSkillForm = () => {
    setEditingProfessionalSkillId(null);
    setProfessionalSkillForm({ ...emptyProfessionalSkill });
    setProfessionalSkillError("");
    setProfessionalSkillMessage("");
    setShowProfessionalSkillForm(true);
  };

  const openEditProfessionalSkillForm = (skill) => {
    setEditingProfessionalSkillId(skill.id);

    setProfessionalSkillForm({
      name: skill.name || "",
      description: skill.description || "",
      display_order: skill.display_order ?? 0,
      is_visible: skill.is_visible !== false,
    });

    setProfessionalSkillError("");
    setProfessionalSkillMessage("");
    setShowProfessionalSkillForm(true);
  };

  const closeProfessionalSkillForm = () => {
    if (savingProfessionalSkill) return;

    setShowProfessionalSkillForm(false);
    setEditingProfessionalSkillId(null);
    setProfessionalSkillForm({ ...emptyProfessionalSkill });
  };

  const handleProfessionalSkillSubmit = async (event) => {
    event.preventDefault();

    setProfessionalSkillError("");
    setProfessionalSkillMessage("");

    if (!professionalSkillForm.name.trim()) {
      setProfessionalSkillError("Professional skill name is required.");
      return;
    }

    try {
      setSavingProfessionalSkill(true);

      const payload = {
        name: professionalSkillForm.name.trim(),
        description: professionalSkillForm.description.trim(),
        display_order: Number(
          professionalSkillForm.display_order
        ),
        is_visible: professionalSkillForm.is_visible,
      };

      let data;

      if (editingProfessionalSkillId) {
        data = await updateProfessionalSkill(
          editingProfessionalSkillId,
          payload
        );
      } else {
        data = await createProfessionalSkill(payload);
      }

      setProfessionalSkillMessage(
        data.message ||
          (editingProfessionalSkillId
            ? "Professional skill updated successfully."
            : "Professional skill created successfully.")
      );

      await loadProfessionalSkills();

      setShowProfessionalSkillForm(false);
      setEditingProfessionalSkillId(null);
      setProfessionalSkillForm({ ...emptyProfessionalSkill });
    } catch (error) {
      let message =
        error?.data?.message ||
        error?.message ||
        "Unable to save professional skill.";

      if (
        Array.isArray(error?.data?.errors) &&
        error.data.errors.length > 0
      ) {
        message = error.data.errors
          .map((item) => item.msg || item.message)
          .join(" ");
      }

      setProfessionalSkillError(message);
    } finally {
      setSavingProfessionalSkill(false);
    }
  };

  const handleDeleteProfessionalSkill = async (skill) => {
    const confirmed = window.confirm(
      `Delete "${skill.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setProfessionalSkillError("");
    setProfessionalSkillMessage("");

    try {
      const data = await deleteProfessionalSkill(skill.id);

      setProfessionalSkillMessage(
        data.message || "Professional skill deleted successfully."
      );

      await loadProfessionalSkills();
    } catch (error) {
      setProfessionalSkillError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete professional skill."
      );
    }
  };

  /* =========================
     LANGUAGES
  ========================= */

  const handleLanguageInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setLanguageForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddLanguageForm = () => {
    setEditingLanguageId(null);
    setLanguageForm({ ...emptyLanguage });
    setLanguageError("");
    setLanguageMessage("");
    setShowLanguageForm(true);
  };

  const openEditLanguageForm = (language) => {
    setEditingLanguageId(language.id);

    setLanguageForm({
      name: language.name || "",
      proficiency: language.proficiency || "",
      display_order: language.display_order ?? 0,
      is_visible: language.is_visible !== false,
    });

    setLanguageError("");
    setLanguageMessage("");
    setShowLanguageForm(true);
  };

  const closeLanguageForm = () => {
    if (savingLanguage) return;

    setShowLanguageForm(false);
    setEditingLanguageId(null);
    setLanguageForm({ ...emptyLanguage });
  };

  const handleLanguageSubmit = async (event) => {
    event.preventDefault();

    setLanguageError("");
    setLanguageMessage("");

    if (!languageForm.name.trim()) {
      setLanguageError("Language name is required.");
      return;
    }

    try {
      setSavingLanguage(true);

      const payload = {
        name: languageForm.name.trim(),
        proficiency: languageForm.proficiency.trim(),
        display_order: Number(languageForm.display_order),
        is_visible: languageForm.is_visible,
      };

      let data;

      if (editingLanguageId) {
        data = await updateLanguage(
          editingLanguageId,
          payload
        );
      } else {
        data = await createLanguage(payload);
      }

      setLanguageMessage(
        data.message ||
          (editingLanguageId
            ? "Language updated successfully."
            : "Language created successfully.")
      );

      await loadLanguages();

      setShowLanguageForm(false);
      setEditingLanguageId(null);
      setLanguageForm({ ...emptyLanguage });
    } catch (error) {
      let message =
        error?.data?.message ||
        error?.message ||
        "Unable to save language.";

      if (
        Array.isArray(error?.data?.errors) &&
        error.data.errors.length > 0
      ) {
        message = error.data.errors
          .map((item) => item.msg || item.message)
          .join(" ");
      }

      setLanguageError(message);
    } finally {
      setSavingLanguage(false);
    }
  };

  const handleDeleteLanguage = async (language) => {
    const confirmed = window.confirm(
      `Delete "${language.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setLanguageError("");
    setLanguageMessage("");

    try {
      const data = await deleteLanguage(language.id);

      setLanguageMessage(
        data.message || "Language deleted successfully."
      );

      await loadLanguages();
    } catch (error) {
      setLanguageError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete language."
      );
    }
  };

  /* =========================
     INTERESTS
  ========================= */

  const handleInterestInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setInterestForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddInterestForm = () => {
    setEditingInterestId(null);
    setInterestForm({ ...emptyInterest });
    setInterestError("");
    setInterestMessage("");
    setShowInterestForm(true);
  };

  const openEditInterestForm = (interest) => {
    setEditingInterestId(interest.id);

    setInterestForm({
      name: interest.name || "",
      description: interest.description || "",
      display_order: interest.display_order ?? 0,
      is_visible: interest.is_visible !== false,
    });

    setInterestError("");
    setInterestMessage("");
    setShowInterestForm(true);
  };

  const closeInterestForm = () => {
    if (savingInterest) return;

    setShowInterestForm(false);
    setEditingInterestId(null);
    setInterestForm({ ...emptyInterest });
  };

  const handleInterestSubmit = async (event) => {
    event.preventDefault();

    setInterestError("");
    setInterestMessage("");

    if (!interestForm.name.trim()) {
      setInterestError("Interest name is required.");
      return;
    }

    try {
      setSavingInterest(true);

      const payload = {
        name: interestForm.name.trim(),
        description: interestForm.description.trim(),
        display_order: Number(interestForm.display_order),
        is_visible: interestForm.is_visible,
      };

      let data;

      if (editingInterestId) {
        data = await updateInterest(
          editingInterestId,
          payload
        );
      } else {
        data = await createInterest(payload);
      }

      setInterestMessage(
        data.message ||
          (editingInterestId
            ? "Interest updated successfully."
            : "Interest created successfully.")
      );

      await loadInterests();

      setShowInterestForm(false);
      setEditingInterestId(null);
      setInterestForm({ ...emptyInterest });
    } catch (error) {
      let message =
        error?.data?.message ||
        error?.message ||
        "Unable to save interest.";

      if (
        Array.isArray(error?.data?.errors) &&
        error.data.errors.length > 0
      ) {
        message = error.data.errors
          .map((item) => item.msg || item.message)
          .join(" ");
      }

      setInterestError(message);
    } finally {
      setSavingInterest(false);
    }
  };

  const handleDeleteInterest = async (interest) => {
    const confirmed = window.confirm(
      `Delete "${interest.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setInterestError("");
    setInterestMessage("");

    try {
      const data = await deleteInterest(interest.id);

      setInterestMessage(
        data.message || "Interest deleted successfully."
      );

      await loadInterests();
    } catch (error) {
      setInterestError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete interest."
      );
    }
  };

  /* =========================
     CERTIFICATIONS
  ========================= */

  const handleCertificationInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setCertificationForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCertificateFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setCertificateFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setCertificationError(
        "Only PDF, JPEG, PNG and WEBP certificate files are allowed."
      );

      event.target.value = "";
      setCertificateFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCertificationError(
        "Certificate file must not exceed 10 MB."
      );

      event.target.value = "";
      setCertificateFile(null);
      return;
    }

    setCertificationError("");
    setCertificateFile(file);
  };

  const openAddCertificationForm = () => {
    setEditingCertificationId(null);
    setCertificationForm({ ...emptyCertification });
    setCertificateFile(null);
    setCertificationError("");
    setCertificationMessage("");
    setShowCertificationForm(true);
  };

  const openEditCertificationForm = (certification) => {
    setEditingCertificationId(certification.id);

    setCertificationForm({
      title: certification.title || "",
      issuer: certification.issuer || "",
      status: certification.status || "Completed",
      description: certification.description || "",
      display_order: certification.display_order ?? 0,
      is_visible: certification.is_visible !== false,
    });

    setCertificateFile(null);
    setCertificationError("");
    setCertificationMessage("");
    setShowCertificationForm(true);
  };

  const closeCertificationForm = () => {
    if (savingCertification) return;

    setShowCertificationForm(false);
    setEditingCertificationId(null);
    setCertificationForm({ ...emptyCertification });
    setCertificateFile(null);
  };

  const handleCertificationSubmit = async (event) => {
    event.preventDefault();

    setCertificationError("");
    setCertificationMessage("");

    if (
      !certificationForm.title.trim() ||
      !certificationForm.issuer.trim() ||
      !certificationForm.status.trim()
    ) {
      setCertificationError(
        "Title, issuer and status are required."
      );
      return;
    }

    try {
      setSavingCertification(true);

      const formData = new FormData();

      formData.append(
        "title",
        certificationForm.title.trim()
      );

      formData.append(
        "issuer",
        certificationForm.issuer.trim()
      );

      formData.append(
        "status",
        certificationForm.status.trim()
      );

      formData.append(
        "description",
        certificationForm.description.trim()
      );

      formData.append(
        "display_order",
        String(
          Number(certificationForm.display_order)
        )
      );

      formData.append(
        "is_visible",
        String(certificationForm.is_visible)
      );

      if (certificateFile) {
        formData.append(
          "certificate",
          certificateFile
        );
      }

      let data;

      if (editingCertificationId) {
        data = await updateCertification(
          editingCertificationId,
          formData
        );
      } else {
        data = await createCertification(formData);
      }

      setCertificationMessage(
        data.message ||
          (editingCertificationId
            ? "Certification updated successfully."
            : "Certification created successfully.")
      );

      await loadCertifications();

      setShowCertificationForm(false);
      setEditingCertificationId(null);
      setCertificationForm({
        ...emptyCertification,
      });
      setCertificateFile(null);
    } catch (error) {
      let message =
        error?.data?.message ||
        error?.message ||
        "Unable to save certification.";

      if (
        Array.isArray(error?.data?.errors) &&
        error.data.errors.length > 0
      ) {
        message = error.data.errors
          .map(
            (item) =>
              item.msg || item.message
          )
          .join(" ");
      }

      setCertificationError(message);
    } finally {
      setSavingCertification(false);
    }
  };

  const handleDeleteCertification = async (
    certification
  ) => {
    const confirmed = window.confirm(
      `Delete "${certification.title}"? This will also remove its certificate file. This action cannot be undone.`
    );

    if (!confirmed) return;

    setCertificationError("");
    setCertificationMessage("");

    try {
      const data =
        await deleteCertification(
          certification.id
        );

      setCertificationMessage(
        data.message ||
          "Certification deleted successfully."
      );

      await loadCertifications();
    } catch (error) {
      setCertificationError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete certification."
      );
    }
  };

  const handleViewCertificate = (
    certification
  ) => {
    if (!certification?.id) return;

    const url =
      getPublicCertificateUrl(
        certification.id
      );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================
     PROFILE
  ========================= */

  const handleProfileInputChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (event) => {
    const file =
      event.target.files?.[0] || null;

    if (!file) {
      setProfileImageFile(null);

      setProfileImagePreview(
        profile?.profile_image_path
          ? getProfileImageUrl(
              profile.profile_image_path
            )
          : ""
      );

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setProfileError(
        "Only JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      setProfileImageFile(null);

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setProfileError(
        "Profile image must not exceed 10 MB."
      );

      event.target.value = "";
      setProfileImageFile(null);

      return;
    }

    setProfileError("");
    setProfileImageFile(file);

    setProfileImagePreview(
      URL.createObjectURL(file)
    );
  };

  const openProfileForm = () => {
    setProfileError("");
    setProfileMessage("");

    if (profile) {
      setEditingProfileId(profile.id);

      setProfileForm({
        full_name:
          profile.full_name || "",

        professional_title:
          profile.professional_title || "",

        bio:
          profile.bio || "",

        phone:
          profile.phone || "",

        email:
          profile.email || "",

        location:
          profile.location || "",

        linkedin_url:
          profile.linkedin_url || "",

        github_url:
          profile.github_url || "",
      });

      setProfileImageFile(null);

      setProfileImagePreview(
        profile.profile_image_path
          ? getProfileImageUrl(
              profile.profile_image_path
            )
          : ""
      );
    } else {
      setEditingProfileId(null);
      setProfileForm({
        ...emptyProfile,
      });

      setProfileImageFile(null);
      setProfileImagePreview("");
    }

    setShowProfileForm(true);
  };

  const closeProfileForm = () => {
    if (savingProfile) return;

    setShowProfileForm(false);
    setProfileImageFile(null);

    setProfileImagePreview(
      profile?.profile_image_path
        ? getProfileImageUrl(
            profile.profile_image_path
          )
        : ""
    );
  };

  const handleRemoveProfileImage = async () => {
    if (!profile?.id) return;

    const confirmed = window.confirm(
      "Remove the current profile image?"
    );

    if (!confirmed) return;

    setProfileError("");
    setProfileMessage("");

    try {
      setSavingProfile(true);

      const data =
        await deleteProfileImage(
          profile.id
        );

      setProfileImageFile(null);
      setProfileImagePreview("");

      setProfileMessage(
        data.message ||
          "Profile image removed successfully."
      );

      await loadProfile();
    } catch (error) {
      setProfileError(
        error?.data?.message ||
          error?.message ||
          "Unable to remove profile image."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileError("");
    setProfileMessage("");

    if (!profileForm.full_name.trim()) {
      setProfileError(
        "Full name is required."
      );

      return;
    }

    try {
      setSavingProfile(true);

      const payload = {
        full_name:
          profileForm.full_name.trim(),

        professional_title:
          profileForm.professional_title.trim(),

        bio:
          profileForm.bio.trim(),

        phone:
          profileForm.phone.trim(),

        email:
          profileForm.email.trim(),

        location:
          profileForm.location.trim(),

        linkedin_url:
          profileForm.linkedin_url.trim(),

        github_url:
          profileForm.github_url.trim(),
      };

      let data;

      let savedProfileId =
        editingProfileId;

      if (editingProfileId) {
        data =
          await updateProfile(
            editingProfileId,
            payload
          );
      } else {
        data =
          await createProfile(
            payload
          );

        savedProfileId =
          data?.profile?.id ||
          null;
      }

      if (
        profileImageFile &&
        savedProfileId
      ) {
        const imageData =
          await uploadProfileImage(
            savedProfileId,
            profileImageFile
          );

        data = imageData;
      }

      setProfileMessage(
        data.message ||
          (editingProfileId
            ? "Profile updated successfully."
            : "Profile created successfully.")
      );

      setProfileImageFile(null);

      await loadProfile();

      setShowProfileForm(false);
    } catch (error) {
      let message =
        error?.data?.message ||
        error?.message ||
        "Unable to save profile.";

      if (
        Array.isArray(
          error?.data?.errors
        ) &&
        error.data.errors.length > 0
      ) {
        message =
          error.data.errors
            .map(
              (item) =>
                item.msg ||
                item.message
            )
            .join(" ");
      }

      setProfileError(message);
    } finally {
      setSavingProfile(false);
    }
  };

  /* =========================
     EXPERIENCE
  ========================= */

  const handleExperienceInputChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setExperienceForm(
      (current) => ({
        ...current,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );
  };

  const openAddExperienceForm = () => {
    setEditingExperienceId(null);

    setExperienceForm({
      ...emptyExperience,
    });

    setExperienceError("");
    setExperienceMessage("");
    setShowExperienceForm(true);
  };

  const openEditExperienceForm = (
    experience
  ) => {
    const activities =
      Array.isArray(
        experience.activities
      )
        ? experience.activities.join(
            "\n"
          )
        : "";

    setEditingExperienceId(
      experience.id
    );

    setExperienceForm({
      date_range:
        experience.date_range ||
        "",

      role:
        experience.role || "",

      company:
        experience.company || "",

      description:
        experience.description ||
        "",

      activities,

      display_order:
        experience.display_order ??
        0,

      is_visible:
        experience.is_visible !==
        false,
    });

    setExperienceError("");
    setExperienceMessage("");
    setShowExperienceForm(true);
  };

  const closeExperienceForm = () => {
    if (savingExperience) return;

    setShowExperienceForm(false);
    setEditingExperienceId(null);

    setExperienceForm({
      ...emptyExperience,
    });
  };

  const handleExperienceSubmit = async (
    event
  ) => {
    event.preventDefault();

    setExperienceError("");
    setExperienceMessage("");

    if (
      !experienceForm.date_range.trim() ||
      !experienceForm.role.trim() ||
      !experienceForm.company.trim()
    ) {
      setExperienceError(
        "Date range, role and company are required."
      );

      return;
    }

    const activities =
      experienceForm.activities
        .split("\n")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);

    try {
      setSavingExperience(true);

      const payload = {
        date_range:
          experienceForm.date_range.trim(),

        role:
          experienceForm.role.trim(),

        company:
          experienceForm.company.trim(),

        description:
          experienceForm.description.trim(),

        activities,

        display_order:
          Number(
            experienceForm.display_order
          ),

        is_visible:
          experienceForm.is_visible,
      };

      let data;

      if (editingExperienceId) {
        data =
          await updateExperience(
            editingExperienceId,
            payload
          );
      } else {
        data =
          await createExperience(
            payload
          );
      }

      setExperienceMessage(
        data.message ||
          (editingExperienceId
            ? "Experience updated successfully."
            : "Experience created successfully.")
      );

      await loadExperiences();

      setShowExperienceForm(false);
      setEditingExperienceId(null);

      setExperienceForm({
        ...emptyExperience,
      });
    } catch (error) {
      let message =
        error?.data?.message ||
        error?.message ||
        "Unable to save experience.";

      if (
        Array.isArray(
          error?.data?.errors
        ) &&
        error.data.errors.length > 0
      ) {
        message =
          error.data.errors
            .map(
              (item) =>
                item.msg ||
                item.message
            )
            .join(" ");
      }

      setExperienceError(message);
    } finally {
      setSavingExperience(false);
    }
  };

  const handleDeleteExperience = async (
    experience
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${experience.role}" at "${experience.company}"? This action cannot be undone.`
      );

    if (!confirmed) return;

    setExperienceError("");
    setExperienceMessage("");

    try {
      const data =
        await deleteExperience(
          experience.id
        );

      setExperienceMessage(
        data.message ||
          "Experience deleted successfully."
      );

      await loadExperiences();
    } catch (error) {
      setExperienceError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete experience."
      );
    }
  };

  /* =========================
     PORTFOLIO ITEMS
  ========================= */

  const portfolioItems = [
    {
      id: "home",
      icon: "⌂",
      title: "Home",
      description:
        "Manage your portfolio introduction and hero content.",
    },
    {
      id: "about",
      icon: "👤",
      title: "About",
      description:
        "Manage your professional profile and biography.",
    },
    {
      id: "profile",
      icon: "🪪",
      title: "Profile",
      description:
        "Manage your name, professional title, contact details and biography.",
    },
    {
      id: "skills",
      icon: "🛠",
      title: "Technical Skills",
      description:
        "Manage technical skills displayed on your public portfolio.",
    },
    {
      id: "professional-skills",
      icon: "⭐",
      title: "Professional Skills",
      description:
        "Manage professional and transferable skills used in your CV.",
    },
    {
      id: "education",
      icon: "🎓",
      title: "Education",
      description:
        "Manage your academic background and qualifications.",
    },
    {
      id: "certifications",
      icon: "📜",
      title: "Certifications",
      description:
        "Manage professional certificates and training.",
    },
    {
      id: "experience",
      icon: "💼",
      title: "Experience",
      description:
        "Manage practical and professional experience.",
    },
    {
      id: "projects",
      icon: "🚀",
      title: "Projects",
      description:
        "Add, edit or remove portfolio projects.",
    },
    {
      id: "cv",
      icon: "📄",
      title: "CV",
      description:
        "Manage the data displayed in your professional CV.",
    },
    {
      id: "languages",
      icon: "🌐",
      title: "Languages",
      description:
        "Manage languages displayed on your professional CV.",
    },
    {
      id: "interests",
      icon: "🎯",
      title: "Interests",
      description:
        "Manage professional interests displayed on your CV.",
    },
    {
      id: "contact",
      icon: "📞",
      title: "Contact",
      description:
        "Manage contact information and social links.",
    },
  ];

  /* =========================
     OVERVIEW
  ========================= */

  const renderOverview = () => (
    <>
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO CONTROL CENTER
          </p>

          <h2>Dashboard Overview</h2>

          <p>
            Manage your entire cybersecurity portfolio
            from one secure administration panel.
          </p>
        </div>

        <div className="admin-user-badge">
          <span>ADMIN</span>

          <strong>
            {user?.email ||
              "Administrator"}
          </strong>
        </div>
      </div>

      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <span className="admin-stat-icon">
            📂
          </span>

          <div>
            <span className="admin-stat-label">
              Protected Documents
            </span>

            <strong>
              {loadingDocuments
                ? "..."
                : documents.length}
            </strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon">
            🧩
          </span>

          <div>
            <span className="admin-stat-label">
              Portfolio Sections
            </span>

            <strong>
              {portfolioItems.length}
            </strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon">
            📜
          </span>

          <div>
            <span className="admin-stat-label">
              Certifications
            </span>

            <strong>
              {loadingCertifications
                ? "..."
                : certifications.length}
            </strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon">
            🔐
          </span>

          <div>
            <span className="admin-stat-label">
              Account Status
            </span>

            <strong className="admin-status-online">
              Active
            </strong>
          </div>
        </article>
      </div>

      <div className="admin-content-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </p>

          <h3>
            Manage Portfolio Content
          </h3>
        </div>
      </div>

      <div className="admin-management-grid">
        {portfolioItems.map(
          (item) => (
            <button
              key={item.id}
              type="button"
              className="admin-management-card"
              onClick={() =>
                setActiveSection(
                  item.id
                )
              }
            >
              <span className="admin-management-icon">
                {item.icon}
              </span>

              <span className="admin-management-content">
                <strong>
                  {item.title}
                </strong>

                <small>
                  {item.description}
                </small>
              </span>

              <span className="admin-management-arrow">
                →
              </span>
            </button>
          )
        )}
      </div>
    </>
  );

  /* =========================
     ABOUT HANDLERS
  ========================= */

  const handleAboutInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAboutForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddAboutForm = () => {
    setEditingAboutId(null);
    setAboutForm({
      introduction: "",
      goal: "",
      field: "",
      specialization: "",
      focus: "",
      status: "",
      display_order: about.length,
      is_visible: true,
    });
    setAboutMessage("");
    setAboutError("");
    setShowAboutForm(true);
  };

  const openEditAboutForm = (item) => {
    setEditingAboutId(item.id);
    setAboutForm({
      introduction: item.introduction || "",
      goal: item.goal || "",
      field: item.field || "",
      specialization: item.specialization || "",
      focus: item.focus || "",
      status: item.status || "",
      display_order: item.display_order ?? 0,
      is_visible: Boolean(item.is_visible),
    });
    setAboutMessage("");
    setAboutError("");
    setShowAboutForm(true);
  };

  const closeAboutForm = () => {
    if (savingAbout) {
      return;
    }

    setShowAboutForm(false);
    setEditingAboutId(null);
    setAboutForm({
      introduction: "",
      goal: "",
      field: "",
      specialization: "",
      focus: "",
      status: "",
      display_order: 0,
      is_visible: true,
    });
  };

  const handleAboutSubmit = async (event) => {
    event.preventDefault();

    setSavingAbout(true);
    setAboutMessage("");
    setAboutError("");

    try {
      const payload = {
        introduction: aboutForm.introduction.trim(),
        goal: aboutForm.goal.trim(),
        field: aboutForm.field.trim(),
        specialization: aboutForm.specialization.trim(),
        focus: aboutForm.focus.trim(),
        status: aboutForm.status.trim(),
        display_order: Number(aboutForm.display_order) || 0,
        is_visible: Boolean(aboutForm.is_visible),
      };

      if (editingAboutId) {
        const data = await updateAbout(
          editingAboutId,
          payload
        );

        if (!data?.success) {
          throw new Error(
            data?.message || "Failed to update About information."
          );
        }

        setAboutMessage(
          data.message || "About information updated successfully."
        );
      } else {
        const data = await createAbout(payload);

        if (!data?.success) {
          throw new Error(
            data?.message || "Failed to create About information."
          );
        }

        setAboutMessage(
          data.message || "About information created successfully."
        );
      }

      await loadAbout();
      closeAboutForm();
    } catch (error) {
      console.error("Failed to save About:", error);
      setAboutError(
        error.message || "Failed to save About information."
      );
    } finally {
      setSavingAbout(false);
    }
  };

  const handleDeleteAbout = async (item) => {
    const confirmed = window.confirm(
      `Delete this About entry?\n\n${item.field || "About information"}`
    );

    if (!confirmed) {
      return;
    }

    setAboutMessage("");
    setAboutError("");

    try {
      const data = await deleteAbout(item.id);

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to delete About information."
        );
      }

      setAboutMessage(
        data.message || "About information deleted successfully."
      );

      await loadAbout();
    } catch (error) {
      console.error("Failed to delete About:", error);
      setAboutError(
        error.message || "Failed to delete About information."
      );
    }
  };

  /* =========================
     PROFILE UI
  ========================= */

  const renderProfile = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </p>

          <h2>🪪 Profile</h2>

          <p>
            Manage the personal and professional
            information displayed throughout your
            public portfolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openProfileForm}
          disabled={loadingProfile}
        >
          {profile
            ? "✎ Edit Profile"
            : "+ Create Profile"}
        </button>
      </div>

      {profileMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {profileMessage}
        </div>
      )}

      {profileError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {profileError}
        </div>
      )}

      {loadingProfile ? (
        <div className="admin-empty-state">
          <span>⏳</span>

          <h3>
            Loading Profile
          </h3>

          <p>
            Retrieving profile information
            from PostgreSQL...
          </p>
        </div>
      ) : (
        <>
          {showProfileForm && (
            <form
              className="admin-skill-form"
              onSubmit={
                handleProfileSubmit
              }
            >
              <div className="admin-form-header">
                <div>
                  <p className="admin-eyebrow">
                    {editingProfileId
                      ? "EDIT PROFILE"
                      : "NEW PROFILE"}
                  </p>

                  <h3>
                    {editingProfileId
                      ? "Edit Profile"
                      : "Create Profile"}
                  </h3>
                </div>

                <button
                  type="button"
                  className="admin-close-button"
                  onClick={
                    closeProfileForm
                  }
                  disabled={
                    savingProfile
                  }
                >
                  ×
                </button>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="profile-full-name">
                    Full Name
                  </label>

                  <input
                    id="profile-full-name"
                    name="full_name"
                    type="text"
                    value={
                      profileForm.full_name
                    }
                    onChange={
                      handleProfileInputChange
                    }
                    placeholder="Enter full name"
                    maxLength={255}
                    disabled={
                      savingProfile
                    }
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="profile-professional-title">
                    Professional Title
                  </label>

                  <input
                    id="profile-professional-title"
                    name="professional_title"
                    type="text"
                    value={
                      profileForm.professional_title
                    }
                    onChange={
                      handleProfileInputChange
                    }
                    placeholder="Enter professional title"
                    maxLength={255}
                    disabled={
                      savingProfile
                    }
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label htmlFor="profile-bio">
                    Professional Biography
                  </label>

                  <textarea
                    id="profile-bio"
                    name="bio"
                    value={
                      profileForm.bio
                    }
                    onChange={
                      handleProfileInputChange
                    }
                    placeholder="Write your professional profile..."
                    rows="6"
                    disabled={
                      savingProfile
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="profile-phone">
                    Phone
                  </label>

                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={
                      profileForm.phone
                    }
                    onChange={
                      handleProfileInputChange
                    }
                    placeholder="Phone number"
                    maxLength={50}
                    disabled={
                      savingProfile
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="profile-email">
                    Email
                  </label>

                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={
                      profileForm.email
                    }
                    onChange={
                      handleProfileInputChange
                    }
                    placeholder="Professional email"
                    maxLength={255}
                    disabled={
                      savingProfile
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="profile-location">
                    Location
                  </label>

                  <input
                    id="profile-location"
                    name="location"
                    type="text"
                    value={
                      profileForm.location
                    }
                    onChange={
                      handleProfileInputChange
                    }
                    placeholder="Location"
                    maxLength={255}
                    disabled={
                      savingProfile
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="profile-linkedin-url">
                    LinkedIn URL
                  </label>
                  <input
                    id="profile-linkedin-url"
                    name="linkedin_url"
                    type="url"
                    value={profileForm.linkedin_url}
                    onChange={handleProfileInputChange}
                    placeholder="https://www.linkedin.com/in/your-profile"
                    maxLength={500}
                    disabled={savingProfile}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="profile-github-url">
                    GitHub URL
                  </label>
                  <input
                    id="profile-github-url"
                    name="github_url"
                    type="url"
                    value={profileForm.github_url}
                    onChange={handleProfileInputChange}
                    placeholder="https://github.com/your-username"
                    maxLength={500}
                    disabled={savingProfile}
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label htmlFor="profile-image">
                    Profile Photo
                  </label>

                  <div
                    style={{
                      display:
                        "flex",
                      gap:
                        "1rem",
                      alignItems:
                        "flex-start",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    {profileImagePreview ? (
                      <div
                        style={{
                          width:
                            "160px",
                          height:
                            "200px",
                          overflow:
                            "hidden",
                          borderRadius:
                            "12px",
                          border:
                            "1px solid rgba(255,255,255,0.12)",
                          background:
                            "rgba(0,0,0,0.25)",
                          flexShrink:
                            0,
                        }}
                      >
                        <img
                          src={
                            profileImagePreview
                          }
                          alt="Profile preview"
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "contain",
                            objectPosition:
                              "center center",
                            display:
                              "block",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width:
                            "160px",
                          height:
                            "200px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          borderRadius:
                            "12px",
                          border:
                            "1px dashed rgba(255,255,255,0.2)",
                          background:
                            "rgba(0,0,0,0.2)",
                          color:
                            "rgba(255,255,255,0.55)",
                          textAlign:
                            "center",
                          padding:
                            "1rem",
                          flexShrink:
                            0,
                        }}
                      >
                        No photo
                      </div>
                    )}

                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap:
                          "0.7rem",
                        minWidth:
                          "220px",
                      }}
                    >
                      <input
                        id="profile-image"
                        name="profile_image"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={
                          handleProfileImageChange
                        }
                        disabled={
                          savingProfile
                        }
                      />

                      <small>
                        Upload JPEG,
                        PNG or WEBP.
                        Maximum 10 MB.
                      </small>

                      {profileImageFile && (
                        <small>
                          Selected:{" "}
                          <strong>
                            {
                              profileImageFile.name
                            }
                          </strong>
                        </small>
                      )}

                      {profile?.profile_image_path &&
                        !profileImageFile && (
                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={
                              handleRemoveProfileImage
                            }
                            disabled={
                              savingProfile
                            }
                          >
                            🗑 Remove
                            Photo
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={
                    closeProfileForm
                  }
                  disabled={
                    savingProfile
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={
                    savingProfile
                  }
                >
                  {savingProfile
                    ? "Saving..."
                    : editingProfileId
                    ? "Update Profile"
                    : "Save Profile"}
                </button>
              </div>
            </form>
          )}

          <div className="admin-skills-panel">
            <div className="admin-panel-header">
              <div>
                <h3>
                  Profile Information
                </h3>

                <p>
                  {profile
                    ? "Profile record is connected to PostgreSQL."
                    : "No profile record exists yet."}
                </p>
              </div>

              <button
                type="button"
                className="admin-refresh-button"
                onClick={
                  loadProfile
                }
                disabled={
                  loadingProfile
                }
              >
                ↻ Refresh
              </button>
            </div>

            {!profile ? (
              <div className="admin-empty-state">
                <span>🪪</span>

                <h3>
                  No Profile Yet
                </h3>

                <p>
                  Create your profile
                  information using the
                  button above.
                </p>
              </div>
            ) : (
              <article className="admin-skill-item">
                <div className="admin-skill-main">
                  {profile.profile_image_path && (
                    <div
                      style={{
                        marginBottom:
                          "1rem",
                        width:
                          "140px",
                        height:
                          "175px",
                        overflow:
                          "hidden",
                        borderRadius:
                          "12px",
                        border:
                          "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <img
                        src={getProfileImageUrl(
                          profile.profile_image_path
                        )}
                        alt={
                          profile.full_name ||
                          "Profile photo"
                        }
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                          objectFit:
                            "cover",
                          display:
                            "block",
                        }}
                      />
                    </div>
                  )}

                  <div className="admin-skill-heading">
                    <h3>
                      {
                        profile.full_name
                      }
                    </h3>

                    <span className="admin-visibility visible">
                      Active
                    </span>
                  </div>

                  {profile.professional_title && (
                    <span className="admin-skill-category">
                      {
                        profile.professional_title
                      }
                    </span>
                  )}

                  {profile.bio && (
                    <p>
                      {profile.bio}
                    </p>
                  )}

                  <div>
                    {profile.email && (
                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {
                          profile.email
                        }
                      </p>
                    )}

                    {profile.phone && (
                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {
                          profile.phone
                        }
                      </p>
                    )}

                    {profile.location && (
                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {
                          profile.location
                        }
                      </p>
                    )}

                    {profile.linkedin_url && (
                      <p>
                        <strong>
                          LinkedIn:
                        </strong>{" "}
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profile.linkedin_url}
                        </a>
                      </p>
                    )}

                    {profile.github_url && (
                      <p>
                        <strong>
                          GitHub:
                        </strong>{" "}
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profile.github_url}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="admin-skill-actions">
                  <button
                    type="button"
                    className="admin-edit-button"
                    onClick={
                      openProfileForm
                    }
                  >
                    ✎ Edit
                  </button>
                </div>
              </article>
            )}
          </div>
        </>
      )}
    </div>
  );

  /* =========================
     ABOUT UI
  ========================= */

  const renderAbout = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </p>

          <h2>👤 About</h2>

          <p>
            Manage the About information displayed
            on your public portfolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddAboutForm}
          disabled={loadingAbout}
        >
          + Add About
        </button>
      </div>

      {aboutMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {aboutMessage}
        </div>
      )}

      {aboutError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {aboutError}
        </div>
      )}

      {showAboutForm && (
        <form
          className="admin-skill-form"
          onSubmit={handleAboutSubmit}
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">
                {editingAboutId
                  ? "EDIT ABOUT"
                  : "NEW ABOUT"}
              </p>

              <h3>
                {editingAboutId
                  ? "Edit About Information"
                  : "Add About Information"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={closeAboutForm}
              disabled={savingAbout}
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-full">
              <label htmlFor="about-introduction">
                Introduction
              </label>

              <textarea
                id="about-introduction"
                name="introduction"
                value={aboutForm.introduction}
                onChange={handleAboutInputChange}
                placeholder="Write your introduction..."
                rows="6"
                disabled={savingAbout}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="about-goal">
                Professional Goal
              </label>

              <textarea
                id="about-goal"
                name="goal"
                value={aboutForm.goal}
                onChange={handleAboutInputChange}
                placeholder="Describe your professional goal..."
                rows="6"
                disabled={savingAbout}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="about-field">
                Field
              </label>

              <input
                id="about-field"
                name="field"
                type="text"
                value={aboutForm.field}
                onChange={handleAboutInputChange}
                placeholder="e.g. Cybersecurity"
                maxLength={150}
                disabled={savingAbout}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="about-specialization">
                Specialization
              </label>

              <input
                id="about-specialization"
                name="specialization"
                type="text"
                value={aboutForm.specialization}
                onChange={handleAboutInputChange}
                placeholder="e.g. Digital Forensics"
                maxLength={150}
                disabled={savingAbout}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="about-focus">
                Focus
              </label>

              <input
                id="about-focus"
                name="focus"
                type="text"
                value={aboutForm.focus}
                onChange={handleAboutInputChange}
                placeholder="e.g. Ethical Hacking"
                maxLength={150}
                disabled={savingAbout}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="about-status">
                Status
              </label>

              <input
                id="about-status"
                name="status"
                type="text"
                value={aboutForm.status}
                onChange={handleAboutInputChange}
                placeholder="e.g. Learning & Building"
                maxLength={150}
                disabled={savingAbout}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="about-display-order">
                Display Order
              </label>

              <input
                id="about-display-order"
                name="display_order"
                type="number"
                min="0"
                value={aboutForm.display_order}
                onChange={handleAboutInputChange}
                disabled={savingAbout}
              />
            </div>

            <label className="admin-checkbox-group">
              <input
                name="is_visible"
                type="checkbox"
                checked={aboutForm.is_visible}
                onChange={handleAboutInputChange}
                disabled={savingAbout}
              />

              <span>
                Visible on portfolio
              </span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={closeAboutForm}
              disabled={savingAbout}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={savingAbout}
            >
              {savingAbout
                ? "Saving..."
                : editingAboutId
                ? "Update About"
                : "Save About"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-skills-panel">
        <div className="admin-panel-header">
          <div>
            <h3>About Information</h3>

            <p>
              {about.length} About record
              {about.length === 1 ? "" : "s"} in database
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadAbout}
            disabled={loadingAbout}
          >
            ↻ Refresh
          </button>
        </div>

        {loadingAbout ? (
          <div className="admin-empty-state">
            <span>⏳</span>

            <h3>
              Loading About Information
            </h3>

            <p>
              Retrieving About information
              from PostgreSQL...
            </p>
          </div>
        ) : about.length === 0 ? (
          <div className="admin-empty-state">
            <span>👤</span>

            <h3>
              No About Information Yet
            </h3>

            <p>
              Create your About information
              using the button above.
            </p>
          </div>
        ) : (
          <div className="admin-skill-list">
            {about.map((item) => (
              <article
                key={item.id}
                className="admin-skill-item"
              >
                <div className="admin-skill-main">
                  <div className="admin-skill-heading">
                    <h3>
                      {item.field ||
                        "About Information"}
                    </h3>

                    <span
                      className={`admin-visibility ${
                        item.is_visible
                          ? "visible"
                          : "hidden"
                      }`}
                    >
                      {item.is_visible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>

                  {item.specialization && (
                    <span className="admin-skill-category">
                      Specialization:{" "}
                      {item.specialization}
                    </span>
                  )}

                  {item.introduction && (
                    <p>
                      <strong>
                        Introduction:
                      </strong>{" "}
                      {item.introduction}
                    </p>
                  )}

                  {item.goal && (
                    <p>
                      <strong>
                        Goal:
                      </strong>{" "}
                      {item.goal}
                    </p>
                  )}

                  <div>
                    {item.focus && (
                      <p>
                        <strong>
                          Focus:
                        </strong>{" "}
                        {item.focus}
                      </p>
                    )}

                    {item.status && (
                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {item.status}
                      </p>
                    )}

                    <small>
                      Display order:{" "}
                      {item.display_order}
                    </small>
                  </div>
                </div>

                <div className="admin-skill-actions">
                  <button
                    type="button"
                    className="admin-edit-button"
                    onClick={() =>
                      openEditAboutForm(item)
                    }
                  >
                    ✎ Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() =>
                      handleDeleteAbout(item)
                    }
                  >
                    🗑 Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     TECHNICAL SKILLS UI
  ========================= */

  const renderSkills = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </p>

          <h2>🛠 Technical Skills</h2>

          <p>
            Manage technical skills displayed on
            your public portfolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openAddSkillForm
          }
        >
          + Add Skill
        </button>
      </div>

      {skillMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {skillMessage}
        </div>
      )}

      {skillError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {skillError}
        </div>
      )}

      {showSkillForm && (
        <form
          className="admin-skill-form"
          onSubmit={
            handleSkillSubmit
          }
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">
                {editingSkillId
                  ? "EDIT SKILL"
                  : "NEW SKILL"}
              </p>

              <h3>
                {editingSkillId
                  ? "Edit Skill"
                  : "Add New Skill"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={
                closeSkillForm
              }
              disabled={
                savingSkill
              }
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="skill-category">
                Category
              </label>

              <input
                id="skill-category"
                name="category"
                type="text"
                value={
                  skillForm.category
                }
                onChange={
                  handleSkillInputChange
                }
                placeholder="e.g. Cybersecurity"
                maxLength={150}
                disabled={
                  savingSkill
                }
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="skill-name">
                Skill Name
              </label>

              <input
                id="skill-name"
                name="name"
                type="text"
                value={
                  skillForm.name
                }
                onChange={
                  handleSkillInputChange
                }
                placeholder="e.g. Network Security"
                maxLength={150}
                disabled={
                  savingSkill
                }
                required
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="skill-description">
                Description
              </label>

              <textarea
                id="skill-description"
                name="description"
                value={
                  skillForm.description
                }
                onChange={
                  handleSkillInputChange
                }
                placeholder="Describe this skill..."
                rows="4"
                disabled={
                  savingSkill
                }
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="skill-display-order">
                Display Order
              </label>

              <input
                id="skill-display-order"
                name="display_order"
                type="number"
                min="0"
                value={
                  skillForm.display_order
                }
                onChange={
                  handleSkillInputChange
                }
                disabled={
                  savingSkill
                }
              />
            </div>

            <label className="admin-checkbox-group">
              <input
                name="is_visible"
                type="checkbox"
                checked={
                  skillForm.is_visible
                }
                onChange={
                  handleSkillInputChange
                }
                disabled={
                  savingSkill
                }
              />

              <span>
                Visible on public
                portfolio
              </span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={
                closeSkillForm
              }
              disabled={
                savingSkill
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={
                savingSkill
              }
            >
              {savingSkill
                ? "Saving..."
                : editingSkillId
                ? "Update Skill"
                : "Save Skill"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-skills-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Technical Skills</h3>

            <p>
              {skills.length} skill
              {skills.length === 1
                ? ""
                : "s"} in database
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadSkills
            }
            disabled={
              loadingSkills
            }
          >
            ↻ Refresh
          </button>
        </div>

        {loadingSkills ? (
          <div className="admin-empty-state">
            <span>⏳</span>

            <h3>
              Loading Skills
            </h3>

            <p>
              Retrieving skills from
              PostgreSQL...
            </p>
          </div>
        ) : skills.length === 0 ? (
          <div className="admin-empty-state">
            <span>🛠</span>

            <h3>
              No Skills Yet
            </h3>

            <p>
              Add your first technical
              skill using the button
              above.
            </p>
          </div>
        ) : (
          <div className="admin-skills-list">
            {skills.map(
              (skill) => (
                <article
                  key={skill.id}
                  className="admin-skill-item"
                >
                  <div className="admin-skill-main">
                    <div className="admin-skill-heading">
                      <h3>
                        {skill.name}
                      </h3>

                      <span
                        className={
                          skill.is_visible
                            ? "admin-visibility visible"
                            : "admin-visibility hidden"
                        }
                      >
                        {skill.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </div>

                    <span className="admin-skill-category">
                      {
                        skill.category
                      }
                    </span>

                    {skill.description && (
                      <p>
                        {
                          skill.description
                        }
                      </p>
                    )}

                    <small>
                      Display order:{" "}
                      {
                        skill.display_order
                      }
                    </small>
                  </div>

                  <div className="admin-skill-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        openEditSkillForm(
                          skill
                        )
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDeleteSkill(
                          skill
                        )
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     PROFESSIONAL SKILLS UI
  ========================= */

  const renderProfessionalSkills = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            CV MANAGEMENT
          </p>

          <h2>⭐ Professional Skills</h2>

          <p>
            Manage professional and transferable
            skills used in your CV.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openAddProfessionalSkillForm
          }
        >
          + Add Professional Skill
        </button>
      </div>

      {professionalSkillMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {professionalSkillMessage}
        </div>
      )}

      {professionalSkillError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {professionalSkillError}
        </div>
      )}

      {showProfessionalSkillForm && (
        <form
          className="admin-skill-form"
          onSubmit={
            handleProfessionalSkillSubmit
          }
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">
                {editingProfessionalSkillId
                  ? "EDIT PROFESSIONAL SKILL"
                  : "NEW PROFESSIONAL SKILL"}
              </p>

              <h3>
                {editingProfessionalSkillId
                  ? "Edit Professional Skill"
                  : "Add Professional Skill"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={
                closeProfessionalSkillForm
              }
              disabled={
                savingProfessionalSkill
              }
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-full">
              <label htmlFor="professional-skill-name">
                Skill Name
              </label>

              <input
                id="professional-skill-name"
                name="name"
                type="text"
                value={
                  professionalSkillForm.name
                }
                onChange={
                  handleProfessionalSkillInputChange
                }
                placeholder="e.g. Problem Solving"
                maxLength={150}
                disabled={
                  savingProfessionalSkill
                }
                required
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="professional-skill-description">
                Description
              </label>

              <textarea
                id="professional-skill-description"
                name="description"
                value={
                  professionalSkillForm.description
                }
                onChange={
                  handleProfessionalSkillInputChange
                }
                placeholder="Optional description..."
                rows="4"
                disabled={
                  savingProfessionalSkill
                }
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="professional-skill-display-order">
                Display Order
              </label>

              <input
                id="professional-skill-display-order"
                name="display_order"
                type="number"
                min="0"
                value={
                  professionalSkillForm.display_order
                }
                onChange={
                  handleProfessionalSkillInputChange
                }
                disabled={
                  savingProfessionalSkill
                }
              />
            </div>

            <label className="admin-checkbox-group">
              <input
                name="is_visible"
                type="checkbox"
                checked={
                  professionalSkillForm.is_visible
                }
                onChange={
                  handleProfessionalSkillInputChange
                }
                disabled={
                  savingProfessionalSkill
                }
              />

              <span>
                Visible on CV
              </span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={
                closeProfessionalSkillForm
              }
              disabled={
                savingProfessionalSkill
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={
                savingProfessionalSkill
              }
            >
              {savingProfessionalSkill
                ? "Saving..."
                : editingProfessionalSkillId
                ? "Update Skill"
                : "Save Skill"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-skills-panel">
        <div className="admin-panel-header">
          <div>
            <h3>
              Professional Skills
            </h3>

            <p>
              {professionalSkills.length} skill
              {professionalSkills.length === 1
                ? ""
                : "s"} in database
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadProfessionalSkills
            }
            disabled={
              loadingProfessionalSkills
            }
          >
            ↻ Refresh
          </button>
        </div>

        {loadingProfessionalSkills ? (
          <div className="admin-empty-state">
            <span>⏳</span>

            <h3>
              Loading Professional Skills
            </h3>

            <p>
              Retrieving professional skills
              from PostgreSQL...
            </p>
          </div>
        ) : professionalSkills.length === 0 ? (
          <div className="admin-empty-state">
            <span>⭐</span>

            <h3>
              No Professional Skills Yet
            </h3>

            <p>
              Add professional skills that
              will appear in your CV.
            </p>
          </div>
        ) : (
          <div className="admin-skills-list">
            {professionalSkills.map(
              (skill) => (
                <article
                  key={skill.id}
                  className="admin-skill-item"
                >
                  <div className="admin-skill-main">
                    <div className="admin-skill-heading">
                      <h3>
                        {skill.name}
                      </h3>

                      <span
                        className={
                          skill.is_visible
                            ? "admin-visibility visible"
                            : "admin-visibility hidden"
                        }
                      >
                        {skill.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </div>

                    {skill.description && (
                      <p>
                        {
                          skill.description
                        }
                      </p>
                    )}

                    <small>
                      Display order:{" "}
                      {
                        skill.display_order
                      }
                    </small>
                  </div>

                  <div className="admin-skill-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        openEditProfessionalSkillForm(
                          skill
                        )
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDeleteProfessionalSkill(
                          skill
                        )
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     LANGUAGES UI
  ========================= */

  const renderLanguages = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            CV MANAGEMENT
          </p>

          <h2>🌐 Languages</h2>

          <p>
            Manage languages displayed in
            your professional CV.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openAddLanguageForm
          }
        >
          + Add Language
        </button>
      </div>

      {languageMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {languageMessage}
        </div>
      )}

      {languageError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {languageError}
        </div>
      )}

      {showLanguageForm && (
        <form
          className="admin-skill-form"
          onSubmit={
            handleLanguageSubmit
          }
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">
                {editingLanguageId
                  ? "EDIT LANGUAGE"
                  : "NEW LANGUAGE"}
              </p>

              <h3>
                {editingLanguageId
                  ? "Edit Language"
                  : "Add Language"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={
                closeLanguageForm
              }
              disabled={
                savingLanguage
              }
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="language-name">
                Language
              </label>

              <input
                id="language-name"
                name="name"
                type="text"
                value={
                  languageForm.name
                }
                onChange={
                  handleLanguageInputChange
                }
                placeholder="e.g. English"
                maxLength={100}
                disabled={
                  savingLanguage
                }
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="language-proficiency">
                Proficiency
              </label>

              <input
                id="language-proficiency"
                name="proficiency"
                type="text"
                value={
                  languageForm.proficiency
                }
                onChange={
                  handleLanguageInputChange
                }
                placeholder="Optional"
                maxLength={100}
                disabled={
                  savingLanguage
                }
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="language-display-order">
                Display Order
              </label>

              <input
                id="language-display-order"
                name="display_order"
                type="number"
                min="0"
                value={
                  languageForm.display_order
                }
                onChange={
                  handleLanguageInputChange
                }
                disabled={
                  savingLanguage
                }
              />
            </div>

            <label className="admin-checkbox-group">
              <input
                name="is_visible"
                type="checkbox"
                checked={
                  languageForm.is_visible
                }
                onChange={
                  handleLanguageInputChange
                }
                disabled={
                  savingLanguage
                }
              />

              <span>
                Visible on CV
              </span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={
                closeLanguageForm
              }
              disabled={
                savingLanguage
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={
                savingLanguage
              }
            >
              {savingLanguage
                ? "Saving..."
                : editingLanguageId
                ? "Update Language"
                : "Save Language"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-skills-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Languages</h3>

            <p>
              {languages.length} language
              {languages.length === 1
                ? ""
                : "s"} in database
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadLanguages
            }
            disabled={
              loadingLanguages
            }
          >
            ↻ Refresh
          </button>
        </div>

        {loadingLanguages ? (
          <div className="admin-empty-state">
            <span>⏳</span>

            <h3>
              Loading Languages
            </h3>

            <p>
              Retrieving languages from
              PostgreSQL...
            </p>
          </div>
        ) : languages.length === 0 ? (
          <div className="admin-empty-state">
            <span>🌐</span>

            <h3>
              No Languages Yet
            </h3>

            <p>
              Add the languages you want
              to display in your CV.
            </p>
          </div>
        ) : (
          <div className="admin-skills-list">
            {languages.map(
              (language) => (
                <article
                  key={language.id}
                  className="admin-skill-item"
                >
                  <div className="admin-skill-main">
                    <div className="admin-skill-heading">
                      <h3>
                        {language.name}
                      </h3>

                      <span
                        className={
                          language.is_visible
                            ? "admin-visibility visible"
                            : "admin-visibility hidden"
                        }
                      >
                        {language.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </div>

                    {language.proficiency && (
                      <span className="admin-skill-category">
                        {
                          language.proficiency
                        }
                      </span>
                    )}

                    <small>
                      Display order:{" "}
                      {
                        language.display_order
                      }
                    </small>
                  </div>

                  <div className="admin-skill-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        openEditLanguageForm(
                          language
                        )
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDeleteLanguage(
                          language
                        )
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     INTERESTS UI
  ========================= */

  const renderInterests = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            CV MANAGEMENT
          </p>

          <h2>🎯 Interests</h2>

          <p>
            Manage professional interests
            displayed in your CV.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openAddInterestForm
          }
        >
          + Add Interest
        </button>
      </div>

      {interestMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {interestMessage}
        </div>
      )}

      {interestError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {interestError}
        </div>
      )}

      {showInterestForm && (
        <form
          className="admin-skill-form"
          onSubmit={
            handleInterestSubmit
          }
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">
                {editingInterestId
                  ? "EDIT INTEREST"
                  : "NEW INTEREST"}
              </p>

              <h3>
                {editingInterestId
                  ? "Edit Interest"
                  : "Add Interest"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={
                closeInterestForm
              }
              disabled={
                savingInterest
              }
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-full">
              <label htmlFor="interest-name">
                Interest
              </label>

              <input
                id="interest-name"
                name="name"
                type="text"
                value={
                  interestForm.name
                }
                onChange={
                  handleInterestInputChange
                }
                placeholder="e.g. Cybersecurity Research"
                maxLength={150}
                disabled={
                  savingInterest
                }
                required
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="interest-description">
                Description
              </label>

              <textarea
                id="interest-description"
                name="description"
                value={
                  interestForm.description
                }
                onChange={
                  handleInterestInputChange
                }
                placeholder="Optional description..."
                rows="4"
                disabled={
                  savingInterest
                }
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="interest-display-order">
                Display Order
              </label>

              <input
                id="interest-display-order"
                name="display_order"
                type="number"
                min="0"
                value={
                  interestForm.display_order
                }
                onChange={
                  handleInterestInputChange
                }
                disabled={
                  savingInterest
                }
              />
            </div>

            <label className="admin-checkbox-group">
              <input
                name="is_visible"
                type="checkbox"
                checked={
                  interestForm.is_visible
                }
                onChange={
                  handleInterestInputChange
                }
                disabled={
                  savingInterest
                }
              />

              <span>
                Visible on CV
              </span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={
                closeInterestForm
              }
              disabled={
                savingInterest
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={
                savingInterest
              }
            >
              {savingInterest
                ? "Saving..."
                : editingInterestId
                ? "Update Interest"
                : "Save Interest"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-skills-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Interests</h3>

            <p>
              {interests.length} interest
              {interests.length === 1
                ? ""
                : "s"} in database
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadInterests
            }
            disabled={
              loadingInterests
            }
          >
            ↻ Refresh
          </button>
        </div>

        {loadingInterests ? (
          <div className="admin-empty-state">
            <span>⏳</span>

            <h3>
              Loading Interests
            </h3>

            <p>
              Retrieving interests from
              PostgreSQL...
            </p>
          </div>
        ) : interests.length === 0 ? (
          <div className="admin-empty-state">
            <span>🎯</span>

            <h3>
              No Interests Yet
            </h3>

            <p>
              Add professional interests
              that will appear in your CV.
            </p>
          </div>
        ) : (
          <div className="admin-skills-list">
            {interests.map(
              (interest) => (
                <article
                  key={interest.id}
                  className="admin-skill-item"
                >
                  <div className="admin-skill-main">
                    <div className="admin-skill-heading">
                      <h3>
                        {interest.name}
                      </h3>

                      <span
                        className={
                          interest.is_visible
                            ? "admin-visibility visible"
                            : "admin-visibility hidden"
                        }
                      >
                        {interest.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </div>

                    {interest.description && (
                      <p>
                        {
                          interest.description
                        }
                      </p>
                    )}

                    <small>
                      Display order:{" "}
                      {
                        interest.display_order
                      }
                    </small>
                  </div>

                  <div className="admin-skill-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        openEditInterestForm(
                          interest
                        )
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDeleteInterest(
                          interest
                        )
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     CERTIFICATIONS UI
  ========================= */

  const renderEducation = () => {
    return (
      <>
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">PORTFOLIO CONTENT</p>
            <h2>Education</h2>
            <p>
              Manage your academic background and qualifications
              displayed on your portfolio and CV.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => {
              setEditingEducationId(null);
              setEducationForm(emptyEducation);
              setEducationError("");
              setEducationMessage("");
              setShowEducationForm(true);
            }}
          >
            + Add Education
          </button>
        </div>

        {educationError && (
          <div className="admin-alert admin-alert-error">
            {educationError}
          </div>
        )}

        {educationMessage && (
          <div className="admin-alert admin-alert-success">
            {educationMessage}
          </div>
        )}

        {showEducationForm && (
          <form
            className="admin-form-card"
            onSubmit={handleEducationSubmit}
          >
            <div className="admin-form-header">
              <div>
                <h3>
                  {editingEducationId
                    ? "Edit Education"
                    : "Add Education"}
                </h3>
                <p>
                  Enter the academic qualification details.
                </p>
              </div>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={handleCancelEducation}
                disabled={savingEducation}
              >
                Cancel
              </button>
            </div>

            <div className="admin-form-grid">
              <label>
                <span>Period</span>
                <input
                  type="text"
                  value={educationForm.period}
                  onChange={(event) =>
                    setEducationForm((current) => ({
                      ...current,
                      period: event.target.value,
                    }))
                  }
                  placeholder="2024 – Present"
                  required
                />
              </label>

              <label>
                <span>Qualification</span>
                <input
                  type="text"
                  value={educationForm.qualification}
                  onChange={(event) =>
                    setEducationForm((current) => ({
                      ...current,
                      qualification: event.target.value,
                    }))
                  }
                  placeholder="Bachelor of Science..."
                  required
                />
              </label>

              <label>
                <span>Institution</span>
                <input
                  type="text"
                  value={educationForm.institution}
                  onChange={(event) =>
                    setEducationForm((current) => ({
                      ...current,
                      institution: event.target.value,
                    }))
                  }
                  placeholder="University / School"
                  required
                />
              </label>

              <label>
                <span>Display Order</span>
                <input
                  type="number"
                  min="0"
                  value={educationForm.display_order}
                  onChange={(event) =>
                    setEducationForm((current) => ({
                      ...current,
                      display_order: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="admin-form-full">
                <span>Description</span>
                <textarea
                  value={educationForm.description}
                  onChange={(event) =>
                    setEducationForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows="4"
                  placeholder="Optional description"
                />
              </label>

              <label className="admin-form-full">
                <span>Certificate (Optional)</span>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  disabled={savingEducation}
                  onChange={(event) =>
                    setEducationForm((current) => ({
                      ...current,
                      certificate:
                        event.target.files?.[0] || null,
                    }))
                  }
                />

                <small>
                  PDF, JPEG, PNG or WEBP. Maximum size: 10 MB.
                  {editingEducationId &&
                    " Select a new file only if you want to replace the current certificate."}
                </small>
              </label>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={educationForm.is_visible}
                  onChange={(event) =>
                    setEducationForm((current) => ({
                      ...current,
                      is_visible: event.target.checked,
                    }))
                  }
                />
                <span>Visible on public portfolio</span>
              </label>
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
                disabled={savingEducation}
              >
                {savingEducation
                  ? "Saving..."
                  : editingEducationId
                  ? "Update Education"
                  : "Save Education"}
              </button>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={handleCancelEducation}
                disabled={savingEducation}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="admin-section-toolbar">
          <div>
            <strong>{education.length}</strong>{" "}
            education record
            {education.length === 1 ? "" : "s"}
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadEducation}
            disabled={loadingEducation}
          >
            {loadingEducation ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loadingEducation ? (
          <div className="admin-empty-state">
            <p>Loading education...</p>
          </div>
        ) : education.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No Education Records</h3>
            <p>
              Add your academic qualifications to display them
              on your portfolio and CV.
            </p>
          </div>
        ) : (
          <div className="admin-content-list">
            {education.map((item) => (
              <article
                className="admin-content-card"
                key={item.id}
              >
                <div className="admin-content-card-header">
                  <div>
                    <span className="admin-content-meta">
                      {item.period}
                    </span>

                    <h3>{item.qualification}</h3>

                    <p className="admin-content-company">
                      {item.institution}
                    </p>
                  </div>

                  <span
                    className={
                      item.is_visible
                        ? "admin-status admin-status-success"
                        : "admin-status admin-status-muted"
                    }
                  >
                    {item.is_visible ? "Visible" : "Hidden"}
                  </span>
                </div>

                {item.description && (
                  <p className="admin-content-description">
                    {item.description}
                  </p>
                )}

                {item.certificate_path && (
                  <div className="admin-content-card-footer">
                    <a
                      href={getPublicEducationCertificateUrl(item.id)}
                      className="admin-secondary-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </a>
                  </div>
                )}

                <div className="admin-content-card-footer">
                  <span>
                    Order: {item.display_order}
                  </span>

                  <div className="admin-content-actions">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        handleEditEducation(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() =>
                        handleDeleteEducation(item.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </>
    );
  };

  const renderContact = () => {
    const newMessages = contactMessages.filter(
      (item) => item.status === "new"
    ).length;

    const readMessages = contactMessages.filter(
      (item) => item.status === "read"
    ).length;

    const archivedMessages = contactMessages.filter(
      (item) => item.status === "archived"
    ).length;

    const handleContactStatus = async (id, status) => {
      setContactError("");
      setContactMessage("");

      try {
        await updateContactMessageStatus(id, status);
        await loadContactMessages();
        setContactMessage("Message status updated successfully.");
      } catch (error) {
        setContactError(
          error?.data?.message ||
            error?.message ||
            "Unable to update message status."
        );
      }
    };

    const handleDeleteContact = async (id) => {
      const confirmed = window.confirm(
        "Are you sure you want to permanently delete this message?"
      );

      if (!confirmed) return;

      setContactError("");
      setContactMessage("");

      try {
        await deleteContactMessage(id);
        await loadContactMessages();
        setContactMessage("Contact message deleted successfully.");
      } catch (error) {
        setContactError(
          error?.data?.message ||
            error?.message ||
            "Unable to delete contact message."
        );
      }
    };

    return (
      <div className="admin-section-page">
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">
              COMMUNICATION MANAGEMENT
            </p>

            <h2>📞 Contact Messages</h2>

            <p className="admin-page-description">
              Review and manage messages submitted through the public contact form.
            </p>
          </div>

          <div className="admin-page-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={loadContactMessages}
              disabled={loadingContactMessages}
            >
              {loadingContactMessages ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">TOTAL MESSAGES</span>
            <strong>{contactMessages.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">NEW</span>
            <strong>{newMessages}</strong>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">READ</span>
            <strong>{readMessages}</strong>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">ARCHIVED</span>
            <strong>{archivedMessages}</strong>
          </div>
        </div>

        {contactError && (
          <div className="admin-alert admin-alert-error">
            {contactError}
          </div>
        )}

        {contactMessage && (
          <div className="admin-alert admin-alert-success">
            {contactMessage}
          </div>
        )}

        {loadingContactMessages ? (
          <div className="admin-empty-state">
            <p>Loading Contact Messages...</p>
          </div>
        ) : contactMessages.length === 0 ? (
          <div className="admin-empty-state">
            <p>No contact messages yet.</p>
            <span>
              Messages submitted through the public contact form will appear here.
            </span>
          </div>
        ) : (
          <div className="admin-contact-messages">
            {contactMessages.map((item) => (
              <article
                key={item.id}
                className={`admin-contact-message ${
                  item.status === "new" ? "is-new" : ""
                }`}
              >
                <div className="admin-contact-message-header">
                  <div>
                    <h3>{item.name}</h3>

                    <a href={`mailto:${item.email}`}>
                      {item.email}
                    </a>
                  </div>

                  <span
                    className={`admin-contact-status status-${item.status}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="admin-contact-message-date">
                  {new Date(item.created_at).toLocaleString()}
                </div>

                <div className="admin-contact-message-body">
                  {item.message}
                </div>

                <div className="admin-contact-message-actions">
                  {item.status === "new" && (
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        handleContactStatus(item.id, "read")
                      }
                    >
                      ✓ Mark Read
                    </button>
                  )}

                  {item.status !== "archived" && (
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        handleContactStatus(item.id, "archived")
                      }
                    >
                      Archive
                    </button>
                  )}

                  {item.status === "archived" && (
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        handleContactStatus(item.id, "new")
                      }
                    >
                      Restore
                    </button>
                  )}

                  <button
                    type="button"
                    className="admin-danger-button"
                    onClick={() =>
                      handleDeleteContact(item.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCertifications = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </p>

          <h2>
            📜 Certifications
          </h2>

          <p>
            Manage professional certificates
            and training displayed on your
            public portfolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openAddCertificationForm
          }
        >
          + Add Certification
        </button>
      </div>

      {certificationMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {certificationMessage}
        </div>
      )}

      {certificationError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {certificationError}
        </div>
      )}

      {showCertificationForm && (
        <form
          className="admin-skill-form"
          onSubmit={
            handleCertificationSubmit
          }
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">
                {editingCertificationId
                  ? "EDIT CERTIFICATION"
                  : "NEW CERTIFICATION"}
              </p>

              <h3>
                {editingCertificationId
                  ? "Edit Certification"
                  : "Add New Certification"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={
                closeCertificationForm
              }
              disabled={
                savingCertification
              }
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="certification-title">
                Certificate Title
              </label>

              <input
                id="certification-title"
                name="title"
                type="text"
                value={
                  certificationForm.title
                }
                onChange={
                  handleCertificationInputChange
                }
                placeholder="Certificate title"
                maxLength={255}
                disabled={
                  savingCertification
                }
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="certification-issuer">
                Issuer
              </label>

              <input
                id="certification-issuer"
                name="issuer"
                type="text"
                value={
                  certificationForm.issuer
                }
                onChange={
                  handleCertificationInputChange
                }
                placeholder="Issuing organization"
                maxLength={255}
                disabled={
                  savingCertification
                }
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="certification-status">
                Status
              </label>

              <select
                id="certification-status"
                name="status"
                value={
                  certificationForm.status
                }
                onChange={
                  handleCertificationInputChange
                }
                disabled={
                  savingCertification
                }
                required
              >
                <option value="Completed">
                  Completed
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Expired">
                  Expired
                </option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="certification-display-order">
                Display Order
              </label>

              <input
                id="certification-display-order"
                name="display_order"
                type="number"
                min="0"
                value={
                  certificationForm.display_order
                }
                onChange={
                  handleCertificationInputChange
                }
                disabled={
                  savingCertification
                }
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="certification-description">
                Description
              </label>

              <textarea
                id="certification-description"
                name="description"
                value={
                  certificationForm.description
                }
                onChange={
                  handleCertificationInputChange
                }
                placeholder="Certification description"
                rows="4"
                disabled={
                  savingCertification
                }
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="certificate-file">
                Certificate File
              </label>

              <input
                id="certificate-file"
                name="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={
                  handleCertificateFileChange
                }
                disabled={
                  savingCertification
                }
              />

              <small>
                Allowed: PDF, JPEG,
                PNG or WEBP. Maximum:
                10 MB.
              </small>

              {certificateFile && (
                <small>
                  Selected:{" "}
                  <strong>
                    {
                      certificateFile.name
                    }
                  </strong>
                </small>
              )}
            </div>

            <label className="admin-checkbox-group">
              <input
                name="is_visible"
                type="checkbox"
                checked={
                  certificationForm.is_visible
                }
                onChange={
                  handleCertificationInputChange
                }
                disabled={
                  savingCertification
                }
              />

              <span>
                Visible on public
                portfolio
              </span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={
                closeCertificationForm
              }
              disabled={
                savingCertification
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={
                savingCertification
              }
            >
              {savingCertification
                ? "Saving..."
                : editingCertificationId
                ? "Update Certification"
                : "Save Certification"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-skills-panel">
        <div className="admin-panel-header">
          <div>
            <h3>
              Certifications
            </h3>

            <p>
              {
                certifications.length
              } certification
              {certifications.length ===
              1
                ? ""
                : "s"} in database
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadCertifications
            }
            disabled={
              loadingCertifications
            }
          >
            ↻ Refresh
          </button>
        </div>

        {loadingCertifications ? (
          <div className="admin-empty-state">
            <span>⏳</span>

            <h3>
              Loading Certifications
            </h3>

            <p>
              Retrieving certifications
              from PostgreSQL...
            </p>
          </div>
        ) : certifications.length ===
          0 ? (
          <div className="admin-empty-state">
            <span>📜</span>

            <h3>
              No Certifications Yet
            </h3>

            <p>
              Add your first professional
              certification using the
              button above.
            </p>
          </div>
        ) : (
          <div className="admin-skills-list">
            {certifications.map(
              (certification) => (
                <article
                  key={
                    certification.id
                  }
                  className="admin-skill-item"
                >
                  <div className="admin-skill-main">
                    <div className="admin-skill-heading">
                      <h3>
                        {
                          certification.title
                        }
                      </h3>

                      <span
                        className={
                          certification.is_visible
                            ? "admin-visibility visible"
                            : "admin-visibility hidden"
                        }
                      >
                        {certification.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </div>

                    <span className="admin-skill-category">
                      {
                        certification.issuer
                      }
                    </span>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}
                      {
                        certification.status
                      }
                    </p>

                    {certification.description && (
                      <p>
                        {
                          certification.description
                        }
                      </p>
                    )}

                    <small>
                      Display order:{" "}
                      {
                        certification.display_order
                      }
                    </small>

                    <div
                      style={{
                        marginTop:
                          "0.75rem",
                        display:
                          "flex",
                        gap:
                          "0.5rem",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      {certification.certificate_path ? (
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() =>
                            handleViewCertificate(
                              certification
                            )
                          }
                        >
                          👁 View
                          Certificate
                        </button>
                      ) : (
                        <span className="admin-visibility hidden">
                          No Certificate
                          File
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="admin-skill-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        openEditCertificationForm(
                          certification
                        )
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDeleteCertification(
                          certification
                        )
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     EXPERIENCE UI
  ========================= */

  const handleProjectInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setProjectForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      ...emptyProject,
    });
    setProjectMessage("");
    setProjectError("");
    setShowProjectForm(true);
  };

  const openEditProjectForm = (project) => {
    setEditingProjectId(project.id);

    setProjectForm({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      project_url: project.project_url || "",
      repository_url: project.repository_url || "",
      display_order: project.display_order ?? 0,
      is_visible: project.is_visible !== false,
    });

    setProjectMessage("");
    setProjectError("");
    setShowProjectForm(true);
  };

  const closeProjectForm = () => {
    setShowProjectForm(false);
    setEditingProjectId(null);
    setProjectForm({
      ...emptyProject,
    });
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();

    setSavingProject(true);
    setProjectMessage("");
    setProjectError("");

    const payload = {
      title: projectForm.title.trim(),
      category: projectForm.category.trim(),
      description: projectForm.description.trim(),
      technologies: projectForm.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      project_url: projectForm.project_url.trim() || null,
      repository_url:
        projectForm.repository_url.trim() || null,
      display_order:
        Number(projectForm.display_order) || 0,
      is_visible: projectForm.is_visible,
    };

    if (!payload.title || !payload.description) {
      setProjectError(
        "Project title and description are required."
      );
      setSavingProject(false);
      return;
    }

    try {
      const data = editingProjectId
        ? await updateProject(
            editingProjectId,
            payload
          )
        : await createProject(payload);

      if (data.success) {
        await loadProjects();

        setProjectMessage(
          editingProjectId
            ? "Project updated successfully."
            : "Project added successfully."
        );

        closeProjectForm();
      } else {
        setProjectError(
          data.message || "Unable to save project."
        );
      }
    } catch (error) {
      setProjectError(
        error?.data?.message ||
          error?.message ||
          "Unable to save project."
      );
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setProjectMessage("");
    setProjectError("");

    try {
      const data = await deleteProject(id);

      if (data.success) {
        await loadProjects();
        setProjectMessage(
          "Project deleted successfully."
        );
      } else {
        setProjectError(
          data.message || "Unable to delete project."
        );
      }
    } catch (error) {
      setProjectError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete project."
      );
    }
  };

  /* =========================
     PROJECTS UI
  ========================= */

  const renderProjects = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </p>

          <h2>🚀 Projects</h2>

          <p>
            Manage projects displayed on your public portfolio.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddProjectForm}
          >
            + Add Project
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadProjects}
            disabled={loadingProjects}
          >
            {loadingProjects ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {projectMessage && (
        <div className="admin-success-message">
          {projectMessage}
        </div>
      )}

      {projectError && (
        <div className="admin-error-message">
          {projectError}
        </div>
      )}

      {showProjectForm && (
        <form
          className="admin-form"
          onSubmit={handleProjectSubmit}
        >
          <div className="admin-form-group">
            <label htmlFor="project-title">
              Project Title
            </label>

            <input
              id="project-title"
              name="title"
              type="text"
              value={projectForm.title}
              onChange={handleProjectInputChange}
              placeholder="Project title"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="project-category">
              Category
            </label>

            <input
              id="project-category"
              name="category"
              type="text"
              value={projectForm.category}
              onChange={handleProjectInputChange}
              placeholder="e.g. Cybersecurity, Digital Forensics"
            />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label htmlFor="project-description">
              Description
            </label>

            <textarea
              id="project-description"
              name="description"
              value={projectForm.description}
              onChange={handleProjectInputChange}
              placeholder="Describe the project and your work."
              rows="5"
              required
            />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label htmlFor="project-technologies">
              Technologies
            </label>

            <input
              id="project-technologies"
              name="technologies"
              type="text"
              value={projectForm.technologies}
              onChange={handleProjectInputChange}
              placeholder="Nmap, Wireshark, Burp Suite"
            />

            <small>
              Separate technologies with commas.
            </small>
          </div>

          <div className="admin-form-group">
            <label htmlFor="project-url">
              Project URL
            </label>

            <input
              id="project-url"
              name="project_url"
              type="url"
              value={projectForm.project_url}
              onChange={handleProjectInputChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="project-repository-url">
              Repository URL
            </label>

            <input
              id="project-repository-url"
              name="repository_url"
              type="url"
              value={projectForm.repository_url}
              onChange={handleProjectInputChange}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="project-display-order">
              Display Order
            </label>

            <input
              id="project-display-order"
              name="display_order"
              type="number"
              min="0"
              value={projectForm.display_order}
              onChange={handleProjectInputChange}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-checkbox-label">
              <input
                name="is_visible"
                type="checkbox"
                checked={projectForm.is_visible}
                onChange={handleProjectInputChange}
              />

              <span>
                Visible on public portfolio
              </span>
            </label>
          </div>

          <div className="admin-form-actions admin-form-group-full">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={savingProject}
            >
              {savingProject
                ? "Saving..."
                : editingProjectId
                  ? "Update Project"
                  : "Add Project"}
            </button>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={closeProjectForm}
              disabled={savingProject}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-content-card">
        {loadingProjects ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No projects yet</h3>

            <p>
              Add your first real project to display it
              on the public portfolio.
            </p>
          </div>
        ) : (
          <div className="admin-list">
            {projects.map((project) => (
              <div
                key={project.id}
                className="admin-list-item"
              >
                <div className="admin-list-item-content">
                  <div className="admin-list-item-header">
                    <h3>{project.title}</h3>

                    <span>
                      {project.is_visible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>

                  {project.category && (
                    <p>
                      <strong>Category:</strong>{" "}
                      {project.category}
                    </p>
                  )}

                  <p>
                    {project.description}
                  </p>

                  {Array.isArray(project.technologies) &&
                    project.technologies.length > 0 && (
                      <p>
                        <strong>Technologies:</strong>{" "}
                        {project.technologies.join(", ")}
                      </p>
                    )}

                  <p>
                    <strong>Display Order:</strong>{" "}
                    {project.display_order ?? 0}
                  </p>

                  <div className="admin-project-links">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Project
                      </a>
                    )}

                    {project.repository_url && (
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Repository
                      </a>
                    )}
                  </div>
                </div>

                <div className="admin-list-item-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() =>
                      openEditProjectForm(project)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-danger-button"
                    onClick={() =>
                      handleDeleteProject(project.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </p>

          <h2>💼 Experience</h2>

          <p>
            Manage practical and
            professional experience
            displayed on your public
            portfolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openAddExperienceForm
          }
        >
          + Add Experience
        </button>
      </div>

      {experienceMessage && (
        <div
          className="admin-success-message"
          role="status"
        >
          {experienceMessage}
        </div>
      )}

      {experienceError && (
        <div
          className="admin-error-message"
          role="alert"
        >
          {experienceError}
        </div>
      )}

      {showExperienceForm && (
        <form
          className="admin-skill-form"
          onSubmit={
            handleExperienceSubmit
          }
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">
                {editingExperienceId
                  ? "EDIT EXPERIENCE"
                  : "NEW EXPERIENCE"}
              </p>

              <h3>
                {editingExperienceId
                  ? "Edit Experience"
                  : "Add New Experience"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={
                closeExperienceForm
              }
              disabled={
                savingExperience
              }
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="experience-date-range">
                Date Range
              </label>

              <input
                id="experience-date-range"
                name="date_range"
                type="text"
                value={
                  experienceForm.date_range
                }
                onChange={
                  handleExperienceInputChange
                }
                placeholder="e.g. July 2026 – September 2026"
                maxLength={100}
                disabled={
                  savingExperience
                }
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="experience-role">
                Role
              </label>

              <input
                id="experience-role"
                name="role"
                type="text"
                value={
                  experienceForm.role
                }
                onChange={
                  handleExperienceInputChange
                }
                placeholder="Experience role"
                maxLength={255}
                disabled={
                  savingExperience
                }
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="experience-company">
                Company / Organization
              </label>

              <input
                id="experience-company"
                name="company"
                type="text"
                value={
                  experienceForm.company
                }
                onChange={
                  handleExperienceInputChange
                }
                placeholder="Organization"
                maxLength={255}
                disabled={
                  savingExperience
                }
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="experience-display-order">
                Display Order
              </label>

              <input
                id="experience-display-order"
                name="display_order"
                type="number"
                min="0"
                value={
                  experienceForm.display_order
                }
                onChange={
                  handleExperienceInputChange
                }
                disabled={
                  savingExperience
                }
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="experience-description">
                Description
              </label>

              <textarea
                id="experience-description"
                name="description"
                value={
                  experienceForm.description
                }
                onChange={
                  handleExperienceInputChange
                }
                placeholder="Describe your experience..."
                rows="4"
                disabled={
                  savingExperience
                }
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="experience-activities">
                Key Activities
              </label>

              <textarea
                id="experience-activities"
                name="activities"
                value={
                  experienceForm.activities
                }
                onChange={
                  handleExperienceInputChange
                }
                placeholder={
                  "Enter one activity per line.\nExample:\nConducted network scanning using Nmap.\nAnalyzed network traffic using Wireshark."
                }
                rows="9"
                disabled={
                  savingExperience
                }
              />

              <small>
                Enter one activity per
                line.
              </small>
            </div>

            <label className="admin-checkbox-group">
              <input
                name="is_visible"
                type="checkbox"
                checked={
                  experienceForm.is_visible
                }
                onChange={
                  handleExperienceInputChange
                }
                disabled={
                  savingExperience
                }
              />

              <span>
                Visible on public
                portfolio
              </span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={
                closeExperienceForm
              }
              disabled={
                savingExperience
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={
                savingExperience
              }
            >
              {savingExperience
                ? "Saving..."
                : editingExperienceId
                ? "Update Experience"
                : "Save Experience"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-skills-panel">
        <div className="admin-panel-header">
          <div>
            <h3>
              Experience Records
            </h3>

            <p>
              {experiences.length} experience
              {experiences.length === 1
                ? ""
                : "s"} in database
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadExperiences
            }
            disabled={
              loadingExperiences
            }
          >
            ↻ Refresh
          </button>
        </div>

        {loadingExperiences ? (
          <div className="admin-empty-state">
            <span>⏳</span>

            <h3>
              Loading Experience
            </h3>

            <p>
              Retrieving experience
              from PostgreSQL...
            </p>
          </div>
        ) : experiences.length ===
          0 ? (
          <div className="admin-empty-state">
            <span>💼</span>

            <h3>
              No Experience Yet
            </h3>

            <p>
              Add your first experience
              record using the button
              above.
            </p>
          </div>
        ) : (
          <div className="admin-skills-list">
            {experiences.map(
              (experience) => {
                const activities =
                  Array.isArray(
                    experience.activities
                  )
                    ? experience.activities
                    : [];

                return (
                  <article
                    key={
                      experience.id
                    }
                    className="admin-skill-item"
                  >
                    <div className="admin-skill-main">
                      <div className="admin-skill-heading">
                        <h3>
                          {
                            experience.role
                          }
                        </h3>

                        <span
                          className={
                            experience.is_visible
                              ? "admin-visibility visible"
                              : "admin-visibility hidden"
                          }
                        >
                          {experience.is_visible
                            ? "Visible"
                            : "Hidden"}
                        </span>
                      </div>

                      <span className="admin-skill-category">
                        {
                          experience.company
                        }
                      </span>

                      <p>
                        <strong>
                          {
                            experience.date_range
                          }
                        </strong>
                      </p>

                      {experience.description && (
                        <p>
                          {
                            experience.description
                          }
                        </p>
                      )}

                      {activities.length >
                        0 && (
                        <div>
                          <strong>
                            Activities:
                          </strong>

                          <ul>
                            {activities.map(
                              (
                                activity,
                                index
                              ) => (
                                <li
                                  key={
                                    index
                                  }
                                >
                                  {
                                    activity
                                  }
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      <small>
                        Display order:{" "}
                        {
                          experience.display_order
                        }
                      </small>
                    </div>

                    <div className="admin-skill-actions">
                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() =>
                          openEditExperienceForm(
                            experience
                          )
                        }
                      >
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          handleDeleteExperience(
                            experience
                          )
                        }
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     CV MANAGEMENT
  ========================= */

  const renderCV = () => {
    const safeEducation = Array.isArray(education) ? education : [];
    const safeCertifications = Array.isArray(certifications)
      ? certifications
      : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeProfessionalSkills = Array.isArray(professionalSkills)
      ? professionalSkills
      : [];
    const safeExperiences = Array.isArray(experiences)
      ? experiences
      : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeLanguages = Array.isArray(languages) ? languages : [];
    const safeInterests = Array.isArray(interests) ? interests : [];

    const cvSources = [
      {
        id: "profile",
        icon: "👤",
        title: "Profile",
        description:
          "Name, professional title, contact details and profile summary.",
        count: profile ? 1 : 0,
      },
      {
        id: "education",
        icon: "🎓",
        title: "Education",
        description:
          "Academic background displayed in the CV.",
        count: safeEducation.length,
      },
      {
        id: "certifications",
        icon: "📜",
        title: "Certifications",
        description:
          "Professional certifications and training records.",
        count: safeCertifications.length,
      },
      {
        id: "skills",
        icon: "🛠",
        title: "Technical Skills",
        description:
          "Technical skills grouped by category.",
        count: safeSkills.length,
      },
      {
        id: "professional-skills",
        icon: "⭐",
        title: "Professional Skills",
        description:
          "Professional and workplace skills.",
        count: safeProfessionalSkills.length,
      },
      {
        id: "experience",
        icon: "💼",
        title: "Experience",
        description:
          "Practical and professional experience.",
        count: safeExperiences.length,
      },
      {
        id: "projects",
        icon: "🚀",
        title: "Projects",
        description:
          "Selected projects included in the CV.",
        count: safeProjects.length,
      },
      {
        id: "languages",
        icon: "🌐",
        title: "Languages",
        description:
          "Languages displayed in the CV.",
        count: safeLanguages.length,
      },
      {
        id: "interests",
        icon: "🎯",
        title: "Interests",
        description:
          "Professional interests displayed in the CV.",
        count: safeInterests.length,
      },
    ];

    const totalItems = cvSources.reduce(
      (total, source) => total + source.count,
      0
    );

    return (
      <div className="admin-section-page">
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">
              CURRICULUM VITAE
            </p>

            <h2>📄 CV Management</h2>

            <p>
              Manage the content sources used to generate
              your public Curriculum Vitae.
            </p>
          </div>

          <button
            type="button"
            className="admin-back-button"
            onClick={() => setActiveSection("overview")}
          >
            ← Dashboard
          </button>
        </div>

        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">📄</span>

            <div>
              <strong>Live CV</strong>
              <span>Connected</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📚</span>

            <div>
              <strong>{cvSources.length}</strong>
              <span>Content Sources</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📊</span>

            <div>
              <strong>{totalItems}</strong>
              <span>Total Records</span>
            </div>
          </div>
        </div>

        <div className="admin-section-card">
          <div className="admin-card-header">
            <div>
              <p className="admin-eyebrow">
                CV ACTIONS
              </p>

              <h3>Preview and Manage CV</h3>
            </div>
          </div>

          <div className="admin-action-preview">
            <button
              type="button"
              className="admin-primary-button"
              onClick={() =>
                window.open(
                  "/#cv",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              👁 View Public CV
            </button>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() =>
                window.open(
                  "/#cv",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              🖨 Open CV / Print
            </button>
          </div>

          <p className="admin-form-help">
            The public CV is generated from the portfolio
            data managed in the sections below. Changes made
            to those sections are reflected in the CV automatically.
          </p>
        </div>

        <div className="admin-section-card">
          <div className="admin-card-header">
            <div>
              <p className="admin-eyebrow">
                CV CONTENT
              </p>

              <h3>CV Content Sources</h3>
            </div>
          </div>

          <div className="admin-item-grid">
            {cvSources.map((source) => (
              <div
                className="admin-item-card"
                key={source.id}
              >
                <div className="admin-item-card-header">
                  <div>
                    <span className="admin-item-icon">
                      {source.icon}
                    </span>

                    <h4>{source.title}</h4>
                  </div>

                  <span className="admin-item-status">
                    {source.count}{" "}
                    {source.count === 1
                      ? "record"
                      : "records"}
                  </span>
                </div>

                <p>{source.description}</p>

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() =>
                    setActiveSection(source.id)
                  }
                >
                  Manage {source.title}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-section-card">
          <div className="admin-card-header">
            <div>
              <p className="admin-eyebrow">
                CV WORKFLOW
              </p>

              <h3>How CV Management Works</h3>
            </div>
          </div>

          <div className="admin-workflow-list">
            <div className="admin-workflow-item">
              <span>01</span>

              <div>
                <strong>Update Portfolio Data</strong>

                <p>
                  Manage your profile, education,
                  certifications, skills, experience,
                  projects and other CV content.
                </p>
              </div>
            </div>

            <div className="admin-workflow-item">
              <span>02</span>

              <div>
                <strong>CV Updates Automatically</strong>

                <p>
                  The public CV reads the latest visible
                  portfolio records from the database.
                </p>
              </div>
            </div>

            <div className="admin-workflow-item">
              <span>03</span>

              <div>
                <strong>Preview or Print</strong>

                <p>
                  Open the public CV and use the browser
                  print function to print or save it as PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* =========================
     PLACEHOLDER PORTFOLIO UI
  ========================= */

  const renderPortfolioSection = () => {
    const currentItem =
      portfolioItems.find(
        (item) =>
          item.id === activeSection
      );

    if (!currentItem) return null;

    if (
      currentItem.id ===
      "profile"
    ) {
      return renderProfile();
    }

    if (
      currentItem.id ===
      "about"
    ) {
      return renderAbout();
    }

    if (
      currentItem.id ===
      "skills"
    ) {
      return renderSkills();
    }

    if (
      currentItem.id ===
      "professional-skills"
    ) {
      return renderProfessionalSkills();
    }

    if (
      currentItem.id ===
      "languages"
    ) {
      return renderLanguages();
    }

    if (
      currentItem.id ===
      "interests"
    ) {
      return renderInterests();
    }

    if (
      currentItem.id ===
      "education"
    ) {
      return renderEducation();
    }

    if (
      currentItem.id ===
      "contact"
    ) {
      return renderContact();
    }

    if (
      currentItem.id ===
      "certifications"
    ) {
      return renderCertifications();
    }

    if (
      currentItem.id ===
      "experience"
    ) {
      return renderExperience();
    }

    if (
      currentItem.id ===
      "projects"
    ) {
      return renderProjects();
    }

    if (
      currentItem.id ===
      "cv"
    ) {
      return renderCV();
    }

    return (
      <div className="admin-section-page">
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">
              PORTFOLIO MANAGEMENT
            </p>

            <h2>
              {currentItem.icon}{" "}
              {currentItem.title}
            </h2>

            <p>
              {
                currentItem.description
              }
            </p>
          </div>

          <button
            type="button"
            className="admin-back-button"
            onClick={() =>
              setActiveSection(
                "overview"
              )
            }
          >
            ← Dashboard
          </button>
        </div>

        <div className="admin-coming-soon">
          <span className="admin-coming-soon-icon">
            {currentItem.icon}
          </span>

          <h3>
            {currentItem.title}{" "}
            Management
          </h3>

          <p>
            This management module
            will be connected to
            PostgreSQL in the next
            phase.
          </p>

          <div className="admin-action-preview">
            <span>＋ Add</span>
            <span>✎ Edit</span>
            <span>🗑 Delete</span>
          </div>
        </div>
      </div>
    );
  };

  /* =========================
     PRIVATE VAULT
  ========================= */

  const handleDocumentInputChange = (event) => {
    const { name, value } = event.target;

    setDocumentForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleDocumentFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setDocumentFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setDocumentError(
        "Only PDF, JPEG, PNG and WEBP document files are allowed."
      );
      event.target.value = "";
      setDocumentFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setDocumentError("Document file must not exceed 10 MB.");
      event.target.value = "";
      setDocumentFile(null);
      return;
    }

    setDocumentError("");
    setDocumentMessage("");
    setDocumentFile(file);
  };

  const openAddDocumentForm = () => {
    setDocumentForm({
      title: "",
      document_type: "",
    });
    setDocumentFile(null);
    setDocumentError("");
    setDocumentMessage("");
    setShowDocumentForm(true);
  };

  const closeDocumentForm = () => {
    if (savingDocument) return;

    setShowDocumentForm(false);
    setDocumentForm({
      title: "",
      document_type: "",
    });
    setDocumentFile(null);
  };

  const handleDocumentSubmit = async (event) => {
    event.preventDefault();

    setDocumentError("");
    setDocumentMessage("");

    if (!documentForm.title.trim() || !documentForm.document_type.trim()) {
      setDocumentError("Document title and document type are required.");
      return;
    }

    if (!documentFile) {
      setDocumentError("Please select a document file.");
      return;
    }

    try {
      setSavingDocument(true);

      const formData = new FormData();

      formData.append("title", documentForm.title.trim());
      formData.append(
        "document_type",
        documentForm.document_type.trim()
      );
      formData.append("document", documentFile);

      const data = await uploadDocument(formData);

      setDocumentMessage(
        data.message || "Document uploaded successfully."
      );

      setDocumentForm({
        title: "",
        document_type: "",
      });
      setDocumentFile(null);
      setShowDocumentForm(false);

      await loadDocuments();
    } catch (error) {
      setDocumentError(
        error?.data?.message ||
          error?.message ||
          "Unable to upload document."
      );
    } finally {
      setSavingDocument(false);
    }
  };

  const handleDeleteDocument = async (document) => {
    const confirmed = window.confirm(
      `Delete "${document.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDocumentError("");
    setDocumentMessage("");

    try {
      const data = await deleteDocument(document.id);

      setDocumentMessage(
        data.message || "Document deleted successfully."
      );

      await loadDocuments();
    } catch (error) {
      setDocumentError(
        error?.data?.message ||
          error?.message ||
          "Unable to delete document."
      );
    }
  };

  const renderDocuments = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">SECURE AREA</p>

          <h2>🔐 Private Vault</h2>

          <p>
            Manage protected and private documents.
          </p>
        </div>

        {!showDocumentForm && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddDocumentForm}
          >
            + Add Document
          </button>
        )}
      </div>

      {documentMessage && (
        <div className="admin-success-message" role="status">
          {documentMessage}
        </div>
      )}

      {documentError && (
        <div className="vault-login-error" role="alert">
          {documentError}
        </div>
      )}

      {showDocumentForm && (
        <form
          className="admin-skill-form"
          onSubmit={handleDocumentSubmit}
        >
          <div className="admin-form-header">
            <div>
              <p className="admin-eyebrow">NEW PRIVATE DOCUMENT</p>

              <h3>Upload Protected Document</h3>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={closeDocumentForm}
              disabled={savingDocument}
            >
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="document-title">
                Document Title
              </label>

              <input
                id="document-title"
                name="title"
                type="text"
                value={documentForm.title}
                onChange={handleDocumentInputChange}
                placeholder="e.g. Birth Certificate"
                disabled={savingDocument}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="document-type">
                Document Type
              </label>

              <input
                id="document-type"
                name="document_type"
                type="text"
                value={documentForm.document_type}
                onChange={handleDocumentInputChange}
                placeholder="e.g. Personal Document"
                disabled={savingDocument}
                required
              />
            </div>

            <div className="admin-form-group admin-form-group-full">
              <label htmlFor="document-file">
                Protected File
              </label>

              <input
                id="document-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleDocumentFileChange}
                disabled={savingDocument}
                required
              />

              <small>
                PDF, JPEG, PNG or WEBP · Maximum 10 MB
              </small>
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeDocumentForm}
              disabled={savingDocument}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingDocument}
            >
              {savingDocument ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-documents-panel">
        {loadingDocuments ? (
          <p>Loading protected documents...</p>
        ) : documents.length === 0 ? (
          <div className="admin-empty-state">
            <span>📁</span>

            <h3>No Protected Documents</h3>

            <p>
              Your secure vault is ready for protected documents.
            </p>
          </div>
        ) : (
          <div className="admin-documents-list">
            {documents.map((document) => (
              <article
                key={document.id}
                className="admin-document-item"
              >
                <div>
                  <h3>{document.title}</h3>

                  <p>
                    {document.document_type} · {document.mime_type}
                  </p>

                  <small>
                    🔒 Private document
                  </small>
                </div>

                <div className="admin-document-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      window.open(
                        getDocumentDownloadUrl(document.id),
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    Download
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      handleDeleteDocument(document)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* =========================
     SECURITY
  ========================= */

  const renderSecurity = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            SECURITY CENTER
          </p>

          <h2>
            🛡️ Security
          </h2>

          <p>
            Review authentication and
            portfolio security status.
          </p>
        </div>
      </div>

      <div className="admin-security-grid">
        <article className="admin-security-card">
          <span>🔑</span>

          <h3>
            Authentication
          </h3>

          <p>
            Session-based
            administrator
            authentication is
            active.
          </p>
        </article>

        <article className="admin-security-card">
          <span>🛡️</span>

          <h3>
            CSRF Protection
          </h3>

          <p>
            Cross-site request
            forgery protection is
            enabled for protected
            requests.
          </p>
        </article>

        <article className="admin-security-card">
          <span>🗄️</span>

          <h3>
            Database
          </h3>

          <p>
            PostgreSQL is connected
            to the portfolio backend.
          </p>
        </article>
      </div>
    </div>
  );

  /* =========================
     SETTINGS
  ========================= */

  const renderSettings = () => (
    <div className="admin-section-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            SYSTEM SETTINGS
          </p>

          <h2>
            ⚙️ Settings
          </h2>

          <p>
            Portfolio-wide settings
            and configuration will be
            managed here.
          </p>
        </div>
      </div>

      <div className="admin-coming-soon">
        <span className="admin-coming-soon-icon">
          ⚙️
        </span>

        <h3>
          Portfolio Settings
        </h3>

        <p>
          General site settings,
          social links and portfolio
          configuration will be
          added here.
        </p>
      </div>
    </div>
  );

  /* =========================
     CONTENT ROUTER
  ========================= */

  const renderContent = () => {
    if (
      activeSection ===
      "overview"
    ) {
      return renderOverview();
    }

    if (
      activeSection ===
      "documents"
    ) {
      return renderDocuments();
    }

    if (
      activeSection ===
      "security"
    ) {
      return renderSecurity();
    }

    if (
      activeSection ===
      "settings"
    ) {
      return renderSettings();
    }

    return renderPortfolioSection();
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">
            ⌘
          </span>

          <div>
            <strong>
              SHIJA MALONGO
            </strong>

            <small>
              ADMIN PANEL
            </small>
          </div>
        </div>

        <nav className="admin-navigation">
          <div className="admin-nav-group">
            <span className="admin-nav-title">
              DASHBOARD
            </span>

            <button
              type="button"
              className={
                activeSection ===
                "overview"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                setActiveSection(
                  "overview"
                )
              }
            >
              <span>🏠</span>
              Overview
            </button>
          </div>

          <div className="admin-nav-group">
            <span className="admin-nav-title">
              PORTFOLIO
            </span>

            {menuItems
              .filter(
                (item) =>
                  item.id !==
                  "overview"
              )
              .map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    className={
                      activeSection ===
                      item.id
                        ? "admin-nav-item active"
                        : "admin-nav-item"
                    }
                    onClick={() =>
                      setActiveSection(
                        item.id
                      )
                    }
                  >
                    <span>
                      {
                        item.icon
                      }
                    </span>

                    {
                      item.label
                    }
                  </button>
                )
              )}
          </div>

          <div className="admin-nav-group">
            <span className="admin-nav-title">
              SECURE AREA
            </span>

            {secureItems.map(
              (item) => (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  className={
                    activeSection ===
                    item.id
                      ? "admin-nav-item active"
                      : "admin-nav-item"
                  }
                  onClick={() =>
                    setActiveSection(
                      item.id
                    )
                  }
                >
                  <span>
                    {
                      item.icon
                    }
                  </span>

                  {
                    item.label
                  }
                </button>
              )
            )}
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <span>●</span>

            <div>
              <strong>
                Administrator
              </strong>

              <small>
                {user?.email}
              </small>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={
              handleLogout
            }
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="admin-online-dot">
              ●
            </span>

            Secure Administration
            Session
          </div>

          <span>
            Portfolio Management
            System
          </span>
        </div>

        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
