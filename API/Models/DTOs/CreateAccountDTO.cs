using System.ComponentModel.DataAnnotations;

namespace API.Models.DTOs
{
    public class CreateAccountDTO
    {
        [Required]
        [MaxLength(20, ErrorMessage = "The username cannot be longer that 20 characters")]
        public required string Username { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
