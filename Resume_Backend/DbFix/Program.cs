using Npgsql;
const string CS = "Host=localhost;Port=5432;Database=ResumeMatcherDb;Username=postgres;Password=root";
await using var conn = new NpgsqlConnection(CS);
await conn.OpenAsync();
Console.WriteLine("Connected.\n");

// Show Resumes columns
Console.WriteLine("=== Resumes current columns ===");
await using (var c=new NpgsqlCommand("SELECT column_name,data_type FROM information_schema.columns WHERE table_name='Resumes' ORDER BY ordinal_position",conn))
await using (var rd=await c.ExecuteReaderAsync()) while(await rd.ReadAsync()) Console.WriteLine($"  {rd.GetString(0)}: {rd.GetString(1)}");

// Check Resumes.Id type
string? rIdType=null;
await using(var c=new NpgsqlCommand("SELECT data_type FROM information_schema.columns WHERE table_name='Resumes' AND column_name='Id'",conn))
    rIdType=(string?)await c.ExecuteScalarAsync();
Console.WriteLine($"\nResumes.Id type: {rIdType}");

if(rIdType=="integer") {
    // Delete all rows first (no valuable data)
    await using(var c=new NpgsqlCommand(@"DELETE FROM ""Resumes""",conn)) await c.ExecuteNonQueryAsync();
    Console.WriteLine("Cleared Resumes rows.");
    // Drop PK
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" DROP CONSTRAINT IF EXISTS ""PK_Resumes""",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Dropped PK_Resumes");}catch(Exception ex){Console.WriteLine("PK drop: "+ex.Message.Split('\n')[0]);}
    // Add NewId uuid
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" ADD COLUMN ""NewId"" uuid DEFAULT gen_random_uuid()",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Added Resumes.NewId");}catch(Exception ex){Console.WriteLine("NewId: "+ex.Message.Split('\n')[0]);}
    // Drop old Id
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" DROP COLUMN ""Id""",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Dropped Resumes.Id int");}catch(Exception ex){Console.WriteLine("Drop Id: "+ex.Message.Split('\n')[0]);}
    // Rename
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" RENAME COLUMN ""NewId"" TO ""Id""",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Renamed -> Id uuid");}catch(Exception ex){Console.WriteLine("Rename: "+ex.Message.Split('\n')[0]);}
    // Add PK
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" ADD CONSTRAINT ""PK_Resumes"" PRIMARY KEY (""Id"")",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Added PK_Resumes");}catch(Exception ex){Console.WriteLine("PK add: "+ex.Message.Split('\n')[0]);}
}

// Fix UserId on Resumes (drop old int, add uuid)
string? uIdType=null;
await using(var c=new NpgsqlCommand("SELECT data_type FROM information_schema.columns WHERE table_name='Resumes' AND column_name='UserId'",conn))
    uIdType=(string?)await c.ExecuteScalarAsync();
Console.WriteLine($"\nResumes.UserId type: {uIdType}");

if(uIdType=="integer"){
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" DROP COLUMN ""UserId""",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Dropped old int UserId");}catch(Exception ex){Console.WriteLine("Drop UserId: "+ex.Message.Split('\n')[0]);}
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" ADD COLUMN ""UserId"" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Added uuid UserId");}catch(Exception ex){Console.WriteLine("Add UserId: "+ex.Message.Split('\n')[0]);}
    try{await using var c=new NpgsqlCommand(@"ALTER TABLE ""Resumes"" ADD CONSTRAINT ""FK_Resumes_Users_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""Users""(""Id"") ON DELETE CASCADE",conn);await c.ExecuteNonQueryAsync();Console.WriteLine("Added FK");}catch(Exception ex){Console.WriteLine("Add FK: "+ex.Message.Split('\n')[0]);}
}

// Add missing columns to Resumes
foreach(var (col,def) in new[]{("FileType","varchar(10) NOT NULL DEFAULT 'pdf'"),("RawText","text NOT NULL DEFAULT ''"),("NormalizedText","text NOT NULL DEFAULT ''"),("FileName","varchar(512) NOT NULL DEFAULT ''"),("UploadedAt","timestamptz NOT NULL DEFAULT NOW()")}){
    bool ex2;await using(var c=new NpgsqlCommand($"SELECT 1 FROM information_schema.columns WHERE table_name='Resumes' AND column_name='{col}'",conn))ex2=await c.ExecuteScalarAsync()!=null;
    if(!ex2){try{await using var c=new NpgsqlCommand($@"ALTER TABLE ""Resumes"" ADD COLUMN IF NOT EXISTS ""{col}"" {def}",conn);await c.ExecuteNonQueryAsync();Console.WriteLine($"Added Resumes.{col}");}catch(Exception e){Console.WriteLine($"Resumes.{col}: {e.Message.Split('\n')[0]}");}}
}

