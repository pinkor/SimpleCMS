using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SimpleCMS.Models.Mapping
{
    public class UserProfileMap : EntityTypeConfiguration<UserProfile>
    {
        public UserProfileMap()
        {
            // Primary Key
            this.HasKey(t => t.UserId);

            // Properties
            this.Property(t => t.UserName)
                .IsRequired()
                .HasMaxLength(56);

            // Table & Column Mappings
            this.ToTable("UserProfile");
            this.Property(t => t.UserId).HasColumnName("UserId");
            this.Property(t => t.UserName).HasColumnName("UserName");

            // Relationships
            this.HasMany(t => t.webpages_Roles)
                .WithMany(t => t.UserProfiles)
                .Map(m =>
                    {
                        m.ToTable("webpages_UsersInRoles");
                        m.MapLeftKey("UserId");
                        m.MapRightKey("RoleId");
                    });


        }
    }
}
