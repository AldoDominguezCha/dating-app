using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountsController : BaseAPIController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountsController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> RegisterAccount(RegisterUserDTO registerUserDTO)
        {
            if (await UsernameIsTaken(registerUserDTO.Username))
            {
                return BadRequest(new { error = "The usernamme is already taken." });
            }
            
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerUserDTO.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerUserDTO.Password)),
                PasswordSalt = hmac.Key,
            };

            _context.Add(user);
            await _context.SaveChangesAsync();

            return new UserDTO
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> LogIn(UserLoginDTO userLoginDTO)
        {

            var unauthorizedResponse = BadRequest(new { error = "Invalid username and/or password" });

            var user = await _context.Users.SingleOrDefaultAsync(user => user.UserName == userLoginDTO.Username);

            if (user == null)
            {
                return unauthorizedResponse;
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userLoginDTO.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return unauthorizedResponse;
                }
            }

            return new UserDTO
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
            };
        }


        private async Task<bool> UsernameIsTaken(string username)
        {
            return await _context.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
        }

    }
}
