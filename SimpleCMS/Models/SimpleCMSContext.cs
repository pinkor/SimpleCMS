using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using SimpleCMS.Models.Mapping;

namespace SimpleCMS.Models
{
    public partial class SimpleCMSContext : DbContext
    {
        static SimpleCMSContext()
        {
            Database.SetInitializer<SimpleCMSContext>(null);
        }

        public SimpleCMSContext()
            : base("Name=SimpleCMSContext")
        {
        }

        public DbSet<T_Category> T_Category { get; set; }
        public DbSet<T_Content> T_Content { get; set; }
        public DbSet<T_Tag> T_Tag { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<webpages_Membership> webpages_Membership { get; set; }
        public DbSet<webpages_OAuthMembership> webpages_OAuthMembership { get; set; }
        public DbSet<webpages_Roles> webpages_Roles { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new T_CategoryMap());
            modelBuilder.Configurations.Add(new T_ContentMap());
            modelBuilder.Configurations.Add(new T_TagMap());
            modelBuilder.Configurations.Add(new UserProfileMap());
            modelBuilder.Configurations.Add(new webpages_MembershipMap());
            modelBuilder.Configurations.Add(new webpages_OAuthMembershipMap());
            modelBuilder.Configurations.Add(new webpages_RolesMap());
        }
    }
}
