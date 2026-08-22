import {
  BadgeCheck,
  CalendarDays,
  Camera,
  Edit3,
  Globe2,
  Languages,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { apiRequest, resolveMediaUrl } from "../../../services/api";
import AccountSecurityPanel from "../../../shared/components/AccountSecurityPanel/AccountSecurityPanel";
import { logoutUser, updateProfile } from "../../../store/slices/authSlice";
import styles from "./GuideAccountProfile.module.css";

const SPECIALTIES = [
  "History & Culture",
  "Food & Culinary",
  "Adventure",
  "Luxury",
  "Nile Cruise",
  "Desert Safari",
];

function getInitials(fullName = "Trip Guide") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value, fallback = "Not added yet") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function inputDate(value) {
  return value ? String(value).slice(0, 10) : "";
}

function profileForm(profile) {
  return {
    fullName: profile?.fullName || profile?.name || "",
    headline: profile?.headline || profile?.title || "",
    phoneNumber: profile?.phoneNumber || "",
    location: profile?.location || "",
    nationality: profile?.nationality || "",
    dateOfBirth: inputDate(profile?.dateOfBirth),
    gender: profile?.gender || "other",
    preferredLanguage: profile?.preferredLanguage || "en",
    yearsExperience: profile?.yearsExperience ?? 0,
    languages: Array.isArray(profile?.languages)
      ? profile.languages.join(", ")
      : "",
    specialties: Array.isArray(profile?.specialties) ? profile.specialties : [],
    about: profile?.about || "",
  };
}

function show(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not added yet";
  if (value === 0) return "0";
  return value || "Not added yet";
}

function formatLanguage(language) {
  return ({ en: "English", ar: "Arabic", fr: "French", de: "German", es: "Spanish" })[
    language
  ] || language || "Not added yet";
}

