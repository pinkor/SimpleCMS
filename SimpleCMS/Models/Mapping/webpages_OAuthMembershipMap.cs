using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SimpleCMS.Models.Mapping
{
    public class webpages_OAuthMembershipMap : EntityTypeConfiguration<webpages_OAuthMembership>
    {
        public webpages_OAuthMembershipMap()
        {
            // Primary Key
            this.HasKey(t => new { t.Provider, t.ProviderUserId });

            // Properties
            this.Property(t => t.Provider)
                .IsRequired()
                .HasMaxLength(30);

            this.Property(t => t.ProviderUserId)
                .IsRequired()
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("webpages_OAuthMembership");
            this.Property(t => t.Provider).HasColumnName("Provider");
            this.Property(t => t.ProviderUserId).HasColumnName("ProviderUserId");
            this.Property(t => t.UserId).HasColumnName("UserId");

            // Relationships
            this.HasRequired(t => t.UserProfile)
                .WithMany(t => t.webpages_OAuthMembership)
                .HasForeignKey(d => d.UserId);

        }
    }
}
