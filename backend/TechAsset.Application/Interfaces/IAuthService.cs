using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces
{
    public interface IAuthService
    {
        Task<string> LoginAsync(LoginDto dto);
        Task<Usuario> RegisterAsync(RegisterDto dto);
    }
}
