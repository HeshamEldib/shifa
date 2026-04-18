using System;
using System.Collections.Generic;

namespace Shifa.API.Dtos.Doctors
{
    public class DoctorDashboardOverviewDto
    {
        public DoctorStatsDto Stats { get; set; }
        public List<TodayScheduleDto> TodaySchedule { get; set; }
    }

    public class DoctorStatsDto
    {
        public int TodayAppointments { get; set; }
        public int TotalPatients { get; set; }
        public int PendingRequests { get; set; }
        public int CompletedThisMonth { get; set; }
    }

    public class TodayScheduleDto
    {
        public Guid AppointmentID { get; set; }
        public Guid PatientID { get; set; }
        public string PatientName { get; set; }
        public string Time { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
    }
}