// lib/image-loader.ts

/**
 * ✅ Next.js 이미지 최적화를 위한 커스텀 로더
 * Firebase Storage 이미지를 최적화하여 제공
 */

export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Firebase Storage 이미지 로더
 * 
 * @example
 * <Image
 *   src="/profile/user123.jpg"
 *   loader={firebaseImageLoader}
 *   width={300}
 *   height={300}
 *   alt="Profile"
 * />
 */
export function firebaseImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Firebase Storage URL인지 확인
  if (src.includes('firebasestorage.googleapis.com')) {
    // Firebase Storage는 자체 리사이징을 지원하지 않으므로
    // 원본 URL 반환 (Next.js가 자체적으로 최적화)
    return src;
  }

  // 로컬 또는 다른 CDN 이미지
  const params = new URLSearchParams();
  
  if (width) {
    params.set('w', width.toString());
  }
  
  if (quality) {
    params.set('q', quality.toString());
  }

  return `${src}?${params.toString()}`;
}

/**
 * Google 프로필 이미지 로더
 * Google 프로필 사진은 크기 파라미터를 지원함
 * 
 * @example
 * <Image
 *   src="https://lh3.googleusercontent.com/..."
 *   loader={googleImageLoader}
 *   width={96}
 *   height={96}
 *   alt="Google Profile"
 * />
 */
export function googleImageLoader({ src, width }: ImageLoaderProps): string {
  if (src.includes('googleusercontent.com')) {
    // Google 이미지 크기 파라미터 추가
    // 예: =s96-c (96x96 크기, 크롭)
    const size = width || 96;
    
    // 이미 크기 파라미터가 있으면 제거
    const baseUrl = src.split('=s')[0];
    
    return `${baseUrl}=s${size}-c`;
  }

  return src;
}

/**
 * 범용 이미지 로더
 * URL에 따라 적절한 로더 자동 선택
 * 
 * @example
 * <Image
 *   src={imageUrl}
 *   loader={universalImageLoader}
 *   width={300}
 *   height={300}
 *   alt="Image"
 * />
 */
export function universalImageLoader(props: ImageLoaderProps): string {
  const { src } = props;

  // Google 이미지
  if (src.includes('googleusercontent.com')) {
    return googleImageLoader(props);
  }

  // Firebase Storage 이미지
  if (src.includes('firebasestorage.googleapis.com')) {
    return firebaseImageLoader(props);
  }

  // 기본 로더
  return src;
}

/**
 * 이미지 품질 프리셋
 */
export const IMAGE_QUALITY = {
  low: 50,
  medium: 75,
  high: 90,
  max: 100,
} as const;

/**
 * 반응형 이미지 크기 프리셋
 */
export const IMAGE_SIZES = {
  thumbnail: 64,
  avatar: 96,
  small: 256,
  medium: 512,
  large: 1024,
  xlarge: 2048,
} as const;

/**
 * 이미지 최적화 유틸리티
 */
export const imageUtils = {
  /**
   * 이미지 URL이 외부 URL인지 확인
   */
  isExternalUrl(src: string): boolean {
    return src.startsWith('http://') || src.startsWith('https://');
  },

  /**
   * 이미지 URL이 Firebase Storage인지 확인
   */
  isFirebaseStorage(src: string): boolean {
    return src.includes('firebasestorage.googleapis.com');
  },

  /**
   * 이미지 URL이 Google CDN인지 확인
   */
  isGoogleCDN(src: string): boolean {
    return src.includes('googleusercontent.com');
  },

  /**
   * 이미지 확장자 추출
   */
  getImageExtension(src: string): string | null {
    const match = src.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i);
    return match ? match[1].toLowerCase() : null;
  },

  /**
   * WebP 지원 여부 확인 (클라이언트 사이드)
   */
  supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  },
};

/**
 * Next.js Image 컴포넌트 기본 Props
 */
export const defaultImageProps = {
  quality: IMAGE_QUALITY.high,
  loading: 'lazy' as const,
  placeholder: 'blur' as const,
};

export default universalImageLoader;