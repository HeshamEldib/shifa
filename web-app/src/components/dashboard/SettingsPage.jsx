// src/components/SettingsPage.jsx
import React, { useState, useMemo } from "react";
import "./Seeting.css";
import { useTranslation } from "react-i18next";

/* ========== UI primitives ========== */

function Section({ title, subtitle, children, icon }) {
  return (
    <section className="cc-card" style={{ marginBottom: 16 }}>
      <div className="cc-cardHeadRow">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon && (
            <span style={{ fontSize: 18, opacity: 0.9 }}>
              {icon}
            </span>
          )}
          <div>
            <div className="cc-cardTitle">{title}</div>
            {subtitle && <div className="cc-cardSub">{subtitle}</div>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}

function ToggleRow({ label, description, onChange, checked }) {
  const [internalChecked, setInternalChecked] = useState(
    checked ?? true
  );

  const handleChange = (e) => {
    setInternalChecked(e.target.checked);
    onChange?.(e);
  };

  return (
    <div
      className="cc-row"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid rgba(30,64,175,0.35)",
      }}
    >
      <div style={{ maxWidth: "70%" }}>
        <div className="cc-muted">{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>

      <label className="shf-toggle">
        <input
          type="checkbox"
          checked={internalChecked}
          onChange={handleChange}
        />
        <span className="shf-toggle-track" />
        <span className="shf-toggle-thumb" />
      </label>
    </div>
  );
}

function SelectRow({ label, description, options, minWidth = 140, onChange }) {
  return (
    <div
      className="cc-row"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid rgba(30,64,175,0.35)",
      }}
    >
      <div style={{ maxWidth: "70%" }}>
        <div className="cc-muted">{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <select
        className="cc-select"
        style={{ minWidth }}
        onChange={onChange}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DataExposureMeter({ level }) {
  const { t } = useTranslation();
  const labels = {
    minimal: t("settings.data_exposure_minimal"),
    standard: t("settings.data_exposure_standard"),
    extended: t("settings.data_exposure_extended"),
  };

  const percent = level === "minimal" ? 20 : level === "standard" ? 55 : 85;

  return (
    <div style={{ marginTop: 12 }}>
      <div
        className="cc-row"
        style={{ marginBottom: 6, alignItems: "baseline" }}
      >
        <div className="cc-muted">
          {t("settings.data_exposure_title")}
        </div>
        <div style={{ fontSize: 12, color: "#e5e7eb" }}>
          {labels[level]}
        </div>
      </div>

      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "rgba(15,23,42,0.9)",
          border: "1px solid rgba(30,64,175,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 999,
            background:
              level === "minimal"
                ? "linear-gradient(90deg,#22c55e,#4ade80)"
                : level === "standard"
                ? "linear-gradient(90deg,#38bdf8,#3b82f6)"
                : "linear-gradient(90deg,#a855f7,#6366f1)",
            transition: "width 160ms ease",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#9ca3af",
        }}
      >
        <span>{t("settings.data_exposure_scale_minimal")}</span>
        <span>{t("settings.data_exposure_scale_standard")}</span>
        <span>{t("settings.data_exposure_scale_extended")}</span>
      </div>
    </div>
  );
}

/* ========== Tabs Strip ========== */

