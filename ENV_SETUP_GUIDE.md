# 환경 변수 설정 가이드

`.env.local` 파일을 설정하는 단계별 가이드입니다.

---

## 🚀 빠른 시작

```bash
# 1. 템플릿 복사
cp .env.local.template .env.local

# 2. .env.local 파일 편집
# 아래 가이드를 따라 필수 값 입력

# 3. 개발 서버 실행
npm run dev
```

---

## 📝 필수 환경 변수 설정 (17개)

### 1️⃣ Firebase Client 설정 (7개)

**위치**: [Firebase Console](https://console.firebase.google.com) → 프로젝트 선택 → ⚙️ 프로젝트 설정 → 일반 → 내 앱

1. **웹 앱이 없다면**:
   - "앱 추가" → 웹 (</>) 아이콘 클릭
   - 앱 닉네임 입력 (예: Gena Page Web)
   - "앱 등록" 클릭

2. **Firebase SDK 스니펫에서 값 복사**:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",              // → NEXT_PUBLIC_FIREBASE_API_KEY
     authDomain: "xxx.firebaseapp.com", // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     projectId: "xxx",                  // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
     storageBucket: "xxx.firebasestorage.app", // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     messagingSenderId: "123456789",    // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     appId: "1:123:web:abc",           // → NEXT_PUBLIC_FIREBASE_APP_ID
     measurementId: "G-XXXXXXXXXX"     // → NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   };
   ```

3. **.env.local에 입력**:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

---

### 2️⃣ Firebase Admin 설정 (3개)

**위치**: [Firebase Console](https://console.firebase.google.com) → 프로젝트 설정 → 서비스 계정

1. **"새 비공개 키 생성" 버튼 클릭**
2. **JSON 파일 다운로드** (`your-project-xxxxx.json`)
3. **JSON 파일 열기**:
   ```json
   {
     "project_id": "your-project",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
   }
   ```

4. **.env.local에 입력**:
   ```env
   FIREBASE_ADMIN_PROJECT_ID=your-project
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   ```

   ⚠️ **중요**:
   - `FIREBASE_ADMIN_PRIVATE_KEY`는 반드시 **큰따옴표**로 감싸야 합니다
   - `\n` (줄바꿈)을 그대로 유지하세요

---

### 3️⃣ Paddle 설정 (5개)

**위치**: [Paddle Vendors](https://vendors.paddle.com)

#### 3-1. Environment 설정
```env
# 개발/테스트: sandbox
# 운영: production
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

#### 3-2. Client Token 가져오기

1. **Paddle Dashboard 로그인**
2. **우측 상단에서 "Sandbox" 모드 확인** (개발 중)
3. **Developer Tools → Authentication** 클릭
4. **"Client-side tokens" 섹션**:
   - "Generate new token" 클릭
   - Token name: `Gena Page Web`
   - "Generate" 클릭
   - 생성된 토큰 복사 (예: `test_abc123...`)

```env
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_abc123...
```

#### 3-3. API Key 가져오기

1. **동일 페이지 (Developer Tools → Authentication)**
2. **"API keys" 섹션**:
   - "Generate new key" 클릭
   - Key name: `Gena Page Server`
   - "Generate" 클릭
   - 생성된 키 복사 (예: `pdl_sdbx_apikey_abc123...`)

```env
PADDLE_API_KEY=pdl_sdbx_apikey_abc123...
```

#### 3-4. Webhook Secret 가져오기

1. **Paddle Dashboard → Notifications → Webhooks**
2. **"Create Webhook" 또는 기존 Webhook 선택**
3. **Webhook URL 설정**:
   ```
   https://yourdomain.com/api/webhooks/paddle
   ```
   (로컬 테스트 시: `http://localhost:3000/api/webhooks/paddle`)

4. **Subscribe to events** (모두 체크 권장):
   - ✅ Subscription Created
   - ✅ Subscription Updated
   - ✅ Subscription Canceled
   - ✅ Transaction Completed
   - ✅ Transaction Updated

5. **Secret key 복사** (예: `pdl_ntfset_abc123...`)

```env
PADDLE_WEBHOOK_SECRET=pdl_ntfset_abc123...
```

#### 3-5. Price ID 가져오기

1. **Paddle Dashboard → Catalog → Prices**
2. **Pro Monthly 플랜 찾기**
3. **Price ID 복사** (예: `pri_abc123...`)

```env
NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY=pri_abc123...
```

---

### 4️⃣ App URL 설정 (1개)

```env
# 로컬 개발
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 프로덕션 (배포 후 변경)
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

### 5️⃣ Admin Emails 설정 (1개)

관리자 페이지에 접근할 이메일 주소:

```env
# 단일 이메일
ADMIN_EMAILS=admin@example.com

# 여러 이메일 (쉼표로 구분)
ADMIN_EMAILS=admin@example.com,admin2@example.com,admin3@example.com
```

⚠️ **중요**: Firebase Authentication에 등록된 이메일이어야 합니다.

---

## 🛡️ 보안 환경 변수 (2개 - 강력 권장)

### CSRF Secret 생성

```bash
# Mac/Linux
openssl rand -base64 32

# Windows (Git Bash)
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

생성된 값을 복사:
```env
CSRF_SECRET=abcd1234efgh5678ijkl9012mnop3456
```

### Cron Secret 생성

동일한 방법으로 다른 값 생성:
```env
CRON_SECRET=wxyz9876stuv5432pqrs1098nmlk5432
```

---

## ✅ 설정 완료 체크리스트

### 필수 항목 (17개)

- [ ] **Firebase Client** (7개)
  - [ ] NEXT_PUBLIC_FIREBASE_API_KEY
  - [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - [ ] NEXT_PUBLIC_FIREBASE_APP_ID
  - [ ] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

- [ ] **Firebase Admin** (3개)
  - [ ] FIREBASE_ADMIN_PROJECT_ID
  - [ ] FIREBASE_ADMIN_CLIENT_EMAIL
  - [ ] FIREBASE_ADMIN_PRIVATE_KEY (큰따옴표 필수!)

- [ ] **Paddle** (5개)
  - [ ] NEXT_PUBLIC_PADDLE_ENVIRONMENT
  - [ ] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  - [ ] PADDLE_API_KEY
  - [ ] PADDLE_WEBHOOK_SECRET
  - [ ] NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY

- [ ] **기타** (2개)
  - [ ] NEXT_PUBLIC_APP_URL
  - [ ] ADMIN_EMAILS

### 권장 항목 (2개)

- [ ] **보안**
  - [ ] CSRF_SECRET
  - [ ] CRON_SECRET

---

## 🧪 설정 확인

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 브라우저에서 확인
```
http://localhost:3000
```

### 3. Firebase 연결 확인
- 로그인 페이지에서 회원가입/로그인 시도
- 콘솔에 에러가 없어야 함

### 4. Admin 페이지 접근 확인
```
http://localhost:3000/admin
```
- ADMIN_EMAILS에 등록한 이메일로 로그인 시 접근 가능

---

## 🔧 문제 해결

### Firebase 에러
```
Error: Firebase: Error (auth/invalid-api-key)
```
→ `NEXT_PUBLIC_FIREBASE_API_KEY` 확인

### Paddle 에러
```
Error: Paddle: Invalid credentials
```
→ `PADDLE_API_KEY` 확인 (Sandbox/Live 모드 확인)

### Admin 접근 불가
```
403 Forbidden
```
→ `ADMIN_EMAILS`에 현재 로그인한 이메일이 포함되어 있는지 확인

### 환경 변수가 인식되지 않음
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버 재시작 (`Ctrl+C` → `npm run dev`)
3. 변수 이름 오타 확인

---

## 📚 추가 참고 자료

- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [Paddle Authentication](https://developer.paddle.com/api-reference/authentication)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**설정 완료 후**: `npm run dev`로 개발 서버를 실행하고 테스트하세요!
