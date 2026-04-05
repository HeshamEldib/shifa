using Microsoft.OpenApi.Models;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Microsoft.EntityFrameworkCore;
using Shifa.Infrastructure.Data;
using Shifa.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. إضافة الخدمات (Add Services)
// ==========================================

// أ. إعداد الاتصال بقاعدة البيانات SQL Server
// نقرأ جملة الاتصال "DefaultConnection" من ملف appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<Shifa.API.Services.SettingsService>();
// إضافة HttpClient لتمكين الاتصال بالـ API الخارجي
builder.Services.AddHttpClient<Shifa.API.Services.PrayerTimeService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// ب. إعداد سياسة CORS (مهم جداً للربط مع React)
// يسمح هذا الإعداد للفرونت إند بالاتصال بالـ API بدون مشاكل أمنية أثناء التطوير
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyOrigin()  // يسمح لأي مصدر بالاتصال (غيّر هذا لاحقاً عند النشر)
            .AllowAnyMethod()  // يسمح بكل أنواع الطلبات (GET, POST, PUT, DELETE)
            .AllowAnyHeader()); // يسمح بكل الهيدرز
});

// ج. إضافة خدمات الـ Controllers و Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "أدخل كلمة 'Bearer' ثم مسافة ثم التوكن الخاص بك.\r\n\r\nمثال:\r\nBearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// إعدادات الـ JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

// إضافة خدمة الكاش لحفظ أكواد الـ OTP مؤقتاً
builder.Services.AddMemoryCache();

var app = builder.Build();

// ==========================================
// 2. إعداد مسار الطلبات (Request Pipeline)
// ==========================================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // هذا السطر سينشئ قاعدة البيانات ويضيف الأدوار تلقائياً
        await DbInitializer.InitializeAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "حدث خطأ أثناء تهيئة قاعدة البيانات.");
    }
}

// أ. إعداد Swagger (واجهة تجربة الـ API) في بيئة التطوير
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ب. تفعيل CORS (يجب أن يكون قبل UseAuthorization)
app.UseCors("AllowReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
