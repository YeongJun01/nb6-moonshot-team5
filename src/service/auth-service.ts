import bcrypt from 'bcrypt';
import authRepository from '../repository/auth-repository';
import { generateToken, verifyRefreshToken } from '../lib/token';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ConflictError from '../lib/errors/ConflictError';

class AuthService {
  //회원가입
  async registerUser(email: string, name: string, password: string) {
    // 필수 입력값 확인 -> 구글 로그인시 아마 변동
    if (!email || !name || !password) {
      throw new ConflictError('모든 필드를 채워주세요.');
    }

    // 중복 이메일 확인
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새로운 사용자 생성
    const newUser = await authRepository.createUser(email, name, hashedPassword);
    return newUser;
  }

  //로그인
  async loginUser(email: string, password: string) {
    // 사용자 존재 확인
    const user = await authRepository.findUserByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 비밀번호가 올바르지 않을 경우
    if (!isPasswordValid) {
      throw new UnauthorizedError('비밀번호가 올바르지 않습니다.');
    }

    // 토큰 생성
    const { accessToken, refreshToken } = generateToken(user.id);

    //accessToken 만료 시간
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60분

    // 사용자 토큰 저장
    await authRepository.createUserToken(user.id, accessToken, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  //토큰 재발급
  async refreshToken(refreshToken: string) {
    // DB에서 Refresh Token 조회
    const tokenRecord = await authRepository.findByRefreshToken(refreshToken);

    if (!tokenRecord) {
      throw new UnauthorizedError('유효하지 않은 리프레시 토큰입니다.');
    }

    // 토큰이 만료되었는지 확인
    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedError('리프레시 토큰이 만료되었습니다.');
    }

    // 토큰 검증
    const { userId } = verifyRefreshToken(refreshToken);

    // 기존 토큰 무효화
    // await authRepository.revokeToken(tokenRecord.id);

    //기존 토큰 삭제
    //await authRepository.deleteToken(tokenRecord.id);

    // 새로운 토큰 생성
    const { accessToken, refreshToken: newRefreshToken } = generateToken(userId);
    // 새로운 accessToken 만료 시간
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60분

    // 토큰 테이블 업데이트
    await authRepository.updateUserToken(tokenRecord.id, accessToken, newRefreshToken, expiresAt);
    // 사용자 토큰 업데이트
    //await authRepository.createUserToken(userId, accessToken, newRefreshToken, expiresAt);

    return { accessToken, newRefreshToken };
  }
}

export default new AuthService();