export default function GuideAccountProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, profile } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => profileForm(profile));
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || "");
  const [failedAvatar, setFailedAvatar] = useState("");
  const [failedPreview, setFailedPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const guideData = useMemo(
    () => ({
      fullName: profile?.fullName || profile?.name || "Not added yet",
      email: user?.email || "Not added yet",
      avatar: profile?.avatar || profile?.profileImage || "",
      headline: profile?.headline || profile?.title || "",
      phoneNumber: profile?.phoneNumber || "",
      location: profile?.location || "",
      nationality: profile?.nationality || "",
      dateOfBirth: profile?.dateOfBirth || null,
      gender: profile?.gender || "other",
      preferredLanguage: profile?.preferredLanguage || "",
      languages: Array.isArray(profile?.languages) ? profile.languages : [],
      specialties: Array.isArray(profile?.specialties) ? profile.specialties : [],
      yearsExperience: Number(profile?.yearsExperience || 0),
      rating: Number(profile?.rating || 0),
      reviewsCount: Number(profile?.reviewsCount || 0),
      verificationStatus: profile?.verificationStatus || "draft",
      memberSince: user?.createdAt || profile?.memberSince || profile?.createdAt,
      about: profile?.about || "",
    }),
    [profile, user],
  );

  const initials = useMemo(
    () => getInitials(guideData.fullName),
    [guideData.fullName],
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login", { replace: true });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const toggleSpecialty = (specialty) => {
    setForm((current) => ({
      ...current,
      specialties: current.specialties.includes(specialty)
        ? current.specialties.filter((item) => item !== specialty)
        : current.specialties.length < 3
          ? [...current.specialties, specialty]
          : current.specialties,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setFailedPreview("");
  };

  const cancelEditing = () => {
    setEditing(false);
    setError("");
    setForm(profileForm(guideData));
    setAvatarPreview(guideData.avatar);
    setFailedPreview("");
    setAvatarFile(null);
  };

  const startEditing = () => {
    setForm(profileForm(guideData));
    setAvatarPreview(guideData.avatar);
    setFailedPreview("");
    setAvatarFile(null);
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatarFile);
        await apiRequest("/users/profile/avatar", {
          method: "POST",
          body: avatarData,
        });
      }

      const response = await apiRequest("/guides/profile/me", {
        method: "PUT",
        body: JSON.stringify({
          fullName: form.fullName,
          headline: form.headline,
          phoneNumber: form.phoneNumber,
          location: form.location,
          nationality: form.nationality,
          dateOfBirth: form.dateOfBirth || null,
          gender: form.gender,
          preferredLanguage: form.preferredLanguage,
          yearsExperience: Number(form.yearsExperience || 0),
          languages: form.languages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          specialties: form.specialties,
          about: form.about,
        }),
      });

      dispatch(updateProfile({ user, profile: response.data.guide }));
      setEditing(false);
      setSuccess(response.message || "Guide profile updated successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to update guide profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Profile</h1>
          <p>Keep your guide information, sign-in methods, and public details up to date.</p>
        </div>

        {!editing && (
          <button type="button" className={styles.editButton} onClick={startEditing}>
            <Edit3 size={18} /> Edit profile
          </button>
        )}
      </header>

      {success && <p className={styles.successMessage}>{success}</p>}

      <section className={styles.profileCard}>
        {guideData.avatar && failedAvatar !== guideData.avatar ? (
          <img
            src={resolveMediaUrl(guideData.avatar)}
            alt={guideData.fullName}
            onError={() => setFailedAvatar(guideData.avatar)}
          />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}

        <div className={styles.profileIdentity}>
          <h2>{guideData.fullName}</h2>
          <p>{guideData.headline || guideData.email}</p>

          <div className={styles.badgesRow}>
            <span className={styles.roleBadge}>
              <UserRound size={14} /> Trip Guide
            </span>
            {guideData.verificationStatus === "approved" && (
              <span className={styles.verifiedBadge}>
                <BadgeCheck size={14} /> Verified
              </span>
            )}
          </div>

          <div className={styles.ratingRow}>
            <Star size={17} fill="currentColor" />
            <strong>{guideData.rating.toFixed(1)} / 5</strong>
            <span>{guideData.reviewsCount} reviews</span>
          </div>
        </div>
      </section>

      {editing ? (
        <form className={styles.editCard} onSubmit={handleSubmit}>
          <div className={styles.editCardHeader}>
            <div>
              <h2>Edit guide profile</h2>
              <p>These values are loaded from and saved to your Nefru profile.</p>
            </div>
            <button type="button" onClick={cancelEditing} aria-label="Cancel editing">
              <X size={20} />
            </button>
          </div>

          <div className={styles.photoEditor}>
            {avatarPreview && failedPreview !== avatarPreview ? (
              <img
                src={resolveMediaUrl(avatarPreview)}
                alt="Profile preview"
                onError={() => setFailedPreview(avatarPreview)}
              />
            ) : (
              <div className={styles.avatarFallback}>{getInitials(form.fullName)}</div>
            )}
            <div>
              <strong>Profile photo</strong>
              <p>JPG or PNG, up to 5 MB.</p>
              <button type="button" onClick={() => fileInputRef.current?.click()}>
                <Camera size={17} /> Choose photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formGrid}>
            <label>
              <span>Full name</span>
              <input name="fullName" value={form.fullName} onChange={handleChange} required />
            </label>
            <label>
              <span>Professional headline</span>
              <input name="headline" value={form.headline} onChange={handleChange} />
            </label>
            <label>
              <span>Phone number</span>
              <input
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                autoComplete="tel"
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Based in</span>
              <input name="location" value={form.location} onChange={handleChange} />
            </label>
            <label>
              <span>Nationality</span>
              <input name="nationality" value={form.nationality} onChange={handleChange} />
            </label>
            <label>
              <span>Date of birth</span>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            </label>
            <label>
              <span>Gender</span>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
            </label>
            <label>
              <span>Preferred language</span>
              <select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange}>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
              </select>
            </label>
            <label>
              <span>Years of experience</span>
              <input name="yearsExperience" type="number" min="0" max="60" value={form.yearsExperience} onChange={handleChange} />
            </label>
            <label>
              <span>Languages (comma separated)</span>
              <input name="languages" value={form.languages} onChange={handleChange} placeholder="Arabic, English" />
            </label>
            <label className={styles.fullWidth}>
              <span>About</span>
              <textarea name="about" rows="5" value={form.about} onChange={handleChange} />
            </label>
          </div>

          <fieldset className={styles.specialties}>
            <legend>Specialties (up to 3)</legend>
            <div>
              {SPECIALTIES.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  data-selected={form.specialties.includes(specialty) || undefined}
                  onClick={() => toggleSpecialty(specialty)}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </fieldset>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelEditButton} onClick={cancelEditing}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              <Save size={18} /> {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.desktopGrid}>
          <section className={styles.infoCard}>
            <div className={styles.cardTitle}>
              <UserRound size={20} /> <h2>Guide Information</h2>
            </div>
            <div className={styles.fieldsGrid}>
              <div className={styles.fieldBox}><span>Full Name</span><strong>{guideData.fullName}</strong></div>
              <div className={styles.fieldBox}><span>Based In</span><strong>{show(guideData.location)}</strong></div>
              <div className={styles.fieldBox}><span>Experience</span><strong>{guideData.yearsExperience} years</strong></div>
              <div className={styles.fieldBox}><span>Languages</span><strong>{show(guideData.languages)}</strong></div>
              <div className={styles.fieldBox}><span>Specialties</span><strong>{show(guideData.specialties)}</strong></div>
              <div className={styles.fieldBox}><span>Nationality</span><strong>{show(guideData.nationality)}</strong></div>
            </div>
          </section>

          <section className={styles.infoCard}>
            <div className={styles.cardTitle}>
              <Phone size={20} /> <h2>Contact Information</h2>
            </div>
            <div className={styles.contactList}>
              <div><Mail size={18} /><span><small>Email</small><strong>{guideData.email}</strong></span></div>
              <div><Phone size={18} /><span><small>Phone Number</small><strong>{show(guideData.phoneNumber)}</strong></span></div>
              <div><MapPin size={18} /><span><small>Location</small><strong>{show(guideData.location)}</strong></span></div>
            </div>
          </section>

          <section className={styles.infoCard}>
            <div className={styles.cardTitle}>
              <BadgeCheck size={20} /> <h2>Account Summary</h2>
            </div>
            <div className={styles.summaryList}>
              <div><CalendarDays size={18} /><span>Guide Since</span><strong>{formatDate(guideData.memberSince, "Recently joined")}</strong></div>
              <div><Globe2 size={18} /><span>Preferred Language</span><strong>{formatLanguage(guideData.preferredLanguage)}</strong></div>
              <div><Languages size={18} /><span>Languages</span><strong>{show(guideData.languages)}</strong></div>
              <div><BadgeCheck size={18} /><span>Verification</span><strong className={styles.status}>{guideData.verificationStatus}</strong></div>
            </div>
          </section>
        </div>
      )}

      {!editing && (
        <div className={styles.mobileSections}>
          <section className={styles.mobileGroup}>
            <h3>Guide Information</h3>
            <div className={styles.mobileItem}><span className={styles.iconBlue}><MapPin size={19} /></span><span><strong>Based In</strong><small>{show(guideData.location)}</small></span></div>
            <div className={styles.mobileItem}><span className={styles.iconGold}><CalendarDays size={19} /></span><span><strong>Experience</strong><small>{guideData.yearsExperience} years</small></span></div>
            <div className={styles.mobileItem}><span className={styles.iconBlue}><Languages size={19} /></span><span><strong>Languages</strong><small>{show(guideData.languages)}</small></span></div>
          </section>
          <section className={styles.mobileGroup}>
            <h3>Contact Information</h3>
            <div className={styles.mobileItem}><span className={styles.iconBlue}><Mail size={19} /></span><span><strong>Email</strong><small>{guideData.email}</small></span></div>
            <div className={styles.mobileItem}><span className={styles.iconGreen}><Phone size={19} /></span><span><strong>Phone Number</strong><small>{show(guideData.phoneNumber)}</small></span></div>
          </section>
        </div>
      )}

      <AccountSecurityPanel />

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        <LogOut size={19} /> Log Out
      </button>
    </div>
  );
}
