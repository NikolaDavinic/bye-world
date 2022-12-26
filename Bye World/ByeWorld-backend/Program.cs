using Neo4jClient;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("redis")));


var neo4jClient = new GraphClient(
    builder.Configuration.GetConnectionString("neo4j"),
    builder.Configuration.GetSection("Neo4jClientAuth:user").Value,
    builder.Configuration.GetSection("Neo4jClientAuth:password").Value
    );
neo4jClient.ConnectAsync().Wait();
builder.Services.AddSingleton<IGraphClient>(neo4jClient);


var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
