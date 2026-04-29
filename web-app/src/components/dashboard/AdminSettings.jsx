import React, { useState, useEffect } from "react";
import {
    Settings,
    Save,
    Camera,
    Building2,
    Phone,
    Globe,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
} from "lucide-react";
import {
    getGlobalSettingsApi,
    updateGlobalSettingsApi,
    uploadLogoApi,
} from "../../services/adminSettingsService";
import "./AdminSettings.css";
// import { useDispatch } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;
function AdminSettings() {
    // const dispatch = useDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // حالة الإعدادات (تتطابق تماماً مع GlobalSettingsDto)
    const [settings, setSettings] = useState({
        clinicName: "",
        clinicDescription: "",
        contactPhone: "",
        emergencyPhone: "",
        contactEmail: "",
        address: "",
        facebookUrl: "",
        instagramUrl: "",
        twitterUrl: "",
        linkedinUrl: "",
        websiteUrl: "",
        logoUrl: "", // حالياً يتم حفظه كرابط نصي (URL) أو Base64
    });

    // جلب البيانات عند تحميل الصفحة
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const data = await getGlobalSettingsApi();
            // إذا كانت قاعدة البيانات فارغة، سيُرجع الباك إند كائناً بخصائص فارغة، وهذا ممتاز.
            setSettings(data);
        } catch (error) {
            setSaveMessage({
                type: "error",
                text: "تعذر جلب الإعدادات من الخادم.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    // معالجة رفع الشعار (تحويله إلى Base64 ليتم حفظه كنص في قاعدة البيانات مؤقتاً)
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) uploadLogoApi(file);
        window.location.reload();
    };

    // إرسال التعديلات للسيرفر
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);

        try {
            await updateGlobalSettingsApi(settings);
            setSaveMessage({
                type: "success",
                text: "تم تحديث إعدادات النظام بنجاح!",
            });
            setTimeout(() => setSaveMessage(null), 4000); // إخفاء الرسالة بعد 4 ثوانٍ
        } catch (error) {
            setSaveMessage({
                type: "error",
                text: error.message || "حدث خطأ أثناء حفظ الإعدادات.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="custom-spinner mx-auto mt-5"></div>;

    return (
        <div className="admin-settings-page fade-in-up">
            <div className="page-header-flex mb-4">
                <div>
                    <h2 className="text-white mb-1 d-flex align-items-center gap-2">
                        <Settings className="text-cyan" /> الإعدادات العامة
                        للمنصة
                    </h2>
                    <p className="text-muted m-0">
                        قم بإدارة هوية العيادة، معلومات التواصل، وروابط منصات
                        التواصل الاجتماعي.
                    </p>
                </div>
            </div>

            {saveMessage && (
                <div
                    className={`custom-alert ${saveMessage.type === "success" ? "alert-success" : "alert-error"} mb-4`}
                >
                    {saveMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="settings-form-wrapper">
                <div className="settings-layout-grid">
                    {/* العمود الأيمن: الهوية */}
                    <div className="settings-column">
                        <div className="admin-section glass-receipt mb-4">
                            <h4 className="section-title">
                                <Building2 size={20} className="text-cyan" />{" "}
                                هوية العيادة
                            </h4>

                            <div className="logo-upload-section mb-4 text-center">
                                <div className="logo-wrapper mx-auto">
                                    {settings.logoUrl ? (
                                        <img
                                            src={API_URL + settings.logoUrl}
                                            alt="Clinic Logo"
                                            className="clinic-logo-img"
                                        />
                                    ) : (
                                        <Building2
                                            size={40}
                                            className="text-muted"
                                            opacity="0.3"
                                        />
                                    )}
                                    <label
                                        className="btn-upload-logo"
                                        title="تغيير الشعار"
                                    >
                                        <Camera size={18} />
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                        />
                                    </label>
                                </div>
                                <span className="text-muted small mt-2 d-block">
                                    شعار المنصة (يتم حفظه تلقائياً)
                                </span>
                            </div>

                            <div className="form-group mb-3">
                                <label>اسم العيادة / المجمع الطبي</label>
                                <input
                                    required
                                    type="text"
                                    name="clinicName"
                                    className="custom-input"
                                    value={settings.clinicName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>وصف قصير (يظهر في التذييل)</label>
                                <textarea
                                    name="clinicDescription"
                                    className="custom-input"
                                    rows="3"
                                    value={settings.clinicDescription}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="admin-section glass-receipt">
                            <h4 className="section-title">
                                <Globe size={20} className="text-cyan" /> منصات
                                التواصل الاجتماعي
                            </h4>
                            <div className="form-group mb-3 input-with-icon">
                                <Facebook
                                    size={18}
                                    className="input-icon text-muted"
                                />
                                <input
                                    type="url"
                                    name="facebookUrl"
                                    className="custom-input"
                                    dir="ltr"
                                    placeholder="رابط صفحة فيسبوك"
                                    value={settings.facebookUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mb-3 input-with-icon">
                                <Instagram
                                    size={18}
                                    className="input-icon text-muted"
                                />
                                <input
                                    type="url"
                                    name="instagramUrl"
                                    className="custom-input"
                                    dir="ltr"
                                    placeholder="رابط حساب إنستجرام"
                                    value={settings.instagramUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mb-3 input-with-icon">
                                <Twitter
                                    size={18}
                                    className="input-icon text-muted"
                                />
                                <input
                                    type="url"
                                    name="twitterUrl"
                                    className="custom-input"
                                    dir="ltr"
                                    placeholder="رابط حساب تويتر / X"
                                    value={settings.twitterUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mb-3 input-with-icon">
                                <Linkedin
                                    size={18}
                                    className="input-icon text-muted"
                                />
                                <input
                                    type="url"
                                    name="linkedinUrl"
                                    className="custom-input"
                                    dir="ltr"
                                    placeholder="رابط صفحة لينكدإن"
                                    value={settings.linkedinUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mb-3 input-with-icon">
                                <Globe
                                    size={18}
                                    className="input-icon text-muted"
                                />
                                <input
                                    type="url"
                                    name="websiteUrl"
                                    className="custom-input"
                                    dir="ltr"
                                    placeholder="الموقع الإلكتروني الرسمي"
                                    value={settings.websiteUrl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* العمود الأيسر: بيانات التواصل */}
                    <div className="settings-column">
                        <div className="admin-section glass-receipt">
                            <h4 className="section-title">
                                <Phone size={20} className="text-cyan" /> بيانات
                                التواصل والموقع
                            </h4>

                            <div className="form-group mb-3">
                                <label>رقم الاستقبال الموحد</label>
                                <input
                                    required
                                    type="tel"
                                    name="contactPhone"
                                    className="custom-input text-right"
                                    dir="ltr"
                                    value={settings.contactPhone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>رقم الطوارئ (اختياري)</label>
                                <input
                                    type="tel"
                                    name="emergencyPhone"
                                    className="custom-input text-right"
                                    dir="ltr"
                                    placeholder="مثال: 19000"
                                    value={settings.emergencyPhone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>البريد الإلكتروني الرسمي</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    className="custom-input"
                                    value={settings.contactEmail}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>العنوان التفصيلي</label>
                                <textarea
                                    required
                                    name="address"
                                    className="custom-input"
                                    rows="3"
                                    placeholder="المدينة، الحي، الشارع..."
                                    value={settings.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-actions-footer glass-receipt mt-4 text-left">
                    <button
                        type="submit"
                        className="btn-primary-action px-5"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <span className="custom-spinner-sm"></span>
                        ) : (
                            <>
                                <Save size={20} /> حفظ وتحديث الإعدادات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminSettings;
