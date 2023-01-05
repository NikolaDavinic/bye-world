using ByeWorld_backend.Middlewares;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Neo4jClient;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"))
    .AddConsole()
    .AddDebug();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("redis")));
builder.Services.AddSingleton<IBoltGraphClient>(options =>
{
    var neo4jClient = new BoltGraphClient(
        builder.Configuration.GetConnectionString("neo4j"),
        builder.Configuration.GetSection("Neo4jClientAuth:user").Value,
        builder.Configuration.GetSection("Neo4jClientAuth:password").Value);
    neo4jClient.ConnectAsync().Wait();
    return neo4jClient;
});

builder.Services.AddAuthentication("session-scheme")
   .AddScheme<AuthenticationSchemeOptions, SessionAuthenticationSchemeHandler>("session-scheme", options => { });

builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes("session-scheme")
        .RequireAuthenticatedUser()
        .Build();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSDevelopment", builder =>
    {
        builder
        .WithOrigins(
            "http://localhost:3000",
            "https://localhost:3000",
            "http://127.0.0.1:3000",
            "https://127.0.0.1:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });

    options.AddPolicy("CORSProduction", builder =>
    {
        builder.WithOrigins(new string[]
        {
            ""
        })
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});


var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("CORSDevelopment");
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors("CORSProduction");
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
