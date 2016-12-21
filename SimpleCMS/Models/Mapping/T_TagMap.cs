using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace SimpleCMS.Models.Mapping
{
    public class T_TagMap : EntityTypeConfiguration<T_Tag>
    {
        public T_TagMap()
        {
            // Primary Key
            this.HasKey(t => t.TagId);

            // Properties
            this.Property(t => t.TagName)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("T_Tag");
            this.Property(t => t.TagId).HasColumnName("TagId");
            this.Property(t => t.TagName).HasColumnName("TagName");
        }
    }
}
