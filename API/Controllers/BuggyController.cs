using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseAPIController
    {
        private readonly DataContext _context;

        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth-error")]
        public ActionResult<string> GetSecret() {
            return "This is the secret text";
        }

        [HttpGet("not-found-error")]
        public ActionResult<AppUser> GetNotFound()
        {
            AppUser imaginaryUser = _context.Users.Find(-1);

            if (imaginaryUser == null)
            {
                return NotFound(new { error = "The user could not be found" });
            }

            return imaginaryUser;
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            AppUser imaginaryUser = _context.Users.Find(-1);

            return imaginaryUser.ToString();
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest(new { error = "This is a bad request" });
        }
    }
}
