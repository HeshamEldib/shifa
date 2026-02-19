import React, { useState, useMemo } from "react";
import"./Setting.css"

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

function ToggleRow({ label, description, onChange }) {
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
          defaultChecked
          onChange={onChange}
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
  const labels = {
    minimal: "Minimal sharing",
    standard: "Standard",
    extended: "Extended medical collaboration",
  };

  const percent = level === "minimal" ? 20 : level === "standard" ? 55 : 85;

  return (
    <div style={{ marginTop: 12 }}>
      <div
        className="cc-row"
        style={{ marginBottom: 6, alignItems: "baseline" }}
      >
        <div className="cc-muted">Your Data Exposure Level</div>
        <div style={{ fontSize: 12, color: "#e5e7eb" }}>{labels[level]}</div>
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
        <span>Minimal</span>
        <span>Standard</span>
        <span>Extended</span>
      </div>
    </div>
  );
}

/* ========== Tabs Strip (index) ========== */

function TabsStrip({ tabs, activeId, onChange }) {
  return (
    <div
      className="cc-card"
      style={{
        marginBottom: 12,
        padding: 8,
      }}
    >
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
        Sections
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className="cc-btn ghost"
            onClick={() => onChange(t.id)}
            style={{
              fontSize: 11,
              padding: "6px 10px",
              borderColor:
                activeId === t.id
                  ? "rgba(34,211,238,0.8)"
                  : "rgba(148,163,184,0.3)",
              background:
                activeId === t.id
                  ? "rgba(34,211,238,0.12)"
                  : "rgba(7,10,26,0.35)",
            }}
          >
            {t.icon && <span style={{ marginRight: 6 }}>{t.icon}</span>}
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========== PATIENT SETTINGS ========== */

function PatientSettings({ onDirtyChange }) {
  const [activeTab, setActiveTab] = useState("profile");

  const [shareVisits, setShareVisits] = useState(true);
  const [shareLabs, setShareLabs] = useState(true);
  const [shareAllergyAlerts, setShareAllergyAlerts] = useState(true);

  const [reminderTiming, setReminderTiming] = useState("24h");
  const [reminderChannel, setReminderChannel] = useState("app");
  const [quietFrom] = useState("22:00");
  const [quietTo] = useState("08:00");
  const [recoveryMode, setRecoveryMode] = useState(false);

  // language & timezone state (تقدري تعدّلي الـ defaults لو حبيتي)
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
    { id: "profile", label: "Profile & basics", icon: "👤" },
    { id: "context", label: "Health context", icon: "🧬" },
    { id: "privacy", label: "Privacy & sharing", icon: "🛡️" },
    { id: "reminders", label: "Reminders & recovery", icon: "🔔" },
  ];

  let content = null;

  if (activeTab === "profile") {
    content = (
      <Section
        title="Account & profile"
        subtitle="Basic preferences for your patient account"
        icon="👤"
      >
        <SelectRow
          label="Preferred language"
          description="Used for SMS and email notifications."
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
          label="Time zone"
          description="Affects appointment reminders and calendar."
          options={[
            { value: "africa/cairo", label: "Africa/Cairo (UTC+2)" },
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
        title="Personal Health Context"
        subtitle="Help Shifaa understand your health background intelligently"
        icon="🧬"
      >
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
          This information is read-only here and comes from your medical
          record. You can control how Shifaa uses it with doctors.
        </div>

        <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
          <div className="cc-row">
            <span className="cc-muted">Chronic conditions</span>
            <span>Diabetes · Hypertension (example)</span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">Allergies summary</span>
            <span>Penicillin · NSAIDs (example)</span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">Pregnancy status</span>
            <span>Not pregnant (example)</span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">Blood type</span>
            <span>O+ (example)</span>
          </div>
          <div className="cc-row">
            <span className="cc-muted">Emergency contact</span>
            <span>Mother · +20 100 000 0000 (example)</span>
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
            label="Share allergy alerts with any new doctor automatically"
            description="Force allergy warnings in Smart Prescription, even if the doctor forgets to check history."
            onChange={markDirty}
          />
        </div>
      </Section>
    );
  } else if (activeTab === "privacy") {
    content = (
      <Section
        title="Privacy & data"
        subtitle="Control what your doctor can see"
        icon="🛡️"
      >
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
            <div className="cc-muted">
              Share past visits with new doctors
            </div>
            <div
              style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}
            >
              Allow new doctors to view previous encounters inside Shifaa.
            </div>
          </div>
          <label className="shf-toggle">
            <input
              type="checkbox"
              checked={shareVisits}
              onChange={(e) => {
                setShareVisits(e.target.checked);
                markDirty();
              }}
            />
            <span className="shf-toggle-track" />
            <span className="shf-toggle-thumb" />
          </label>
        </div>

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
            <div className="cc-muted">
              Share lab results automatically
            </div>
            <div
              style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}
            >
              Attach latest labs to future related appointments.
            </div>
          </div>
          <label className="shf-toggle">
            <input
              type="checkbox"
              checked={shareLabs}
              onChange={(e) => {
                setShareLabs(e.target.checked);
                markDirty();
              }}
            />
            <span className="shf-toggle-track" />
            <span className="shf-toggle-thumb" />
          </label>
        </div>

        <div
          className="cc-row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
          }}
        >
          <div style={{ maxWidth: "70%" }}>
            <div className="cc-muted">
              Share allergy alerts with any doctor
            </div>
            <div
              style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}
            >
              Force allergy warnings in Smart Prescription for all doctors.
            </div>
          </div>
          <label className="shf-toggle">
            <input
              type="checkbox"
              checked={shareAllergyAlerts}
              onChange={(e) => {
                setShareAllergyAlerts(e.target.checked);
                markDirty();
              }}
            />
            <span className="shf-toggle-track" />
            <span className="shf-toggle-thumb" />
          </label>
        </div>

        <DataExposureMeter level={exposureLevel} />
      </Section>
    );
  } else {
    // reminders
    content = (
      <>
        <Section
          title="Reminders & notifications"
          subtitle="How Shifaa keeps you updated as a patient"
          icon="🔔"
        >
          <SelectRow
            label="Reminder timing"
            description="How long before an appointment you prefer to be reminded."
            options={[
              { value: "24h", label: "24 hours before" },
              { value: "12h", label: "12 hours before" },
              { value: "2h", label: "2 hours before" },
            ]}
            onChange={(e) => {
              setReminderTiming(e.target.value);
              markDirty();
            }}
          />

          <SelectRow
            label="Reminder channel"
            description="Where to receive most reminders."
            options={[
              { value: "app", label: "In‑app only" },
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
              <div className="cc-muted">Quiet hours</div>
              <div
                style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}
              >
                Shifaa avoids sending non‑urgent reminders during these hours.
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
            label="Prescription updates"
            description="Notify when a doctor updates or renews a prescription."
            onChange={markDirty}
          />
          <ToggleRow
            label="Health tips & product updates"
            description="Occasional product tips and educational content."
            onChange={markDirty}
          />
        </Section>

        <Section
          title="Recovery Mode"
          subtitle="Increase support while you are actively recovering"
          icon="❤️"
        >
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
              <div className="cc-muted">Recovery Mode</div>
              <div
                style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}
              >
                When enabled, Shifaa increases reminders, surfaces daily tips,
                and focuses your dashboard on current treatment.
              </div>
            </div>
            <label className="shf-toggle">
              <input
                type="checkbox"
                checked={recoveryMode}
                onChange={(e) => {
                  setRecoveryMode(e.target.checked);
                  markDirty();
                }}
              />
              <span className="shf-toggle-track" />
              <span className="shf-toggle-thumb" />
            </label>
          </div>

          <ul
            style={{
              marginTop: 8,
              paddingLeft: 16,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            <li>Extra follow‑up reminders during treatment windows.</li>
            <li>Contextual health tips based on your condition.</li>
            <li>Dashboard highlights your active care plan.</li>
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

/* ========== DOCTOR SETTINGS (tabs) ========== */

function DoctorSettings({ onDirtyChange }) {
  const [activeTab, setActiveTab] = useState("workflow");

  const markDirty = () => onDirtyChange?.(true);

  const tabs = [
    { id: "workflow", label: "Workflow", icon: "🏥" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "safety", label: "Safety & AI", icon: "⚖️" },
    { id: "wellbeing", label: "Wellbeing", icon: "🌿" },
  ];

  let content = null;

  if (activeTab === "workflow") {
    content = (
      <>
        <Section
          title="Clinic preferences"
          subtitle="Defaults for your daily workflow"
          icon="🏥"
        >
          <SelectRow
            label="Default consultation length"
            description="Used for automatic scheduling blocks."
            options={[
              { value: "15", label: "15 minutes" },
              { value: "20", label: "20 minutes" },
              { value: "30", label: "30 minutes" },
            ]}
            onChange={markDirty}
          />
          <SelectRow
            label="Default view on login"
            description="Page that opens first when you sign in."
            options={[
              { value: "dashboard", label: "Doctor Dashboard" },
              { value: "appointments", label: "Today’s schedule" },
              { value: "patients", label: "Patient list" },
            ]}
            onChange={markDirty}
          />
        </Section>

        <Section
          title="Smart Workflow"
          subtitle="Automate repetitive clinical tasks"
          icon="⚙️"
        >
          <ToggleRow
            label="Auto‑generate follow‑up visit after each encounter"
            description="Create a suggested follow‑up X days after every completed visit."
            onChange={markDirty}
          />
          <ToggleRow
            label="Attach last labs automatically in prescriptions"
            description="Include the most recent related labs with new prescriptions."
            onChange={markDirty}
          />
          <ToggleRow
            label="Use templates for common diagnoses"
            description="Start with pre‑filled diagnosis + plan for frequent conditions."
            onChange={markDirty}
          />
        </Section>
      </>
    );
  } else if (activeTab === "notifications") {
    content = (
      <Section
        title="Notifications"
        subtitle="Signals that reach you as a doctor"
        icon="🔔"
      >
        <ToggleRow
          label="New booking alerts"
          description="When patients book or reschedule appointments."
          onChange={markDirty}
        />
        <ToggleRow
          label="Urgent queue alerts"
          description="Highlight emergency or high‑priority cases."
          onChange={markDirty}
        />
        <ToggleRow
          label="Lab result notifications"
          description="When new lab results arrive for your patients."
          onChange={markDirty}
        />
      </Section>
    );
  } else if (activeTab === "safety") {
    content = (
      <>
        <Section
          title="Risk sensitivity"
          subtitle="How strict Shifaa should be with clinical warnings"
          icon="⚖️"
        >
          <SelectRow
            label="Risk mode"
            description="Controls how many checks and warnings are shown."
            options={[
              { value: "conservative", label: "Conservative (more checks)" },
              { value: "balanced", label: "Balanced" },
              { value: "fast", label: "Fast (fewer prompts)" },
            ]}
            onChange={markDirty}
          />
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
            Conservative mode adds more allergy, interaction and dose checks.
            Fast mode reduces interruptions in high‑volume scenarios.
          </div>
        </Section>

        <Section
          title="Safety & prescribing"
          subtitle="Extra checks before issuing medication"
          icon="💊"
        >
          <ToggleRow
            label="Allergy conflict checks"
            description="Warn if prescribed medicine conflicts with recorded allergies."
            onChange={markDirty}
          />
          <ToggleRow
            label="High‑risk medicine confirmation"
            description="Require an extra confirmation for critical drugs."
            onChange={markDirty}
          />
        </Section>

        <Section
          title="AI assist level"
          subtitle="How much help you want from Smart Prescription"
          icon="🤖"
        >
          <SelectRow
            label="Default AI assistance"
            description="Choose how Smart Prescription participates in your work."
            options={[
              { value: "suggest_meds", label: "Suggest medicines only" },
              { value: "suggest_dose", label: "Suggest medicines + dosage" },
              { value: "full_ai", label: "Full AI support" },
              { value: "off", label: "AI off" },
            ]}
            minWidth={200}
            onChange={markDirty}
          />
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
            You can override this per‑patient during the prescription flow.
          </div>
        </Section>
      </>
    );
  } else {
    // wellbeing
    content = (
      <Section
        title="Doctor wellbeing"
        subtitle="Protect your time and focus"
        icon="🌿"
      >
        <ToggleRow
          label="Max patients per day alert"
          description="Get notified when your schedule crosses a safe threshold."
          onChange={markDirty}
        />
        <ToggleRow
          label="Break reminders"
          description="Gentle prompts to take a short break between long sessions."
          onChange={markDirty}
        />
        <ToggleRow
          label="Late hours warning"
          description="Highlight days where you are consistently working late."
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

/* ========== ADMIN SETTINGS (tabs) ========== */

function AdminSettings({ onDirtyChange }) {
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
    { id: "risk", label: "Risk & activity", icon: "📊" },
    { id: "roles", label: "Roles & access", icon: "🧩" },
    { id: "compliance", label: "Compliance", icon: "⚕️" },
    { id: "simulation", label: "Simulation", icon: "🚨" },
  ];

  let content = null;

  if (activeTab === "risk") {
    content = (
      <>
        <Section
          title="Risk index & activity"
          subtitle="Quick snapshot of how the system is behaving"
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
              <div className="cc-muted">System load</div>
              <div style={{ fontWeight: 600 }}>Medium</div>
            </div>
            <div>
              <div className="cc-muted">Alert rate</div>
              <div style={{ fontWeight: 600 }}>18 / hour</div>
            </div>
            <div>
              <div className="cc-muted">Failed logins</div>
              <div style={{ fontWeight: 600 }}>5 / hour</div>
            </div>
            <div>
              <div className="cc-muted">Avg waiting time</div>
              <div style={{ fontWeight: 600 }}>09:30 min</div>
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
            Mini risk graph placeholder – can be wired to real metrics later.
          </div>
        </Section>

        <Section
          title="Audit & security"
          subtitle="Monitoring and safety for the command center"
          icon="🛡️"
        >
          <ToggleRow
            label="Log all login attempts"
            description="Keep audit history of successful and failed logins."
            onChange={markDirty}
          />
          <ToggleRow
            label="Notify on unusual system load"
            description="Send alerts when risk index stays high for too long."
            onChange={markDirty}
          />
        </Section>
      </>
    );
  } else if (activeTab === "roles") {
    content = (
      <>
        <Section
          title="Role blueprints"
          subtitle="Design and reuse role templates across your organization"
          icon="🧩"
        >
          <div
            className="cc-row"
            style={{ padding: "6px 0", marginBottom: 4, fontSize: 12 }}
          >
            <div className="cc-muted">
              Create named role blueprints and reuse them for new clinics
              or sites.
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            Current role:{" "}
            <span style={{ color: "#e5e7eb" }}>{currentRoleName}</span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="cc-btn"
              type="button"
              onClick={() => {
                console.log("Save current as template (demo)", currentRoleName);
              }}
            >
              Save current as template
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
              Clone existing role
            </button>
            <button
              className="cc-btn ghost"
              type="button"
              onClick={() => {
                console.log("Compare two roles (demo)");
              }}
            >
              Compare two roles
            </button>
          </div>
        </Section>

        <Section
          title="Access & permissions"
          subtitle="High‑level control for roles inside Shifaa"
          icon="🔐"
        >
          <ToggleRow
            label="Allow doctors to export reports"
            description="Enable CSV export for their own patients and schedule."
            onChange={markDirty}
          />
          <ToggleRow
            label="Allow reception to edit bookings"
            description="Reception can move or cancel appointments for all doctors."
            onChange={markDirty}
          />
          <ToggleRow
            label="Require 2‑step approval for bulk actions"
            description="Extra confirmation for actions like ‘Approve all’."
            onChange={markDirty}
          />
        </Section>
      </>
    );
  } else if (activeTab === "compliance") {
    content = (
      <Section
        title="Medical compliance"
        subtitle="Enforce clinical rules across the platform"
        icon="⚕️"
      >
        <ToggleRow
          label="Enforce double signature for narcotics"
          description="Require a second approver for controlled substances."
          onChange={markDirty}
        />
        <ToggleRow
          label="Mandatory allergy check before prescribing"
          description="Block issuing a prescription until allergies are confirmed."
          onChange={markDirty}
        />
        <ToggleRow
          label="Force documentation before high‑risk prescriptions"
          description="Require a brief note before finalizing certain medications."
          onChange={markDirty}
        />
      </Section>
    );
  } else {
    content = (
      <Section
        title="Incident simulation"
        subtitle="Test how Shifaa behaves under stress before it happens"
        icon="🚨"
      >
        <div
          style={{
            fontSize: 12,
            color: "#9ca3af",
            marginBottom: 8,
          }}
        >
          Run a safe simulation of emergency load to see how response time,
          alerts and queues behave without affecting real data.
        </div>
        <button
          className="cc-btn"
          type="button"
          onClick={() => {
            console.log("Simulate emergency load (demo)");
          }}
        >
          Simulate emergency load
        </button>
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          After simulation, a short report will summarize system performance
          and bottlenecks.
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
  const isPatient = role === "Patient";
  const isDoctor = role === "Doctor";
  const isAdmin = role === "Admin";

  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [resetCounter, setResetCounter] = useState(0); // عشان نعمل remount

  const handleDirtyChange = (dirty) => {
    if (dirty) {
      setHasUnsaved(true);
    }
  };

  const handleReset = () => {
    // نخلي الكومبوننتس تتـre-mount فترجع لكل default state
    setResetCounter((c) => c + 1);

    setHasUnsaved((prev) => {
      if (!prev) {
        return true; // لو كانت Saved خليها Unsaved
      }
      return prev; // لو كانت Unsaved سيبها زي ما هي
    });
  };

  const handleSave = () => {
    // هنا لاحقاً هتحطي حفظ فعلي
    setHasUnsaved(false);
  };

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
              <div className="cc-brandSub">Settings</div>
            </div>
          </div>
        </div>

        <div className="cc-topRight">
          <button type="button" className="cc-btn ghost" onClick={onBack}>
            ← Back
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
          <div className="cc-cardTitle">{role} settings</div>
          <div className="cc-cardSub">
            Fine‑tune how Shifaa behaves for this profile.
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
            <Section title="General settings">
              <div className="cc-empty">
                Role not recognized. Using generic defaults.
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
            {hasUnsaved ? "Unsaved changes" : "All changes saved"}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="cc-btn ghost"
              type="button"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="cc-btn"
              type="button"
              onClick={handleSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
