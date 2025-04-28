// src/auth/dto/jwt-payload.dto.ts
export class JwtPayloadDto {
  userId: number; // Atau 'sub' jika Anda menggunakan itu
  email: string;
  username: string;
  sub: number;
  // Tambahkan properti lain jika ada
}