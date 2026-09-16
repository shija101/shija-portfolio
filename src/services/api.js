const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

let csrfToken = null;

const getCsrfToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || !data.csrfToken) {
    throw new Error(data.message || "Unable to obtain CSRF token.");
  }

  csrfToken = data.csrfToken;
  return csrfToken;
};

const apiRequest = async (endpoint, options = {}) => {
  const method = (options.method || "GET").toUpperCase();

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    if (!csrfToken) {
      await getCsrfToken();
    }

    headers["X-CSRF-Token"] = csrfToken;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method,
    credentials: "include",
    headers,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 403 && data.code === "EBADCSRFTOKEN") {
    csrfToken = null;
    await getCsrfToken();

    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method,
      credentials: "include",
      headers: {
        ...headers,
        "X-CSRF-Token": csrfToken,
      },
    });

    try {
      data = await response.json();
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/* =========================
   AUTH
========================= */

export const login = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getCurrentUser = () => apiRequest("/auth/me");

export const logout = () =>
  apiRequest("/auth/logout", {
    method: "POST",
  });

/* =========================
   DOCUMENTS
========================= */

export const getDocuments = () => apiRequest("/documents");

export const uploadDocument = (formData) =>
  apiRequest("/documents", {
    method: "POST",
    body: formData,
  });

export const getDocumentDownloadUrl = (id) =>
  `${API_BASE_URL}/documents/${id}/download`;

export const deleteDocument = (id) =>
  apiRequest(`/documents/${id}`, {
    method: "DELETE",
  });

/* =========================
   PROFILE
========================= */

export const getAbout = () =>
  apiRequest("/about");

export const getAdminAbout = () =>
  apiRequest("/about/admin");

export const createAbout = (about) =>
  apiRequest("/about", {
    method: "POST",
    body: JSON.stringify(about),
  });

export const updateAbout = (id, about) =>
  apiRequest(`/about/${id}`, {
    method: "PUT",
    body: JSON.stringify(about),
  });

export const deleteAbout = (id) =>
  apiRequest(`/about/${id}`, {
    method: "DELETE",
  });

export const getProfile = () => apiRequest("/profile");

export const getAdminProfile = () =>
  apiRequest("/profile/admin");

export const createProfile = (profile) =>
  apiRequest("/profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });

export const updateProfile = (id, profile) =>
  apiRequest(`/profile/${id}`, {
    method: "PUT",
    body: JSON.stringify(profile),
  });

/* =========================
   PROFILE IMAGE
========================= */

export const uploadProfileImage = (id, imageFile) => {
  const formData = new FormData();

  formData.append("profile_image", imageFile);

  return apiRequest(`/profile/${id}/image`, {
    method: "POST",
    body: formData,
  });
};

export const deleteProfileImage = (id) =>
  apiRequest(`/profile/${id}/image`, {
    method: "DELETE",
  });

export const getProfileImageUrl = (profileImagePath) => {
  if (!profileImagePath) {
    return "";
  }

  if (
    profileImagePath.startsWith("http://") ||
    profileImagePath.startsWith("https://")
  ) {
    return profileImagePath;
  }

  const normalizedPath = profileImagePath.startsWith("/")
    ? profileImagePath
    : `/${profileImagePath}`;

  return `${API_BASE_URL.replace(
    /\/api$/,
    ""
  )}${normalizedPath}`;
};

/* =========================
   TECHNICAL SKILLS
========================= */

export const getSkills = () => apiRequest("/skills");

export const getAdminSkills = () =>
  apiRequest("/skills/admin");

export const createSkill = (skill) =>
  apiRequest("/skills", {
    method: "POST",
    body: JSON.stringify(skill),
  });

export const updateSkill = (id, skill) =>
  apiRequest(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(skill),
  });

export const deleteSkill = (id) =>
  apiRequest(`/skills/${id}`, {
    method: "DELETE",
  });

/* =========================
   PROFESSIONAL SKILLS
========================= */

export const getProfessionalSkills = () =>
  apiRequest("/professional-skills");

export const getAdminProfessionalSkills = () =>
  apiRequest("/professional-skills/admin");

export const createProfessionalSkill = (skill) =>
  apiRequest("/professional-skills", {
    method: "POST",
    body: JSON.stringify(skill),
  });

export const updateProfessionalSkill = (
  id,
  skill
) =>
  apiRequest(`/professional-skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(skill),
  });

export const deleteProfessionalSkill = (id) =>
  apiRequest(`/professional-skills/${id}`, {
    method: "DELETE",
  });

/* =========================
   EDUCATION
========================= */

export const getEducation = () =>
  apiRequest("/education");

export const getAdminEducation = () =>
  apiRequest("/education/admin");

export const createEducation = (
  education,
  certificateFile = null
) => {
  const formData = new FormData();

  formData.append("period", education.period);
  formData.append(
    "qualification",
    education.qualification
  );
  formData.append(
    "institution",
    education.institution
  );
  formData.append(
    "description",
    education.description || ""
  );
  formData.append(
    "display_order",
    String(education.display_order ?? 0)
  );
  formData.append(
    "is_visible",
    String(Boolean(education.is_visible))
  );

  if (certificateFile) {
    formData.append("certificate", certificateFile);
  }

  return apiRequest("/education", {
    method: "POST",
    body: formData,
  });
};

export const updateEducation = (
  id,
  education,
  certificateFile = null
) => {
  const formData = new FormData();

  formData.append("period", education.period);
  formData.append(
    "qualification",
    education.qualification
  );
  formData.append(
    "institution",
    education.institution
  );
  formData.append(
    "description",
    education.description || ""
  );
  formData.append(
    "display_order",
    String(education.display_order ?? 0)
  );
  formData.append(
    "is_visible",
    String(Boolean(education.is_visible))
  );

  if (certificateFile) {
    formData.append("certificate", certificateFile);
  }

  return apiRequest(`/education/${id}`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteEducation = (id) =>
  apiRequest(`/education/${id}`, {
    method: "DELETE",
  });

export const getPublicEducationCertificateUrl = (id) =>
  `${API_BASE_URL}/public-files/education-certificates/${id}`;

/* =========================
   CERTIFICATIONS
========================= */

export const getCertifications = () =>
  apiRequest("/certifications");

export const getAdminCertifications = () =>
  apiRequest("/certifications/admin");

export const createCertification = (
  certification
) =>
  apiRequest("/certifications", {
    method: "POST",
    body: certification,
  });

export const updateCertification = (
  id,
  certification
) =>
  apiRequest(`/certifications/${id}`, {
    method: "PUT",
    body: certification,
  });

export const deleteCertification = (id) =>
  apiRequest(`/certifications/${id}`, {
    method: "DELETE",
  });

export const getPublicCertificateUrl = (id) =>
  `${API_BASE_URL}/public-files/certificates/${id}`;

/* =========================
   EXPERIENCE
========================= */

export const getExperience = () =>
  apiRequest("/experience");

export const getAdminExperience = () =>
  apiRequest("/experience/admin");

export const createExperience = (experience) =>
  apiRequest("/experience", {
    method: "POST",
    body: JSON.stringify(experience),
  });

export const updateExperience = (
  id,
  experience
) =>
  apiRequest(`/experience/${id}`, {
    method: "PUT",
    body: JSON.stringify(experience),
  });

export const deleteExperience = (id) =>
  apiRequest(`/experience/${id}`, {
    method: "DELETE",
  });

/* =========================
   PROJECTS
========================= */

export const getProjects = () =>
  apiRequest("/projects");

export const getAdminProjects = () =>
  apiRequest("/projects/admin");

export const createProject = (project) =>
  apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

export const updateProject = (id, project) =>
  apiRequest(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });

export const deleteProject = (id) =>
  apiRequest(`/projects/${id}`, {
    method: "DELETE",
  });

/* =========================
   LANGUAGES
========================= */

export const getLanguages = () =>
  apiRequest("/languages");

export const getAdminLanguages = () =>
  apiRequest("/languages/admin");

export const createLanguage = (language) =>
  apiRequest("/languages", {
    method: "POST",
    body: JSON.stringify(language),
  });

export const updateLanguage = (
  id,
  language
) =>
  apiRequest(`/languages/${id}`, {
    method: "PUT",
    body: JSON.stringify(language),
  });

export const deleteLanguage = (id) =>
  apiRequest(`/languages/${id}`, {
    method: "DELETE",
  });

/* =========================
   INTERESTS
========================= */

export const getInterests = () =>
  apiRequest("/interests");

export const getAdminInterests = () =>
  apiRequest("/interests/admin");

export const createInterest = (interest) =>
  apiRequest("/interests", {
    method: "POST",
    body: JSON.stringify(interest),
  });

export const updateInterest = (
  id,
  interest
) =>
  apiRequest(`/interests/${id}`, {
    method: "PUT",
    body: JSON.stringify(interest),
  });

export const deleteInterest = (id) =>
  apiRequest(`/interests/${id}`, {
    method: "DELETE",
  });

/* =========================
   API BASE URL
========================= */

export const getApiBaseUrl = () =>
  API_BASE_URL;

export default apiRequest;

/* =========================
   CONTACT
========================= */

export const submitContactMessage = (message) =>
  apiRequest("/contact", {
    method: "POST",
    body: JSON.stringify(message),
  });

export const getContactMessages = () =>
  apiRequest("/contact");

export const updateContactMessageStatus = (
  id,
  status
) =>
  apiRequest(`/contact/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const deleteContactMessage = (id) =>
  apiRequest(`/contact/${id}`, {
    method: "DELETE",
  });
