import React from "react";

function Landing({ onGoToAppointments }) {
  return (
    <div className="landing">
      <header className="landing-header">
        <h1>CareFlow</h1>
        <p className="landing-subtitle">
          Keep your **health** and appointments in one clear place.
        </p>
        <button className="primary-btn" onClick={onGoToAppointments}>
          My appointments
        </button>
      </header>
    </div>
  );
}

export default Landing;

