using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDTO> GetMemberByUsernameAsync(string username)
        {
            return await _context.Users
                .Where(u => u.UserName.ToLower() == username.ToLower())
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDTO>> GetMembersAsync()
        {
            return await _context.Users.ProjectTo<MemberDTO>(_mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(u => u.UserPhotos).SingleOrDefaultAsync(user => user.UserName.ToLower() == username.ToLower());
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.Include(u => u.UserPhotos).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            // SaveChangesAsync returns the number of entries written to the database in the operation
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            // Tells the EF tracker to pay attention to the new changes in the entity (manually keep track of the changes)
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}
