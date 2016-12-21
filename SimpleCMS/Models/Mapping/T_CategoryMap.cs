using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SimpleCMS.Models.Mapping
{
    public class T_CategoryMap : EntityTypeConfiguration<T_Category>
    {
        public T_CategoryMap()
        {
            // Primary Key
            this.HasKey(t => t.CategoryId);

            // Properties
            this.Property(t => t.FullPath)
                .HasMaxLength(100);

            this.Property(t => t.Title)
                .HasMaxLength(255);

            this.Property(t => t.Image)
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("T_Category");
            this.Property(t => t.CategoryId).HasColumnName("CategoryId");
            this.Property(t => t.ParentId).HasColumnName("ParentId");
            this.Property(t => t.HierarchyLevel).HasColumnName("HierarchyLevel");
            this.Property(t => t.FullPath).HasColumnName("FullPath");
            this.Property(t => t.Title).HasColumnName("Title");
            this.Property(t => t.Image).HasColumnName("Image");
            this.Property(t => t.Content).HasColumnName("Content");
            this.Property(t => t.SortOrder).HasColumnName("SortOrder");
            this.Property(t => t.State).HasColumnName("State");
            this.Property(t => t.Created).HasColumnName("Created");

            // Relationships
            this.HasOptional(t => t.Parent)
                .WithMany(t => t.Childs)
                .HasForeignKey(d => d.ParentId);

        }
    }
}