function TabsStrip({ tabs, activeId, onChange }) {
  const { t } = useTranslation();
  return (
    <div
      className="cc-card"
      style={{
        marginBottom: 12,
        padding: 8,
      }}
    >
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
        {t("settings.sections_label")}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tabs.map((tItem) => (
          <button
            key={tItem.id}
            type="button"
            className="cc-btn ghost"
            onClick={() => onChange(tItem.id)}
            style={{
              fontSize: 11,
              padding: "6px 10px",
              borderColor:
                activeId === tItem.id
                  ? "rgba(34,211,238,0.8)"
                  : "rgba(148,163,184,0.3)",
              background:
                activeId === tItem.id
                  ? "rgba(34,211,238,0.12)"
                  : "rgba(7,10,26,0.35)",
            }}
          >
            {tItem.icon && (
              <span style={{ marginRight: 6 }}>{tItem.icon}</span>
            )}
            {tItem.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========== PATIENT SETTINGS ========== */

function PatientSettings({ onDirtyChange }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");

  const [shareVisits, setShareVisits] = useState(true);
  const [shareLabs, setShareLabs] = useState(true);
  const [shareAllergyAlerts, setShareAllergyAlerts] = useState(true);

  const [reminderTiming, setReminderTiming] = useState("24h");
  const [reminderChannel, setReminderChannel] = useState("app");
  const [quietFrom] = useState("22:00");
  const [quietTo] = useState("08:00");
  const [recoveryMode, setRecoveryMode] = useState(false);

  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [timeZone, setTimeZone] = useState("africa/cairo");

  const markDirty = () => onDirtyChange?.(true);

  const exposureLevel = useMemo(() => {
    const togglesOn =
      (shareVisits ? 1 : 0) +
      (shareLabs ? 1 : 0) +
      (shareAllergyAlerts ? 1 : 0);
    if (togglesOn <= 1) return "minimal";
    if (togglesOn === 2) return "standard";
    return "extended";
  }, [shareVisits, shareLabs, shareAllergyAlerts]);

  const tabs = [
    { id: "profile", label: t("settings.patient_tab_profile"), icon: "👤" },
    { id: "context", label: t("settings.patient_tab_context"), icon: "🧬" },
    { id: "privacy", label: t("settings.patient_tab_privacy"), icon: "🛡️" },
    { id: "reminders", label: t("settings.patient_tab_reminders"), icon: "🔔" },
  ];

  let content = null;

  if (activeTab === "profile") {
    content = (
      <Section
        title={t("settings.patient_profile_title")}
        subtitle={t("settings.patient_profile_sub")}
        icon="👤"
      >
        <SelectRow
          label={t("settings.preferred_language_label")}
          description={t("settings.preferred_language_desc")}
          options={[
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
          ]}
          onChange={(e) => {
            setPreferredLanguage(e.target.value);
            markDirty();
          }}
        />
        <SelectRow
          label={t("settings.timezone_label")}
          description={t("settings.timezone_desc")}
          options={[
            {
              value: "africa/cairo",
              label: t("settings.timezone_cairo"),
            },
            { value: "utc", label: "UTC" },
          ]}
          onChange={(e) => {
            setTimeZone(e.target.value);
            markDirty();
          }}
        />
      </Section>
    );
  } else if (activeTab === "context") {
    content = (
      <Section
        title={t("settings.patient_context_title")}
        subtitle={t("settings.patient_context_sub")}
        icon="🧬"
      >
        <div
          style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}
        >
          {t("settings.patient_context_note")}
        </div>

        <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
          <div className="cc-row">
            <span className="cc-muted">
              {t("settings.context_chronic")}
            </span>
            <span>
              {t("settings.context_chronic_example")}
            </span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">
              {t("settings.context_allergies")}
            </span>
            <span>
              {t("settings.context_allergies_example")}
            </span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">
              {t("settings.context_pregnancy")}
            </span>
            <span>
              {t("settings.context_pregnancy_example")}
            </span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">
              {t("settings.context_blood_type")}
            </span>
            <span>
              {t("settings.context_blood_type_example")}
            </span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">
              {t("settings.context_emergency_contact")}
            </span>
            <span>
              {t("settings.context_emergency_contact_example")}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid rgba(30,64,175,0.35)",
          }}
        >
          <ToggleRow
            label={t("settings.context_share_allergy_label")}
            description={t("settings.context_share_allergy_desc")}
            onChange={markDirty}
          />
        </div>
      </Section>
    );
  } else if (activeTab === "privacy") {
    content = (
      <Section
        title={t("settings.patient_privacy_title")}
        subtitle={t("settings.patient_privacy_sub")}
        icon="🛡️"
      >
        <ToggleRow
          label={t("settings.patient_share_visits_label")}
          description={t("settings.patient_share_visits_desc")}
          checked={shareVisits}
          onChange={(e) => {
            setShareVisits(e.target.checked);
            markDirty();
          }}
        />

        <ToggleRow
          label={t("settings.patient_share_labs_label")}
          description={t("settings.patient_share_labs_desc")}
          checked={shareLabs}
          onChange={(e) => {
            setShareLabs(e.target.checked);
            markDirty();
          }}
        />

        <ToggleRow
          label={t("settings.patient_share_allergy_label")}
          description={t("settings.patient_share_allergy_desc")}
          checked={shareAllergyAlerts}
          onChange={(e) => {
            setShareAllergyAlerts(e.target.checked);
            markDirty();
          }}
        />

        <DataExposureMeter level={exposureLevel} />
      </Section>
    );
  } else {
    content = (
      <>
        <Section
          title={t("settings.patient_reminders_title")}
          subtitle={t("settings.patient_reminders_sub")}
          icon="🔔"
        >
          <SelectRow
            label={t("settings.reminder_timing_label")}
            description={t("settings.reminder_timing_desc")}
            options={[
              { value: "24h", label: t("settings.reminder_24h") },
              { value: "12h", label: t("settings.reminder_12h") },
              { value: "2h", label: t("settings.reminder_2h") },
            ]}
            onChange={(e) => {
              setReminderTiming(e.target.value);
              markDirty();
            }}
          />

          <SelectRow
            label={t("settings.reminder_channel_label")}
            description={t("settings.reminder_channel_desc")}
            options={[
              { value: "app", label: t("settings.reminder_channel_app") },
              { value: "sms", label: "SMS" },
              { value: "whatsapp", label: "WhatsApp" },
            ]}
            onChange={(e) => {
              setReminderChannel(e.target.value);
              markDirty();
            }}
          />

          <div
            className="cc-row"
            style={{
              padding: "8px 0",
              borderBottom: "1px solid rgba(30,64,175,0.35)",
            }}
          >
            <div>
              <div className="cc-muted">
                {t("settings.quiet_hours_label")}
              </div>
              <div
                style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}
              >
                {t("settings.quiet_hours_desc")}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                fontSize: 12,
                color: "#e5e7eb",
              }}
            >
              <span>{quietFrom}</span>
              <span>–</span>
              <span>{quietTo}</span>
            </div>
          </div>

          <ToggleRow
            label={t("settings.reminder_rx_updates_label")}
            description={t("settings.reminder_rx_updates_desc")}
            onChange={markDirty}
          />
          <ToggleRow
            label={t("settings.reminder_tips_label")}
            description={t("settings.reminder_tips_desc")}
            onChange={markDirty}
          />
        </Section>

        <Section
          title={t("settings.recovery_title")}
          subtitle={t("settings.recovery_sub")}
          icon="❤️"
        >
          <ToggleRow
            label={t("settings.recovery_label")}
            description={t("settings.recovery_desc")}
            checked={recoveryMode}
            onChange={(e) => {
              setRecoveryMode(e.target.checked);
              markDirty();
            }}
          />

          <ul
            style={{
              marginTop: 8,
              paddingLeft: 16,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            <li>{t("settings.recovery_benefit_followup")}</li>
            <li>{t("settings.recovery_benefit_tips")}</li>
            <li>{t("settings.recovery_benefit_dashboard")}</li>
          </ul>
        </Section>
      </>
    );
  }

  return (
    <>
      <TabsStrip tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      {content}
    </>
  );
}

/* ========== DOCTOR SETTINGS ========== */

function DoctorSettings({ onDirtyChange }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("workflow");

  const markDirty = () => onDirtyChange?.(true);

  const tabs = [
    { id: "workflow", label: t("settings.doctor_tab_workflow"), icon: "🏥" },
    {
      id: "notifications",
      label: t("settings.doctor_tab_notifications"),
      icon: "🔔",
    },
    { id: "safety", label: t("settings.doctor_tab_safety"), icon: "⚖️" },
    { id: "wellbeing", label: t("settings.doctor_tab_wellbeing"), icon: "🌿" },
  ];

  let content = null;

  if (activeTab === "workflow") {
    content = (
      <>
        <Section
          title={t("settings.doctor_clinic_title")}
          subtitle={t("settings.doctor_clinic_sub")}
          icon="🏥"
        >
          <SelectRow
            label={t("settings.doctor_default_length_label")}
            description={t("settings.doctor_default_length_desc")}
            options={[
              { value: "15", label: t("settings.doctor_15min") },
              { value: "20", label: t("settings.doctor_20min") },
              { value: "30", label: t("settings.doctor_30min") },
            ]}
            onChange={markDirty}
          />
          <SelectRow
            label={t("settings.doctor_default_view_label")}
            description={t("settings.doctor_default_view_desc")}
            options={[
              {
                value: "dashboard",
                label: t("settings.doctor_view_dashboard"),
              },
              {
                value: "appointments",
                label: t("settings.doctor_view_today"),
              },
              {
                value: "patients",
                label: t("settings.doctor_view_patients"),
              },
            ]}
            onChange={markDirty}
          />
        </Section>

        <Section
          title={t("settings.doctor_workflow_title")}
          subtitle={t("settings.doctor_workflow_sub")}
          icon="⚙️"
        >
          <ToggleRow
            label={t("settings.doctor_auto_followup_label")}
            description={t("settings.doctor_auto_followup_desc")}
            onChange={markDirty}
          />
          <ToggleRow
            label={t("settings.doctor_attach_labs_label")}
            description={t("settings.doctor_attach_labs_desc")}
            onChange={markDirty}
          />
          <ToggleRow
            label={t("settings.doctor_templates_label")}
            description={t("settings.doctor_templates_desc")}
            onChange={markDirty}
          />
        </Section>
      </>
    );
  } else if (activeTab === "notifications") {
    content = (
      <Section
        title={t("settings.doctor_notifications_title")}
        subtitle={t("settings.doctor_notifications_sub")}
        icon="🔔"
      >
        <ToggleRow
          label={t("settings.doctor_new_booking_label")}
          description={t("settings.doctor_new_booking_desc")}
          onChange={markDirty}
        />
        <ToggleRow
          label={t("settings.doctor_urgent_queue_label")}
          description={t("settings.doctor_urgent_queue_desc")}
          onChange={markDirty}
        />
        <ToggleRow
          label={t("settings.doctor_lab_results_label")}
          description={t("settings.doctor_lab_results_desc")}
          onChange={markDirty}
        />
      </Section>
    );
  } else if (activeTab === "safety") {
    content = (
      <>
        <Section
          title={t("settings.doctor_risk_title")}
          subtitle={t("settings.doctor_risk_sub")}
          icon="⚖️"
        >
          <SelectRow
            label={t("settings.doctor_risk_mode_label")}
            description={t("settings.doctor_risk_mode_desc")}
            options={[
              {
                value: "conservative",
                label: t("settings.doctor_risk_conservative"),
              },
              { value: "balanced", label: t("settings.doctor_risk_balanced") },
              { value: "fast", label: t("settings.doctor_risk_fast") },
            ]}
            onChange={markDirty}
          />
          <div
            style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}
          >
            {t("settings.doctor_risk_note")}
          </div>
        </Section>

        <Section
          title={t("settings.doctor_safety_title")}
          subtitle={t("settings.doctor_safety_sub")}
          icon="💊"
        >
          <ToggleRow
            label={t("settings.doctor_allergy_check_label")}
            description={t("settings.doctor_allergy_check_desc")}
            onChange={markDirty}
          />
          <ToggleRow
            label={t("settings.doctor_high_risk_label")}
            description={t("settings.doctor_high_risk_desc")}
            onChange={markDirty}
          />
        </Section>

        <Section
          title={t("settings.doctor_ai_title")}
          subtitle={t("settings.doctor_ai_sub")}
          icon="🤖"
        >
          <SelectRow
            label={t("settings.doctor_ai_default_label")}
            description={t("settings.doctor_ai_default_desc")}
            options={[
              {
                value: "suggest_meds",
                label: t("settings.doctor_ai_suggest_meds"),
              },
              {
                value: "suggest_dose",
                label: t("settings.doctor_ai_suggest_dose"),
              },
              { value: "full_ai", label: t("settings.doctor_ai_full") },
              { value: "off", label: t("settings.doctor_ai_off") },
            ]}
            minWidth={200}
            onChange={markDirty}
          />
          <div
            style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}
          >
            {t("settings.doctor_ai_note")}
          </div>
        </Section>
      </>
    );
  } else {
    content = (
      <Section
        title={t("settings.doctor_wellbeing_title")}
        subtitle={t("settings.doctor_wellbeing_sub")}
        icon="🌿"
      >
        <ToggleRow
          label={t("settings.doctor_max_patients_label")}
          description={t("settings.doctor_max_patients_desc")}
          onChange={markDirty}
        />
        <ToggleRow
          label={t("settings.doctor_breaks_label")}
          description={t("settings.doctor_breaks_desc")}
          onChange={markDirty}
        />
        <ToggleRow
          label={t("settings.doctor_late_hours_label")}
          description={t("settings.doctor_late_hours_desc")}
          onChange={markDirty}
        />
      </Section>
    );
  }

  return (
    <>
      <TabsStrip tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      {content}
    </>
  );
}

