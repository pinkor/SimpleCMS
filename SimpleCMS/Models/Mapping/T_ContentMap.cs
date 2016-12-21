using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SimpleCMS.Models.Mapping
{
    public class T_ContentMap : EntityTypeConfiguration<T_Content>
    {
        public T_ContentMap()
        {
            // Primary Key
            this.HasKey(t => t.ContentId);

            // Properties
            this.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(255);

            this.Property(t => t.Image)
                .HasMaxLength(255);

            this.Property(t => t.Summary)
                .HasMaxLength(500);

            // Table & Column Mappings
            this.ToTable("T_Content");
            this.Property(t => t.ContentId).HasColumnName("ContentId");
            this.Property(t => t.Title).HasColumnName("Title");
            this.Property(t => t.CategoryId).HasColumnName("CategoryId");
            this.Property(t => t.Image).HasColumnName("Image");
            this.Property(t => t.Summary).HasColumnName("Summary");
            this.Property(t => t.Content).HasColumnName("Content");
            this.Property(t => t.Created).HasColumnName("Created");
            this.Property(t => t.Hits).HasColumnName("Hits");
            this.Property(t => t.State).HasColumnName("State");
            this.Property(t => t.SortOrder).HasColumnName("SortOrder");

            // Relationships
            this.HasMany(t => t.T_Tag)
                .WithMany(t => t.T_Content)
                .Map(m =>
                    {
                        m.ToTable("T_TagInContent");
                        m.MapLeftKey("ContentId");
                        m.MapRightKey("TagId");
                    });

            this.HasRequired(t => t.T_Category)
                .WithMany(t => t.T_Content)
                .HasForeignKey(d => d.CategoryId);

        }
    }
}
