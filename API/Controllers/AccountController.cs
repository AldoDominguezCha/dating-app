using API.Data;
using API.Interfaces;
using API.Models.DTOs;
using API.Models.Entities;
using API.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController(DataContext context, ITokenService tokenService) : BaseAPIController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> CreateAccount([FromBody] CreateAccountDTO dto)
        {
            // Verify that the username is not taken already
            if (await context.Users.AnyAsync(u => u.UserName.ToLower() == dto.Username.ToLower())) {
                return BadRequest(new { errorType = ErrorTypeEnum.Validation, description = "The username is already taken" });
            }

            using var hmac = new HMACSHA512();

            AppUser user = new()
            {
                UserName = dto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
                PasswordSalt = hmac.Key
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Created(null as string, new UserDTO { Username = user.UserName, Token = tokenService.CreateToken(user) });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> LogIn([FromBody] SignInDTO dto)
        {
            AppUser? user = await context.Users.FirstOrDefaultAsync(u => u.UserName.ToLower() == dto.Username.ToLower());

            if (user is null)
            {
                return Unauthorized(new { errorType = ErrorTypeEnum.Authentication, description = "Invalid username or password" });
            }

            /* Instantiate the HMAC object using the same key (which equates to the password salt) as the one used
               to create the password hash of the user when creatin the user instance. If the passwords are the same 
               but the keys are not, the hashes won't be equal, that why using a specific key for both creation and login
               is equivalent to using a specific random salt when hashing the password.
            */
            using var hmac = new HMACSHA512(user.PasswordSalt);

            byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));

            if (computedHash.Length != user.PasswordHash.Length) {
                return Unauthorized(new { errorType = ErrorTypeEnum.Authentication, description = "Invalid username or password" });
            }

            for (int i = 0; i < computedHash.Length; i++) {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized(new { errorType = ErrorTypeEnum.Authentication, description = "Invalid username or password" });
                }
            }

            return Ok(new UserDTO { Username = user.UserName, Token = tokenService.CreateToken(user) });
        }
    }
}