// Now create the 12 new tables
Console.WriteLine("\n=== Creating new tables ===");
async Task TryExec(string name,string sql){Console.Write($"  {name}: ");try{await using var c=new NpgsqlCommand(sql,conn);await c.ExecuteNonQueryAsync();Console.WriteLine("OK");}catch(Exception ex){Console.WriteLine("ERR: "+ex.Message.Split('\n')[0]);}}

await TryExec("JobDescriptions-FK",@"ALTER TABLE IF EXISTS ""JobDescriptions"" ADD CONSTRAINT IF NOT EXISTS ""FK_JD_Users"" FOREIGN KEY (""UserId"") REFERENCES ""Users""(""Id"") ON DELETE CASCADE");
await TryExec("Analyses",@"CREATE TABLE IF NOT EXISTS ""Analyses""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""UserId"" uuid NOT NULL,""ResumeId"" uuid NOT NULL,""JobDescriptionId"" uuid NOT NULL,""OverallScore"" numeric(5,2) NOT NULL DEFAULT 0,""ScoreBreakdownJson"" jsonb NOT NULL DEFAULT '{}',""Status"" varchar(32) NOT NULL DEFAULT 'Pending',""CreatedAt"" timestamptz NOT NULL DEFAULT NOW(),CONSTRAINT ""PK_Analyses"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_Analyses_Users"" FOREIGN KEY(""UserId"") REFERENCES ""Users""(""Id"") ON DELETE CASCADE,CONSTRAINT ""FK_Analyses_Resumes"" FOREIGN KEY(""ResumeId"") REFERENCES ""Resumes""(""Id"") ON DELETE RESTRICT,CONSTRAINT ""FK_Analyses_JD"" FOREIGN KEY(""JobDescriptionId"") REFERENCES ""JobDescriptions""(""Id"") ON DELETE RESTRICT)");
await TryExec("ResumeExtractedSkills",@"CREATE TABLE IF NOT EXISTS ""ResumeExtractedSkills""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""ResumeId"" uuid NOT NULL,""SkillName"" varchar(256) NOT NULL DEFAULT '',""Confidence"" numeric(4,3) NOT NULL DEFAULT 1,CONSTRAINT ""PK_RES"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_RES_Resumes"" FOREIGN KEY(""ResumeId"") REFERENCES ""Resumes""(""Id"") ON DELETE CASCADE)");
await TryExec("JobDescExtSkills",@"CREATE TABLE IF NOT EXISTS ""JobDescriptionExtractedSkills""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""JobDescriptionId"" uuid NOT NULL,""SkillName"" varchar(256) NOT NULL DEFAULT '',""IsRequired"" boolean NOT NULL DEFAULT true,CONSTRAINT ""PK_JDES"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_JDES"" FOREIGN KEY(""JobDescriptionId"") REFERENCES ""JobDescriptions""(""Id"") ON DELETE CASCADE)");
await TryExec("AnalysisMissingSkills",@"CREATE TABLE IF NOT EXISTS ""AnalysisMissingSkills""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""AnalysisId"" uuid NOT NULL,""SkillName"" varchar(256) NOT NULL DEFAULT '',""Priority"" varchar(32) NOT NULL DEFAULT 'Medium',""WhyItMatters"" text NOT NULL DEFAULT '',""Decision"" varchar(32) NOT NULL DEFAULT 'Pending',CONSTRAINT ""PK_AMS"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_AMS"" FOREIGN KEY(""AnalysisId"") REFERENCES ""Analyses""(""Id"") ON DELETE CASCADE)");
await TryExec("AnalysisMissingKeywords",@"CREATE TABLE IF NOT EXISTS ""AnalysisMissingKeywords""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""AnalysisId"" uuid NOT NULL,""Keyword"" varchar(256) NOT NULL DEFAULT '',""WhereItMatters"" text NOT NULL DEFAULT '',CONSTRAINT ""PK_AMK"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_AMK"" FOREIGN KEY(""AnalysisId"") REFERENCES ""Analyses""(""Id"") ON DELETE CASCADE)");
await TryExec("AnalysisSuggestions",@"CREATE TABLE IF NOT EXISTS ""AnalysisSuggestions""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""AnalysisId"" uuid NOT NULL,""Type"" varchar(64) NOT NULL DEFAULT '',""OriginalText"" text NOT NULL DEFAULT '',""SuggestedText"" text NOT NULL DEFAULT '',""Reason"" text NOT NULL DEFAULT '',CONSTRAINT ""PK_ASugg"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_ASugg"" FOREIGN KEY(""AnalysisId"") REFERENCES ""Analyses""(""Id"") ON DELETE CASCADE)");
await TryExec("CourseRecommendations",@"CREATE TABLE IF NOT EXISTS ""CourseRecommendations""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""AnalysisId"" uuid NOT NULL,""SkillName"" varchar(256) NOT NULL DEFAULT '',""Priority"" varchar(32) NOT NULL DEFAULT 'Medium',""Difficulty"" varchar(32) NOT NULL DEFAULT 'Beginner',""EstimatedHours"" integer NOT NULL DEFAULT 10,""FreeResourceTitle"" varchar(512) NOT NULL DEFAULT '',""FreeResourceUrl"" varchar(2048) NOT NULL DEFAULT '',""PaidResourceTitle"" varchar(512) NOT NULL DEFAULT '',""PaidResourceUrl"" varchar(2048) NOT NULL DEFAULT '',""PracticeProject"" text NOT NULL DEFAULT '',CONSTRAINT ""PK_CR"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_CR"" FOREIGN KEY(""AnalysisId"") REFERENCES ""Analyses""(""Id"") ON DELETE CASCADE)");
await TryExec("UserCourseSelections",@"CREATE TABLE IF NOT EXISTS ""UserCourseSelections""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""UserId"" uuid NOT NULL,""CourseRecommendationId"" uuid NOT NULL,""SelectedAt"" timestamptz NOT NULL DEFAULT NOW(),CONSTRAINT ""PK_UCS"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_UCS_U"" FOREIGN KEY(""UserId"") REFERENCES ""Users""(""Id"") ON DELETE CASCADE,CONSTRAINT ""FK_UCS_CR"" FOREIGN KEY(""CourseRecommendationId"") REFERENCES ""CourseRecommendations""(""Id"") ON DELETE CASCADE)");
await TryExec("UserCourseProgress",@"CREATE TABLE IF NOT EXISTS ""UserCourseProgress""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""UserId"" uuid NOT NULL,""CourseRecommendationId"" uuid NOT NULL,""PercentComplete"" integer NOT NULL DEFAULT 0,""LastUpdatedAt"" timestamptz NOT NULL DEFAULT NOW(),CONSTRAINT ""PK_UCP"" PRIMARY KEY(""Id""),CONSTRAINT ""CK_UCP"" CHECK(""PercentComplete"">=0 AND ""PercentComplete""<=100),CONSTRAINT ""FK_UCP_U"" FOREIGN KEY(""UserId"") REFERENCES ""Users""(""Id"") ON DELETE CASCADE,CONSTRAINT ""FK_UCP_CR"" FOREIGN KEY(""CourseRecommendationId"") REFERENCES ""CourseRecommendations""(""Id"") ON DELETE CASCADE)");
await TryExec("GeneratedResumes",@"CREATE TABLE IF NOT EXISTS ""GeneratedResumes""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""UserId"" uuid NOT NULL,""AnalysisId"" uuid NOT NULL,""RoleTitle"" varchar(256) NOT NULL DEFAULT '',""ContentJson"" jsonb NOT NULL DEFAULT '{}',""PlainText"" text NOT NULL DEFAULT '',""GeneratedAt"" timestamptz NOT NULL DEFAULT NOW(),""Version"" integer NOT NULL DEFAULT 1,CONSTRAINT ""PK_GR"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_GR_U"" FOREIGN KEY(""UserId"") REFERENCES ""Users""(""Id"") ON DELETE CASCADE,CONSTRAINT ""FK_GR_An"" FOREIGN KEY(""AnalysisId"") REFERENCES ""Analyses""(""Id"") ON DELETE RESTRICT)");
await TryExec("AnalysisHistories",@"CREATE TABLE IF NOT EXISTS ""AnalysisHistories""(""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),""UserId"" uuid NOT NULL,""AnalysisId"" uuid NOT NULL,""EventType"" varchar(64) NOT NULL DEFAULT '',""EventDetail"" text NOT NULL DEFAULT '',""OccurredAt"" timestamptz NOT NULL DEFAULT NOW(),CONSTRAINT ""PK_AH"" PRIMARY KEY(""Id""),CONSTRAINT ""FK_AH_U"" FOREIGN KEY(""UserId"") REFERENCES ""Users""(""Id"") ON DELETE CASCADE,CONSTRAINT ""FK_AH_An"" FOREIGN KEY(""AnalysisId"") REFERENCES ""Analyses""(""Id"") ON DELETE CASCADE)");

// Final state
Console.WriteLine("\n=== All tables ===");
await using(var c=new NpgsqlCommand("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename",conn))
await using(var rd=await c.ExecuteReaderAsync()) while(await rd.ReadAsync()) Console.WriteLine("  "+rd.GetString(0));

Console.WriteLine("\n=== Final Users columns ===");
await using(var c=new NpgsqlCommand("SELECT column_name,data_type FROM information_schema.columns WHERE table_name='Users' ORDER BY ordinal_position",conn))
await using(var rd=await c.ExecuteReaderAsync()) while(await rd.ReadAsync()) Console.WriteLine($"  {rd.GetString(0)}: {rd.GetString(1)}");

Console.WriteLine("\n=== Final Resumes columns ===");
await using(var c=new NpgsqlCommand("SELECT column_name,data_type FROM information_schema.columns WHERE table_name='Resumes' ORDER BY ordinal_position",conn))
await using(var rd=await c.ExecuteReaderAsync()) while(await rd.ReadAsync()) Console.WriteLine($"  {rd.GetString(0)}: {rd.GetString(1)}");
