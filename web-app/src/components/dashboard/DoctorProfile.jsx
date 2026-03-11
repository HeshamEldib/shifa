// src/components/doctor/DoctorProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Doctor Profile.css";

function DoctorProfile() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language && i18n.language.startsWith("ar");

  const [doctor, setDoctor] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/doctor/profile${userId ? `/${userId}` : ""}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();

        setDoctor({
          name: data.name || "",
          specialty: data.specialty || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error(err);
        setDoctor((prev) =>
          prev.name
            ? prev
            : {
                name: "د. أحمد سامي",
                specialty: "طبيب باطني",
                phone: "+20 100 123 4567",
                email: "ahmed.sami@example.com",
              }
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [token, userId]);

  const initials = useMemo(() => {
    if (!doctor.name) return "DR";
    const parts = doctor.name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "D";
    return (
      (parts[0][0] || "").toUpperCase() +
      (parts[parts.length - 1][0] || "").toUpperCase()
    );
  }, [doctor.name]);

  const handleChange = (field) => (e) => {
    setDoctor((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(
        `/api/doctor/profile${userId ? `/${userId}` : ""}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: doctor.name,
            specialty: doctor.specialty,
            phone: doctor.phone,
            email: doctor.email,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dd-profile-shell" dir={isRTL ? "rtl" : "ltr"}>
      <main className="dd-main dd-profile-main">
        <section className="dd-profile-card">
          <div className="dd-profile-header-title">
            <h2 className="dd-profile-title">
              {t("doctor.account_title", "إعدادات حساب الطبيب")}
            </h2>
            <p className="dd-profile-subtitle">
              {t(
                "doctor.account_subtitle",
                "حدّث بياناتك الشخصية وطرق التواصل مع المرضى."
              )}
            </p>
          </div>

          <div className="dd-profile-top">
            <div className="dd-sidebar-avatar dd-profile-avatar">
              {initials}
            </div>
            <div>
              <div className="dd-profile-name">
                {loading
                  ? t("common.loading", "جاري التحميل...")
                  : doctor.name}
              </div>
              <div className="dd-profile-role">{doctor.specialty}</div>
            </div>
          </div>

          <div className="dd-profile-fields">
            <div className="dd-profile-row">
              <label className="dd-profile-label">
                {t("doctor.field_name", "الاسم")}
              </label>
              <input
                className="dd-profile-input"
                value={doctor.name}
                onChange={handleChange("name")}
                readOnly
              />
            </div>

            <div className="dd-profile-row">
              <label className="dd-profile-label">
                {t("doctor.field_specialty", "التخصص")}
              </label>
              <input
                className="dd-profile-input"
                value={doctor.specialty}
                onChange={handleChange("specialty")}
                readOnly
              />
            </div>

            <div className="dd-profile-row">
              <label className="dd-profile-label">
                {t("doctor.field_phone", "رقم الهاتف")}
              </label>
              <input
                className="dd-profile-input"
                value={doctor.phone}
                onChange={handleChange("phone")}
              />
            </div>

            <div className="dd-profile-row">
              <label className="dd-profile-label">
                {t("doctor.field_email", "البريد الإلكتروني")}
              </label>
              <input
                className="dd-profile-input"
                value={doctor.email}
                onChange={handleChange("email")}
              />
            </div>
          </div>

          <div className="dd-profile-actions">
            <button
              type="button"
              className="dd-profile-save"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving
                ? t("doctor.saving", "جاري الحفظ...")
                : t("doctor.save_changes", "حفظ التغييرات")}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DoctorProfile;
