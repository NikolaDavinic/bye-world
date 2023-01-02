using Microsoft.AspNetCore.Authentication.Cookies;
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

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "byeworld-auth";
        options.Cookie.Expiration = TimeSpan.FromHours(1);
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSDevelopment", builder =>
    {
        builder.WithOrigins(new string[]
        {
            "http://localhost:3000",
            "https://localhost:3000",
            "http://127.0.0.1:3000",
            "https://127.0.0.1:3000"
        })
        .AllowAnyHeader()
        .AllowAnyMethod();
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
