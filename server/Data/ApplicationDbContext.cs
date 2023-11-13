﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using sjekkminhybel.Models;

namespace sjekkminhybel.Data;

public class ApplicationDbContext : IdentityDbContext <ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUser> ApplicationUser {get; set;}
    public DbSet<Posts> Posts {get;set;}
}