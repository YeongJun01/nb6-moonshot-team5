import prisma from '../lib/prisma';

class AuthRepository {
  async findUserById(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(email: string, name: string, hashedPassword: string) {
    return await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }

  async createUserToken(
    userId: number,
    accessToken: string,
    refreshToken: string,
    expiresAt: Date,
  ) {
    return await prisma.userToken.create({
      data: {
        userId,
        accessToken,
        refreshToken,
        expiresAt,
      },
    });
  }

  async findByRefreshToken(refreshToken: string) {
    return await prisma.userToken.findFirst({
      where: { refreshToken },
    });
  }
  async deleteToken(tokenId: number) {
    return prisma.userToken.delete({
      where: { id: tokenId },
    });
  }

  async updateUserToken(
    tokenId: number,
    newAccessToken: string,
    newRefreshToken: string,
    newExpiresAt: Date,
  ) {
    return prisma.userToken.update({
      where: { id: tokenId },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
      },
    });
  }

  async revokeToken(tokenId: number) {
    return prisma.userToken.update({
      where: { id: tokenId },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}

export default new AuthRepository();
