import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    updateProfile,
    updateProfileImage,
} from "../../store/slices/userProfileSlice";
import {
    Camera,
    User,
    Phone,
    MapPin,
    Mail,
    Save,
    Star,
    Quote,
} from "lucide-react";
import "./Profile.css";

function Profile() {
    const dispatch = useDispatch();
    const { data: user, isLoading } = useSelector((state) => state.userProfile);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        bio: "",
        quote: "",
        specialty: "",
    });

    useEffect(() => {
        if (user) setFormData({ ...user });
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) dispatch(updateProfileImage(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
    };

    return (
        <div className="premium-booking-page">
            <div className="security-aura">
                <div className="aura-glow blue-glow"></div>
            </div>

            <div className="booking-container fade-in-up">
                <div className="profile-grid">
                    {/* الجانب الأيمن: الصورة والمعلومات الأساسية */}
                    <div className="profile-sidebar">
                        <div className="glass-receipt text-center">
                            <div className="avatar-upload-container">
                                <img
                                    src={user?.image || "/user.png"}
                                    alt="Profile"
                                    className="large-profile-img"
                                />
                                <label className="camera-btn">
                                    <Camera size={20} />
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            <h3 className="mt-3">{user?.fullName}</h3>
                            <span className="badge bg-info-subtle text-info">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* الجانب الأيسر: نموذج التعديل */}
                    <div className="profile-form-container">
                        <form onSubmit={handleSubmit} className="booking-card">
                            <h4 className="card-inner-title">
                                <User size={20} /> المعلومات الشخصية
                            </h4>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="input-group-custom">
                                        <label>
                                            <User size={16} /> الاسم الكامل
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    fullName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group-custom">
                                        <label>
                                            <Mail size={16} /> البريد الإلكتروني
                                            (ثابت)
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.email}
                                            disabled
                                            className="disabled-input"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group-custom">
                                        <label>
                                            <Phone size={16} /> رقم الهاتف
                                        </label>
                                        <input
                                            type="text"
                                            pattern="01[0-9]{9}"
                                            inputMode="tel"
                                            maxLength="11"
                                            minLength="11"
                                            required

                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group-custom">
                                        <label> العمر</label>
                                        <input
                                            type="text"
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
                                <div className="col-md-6">
                                    <div className="input-group-custom">
                                        <label> الجنس</label>

                                        <div className="gender-options">
                                        <label
                                            htmlFor="male"
                                        >
                                            ذكر
                                        </label>
                                        <input
                                            type="radio"
                                            id="male"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === "male"}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    gender: e.target.value,
                                                })
                                            }
                                        />
                                        </div>
                                        <div className="gender-options">
                                        <label
                                            htmlFor="female"
                                        >
                                            أنثى
                                        </label>
                                        <input
                                            type="radio"
                                            id="female"
                                            name="gender"
                                            value="female"
                                            checked={
                                                formData.gender === "female"
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    gender: e.target.value,
                                                })
                                            }
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group-custom">
                                        <label>
                                            <MapPin size={16} /> الدولة
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    country: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group-custom">
                                        <label>
                                            <MapPin size={16} /> العنوان
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {user?.role === "Patient" && (
                                <div className="mt-4 pt-4 border-top border-secondary">
                                    <h4 className="card-inner-title">
                                        البيانات الطبية
                                    </h4>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                العنوان الوظيفي (Job Title)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.job}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        job: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                فصيلة الدم (Blood Type)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.bloodType}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        bloodType: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                الحساسية (Allergies)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.allergies}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        allergies: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                الأمراض المزمنة (Chronic Diseases)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.chronicDiseases}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        chronicDiseases: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                جهة الاتصال في الحالة الطارئة (Emergency Contact)
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.emergencyContact}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        emergencyContact: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                الوزن (KG)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.weight}
                                                min={0}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        weight: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                الطول (CM)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.height}
                                                min={10}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        height: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <label>
                                                ملاحظات المريض (Patient Notes)
                                            </label>
                                            <textarea
                                                rows="3"
                                                value={formData.patientNotes}
                                                min={10}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        patientNotes: e.target.value,
                                                    })
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* حقول إضافية للطبيب فقط */}
                            {user?.role === "Doctor" && (
                                <div className="mt-4 pt-4 border-top border-secondary">
                                    <h4 className="card-inner-title">
                                        <Star size={20} /> البيانات المهنية
                                    </h4>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="input-group-custom">
                                                <label>التخصص</label>
                                                <input
                                                    type="text"
                                                    value={formData.specialty}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            specialty:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="input-group-custom">
                                                <label>التخصص الدقيق</label>
                                                <input
                                                    type="text"
                                                    value={
                                                        formData.specialization
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            specialization:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="input-group-custom">
                                                <label>سنوات الخبرة</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={
                                                        formData.experienceYears
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            experienceYears:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="input-group-custom">
                                                <label>
                                                    <Quote size={16} /> المقولة
                                                    الشهيرة (Quote)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.quote}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            quote: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="input-group-custom">
                                                <label>
                                                    النبذة التعريفية (Bio)
                                                </label>
                                                <textarea
                                                    rows="3"
                                                    value={formData.bio}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            bio: e.target.value,
                                                        })
                                                    }
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="magic-pay-btn mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    "جاري الحفظ..."
                                ) : (
                                    <span>
                                        حفظ التغييرات <Save size={18} />
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
