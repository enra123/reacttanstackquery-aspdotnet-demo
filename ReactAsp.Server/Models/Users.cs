using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace reactdotnet.Server.Models
{
    public class Users : IdentityUser
    {
        [Column(TypeName = "nvarchar(256)")]
        public List<string> Permissions { get; set; }

    }
}
