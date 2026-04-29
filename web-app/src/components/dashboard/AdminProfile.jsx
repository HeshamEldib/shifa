import React, { useState, useEffect } from "react";
import {
    Mail,
    Calendar,
    Save,
    Camera,
    Edit2,
} from "lucide-react";
import "./AdminProfile.css";
import { useDispatch, useSelector } from "react-redux";
import {
    updateProfile,
    updateProfileImage,
} from "../../store/slices/userProfileSlice";

function AdminProfile() {
    const dispatch = useDispatch();
    const { data: user } = useSelector((state) => state.userProfile);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        age: "",
        gender: "",
        address: "",
        country: "",
        createdDate: "",
    });

    useEffect(() => {
        if (user) setFormData({ ...user });
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) dispatch(updateProfileImage(file));
        window.location.reload();
    };
    // const handleProfileChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    //     setIsSaving(true);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(updateProfile(formData));
        window.location.reload();
    };

    return (
        <div className="admin-profile-page fade-in-up">
            <div className="profile-layout">
                {/* الجزء الأيمن: بطاقة العرض */}
                <div className="profile-side-card glass-receipt">
                    <div className="avatar-container">
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
                        <h3 className="text-white mt-3 mb-1">
                            {formData.fullName}
                        </h3>
                        <span className="badge-admin">مسؤول النظام</span>
                    </div>

                    <div className="quick-info mt-4">
                        <div className="info-row">
                            <Mail size={16} /> {formData.email}
                        </div>
                        <div className="info-row">
                            <Calendar size={16} /> عضو منذ{" "}
                            {new Date(formData.createdDate).toLocaleDateString(
                                "ar-EG",
                            )}
                        </div>
                    </div>
                </div>

                {/* الجزء الأيسر: نموذج التعديل */}
                <div className="profile-main-content glass-receipt">
                    <div className="content-header">
                        <h4 className="text-white m-0">الإعدادات الشخصية</h4>
                        <button
                            className="btn-edit-toggle"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? (
                                "إلغاء"
                            ) : (
                                <>
                                    <Edit2 size={16} /> تعديل
                                </>
                            )}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form mt-4">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>الاسم بالكامل</label>
                                <input
                                    disabled={!isEditing}
                                    className="custom-input"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fullName: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>رقم الهاتف</label>
                                <input
                                    disabled={!isEditing}
                                    className="custom-input"
                                    type="tel"
                                    pattern="01[0-9]{9}"
                                    inputMode="tel"
                                    maxLength="11"
                                    minLength="11"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>الدولة</label>
                                <input
                                    disabled={!isEditing}
                                    className="custom-input"
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            country: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>العمر</label>
                                <input
                                    disabled={!isEditing}
                                    type="number"
                                    className="custom-input"
                                    value={formData.age}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            age: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group mt-3">
                            <label>العنوان التفصيلي</label>
                            <textarea
                                disabled={!isEditing}
                                className="custom-input"
                                rows="3"
                                value={formData.address || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {isEditing && (
                            <div className="form-actions mt-4">
                                <button
                                    type="submit"
                                    className="btn-primary-action px-5"
                                >
                                    <Save size={18} /> حفظ التغييرات
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
