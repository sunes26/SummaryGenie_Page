// lib/auth.ts
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  User,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { getAuthInstance } from './firebase/client';
import { uploadProfilePhoto as uploadPhoto } from './firebase/storage';

/**
 * 이메일/비밀번호로 로그인
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  const auth = getAuthInstance();
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Google로 로그인
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  const auth = getAuthInstance();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return await signInWithPopup(auth, provider);
}

/**
 * 회원가입 (이메일/비밀번호)
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  const auth = getAuthInstance();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // 이름 설정
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  // 이메일 인증 발송
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user);
  }

  return userCredential;
}

/**
 * 비밀번호 재설정 이메일 발송
 */
export async function resetPassword(email: string): Promise<void> {
  const auth = getAuthInstance();
  await sendPasswordResetEmail(auth, email);
}

/**
 * 프로필 업데이트
 */
export async function updateUserProfile(
  displayName?: string,
  photoURL?: string
): Promise<void> {
  const auth = getAuthInstance();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is currently signed in');
  }

  await updateProfile(user, {
    ...(displayName && { displayName }),
    ...(photoURL && { photoURL }),
  });
}

/**
 * 현재 사용자 가져오기
 */
export function getCurrentUser(): User | null {
  const auth = getAuthInstance();
  return auth.currentUser;
}

/**
 * ID 토큰 가져오기 (API 요청용)
 */
export async function getIdToken(): Promise<string | null> {
  const auth = getAuthInstance();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  return await user.getIdToken();
}

/**
 * 세션 쿠키 생성 (로그인 후 호출)
 */
export async function createSession(idToken: string): Promise<void> {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create session');
  }
}

/**
 * 세션 쿠키 삭제 (로그아웃 시 호출)
 */
export async function deleteSession(): Promise<void> {
  const response = await fetch('/api/auth/session', {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete session');
  }
}

/**
 * 세션 확인
 */
export async function verifySession(): Promise<{
  authenticated: boolean;
  user?: { uid: string; email: string };
}> {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
  });

  return await response.json();
}

/**
 * 로그아웃 (Firebase Auth + 세션 쿠키 모두 삭제)
 */
export async function logout(): Promise<void> {
  const auth = getAuthInstance();

  try {
    // 1. 세션 쿠키 삭제
    await deleteSession();

    // 2. Firebase Auth 로그아웃
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    // 에러가 발생해도 Firebase는 로그아웃 시도
    await signOut(auth);
    throw error;
  }
}

/**
 * 사용자 재인증 (이메일/비밀번호)
 * - 민감한 작업 전에 필요 (이메일 변경, 비밀번호 변경 등)
 */
export async function reauthenticateUser(
  currentPassword: string
): Promise<void> {
  const auth = getAuthInstance();
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error('No user is currently signed in');
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error: any) {
    if (error.code === 'auth/wrong-password') {
      throw new Error('auth/wrong-password');
    }
    throw error;
  }
}

/**
 * 이메일 변경
 * - 재인증이 필요할 수 있음
 * 
 * @param newEmail - 새 이메일 주소
 * @param currentPassword - 현재 비밀번호 (재인증용)
 */
export async function updateUserEmail(
  newEmail: string,
  currentPassword: string
): Promise<void> {
  const auth = getAuthInstance();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is currently signed in');
  }

  try {
    // 1. 재인증
    await reauthenticateUser(currentPassword);
    
    // 2. 이메일 업데이트
    await updateEmail(user, newEmail);
    
    // 3. 새 이메일로 인증 이메일 발송
    await sendEmailVerification(user);
  } catch (error: any) {
    // 에러 코드만 throw (번역은 클라이언트에서)
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('auth/email-already-in-use');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('auth/invalid-email');
    }
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('auth/requires-recent-login');
    }
    throw error;
  }
}

/**
 * 비밀번호 변경
 * - 재인증이 필요
 * 
 * @param currentPassword - 현재 비밀번호
 * @param newPassword - 새 비밀번호
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const auth = getAuthInstance();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is currently signed in');
  }

  try {
    // 1. 재인증
    await reauthenticateUser(currentPassword);
    
    // 2. 비밀번호 업데이트
    await updatePassword(user, newPassword);
  } catch (error: any) {
    // 에러 코드만 throw (번역은 클라이언트에서)
    if (error.code === 'auth/weak-password') {
      throw new Error('auth/weak-password');
    }
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('auth/requires-recent-login');
    }
    throw error;
  }
}

/**
 * 프로필 사진 업로드 및 프로필 업데이트
 * 
 * @param file - 업로드할 이미지 파일
 * @param onProgress - 업로드 진행률 콜백
 */
export async function uploadAndUpdateProfilePhoto(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const auth = getAuthInstance();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is currently signed in');
  }

  try {
    // 1. Storage에 업로드
    const photoURL = await uploadPhoto(file, user.uid, {
      onProgress,
    });
    
    // 2. 프로필 업데이트
    await updateProfile(user, { photoURL });
    
    return photoURL;
  } catch (error) {
    console.error('Failed to upload profile photo:', error);
    throw error;
  }
}

/**
 * Firebase Auth 에러 코드를 반환
 * (실제 번역은 클라이언트 컴포넌트에서 useTranslation 훅으로 처리)
 */
export function getFirebaseErrorCode(error: any): string {
  return error?.code || 'auth/unknown-error';
}