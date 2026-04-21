# 1. مرحلة البناء (Build Stage)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# نسخ ملف المشروع واستعادة الحزم (Restore Dependencies)
# ⚠️ استبدل "YourProjectName" باسم مشروعك الفعلي (مثل Shifa.csproj)
COPY ["YourProjectName.csproj", "./"]
RUN dotnet restore "YourProjectName.csproj"

# نسخ باقي الملفات وبناء المشروع
COPY . .
WORKDIR "/src/"
RUN dotnet build "YourProjectName.csproj" -c Release -o /app/build

# 2. مرحلة النشر (Publish Stage)
FROM build AS publish
RUN dotnet publish "YourProjectName.csproj" -c Release -o /app/publish

# 3. مرحلة التشغيل (Runtime Stage)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# تحديد المنفذ الافتراضي الذي ستستمع إليه الحاوية
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

COPY --from=publish /app/publish .
# ⚠️ استبدل "YourProjectName" باسم ملف الـ dll الناتج
ENTRYPOINT ["dotnet", "YourProjectName.dll"]