/* ========== ADMIN SETTINGS ========== */

function AdminSettings({ onDirtyChange }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("risk");
  const [currentRoleName, setCurrentRoleName] = useState("Admin");
  const [dirty, setDirty] = useState(false);

  const markDirty = () => {
    if (!dirty) {
      setDirty(true);
      onDirtyChange?.(true);
    }
  };

  const tabs = [
    { id: "risk", label: t("settings.admin_tab_risk"), icon: "📊" },
    { id: "roles", label: t("settings.admin_tab_roles"), icon: "🧩" },
    {
      id: "compliance",
      label: t("settings.admin_tab_compliance"),
      icon: "⚕️",
    },
    {
      id: "simulation",
      label: t("settings.admin_tab_simulation"),
      icon: "🚨",
    },
  ];

  let content = null;

  if (activeTab === "risk") {
    content = (
      <>
        <Section
          title={t("settings.admin_risk_title")}
          subtitle={t("settings.admin_risk_sub")}
          icon="📊"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 8,
              fontSize: 12,
            }}
          >
            <div>
              <div className="cc-muted">
                {t("settings.admin_system_load_label")}
              </div>
              <div style={{ fontWeight: 600 }}>
                {t("settings.admin_system_load_value")}
              </div>
            </div>
            <div>
              <div className="cc-muted">
                {t("settings.admin_alert_rate_label")}
              </div>
              <div style={{ fontWeight: 600 }}>
                {t("settings.admin_alert_rate_value")}
              </div>
            </div>
            <div>
              <div className="cc-muted">
                {t("settings.admin_failed_logins_label")}
              </div>
              <div style={{ fontWeight: 600 }}>
                {t("settings.admin_failed_logins_value")}
              </div>
            </div>
            <div>
              <div className="cc-muted">
                {t("settings.admin_waiting_time_label")}
              </div>
              <div style={{ fontWeight: 600 }}>
                {t("settings.admin_waiting_time_value")}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              height: 80,
              borderRadius: 10,
              border: "1px dashed rgba(30,64,175,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            {t("settings.admin_risk_graph_placeholder")}
          </div>
        </Section>

        <Section
          title={t("settings.admin_audit_title")}
          subtitle={t("settings.admin_audit_sub")}
          icon="🛡️"
        >
          <ToggleRow
            label={t("settings.admin_log_logins_label")}
            description={t("settings.admin_log_logins_desc")}
            onChange={markDirty}
          />
          <ToggleRow
            label={t("settings.admin_unusual_load_label")}
            description={t("settings.admin_unusual_load_desc")}
            onChange={markDirty}
          />
        </Section>
      </>
    );
  } else if (activeTab === "roles") {
    content = (
      <>
        <Section
          title={t("settings.admin_roles_title")}
          subtitle={t("settings.admin_roles_sub")}
          icon="🧩"
        >
          <div
            className="cc-row"
            style={{ padding: "6px 0", marginBottom: 4, fontSize: 12 }}
          >
            <div className="cc-muted">
              {t("settings.admin_roles_intro")}
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            {t("settings.admin_current_role")}{" "}
            <span style={{ color: "#e5e7eb" }}>
              {currentRoleName}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="cc-btn"
              type="button"
              onClick={() => {
                console.log(
                  "Save current as template (demo)",
                  currentRoleName
                );
              }}
            >
              {t("settings.admin_save_template")}
            </button>
            <button
              className="cc-btn ghost"
              type="button"
              onClick={() => {
                setCurrentRoleName((prev) => {
                  if (prev.endsWith(" (cloned)")) {
                    return prev;
                  }
                  return prev + " (cloned)";
                });
                markDirty();
              }}
            >
              {t("settings.admin_clone_role")}
            </button>
            <button
              className="cc-btn ghost"
              type="button"
              onClick={() => {
                console.log("Compare two roles (demo)");
              }}
            >
              {t("settings.admin_compare_roles")}
            </button>
          </div>
        </Section>

        <Section
          title={t("settings.admin_access_title")}
          subtitle={t("settings.admin_access_sub")}
          icon="🔐"
        >
          <ToggleRow
            label={t("settings.admin_export_reports_label")}
            description={t("settings.admin_export_reports_desc")}
            onChange={markDirty}
          />
          <ToggleRow
            label={t("settings.admin_reception_edit_label")}
            description={t("settings.admin_reception_edit_desc")}
            onChange={markDirty}
          />
          <ToggleRow
            label={t("settings.admin_bulk_approval_label")}
            description={t("settings.admin_bulk_approval_desc")}
            onChange={markDirty}
          />
        </Section>
      </>
    );
  } else if (activeTab === "compliance") {
    content = (
      <Section
        title={t("settings.admin_compliance_title")}
        subtitle={t("settings.admin_compliance_sub")}
        icon="⚕️"
      >
        <ToggleRow
          label={t("settings.admin_narcotics_label")}
          description={t("settings.admin_narcotics_desc")}
          onChange={markDirty}
        />
        <ToggleRow
          label={t("settings.admin_mandatory_allergy_label")}
          description={t("settings.admin_mandatory_allergy_desc")}
          onChange={markDirty}
        />
        <ToggleRow
          label={t("settings.admin_highrisk_doc_label")}
          description={t("settings.admin_highrisk_doc_desc")}
          onChange={markDirty}
        />
      </Section>
    );
  } else {
    content = (
      <Section
        title={t("settings.admin_simulation_title")}
        subtitle={t("settings.admin_simulation_sub")}
        icon="🚨"
      >
        <div
          style={{
            fontSize: 12,
            color: "#9ca3af",
            marginBottom: 8,
          }}
        >
          {t("settings.admin_simulation_text")}
        </div>
        <button
          className="cc-btn"
          type="button"
          onClick={() => {
            console.log("Simulate emergency load (demo)");
          }}
        >
          {t("settings.admin_simulation_btn")}
        </button>
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          {t("settings.admin_simulation_after")}
        </div>
      </Section>
    );
  }

  return (
    <>
      <TabsStrip tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      {content}
    </>
  );
}

