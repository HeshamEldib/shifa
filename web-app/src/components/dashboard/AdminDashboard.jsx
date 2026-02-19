import React, { useEffect, useMemo, useRef, useState } from "react";
import "./AdminDashboard.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function formatPct(n) {
  const sign = n >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(n)}%`;
}

function makeId(prefix = "ID") {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const cls =
    s === "completed" || s === "confirmed" || s === "active"
      ? "cc-pill cc-pill-ok"
      : s === "pending"
      ? "cc-pill cc-pill-warn"
      : s === "urgent" || s === "cancelled" || s === "inactive"
      ? "cc-pill cc-pill-bad"
      : "cc-pill";
  return <span className={cls}>{status}</span>;
}

function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cc-modalWrap" role="dialog" aria-modal="true">
      <div className="cc-modalBackdrop" onClick={onClose} />
      <div className="cc-modal">
        <div className="cc-modalHead">
          <div className="cc-modalTitle">{title}</div>
          <button
            className="cc-iconBtn"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="cc-modalBody">{children}</div>
      </div>
    </div>
  );
}

function Segmented({ value, onChange, items }) {
  return (
    <div className="cc-seg">
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          className={value === it.value ? "cc-segBtn is-active" : "cc-segBtn"}
          onClick={() => onChange?.(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

// Seeded random (stable “behavior map” per mode)
function seeded(seed) {
  let x = seed % 2147483647;
  if (x <= 0) x += 2147483646;
  return () => (x = (x * 16807) % 2147483647) / 2147483647;
}

export default function AdminDashboard({ onLogout, onOpenSettings }) {
  const [tab, setTab] = useState("overview"); // overview | patients | doctors | appointments | reports
  const [timeMode, setTimeMode] = useState("now"); // past | now | future

  const [notifOpen, setNotifOpen] = useState(false);

  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const [openAddPatient, setOpenAddPatient] = useState(false);
  const [openAddDoctor, setOpenAddDoctor] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);

  const [patients, setPatients] = useState([
    {
      id: "P-1001",
      name: "Mona Ali",
      email: "mona@mail.com",
      phone: "01000000001",
      createdAt: "2026-02-10",
    },
    {
      id: "P-1002",
      name: "John Doe",
      email: "john@mail.com",
      phone: "01000000002",
      createdAt: "2026-02-11",
    },
    {
      id: "P-1003",
      name: "Rana Ali",
      email: "rana@mail.com",
      phone: "01000000003",
      createdAt: "2026-02-12",
    },
  ]);

  const [doctors, setDoctors] = useState([
    {
      id: "D-2001",
      name: "Dr. Ahmed",
      specialty: "Cardiology",
      status: "Active",
      createdAt: "2026-02-01",
    },
    {
      id: "D-2002",
      name: "Dr. Sara",
      specialty: "Dermatology",
      status: "Inactive",
      createdAt: "2026-02-05",
    },
    {
      id: "D-2003",
      name: "Dr. Omar",
      specialty: "Internal Medicine",
      status: "Active",
      createdAt: "2026-02-07",
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: "A-3001",
      patient: "Mona Ali",
      doctor: "Dr. Ahmed",
      time: "2026-02-13 10:00",
      status: "Pending",
    },
    {
      id: "A-3002",
      patient: "John Doe",
      doctor: "Dr. Sara",
      time: "2026-02-13 12:00",
      status: "Confirmed",
    },
    {
      id: "A-3003",
      patient: "Rana Ali",
      doctor: "Dr. Omar",
      time: "2026-02-14 18:30",
      status: "Pending",
    },
  ]);

  const [activity, setActivity] = useState([
    {
      id: "L-1",
      activity: "New doctor registered",
      user: "Dr. Ahmed",
      time: "2 hours ago",
      status: "Completed",
      routeHint: "doctors",
    },
    {
      id: "L-2",
      activity: "Appointment created",
      user: "Patient Mona",
      time: "1 hour ago",
      status: "Pending",
      routeHint: "appointments",
    },
    {
      id: "L-3",
      activity: "New lab result added",
      user: "Patient John",
      time: "20 minutes ago",
      status: "Urgent",
      routeHint: "patients",
    },
  ]);

  const pendingApprovalsNow = useMemo(() => {
    const pendingAppts = appointments.filter(
      (a) => String(a.status).toLowerCase() === "pending"
    ).length;
    const inactiveDoctors = doctors.filter(
      (d) => String(d.status).toLowerCase() !== "active"
    ).length;
    return pendingAppts + inactiveDoctors;
  }, [appointments, doctors]);

  const timeFrames = useMemo(() => {
    const nowStats = {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      todayAppointments: appointments.length,
      pendingApprovals: pendingApprovalsNow,
    };

    const pastStats = {
      totalPatients: Math.max(1, Math.round(nowStats.totalPatients * 0.92)),
      totalDoctors: Math.max(1, Math.round(nowStats.totalDoctors * 0.95)),
      todayAppointments: Math.max(
        1,
        Math.round(nowStats.todayAppointments * 0.84)
      ),
      pendingApprovals: Math.max(
        1,
        Math.round(nowStats.pendingApprovals * 1.15)
      ),
    };

    const futureStats = {
      totalPatients: Math.max(1, Math.round(nowStats.totalPatients * 1.08)),
      totalDoctors: Math.max(1, Math.round(nowStats.totalDoctors * 1.03)),
      todayAppointments: Math.max(
        1,
        Math.round(nowStats.todayAppointments * 1.22)
      ),
      pendingApprovals: Math.max(
        1,
        Math.round(nowStats.pendingApprovals * 1.35)
      ),
    };

    return {
      past: {
        label: "Last week",
        stats: pastStats,
        change: { patients: +3, doctors: +1, appts: -8, approvals: +12 },
        pulse: { status: "Stable", liveUsers: 146, responseMs: 980, risk: 34 },
        insights: [
          "Approvals backlog was higher than usual.",
          "Appointments dipped on weekdays.",
          "Patient activity peaked around 8 PM.",
        ],
        suggestions: [
          "Approve pending doctors to reduce load.",
          "Enable extra evening slots (7–9 PM).",
          "Send reminders to no-show patients.",
        ],
      },
      now: {
        label: "Now",
        stats: nowStats,
        change: { patients: +8, doctors: +4, appts: +12, approvals: -6 },
        pulse: { status: "Stable", liveUsers: 214, responseMs: 820, risk: 22 },
        insights: [
          "Appointments increased by 18% this week.",
          "3 doctors have low availability.",
          "High patient activity between 7–9 PM.",
        ],
        suggestions: [
          "Add 2 doctors to evening shift.",
          "Review pending appointments to avoid overload.",
          "Notify patients with overdue follow-ups.",
        ],
      },
      future: {
        label: "Next week",
        stats: futureStats,
        change: { patients: +11, doctors: +3, appts: +24, approvals: +18 },
        pulse: { status: "Watch", liveUsers: 312, responseMs: 1180, risk: 56 },
        insights: [
          "Expected spike in bookings near 8 PM.",
          "Approvals may exceed safe threshold.",
          "Response time risk increases if load stays high.",
        ],
        suggestions: [
          "Approve pending items before peak hours.",
          "Add overflow slots + triage rules.",
          "Enable system warning notifications.",
        ],
      },
    };
  }, [
    patients.length,
    doctors.length,
    appointments.length,
    pendingApprovalsNow,
  ]);

  const frame = timeFrames[timeMode];

  const heat = useMemo(() => {
    const seedBase = timeMode === "past" ? 42 : timeMode === "now" ? 77 : 120;
    const rand = seeded(seedBase);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const v = rand();
      const shaped = Math.pow(v, timeMode === "future" ? 0.65 : 0.85);
      cells.push(shaped);
    }
    return cells;
  }, [timeMode]);

  const searchIndex = useMemo(() => {
    const toItem = (type, obj, title, meta, goToTab) => ({
      id: `${type}-${obj.id || title}`,
      type,
      title,
      meta,
      onPick: () => {
        setTab(goToTab);
        setSearchOpen(false);
        setNotifOpen(false);
      },
    });

    const items = [];
    patients.forEach((p) =>
      items.push(toItem("Patient", p, p.name, p.email, "patients"))
    );
    doctors.forEach((d) =>
      items.push(toItem("Doctor", d, d.name, d.specialty, "doctors"))
    );
    appointments.forEach((a) =>
      items.push(
        toItem(
          "Appointment",
          a,
          `${a.patient} → ${a.doctor}`,
          `${a.time} · ${a.status}`,
          "appointments"
        )
      )
    );
    return items;
  }, [patients, doctors, appointments]);

  const suggestions = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return searchIndex
      .filter(
        (it) =>
          it.title.toLowerCase().includes(s) ||
          (it.meta || "").toLowerCase().includes(s) ||
          it.type.toLowerCase().includes(s)
      )
      .slice(0, 8);
  }, [q, searchIndex]);

  useEffect(() => {
    const onDoc = (e) => {
      const el = searchRef.current;
      if (el && !el.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pushActivity = (entry) => {
    setActivity((prev) => [
      { id: makeId("L"), time: "Just now", ...entry },
      ...prev,
    ]);
  };

  const handleAddPatient = (payload) => {
    const p = {
      id: makeId("P"),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPatients((prev) => [p, ...prev]);
    pushActivity({
      activity: "New patient added",
      user: payload.name,
      status: "Completed",
      routeHint: "patients",
    });
    setOpenAddPatient(false);
    setTab("patients");
  };

  const handleAddDoctor = (payload) => {
    const d = {
      id: makeId("D"),
      name: payload.name.startsWith("Dr.")
        ? payload.name
        : `Dr. ${payload.name}`,
      specialty: payload.specialty,
      status: "Active",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setDoctors((prev) => [d, ...prev]);
    pushActivity({
      activity: "New doctor added",
      user: d.name,
      status: "Completed",
      routeHint: "doctors",
    });
    setOpenAddDoctor(false);
    setTab("doctors");
  };

  const handleChangeAppointmentStatus = (id, nextStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
    pushActivity({
      activity: "Appointment status updated",
      user: id,
      status:
        nextStatus === "Confirmed"
          ? "Completed"
          : nextStatus === "Pending"
          ? "Pending"
          : "Urgent",
      routeHint: "appointments",
    });
  };

  const approveAllPending = () => {
    setAppointments((prev) =>
      prev.map((a) =>
        String(a.status).toLowerCase() === "pending"
          ? { ...a, status: "Confirmed" }
          : a
      )
    );
    setDoctors((prev) =>
      prev.map((d) =>
        String(d.status).toLowerCase() !== "active"
          ? { ...d, status: "Active" }
          : d
      )
    );
    pushActivity({
      activity: "Bulk approvals executed",
      user: "System",
      status: "Completed",
      routeHint: "overview",
    });
    setOpenApprove(false);
  };

  const statCards = useMemo(() => {
    const s = frame.stats;
    const targets = {
      totalPatients: Math.max(10, s.totalPatients + 10),
      totalDoctors: Math.max(5, s.totalDoctors + 3),
      todayAppointments: Math.max(5, s.todayAppointments + 6),
      pendingApprovals: Math.max(
        5,
        Math.max(8, s.pendingApprovals)
      ),
    };
    return [
      {
        key: "totalPatients",
        title: "Total Patients",
        value: s.totalPatients,
        delta: frame.change.patients,
        icon: "👥",
        fill: clamp(
          Math.round(
            (s.totalPatients / targets.totalPatients) * 100
          ),
          8,
          98
        ),
        tone: "cyan",
      },
      {
        key: "totalDoctors",
        title: "Total Doctors",
        value: s.totalDoctors,
        delta: frame.change.doctors,
        icon: "🩺",
        fill: clamp(
          Math.round(
            (s.totalDoctors / targets.totalDoctors) * 100
          ),
          8,
          98
        ),
        tone: "violet",
      },
      {
        key: "todayAppointments",
        title: "Today Appointments",
        value: s.todayAppointments,
        delta: frame.change.appts,
        icon: "📅",
        fill: clamp(
          Math.round(
            (s.todayAppointments /
              targets.todayAppointments) *
              100
          ),
          8,
          98
        ),
        tone: "blue",
      },
      {
        key: "pendingApprovals",
        title: "Pending Approvals",
        value: s.pendingApprovals,
        delta: frame.change.approvals,
        icon: "⏳",
        fill: clamp(
          Math.round(
            (Math.min(
              s.pendingApprovals,
              targets.pendingApprovals
            ) /
              targets.pendingApprovals) *
              100
          ),
          8,
          98
        ),
        tone: s.pendingApprovals > 6 ? "amber" : "green",
      },
    ];
  }, [frame]);

  const risk = frame.pulse.risk;
  const riskLabel = risk < 30 ? "Low" : risk < 60 ? "Medium" : "High";

  const notifications = useMemo(() => {
    const pend = appointments.filter(
      (a) => String(a.status).toLowerCase() === "pending"
    ).length;
    const inactive = doctors.filter(
      (d) => String(d.status).toLowerCase() !== "active"
    ).length;
    const urgent = activity.filter(
      (x) => String(x.status).toLowerCase() === "urgent"
    ).length;

    return [
      {
        id: "n1",
        title: "Pending appointments",
        meta: `${pend} pending`,
        tone: pend ? "warn" : "ok",
      },
      {
        id: "n2",
        title: "Doctor availability",
        meta: `${inactive} inactive`,
        tone: inactive ? "warn" : "ok",
      },
      {
        id: "n3",
        title: "Urgent activity",
        meta: `${urgent} urgent`,
        tone: urgent ? "bad" : "ok",
      },
    ];
  }, [appointments, doctors, activity]);

  const notifCount = useMemo(
    () => notifications.filter((n) => n.tone !== "ok").length,
    [notifications]
  );

  const filteredPatients = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return patients;
    return patients.filter((p) =>
      (p.name + " " + p.email + " " + p.phone)
        .toLowerCase()
        .includes(s)
    );
  }, [patients, q]);

  const filteredDoctors = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return doctors;
    return doctors.filter((d) =>
      (d.name + " " + d.specialty + " " + d.status)
        .toLowerCase()
        .includes(s)
    );
  }, [doctors, q]);

  const filteredAppointments = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return appointments;
    return appointments.filter((a) =>
      (a.patient + " " + a.doctor + " " + a.time + " " + a.status)
        .toLowerCase()
        .includes(s)
    );
  }, [appointments, q]);

  return (
    <div className="cc-root">
      <div className="cc-ambient" aria-hidden="true" />

      <aside className="cc-side">
        <div className="cc-brand">
          <div className="cc-brandMark">S</div>
          <div className="cc-brandText">
            <div className="cc-brandName">Shifaa</div>
            <div className="cc-brandSub">Command Center</div>
          </div>
        </div>

        <nav className="cc-nav">
          <button
            type="button"
            className={
              tab === "overview" ? "cc-navItem is-active" : "cc-navItem"
            }
            onClick={() => setTab("overview")}
          >
            <span className="cc-navIcon">📡</span> Overview
          </button>
          <button
            type="button"
            className={
              tab === "patients" ? "cc-navItem is-active" : "cc-navItem"
            }
            onClick={() => setTab("patients")}
          >
            <span className="cc-navIcon">👥</span> Patients
          </button>
          <button
            type="button"
            className={
              tab === "doctors" ? "cc-navItem is-active" : "cc-navItem"
            }
            onClick={() => setTab("doctors")}
          >
            <span className="cc-navIcon">🩺</span> Doctors
          </button>
          <button
            type="button"
            className={
              tab === "appointments"
                ? "cc-navItem is-active"
                : "cc-navItem"
            }
            onClick={() => setTab("appointments")}
          >
            <span className="cc-navIcon">📅</span> Appointments
          </button>
          <button
            type="button"
            className={
              tab === "reports" ? "cc-navItem is-active" : "cc-navItem"
            }
            onClick={() => setTab("reports")}
          >
            <span className="cc-navIcon">📈</span> Reports
          </button>
          {/* Settings تفتح SettingsPage العامة */}
          <button
            type="button"
            className="cc-navItem"
            onClick={onOpenSettings}
          >
            <span className="cc-navIcon">⚙️</span> Settings
          </button>
        </nav>

        <div className="cc-sideFoot">
          <button
            type="button"
            className="cc-danger"
            onClick={onLogout}
          >
            Logout
          </button>
          <div className="cc-miniNote">
            Time Warp: <b>{frame.label}</b>
          </div>
        </div>
      </aside>

      <main className="cc-main">
        <header className="cc-top">
          <div className="cc-topLeft" ref={searchRef}>
            <div className="cc-searchWrap">
              <input
                className="cc-search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search patients, doctors, appointments..."
              />
              <div className="cc-searchHint">
                Try: “Rana”, “Dr. Ahmed”, “Pending”, “2026-02-13”
              </div>

              {searchOpen && suggestions.length > 0 && (
                <div className="cc-suggest">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      className="cc-suggestItem"
                      type="button"
                      onClick={s.onPick}
                    >
                      <div className="cc-suggestTop">
                        <span className="cc-tag">{s.type}</span>
                        <span className="cc-suggestTitle">
                          {s.title}
                        </span>
                      </div>
                      <div className="cc-suggestMeta">{s.meta}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="cc-timewarp">
              <div className="cc-timewarpLabel">⏳ Time Warp</div>
              <Segmented
                value={timeMode}
                onChange={setTimeMode}
                items={[
                  { value: "past", label: "Past" },
                  { value: "now", label: "Now" },
                  { value: "future", label: "Next" },
                ]}
              />
            </div>
          </div>

          <div className="cc-topRight">
            <button
              type="button"
              className="cc-bell"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              title="Notifications"
            >
              🔔
              {notifCount > 0 && (
                <span className="cc-badge">{notifCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="cc-notif">
                <div className="cc-notifHead">
                  <div>Alerts</div>
                  <button
                    className="cc-iconBtn"
                    type="button"
                    onClick={() => setNotifOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                {notifications.map((n) => (
                  <div key={n.id} className="cc-notifItem">
                    <div className="cc-notifTitle">
                      <span
                        className={
                          n.tone === "ok"
                            ? "cc-dot ok"
                            : n.tone === "warn"
                            ? "cc-dot warn"
                            : "cc-dot bad"
                        }
                      />
                      {n.title}
                    </div>
                    <div className="cc-notifMeta">{n.meta}</div>
                  </div>
                ))}

                <button
                  type="button"
                  className="cc-notifBtn"
                  onClick={() => {
                    setNotifOpen(false);
                    setOpenApprove(true);
                  }}
                >
                  Review & Approve
                </button>
              </div>
            )}

            <div className="cc-profile">
              <div className="cc-avatar">A</div>
              <div className="cc-profText">
                <div className="cc-profName">Admin</div>
                <div className="cc-profSub">Operational Control</div>
              </div>
            </div>
          </div>
        </header>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="cc-content">
            <section className="cc-grid4">
              {statCards.map((c) => (
                <article
                  key={c.key}
                  className={`cc-card cc-stat cc-tone-${c.tone}`}
                >
                  <div className="cc-statTop">
                    <div>
                      <div className="cc-muted">{c.title}</div>
                      <div className="cc-statValue">{c.value}</div>
                    </div>
                    <div className="cc-statIcon" aria-hidden="true">
                      {c.icon}
                    </div>
                  </div>

                  <div
                    className={
                      c.delta >= 0 ? "cc-delta pos" : "cc-delta neg"
                    }
                  >
                    {formatPct(c.delta)}{" "}
                    <span className="cc-deltaSub">
                      ({frame.label})
                    </span>
                  </div>

                  <div className="cc-bar">
                    <div
                      className="cc-barFill"
                      style={{ width: `${c.fill}%` }}
                    />
                  </div>
                </article>
              ))}
            </section>

            <section className="cc-grid2">
              <article className="cc-card cc-pulse">
                <div className="cc-cardHead">
                  <div>
                    <div className="cc-cardTitle">System Pulse</div>
                    <div className="cc-cardSub">
                      Platform condition snapshot · {frame.label}
                    </div>
                  </div>

                  <div className="cc-osi">
                    <div className="cc-osiLabel">
                      Operational Stability Index
                    </div>
                    <div
                      className="cc-osiRing"
                      style={{ "--p": `${100 - risk}%` }}
                    >
                      <div className="cc-osiNum">
                        {100 - risk}
                      </div>
                      <div className="cc-osiSub">/100</div>
                    </div>
                  </div>
                </div>

                <div className="cc-pulseBody">
                  <div
                    className={
                      risk < 30
                        ? "cc-orb ok"
                        : risk < 60
                        ? "cc-orb warn"
                        : "cc-orb bad"
                    }
                  />
                  <div className="cc-pulseMeta">
                    <div className="cc-row">
                      <span className="cc-muted">Status</span>
                      <span className="cc-strong">
                        {frame.pulse.status} · Risk {riskLabel}
                      </span>
                    </div>
                    <div className="cc-row">
                      <span className="cc-muted">Live users</span>
                      <span className="cc-strong">
                        {frame.pulse.liveUsers}
                      </span>
                    </div>
                    <div className="cc-row">
                      <span className="cc-muted">
                        Response time
                      </span>
                      <span className="cc-strong">
                        {(frame.pulse.responseMs / 1000).toFixed(
                          2
                        )}
                        s
                      </span>
                    </div>

                    <div className="cc-risk">
                      <div className="cc-riskTop">
                        <span className="cc-muted">
                          Platform Risk Level
                        </span>
                        <span className="cc-strong">{risk}/100</span>
                      </div>
                      <div className="cc-riskBar">
                        <div
                          className={
                            risk < 30
                              ? "cc-riskFill ok"
                              : risk < 60
                              ? "cc-riskFill warn"
                              : "cc-riskFill bad"
                          }
                          style={{ width: `${risk}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cc-heatWrap">
                  <div className="cc-heatHead">
                    <div className="cc-cardTitle">
                      Live Behavior Map
                    </div>
                    <div className="cc-cardSub">
                      Peak intensity (heat)
                    </div>
                  </div>
                  <div className="cc-heat">
                    {heat.map((v, i) => (
                      <div
                        key={i}
                        className="cc-heatCell"
                        style={{ opacity: 0.22 + v * 0.78 }}
                      />
                    ))}
                  </div>
                </div>
              </article>

              <div className="cc-stack">
                <article className="cc-card">
                  <div className="cc-cardHeadRow">
                    <div>
                      <div className="cc-cardTitle">
                        Admin Insights
                      </div>
                      <div className="cc-cardSub">
                        Decision-ready signals
                      </div>
                    </div>
                    <span className="cc-chip">AI‑Like</span>
                  </div>
                  <ul className="cc-list">
                    {frame.insights.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </article>

                <article className="cc-card">
                  <div className="cc-cardHeadRow">
                    <div>
                      <div className="cc-cardTitle">
                        Suggested Actions
                      </div>
                      <div className="cc-cardSub">
                        What to do next
                      </div>
                    </div>
                    <button
                      className="cc-link"
                      type="button"
                      onClick={() => setOpenApprove(true)}
                    >
                      Run approvals
                    </button>
                  </div>

                  <div className="cc-actionsGrid">
                    <button
                      className="cc-act primary"
                      type="button"
                      onClick={() => setOpenAddDoctor(true)}
                    >
                      🩺 Add Doctor
                      <span className="cc-actSub">
                        Increase capacity
                      </span>
                    </button>

                    <button
                      className="cc-act"
                      type="button"
                      onClick={() => setOpenAddPatient(true)}
                    >
                      👤 Add Patient
                      <span className="cc-actSub">
                        Register quickly
                      </span>
                    </button>

                    <button
                      className="cc-act ghost"
                      type="button"
                      onClick={() => setTab("appointments")}
                    >
                      📅 Review Appointments
                      <span className="cc-actSub">
                        Resolve pending
                      </span>
                    </button>

                    <button
                      className="cc-act ghost"
                      type="button"
                      onClick={() => setTab("reports")}
                    >
                      📈 Open Reports
                      <span className="cc-actSub">
                        Trends + export
                      </span>
                    </button>
                  </div>
                </article>
              </div>
            </section>

            <section className="cc-card">
              <div className="cc-cardHeadRow">
                <div>
                  <div className="cc-cardTitle">
                    Activity Timeline
                  </div>
                  <div className="cc-cardSub">
                    Click any row to open the relevant section
                  </div>
                </div>
                <button
                  className="cc-link"
                  type="button"
                  onClick={() => setTab("appointments")}
                >
                  Go to management →
                </button>
              </div>

              <div className="cc-tableWrap">
                <table className="cc-table">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.slice(0, 8).map((x) => (
                      <tr
                        key={x.id}
                        className="cc-tr"
                        onClick={() =>
                          setTab(x.routeHint || "overview")
                        }
                      >
                        <td>{x.activity}</td>
                        <td>{x.user}</td>
                        <td>
                          <StatusPill status={x.status} />
                        </td>
                        <td>{x.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* PATIENTS */}
        {tab === "patients" && (
          <div className="cc-content">
            <section className="cc-card">
              <div className="cc-cardHeadRow">
                <div>
                  <div className="cc-cardTitle">Patients</div>
                  <div className="cc-cardSub">
                    Filtered by the global search bar
                  </div>
                </div>
                <button
                  className="cc-btn"
                  type="button"
                  onClick={() => setOpenAddPatient(true)}
                >
                  + Add patient
                </button>
              </div>

              <div className="cc-tableWrap">
                <table className="cc-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((p) => (
                      <tr key={p.id} className="cc-tr">
                        <td className="cc-mono">{p.id}</td>
                        <td>{p.name}</td>
                        <td className="cc-mono">{p.email}</td>
                        <td className="cc-mono">{p.phone}</td>
                        <td className="cc-mono">{p.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPatients.length === 0 && (
                  <div className="cc-empty">
                    No patients match your search.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* DOCTORS */}
        {tab === "doctors" && (
          <div className="cc-content">
            <section className="cc-card">
              <div className="cc-cardHeadRow">
                <div>
                  <div className="cc-cardTitle">Doctors</div>
                  <div className="cc-cardSub">
                    Manage availability & specialties
                  </div>
                </div>
                <button
                  className="cc-btn"
                  type="button"
                  onClick={() => setOpenAddDoctor(true)}
                >
                  + Add doctor
                </button>
              </div>

              <div className="cc-tableWrap">
                <table className="cc-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Specialty</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((d) => (
                      <tr key={d.id} className="cc-tr">
                        <td className="cc-mono">{d.id}</td>
                        <td>{d.name}</td>
                        <td>{d.specialty}</td>
                        <td>
                          <StatusPill status={d.status} />
                        </td>
                        <td className="cc-mono">{d.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDoctors.length === 0 && (
                  <div className="cc-empty">
                    No doctors match your search.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* APPOINTMENTS */}
        {tab === "appointments" && (
          <div className="cc-content">
            <section className="cc-card">
              <div className="cc-cardHeadRow">
                <div>
                  <div className="cc-cardTitle">
                    Appointments Management
                  </div>
                  <div className="cc-cardSub">
                    Update statuses directly (demo)
                  </div>
                </div>
                <button
                  className="cc-btn ghost"
                  type="button"
                  onClick={() => setOpenApprove(true)}
                >
                  Bulk approve
                </button>
              </div>

              <div className="cc-tableWrap">
                <table className="cc-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((a) => (
                      <tr key={a.id} className="cc-tr">
                        <td className="cc-mono">{a.id}</td>
                        <td>{a.patient}</td>
                        <td>{a.doctor}</td>
                        <td className="cc-mono">{a.time}</td>
                        <td>
                          <StatusPill status={a.status} />
                        </td>
                        <td>
                          <select
                            className="cc-select"
                            value={a.status}
                            onChange={(e) =>
                              handleChangeAppointmentStatus(
                                a.id,
                                e.target.value
                              )
                            }
                          >
                            <option>Pending</option>
                            <option>Confirmed</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                  <div className="cc-empty">
                    No appointments match your search.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* REPORTS */}
        {tab === "reports" && (
          <ReportsPanel
            timeMode={timeMode}
            frame={frame}
            appointments={appointments}
            onGoAppointments={() => setTab("appointments")}
          />
        )}
      </main>

      {/* MODALS */}
      <Modal
        open={openAddPatient}
        title="Add new patient"
        onClose={() => setOpenAddPatient(false)}
      >
        <AddPatientForm
          onCancel={() => setOpenAddPatient(false)}
          onSubmit={handleAddPatient}
        />
      </Modal>

      <Modal
        open={openAddDoctor}
        title="Add new doctor"
        onClose={() => setOpenAddDoctor(false)}
      >
        <AddDoctorForm
          onCancel={() => setOpenAddDoctor(false)}
          onSubmit={handleAddDoctor}
        />
      </Modal>

      <Modal
        open={openApprove}
        title="Review pending approvals"
        onClose={() => setOpenApprove(false)}
      >
        <div className="cc-approve">
          <div className="cc-approveBox">
            <div className="cc-approveTitle">
              What will be approved?
            </div>
            <div className="cc-approveLine">
              Pending appointments:{" "}
              <b>
                {
                  appointments.filter(
                    (a) =>
                      String(a.status).toLowerCase() === "pending"
                  ).length
                }
              </b>
            </div>
            <div className="cc-approveLine">
              Inactive doctors:{" "}
              <b>
                {
                  doctors.filter(
                    (d) =>
                      String(d.status).toLowerCase() !== "active"
                  ).length
                }
              </b>
            </div>
            <div className="cc-approveNote">
              Demo bulk action for “control room” feel.
            </div>
          </div>

          <div className="cc-rowBtns">
            <button
              className="cc-btn ghost"
              type="button"
              onClick={() => setOpenApprove(false)}
            >
              Cancel
            </button>
            <button
              className="cc-btn"
              type="button"
              onClick={approveAllPending}
            >
              Approve all
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ===========================
   REPORTS (Area + Line)
   =========================== */
function ReportsPanel({ timeMode, frame, appointments, onGoAppointments }) {
  const [range, setRange] = React.useState("last7"); // last7 | last30 | custom
  const [focus, setFocus] = React.useState("summary"); // summary | pending

  const total = Math.max(1, appointments.length);
  const cancelled = appointments.filter(
    (a) => String(a.status).toLowerCase() === "cancelled"
  ).length;
  const pending = appointments.filter(
    (a) => String(a.status).toLowerCase() === "pending"
  ).length;
  const confirmed = appointments.filter(
    (a) => String(a.status).toLowerCase() === "confirmed"
  ).length;
  const noShowRate = Math.round((cancelled / total) * 100);

  const trend = React.useMemo(() => {
    const base = [
      { day: "Sat", appointments: 12, pending: 4 },
      { day: "Sun", appointments: 18, pending: 6 },
      { day: "Mon", appointments: 15, pending: 5 },
      { day: "Tue", appointments: 22, pending: 8 },
      { day: "Wed", appointments: 19, pending: 7 },
      { day: "Thu", appointments: 26, pending: 9 },
      { day: "Fri", appointments: 21, pending: 6 },
    ];

    const k =
      timeMode === "past" ? 0.85 : timeMode === "future" ? 1.22 : 1.0;
    const bump = timeMode === "future" ? 2 : timeMode === "past" ? -1 : 0;

    return base.map((d) => ({
      day: d.day,
      appointments: Math.max(0, Math.round(d.appointments * k)),
      pending: Math.max(
        0,
        Math.round(d.pending + bump * (timeMode === "future" ? 1.15 : 1))
      ),
    }));
  }, [timeMode]);

  const exportCSV = () => {
    const rows = [
      ["Report", "Shifaa Admin Reports"],
      ["TimeWarp", frame.label],
      ["Range", range],
      [],
      ["KPI", "Value"],
      ["Total appointments", total],
      ["Confirmed", confirmed],
      ["Pending", pending],
      ["Cancelled/No-show", cancelled],
      ["No-show rate %", noShowRate],
      [],
      ["Trend table (7 days demo)"],
      ["Day", "Appointments", "Pending"],
      ...trend.map((t) => [t.day, t.appointments, t.pending]),
      [],
      ["Appointments table"],
      ["ID", "Patient", "Doctor", "Time", "Status"],
      ...appointments.map((a) => [a.id, a.patient, a.doctor, a.time, a.status]),
    ];

    const csv = rows
      .map((r) => r.map((x) => String(x ?? "").replaceAll(",", " ")).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shifaa-report-${timeMode}-${range}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cc-content">
      <section className="cc-card">
        <div className="cc-cardHeadRow">
          <div>
            <div className="cc-cardTitle">Reports</div>
            <div className="cc-cardSub">KPIs & Trends · Drilldown · Export</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              className="cc-select"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="custom">Custom demo</option>
            </select>
            <button
              className="cc-btn ghost"
              type="button"
              onClick={exportCSV}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="cc-grid4" style={{ marginTop: 12 }}>
          <article className="cc-card cc-stat cc-tone-blue" style={{ padding: 12 }}>
            <div className="cc-muted">Total appointments</div>
            <div className="cc-statValue">{total}</div>
            <button
              className="cc-link"
              type="button"
              onClick={() => setFocus("summary")}
            >
              Summary
            </button>
          </article>

          <article className="cc-card cc-stat cc-tone-amber" style={{ padding: 12 }}>
            <div className="cc-muted">Pending</div>
            <div className="cc-statValue">{pending}</div>
            <button
              className="cc-link"
              type="button"
              onClick={() => setFocus("pending")}
            >
              Drilldown
            </button>
          </article>

          <article className="cc-card cc-stat cc-tone-green" style={{ padding: 12 }}>
            <div className="cc-muted">Confirmed</div>
            <div className="cc-statValue">{confirmed}</div>
            <div className="cc-cardSub">Throughput</div>
          </article>

          <article className="cc-card cc-stat cc-tone-violet" style={{ padding: 12 }}>
            <div className="cc-muted">No-show / cancellation rate</div>
            <div className="cc-statValue">{noShowRate}%</div>
            <div className="cc-cardSub">Cancelled total demo</div>
          </article>
        </div>
      </section>

      {/* Charts row */}
      <section className="cc-grid2">
        <article className="cc-card">
          <div className="cc-cardTitle">Appointments Trend</div>
          <div className="cc-cardSub">7-day trend demo · {frame.label}</div>
          <div style={{ width: "100%", height: 280, marginTop: 10 }}>
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <CartesianGrid
                  stroke="rgba(148,163,184,0.18)"
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="day" stroke="rgba(203,213,255,0.7)" />
                <YAxis stroke="rgba(203,213,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(7,10,26,0.85)",
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: 12,
                    color: "rgba(234,240,255,0.95)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#22d3ee"
                  fill="rgba(34,211,238,0.18)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="cc-card">
          <div className="cc-cardTitle">Pending Load</div>
          <div className="cc-cardSub">Pending per day demo · {frame.label}</div>
          <div style={{ width: "100%", height: 280, marginTop: 10 }}>
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid
                  stroke="rgba(148,163,184,0.18)"
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="day" stroke="rgba(203,213,255,0.7)" />
                <YAxis stroke="rgba(203,213,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(7,10,26,0.85)",
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: 12,
                    color: "rgba(234,240,255,0.95)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {/* Pending drilldown */}
      {focus === "pending" && (
        <section className="cc-card">
          <div className="cc-cardHeadRow">
            <div>
              <div className="cc-cardTitle">Pending appointments · Drilldown</div>
              <div className="cc-cardSub">Resolve them in management</div>
            </div>
            <div>
              <button
                className="cc-btn"
                type="button"
                onClick={onGoAppointments}
              >
                Go to management
              </button>
            </div>
          </div>

          <div className="cc-tableWrap">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter(
                    (a) =>
                      String(a.status).toLowerCase() === "pending"
                  )
                  .map((a) => (
                    <tr key={a.id} className="cc-tr">
                      <td className="cc-mono">{a.id}</td>
                      <td>{a.patient}</td>
                      <td>{a.doctor}</td>
                      <td className="cc-mono">{a.time}</td>
                      <td>
                        <StatusPill status={a.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Summary view */}
      {focus === "summary" && (
        <section className="cc-card">
          <div className="cc-cardHeadRow">
            <div>
              <div className="cc-cardTitle">Summary</div>
              <div className="cc-cardSub">
                Quick overview of appointment statistics.
              </div>
            </div>
          </div>

          <div className="cc-grid4" style={{ marginTop: 12 }}>
            <div>
              <div className="cc-muted">Total appointments</div>
              <div className="cc-statValue">{total}</div>
            </div>
            <div>
              <div className="cc-muted">Confirmed</div>
              <div className="cc-statValue">{confirmed}</div>
            </div>
            <div>
              <div className="cc-muted">Pending</div>
              <div className="cc-statValue">{pending}</div>
            </div>
            <div>
              <div className="cc-muted">Cancelled / No-show</div>
              <div className="cc-statValue">{cancelled}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ===========================
   Forms
   =========================== */

function AddPatientForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const can = name.trim() && email.trim() && phone.trim();

  return (
    <form
      className="cc-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!can) return;
        onSubmit?.({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        });
      }}
    >
      <label className="cc-label">Name</label>
      <input
        className="cc-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Sara Mohamed"
      />

      <label className="cc-label">Email</label>
      <input
        className="cc-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="e.g. sara@mail.com"
      />

      <label className="cc-label">Phone</label>
      <input
        className="cc-input"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g. 0100..."
      />

      <div className="cc-rowBtns">
        <button
          className="cc-btn ghost"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button className="cc-btn" type="submit" disabled={!can}>
          Add patient
        </button>
      </div>
    </form>
  );
}

function AddDoctorForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");

  const can = name.trim() && specialty.trim();

  return (
    <form
      className="cc-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!can) return;
        onSubmit?.({
          name: name.trim(),
          specialty: specialty.trim(),
        });
      }}
    >
      <label className="cc-label">Name</label>
      <input
        className="cc-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Dr. Ahmed Hassan"
      />

      <label className="cc-label">Specialty</label>
      <input
        className="cc-input"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        placeholder="e.g. Cardiology"
      />

      <div className="cc-rowBtns">
        <button
          className="cc-btn ghost"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button className="cc-btn" type="submit" disabled={!can}>
          Add doctor
        </button>
      </div>
    </form>
  );
}
