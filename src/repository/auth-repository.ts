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

  async upsertGoogleUser(
    googleUser: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    },
    accessToken: string,
    refreshToken: string,
    tokenExpiry: Date,
  ) {
    // 기존에 OAuth 정보가 있는지 확인
    const oauth = await prisma.userOauth.findUnique({
      where: {
        provider_providerId: {
          provider: 'google',
          providerId: googleUser.id,
        },
      },
      include: { user: true },
    });

    // 처음 로그인한 경우
    if (!oauth) {
      return prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.picture,
          userOauths: {
            create: {
              provider: 'google',
              providerId: googleUser.id,
              accessToken,
              refreshToken,
              tokenExpiry,
            },
          },
        },
        include: { userOauths: true },
      });
    }

    // 기존에 OAuth 정보가 있는 경우 토큰 업데이트
    await prisma.userOauth.update({
      where: { id: oauth.id },
      data: {
        accessToken,
        refreshToken,
        tokenExpiry,
      },
    });
    return oauth.user;
  }

  async findUserOauth(provider: string, providerId: string) {
    return prisma.userOauth.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
      include: { user: true },
    });
  }

  async findGoogleOauthByUserId(userId: number) {
    return prisma.userOauth.findFirst({
      where: { userId, provider: 'google' },
    });
  }

  async updateTokens(id: number, accessToken: string, tokenExpiry: Date) {
    return prisma.userOauth.update({
      where: { id },
      data: { accessToken, tokenExpiry },
    });
  }
}

export default new AuthRepository();