/* ========== MAIN SETTINGS PAGE ========== */

export default function SettingsPage({ role = "Patient", onBack }) {
  const { t } = useTranslation();

  // مهم: role يفضل يفضل كود ثابت من الأب: "Patient" / "Doctor" / "Admin"
  const isPatient = role === "Patient";
  const isDoctor = role === "Doctor";
  const isAdmin = role === "Admin";

  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  const handleDirtyChange = (dirty) => {
    if (dirty) {
      setHasUnsaved(true);
    }
  };

  const handleReset = () => {
    setResetCounter((c) => c + 1);
    setHasUnsaved((prev) => (prev ? prev : true));
  };

  const handleSave = () => {
    setHasUnsaved(false);
  };

  // label للعرض فقط (يُترجم)
  const roleLabel =
    role === "Patient"
      ? t("settings.role_patient")
      : role === "Doctor"
      ? t("settings.role_doctor")
      : role === "Admin"
      ? t("settings.role_admin")
      : role;

  return (
    <div
      className="cc-root shf-settings"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="cc-ambient" aria-hidden="true" />

      <header
        className="cc-top"
        style={{
          borderBottom: "1px solid rgba(30,64,175,0.7)",
          padding: "14px 20px",
        }}
      >
        <div className="cc-topLeft">
          <div className="cc-brand">
            <div className="cc-brandMark">S</div>
            <div className="cc-brandText">
              <div className="cc-brandName">Shifaa</div>
              <div className="cc-brandSub">
                {t("settings.page_title")}
              </div>
            </div>
          </div>
        </div>

        <div className="cc-topRight">
          <button
            type="button"
            className="cc-btn ghost"
            onClick={onBack}
          >
            ← {t("settings.back")}
          </button>
        </div>
      </header>

      <main
        className="cc-main"
        style={{
          padding: 20,
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div className="cc-cardTitle">
            {t("settings.role_settings_title", { role: roleLabel })}
          </div>
          <div className="cc-cardSub">
            {t("settings.role_settings_sub")}
          </div>
        </div>

        <div className="cc-content">
          {isPatient && (
            <PatientSettings
              key={`patient-${resetCounter}`}
              onDirtyChange={handleDirtyChange}
            />
          )}
          {isDoctor && (
            <DoctorSettings
              key={`doctor-${resetCounter}`}
              onDirtyChange={handleDirtyChange}
            />
          )}
          {isAdmin && (
            <AdminSettings
              key={`admin-${resetCounter}`}
              onDirtyChange={handleDirtyChange}
            />
          )}

          {!isPatient && !isDoctor && !isAdmin && (
            <Section title={t("settings.general_title")}>
              <div className="cc-empty">
                {t("settings.general_unknown_role")}
              </div>
            </Section>
          )}
        </div>

        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: "1px solid rgba(30,64,175,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: hasUnsaved ? "#f97373" : "#9ca3af",
            }}
          >
            {hasUnsaved
              ? t("settings.status_unsaved")
              : t("settings.status_saved")}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="cc-btn ghost"
              type="button"
              onClick={handleReset}
            >
              {t("settings.reset_btn")}
            </button>
            <button
              className="cc-btn"
              type="button"
              onClick={handleSave}
            >
              {t("settings.save_btn")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
