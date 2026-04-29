import React, { useState, useEffect } from "react";
import { User, BriefcaseMedical, Save, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateProfile,
    updateProfileImage,
} from "../../store/slices/userProfileSlice";
import "./DoctorProfile.css";

function DoctorProfile() {
    const dispatch = useDispatch();
    const { data: user } = useSelector((state) => state.userProfile);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        age: "",
        gender: "",
        address: "",
        bio: "",
        quote: "",
        specialty: "",
        specialization: "",
        experienceYears: "",
    });

    useEffect(() => {
        if (user) setFormData({ ...user });
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) dispatch(updateProfileImage(file));
        window.location.reload();
    };
    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setIsSaving(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(updateProfile(formData));
        window.location.reload();
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form-container">
            {/* قسم الصورة */}
            <div className="profile-avatar-section glass-receipt text-center mb-4">
                <div className="avatar-wrapper mx-auto">
                    <img
                        src={user?.image || "/user.png"}
                        alt="Avatar"
                        className="profile-avatar-img"
                    />
                    <label className="camera-btn btn-change-avatar">
                        <Camera size={20} />
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </label>
                </div>
                <h4 className="text-white mt-3 mb-1">د. {user?.fullName}</h4>
                <p className="text-cyan m-0">
                    {user?.specialization || "تخصص غير محدد"}
                </p>
            </div>

            <div className="profile-grid">
                <div className="profile-section glass-receipt">
                    <h4 className="section-title">
                        <User size={20} className="text-cyan" /> البيانات
                        الأساسية
                    </h4>
                    <div className="form-group mb-3">
                        <label>الاسم الكامل</label>
                        <input
                            required
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>الهاتف</label>
                        <input
                            required
                            type="tel"
                            name="phone"
                            pattern="01[0-9]{9}"
                            inputMode="tel"
                            maxLength="11"
                            minLength="11"
                            value={formData.phone}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>البريد الإلكتروني</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            // onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>العمر</label>
                        <input
                            required
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>الجنس</label>
                        <select
                            required
                            name="gender"
                            value={formData.gender}
                            onChange={handleProfileChange}
                            className="custom-input"
                        >
                            <option value="">اختر الجنس</option>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label>العنوان</label>
                        <input
                            required
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>
                </div>

                <div className="profile-section glass-receipt">
                    <h4 className="section-title">
                        <BriefcaseMedical size={20} className="text-cyan" />{" "}
                        البيانات المهنية
                    </h4>
                    <div className="form-group mb-3">
                        <label>التخصص</label>
                        <input
                            required
                            type="text"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>التخصص الدقيق</label>
                        <input
                            required
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>سنوات الخبرة</label>
                        <input
                            required
                            type="number"
                            name="experienceYears"
                            value={formData.experienceYears}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>الاقتباس المفضل</label>
                        <input
                            type="text"
                            name="quote"
                            value={formData.quote}
                            onChange={handleProfileChange}
                            className="custom-input"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>النبذة التعريفية</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleProfileChange}
                            className="custom-input"
                            rows="4"
                        />
                    </div>
                </div>
            </div>

            <div className="profile-actions glass-receipt mt-4 text-left">
                <button
                    type="submit"
                    className="btn-primary-action"
                    disabled={!isSaving}
                >
                    {isSaving ? (
                        <span className="custom-spinner-sm"></span>
                    ) : (
                        <Save size={20} />
                    )}{" "}
                    حفظ الملف الشخصي
                </button>
            </div>
        </form>
    );
}

export default DoctorProfile;
