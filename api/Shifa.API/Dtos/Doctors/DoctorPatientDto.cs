namespace Shifa.API.Dtos.Doctors
{
    public class DoctorPatientDto
    {
        public Guid PatientID { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public DateTime LastVisit { get; set; }
        public int TotalVisits { get; set; }
    }
}