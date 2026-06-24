export function getLoggedUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const claims = JSON.parse(jsonPayload);
    
    // JwtSecurityTokenHandler remapea los ClaimTypes largos de Microsoft a nombres cortos JWT:
    //   ClaimTypes.NameIdentifier -> "nameid"
    //   ClaimTypes.Name           -> "unique_name"
    //   ClaimTypes.Email          -> "email"
    //   ClaimTypes.Role           -> "role"
    return {
      id: claims.nameid
        || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
        || claims.sub,
      name: claims.unique_name
        || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        || claims.name,
      email: claims.email
        || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: claims.role
        || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        || 'Colaborador',
      area: claims.area
    };
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
}
