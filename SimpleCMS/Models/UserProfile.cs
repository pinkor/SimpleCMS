using System;
using System.Collections.Generic;

namespace SimpleCMS.Models
{
    public partial class UserProfile
    {
        public UserProfile()
        {
            this.webpages_OAuthMembership = new List<webpages_OAuthMembership>();
            this.webpages_Roles = new List<webpages_Roles>();
        }

        public int UserId { get; set; }
        public string UserName { get; set; }
        public virtual webpages_Membership webpages_Membership { get; set; }
        public virtual ICollection<webpages_OAuthMembership> webpages_OAuthMembership { get; set; }
        public virtual ICollection<webpages_Roles> webpages_Roles { get; set; }
    }
}
