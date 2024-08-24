using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using reactdotnet.Server.Models;
using System.Security.Claims;
using System.Text.Json;

namespace IdentityCoreDapper.Factory
{
    public class AppClaimsPrincipalFactory : UserClaimsPrincipalFactory<Users>
    {
        public AppClaimsPrincipalFactory(
            UserManager<Users> userManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, optionsAccessor)
        { }

        // Add custom field 'Permissions' to ClaimsPrincipalFactory 
        public async override Task<ClaimsPrincipal> CreateAsync(Users user)
        {
            var principal = await base.CreateAsync(user);
            var identity = (ClaimsIdentity)principal.Identity;
            var claims = new List<Claim>();

            claims.Add(new Claim("Permissions", JsonSerializer.Serialize(user.Permissions)));

            identity.AddClaims(claims);
            return principal;
        }
    }
}