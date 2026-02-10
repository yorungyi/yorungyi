# ProVision AI - Cloudflare Pages 배포 가이드

## 🚀 Cloudflare Pages 배포 방법

### 방법 1: GitHub 연동 (추천)

1. **Cloudflare Dashboard 접속**
   - https://dash.cloudflare.com/ 로그인
   - 좌측 메뉴에서 "Workers & Pages" 클릭

2. **새 프로젝트 생성**
   - "Create application" → "Pages" → "Connect to Git" 클릭
   - GitHub 계정 연동 (승인 필요)
   - `yorungyi/yorungyi` 저장소 선택

3. **빌드 설정**
   ```
   Project name: provisionai
   Production branch: main
   Build command: (비워둠 - 정적 사이트)
   Build output directory: /
   Root directory: /
   ```

4. **배포 완료**
   - "Save and Deploy" 클릭
   - 자동으로 `provisionai.pages.dev`에 배포됩니다
   - 이후 GitHub에 푸시하면 자동으로 재배포됩니다! 🎉

### 방법 2: Wrangler CLI (로컬에서 직접 배포)

만약 CLI로 배포하고 싶다면:

```bash
# Wrangler 설치
npm install -g wrangler

# Cloudflare 로그인
wrangler login

# Pages 배포
wrangler pages deploy . --project-name=provisionai
```

## 📝 현재 상태

- ✅ GitHub 저장소: https://github.com/yorungyi/yorungyi
- ✅ 최신 코드 푸시 완료
- 🎯 목표 도메인: provisionai.pages.dev

## 🔗 다음 단계

1. 위의 **방법 1**을 따라 Cloudflare Dashboard에서 GitHub 연동
2. 자동 배포 설정 완료
3. `provisionai.pages.dev`에서 라이브 확인!

---

**참고**: 정적 HTML/CSS/JS 앱이므로 빌드 과정이 필요 없습니다. 파일을 그대로 배포하면 됩니다.
