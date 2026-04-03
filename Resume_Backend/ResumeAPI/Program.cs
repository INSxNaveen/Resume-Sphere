using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ResumeAPI.Data;
using ResumeAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Application Services
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IResumeParserService, ResumeParserService>();
builder.Services.AddScoped<ISkillExtractorService, SkillExtractorService>();
builder.Services.AddScoped<IJobMatchService, JobMatchService>();
builder.Services.AddScoped<ISkillGapService, SkillGapService>();
builder.Services.AddScoped<ILearningResourceService, LearningResourceService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAnalysisService, AnalysisService>();
builder.Services.AddScoped<ILearningPlanService, LearningPlanService>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<IResumeGenerationService, ResumeGenerationService>();
builder.Services.AddScoped<IUploadModerationService, UploadModerationService>();

// AI Service
var aiServiceUrl = builder.Configuration["AiService:BaseUrl"] ?? "http://localhost:8000";
builder.Services.AddHttpClient<IAiAnalysisService, AiAnalysisService>(client =>
{
    client.BaseAddress = new Uri(aiServiceUrl);
    client.Timeout = TimeSpan.FromSeconds(120);
});

// JWT Authentication
var jwtToken = builder.Configuration["AppSettings:Token"];
if (string.IsNullOrWhiteSpace(jwtToken))
{
    throw new InvalidOperationException("JWT token is missing. Set AppSettings__Token in environment variables.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtToken)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Smart Resume Matcher API",
        Version = "v1",
        Description = "Upload resumes, extract skills, match jobs, detect skill gaps, and get learning resources."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            new List<string>()
        }
    });
});

// CORS — hardcoded Vercel URL + any extra origin from Railway env var
var allowedOrigins = new List<string>
{
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://resume-sphere-ecru.vercel.app"   // ← your deployed Vercel frontend
};

var frontendUrl = builder.Configuration["Frontend:Url"];
if (!string.IsNullOrWhiteSpace(frontendUrl) && !allowedOrigins.Contains(frontendUrl))
{
    allowedOrigins.Add(frontendUrl);
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// Swagger in ALL environments so you can test the deployed backend
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Resume Matcher API v1");
    c.RoutePrefix = "swagger";
});

// CORS must come before Authentication/Authorization
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();