# IMAGINE PRODUCTION 홈페이지

GitHub Pages로 무료 호스팅하는 정적 홈페이지입니다.
**모든 문구·이미지·가격은 `data/` 폴더의 JSON 파일에 있어서, 코드를 몰라도 JSON만 수정하면 사이트가 바뀝니다.**

## 폴더 구조

```
index.html        HOME (메인)
brand.html        BRAND (회사 소개)
wedding.html      WEDDING (웨딩 상품 · 견적 계산)
contact.html      CONTACT (연락처 · 문의 양식)
404.html          없는 주소 접속 시 표시
data/
  site.json       회사명, 대표, 사업자번호, 주소, 전화, 이메일, 상단 메뉴
  home.json       메인 슬라이드 이미지/문구, 소개, 메뉴 카드
  brand.json      회사 소개, 철학, 서비스, 연혁
  wedding.json    웨딩 패키지, 추가 옵션, 가격, 진행 절차
assets/
  css/style.css   디자인 (맨 위 :root 에서 색상·폰트 변경)
  js/main.js      화면 구성 로직 (보통 수정할 필요 없음)
  images/         이미지 파일
```

## 1. GitHub에 올리기 (최초 1회)

1. GitHub에서 새 저장소(Repository) 생성 — 예: `imagine-production`
2. **Add file → Upload files** 로 이 폴더 안의 파일/폴더를 전부 끌어다 놓고 **Commit changes**
3. 저장소 **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save
4. 1~2분 후 `https://<아이디>.github.io/imagine-production/` 에서 확인

## 2. 내용 수정 · 추가하기

GitHub 웹에서 JSON 파일을 열고 ✏️(연필) 버튼 → 수정 → **Commit changes** 하면 1~2분 뒤 반영됩니다.

- **회사 정보 변경**: `data/site.json` 의 `ceo`, `businessNumber`, `address`, `tel`, `email` 등
- **메인 슬라이드 추가**: `data/home.json` 의 `slides` 에 항목 추가
  ```json
  { "image": "assets/images/새이미지.jpg", "eyebrow": "WEDDING", "title": "첫 줄\n둘째 줄", "text": "설명" }
  ```
- **웨딩 패키지 추가/가격 변경**: `data/wedding.json` 의 `packages` (가격은 쉼표 없이 숫자로: `3500000`)
  - `"featured": true` 를 넣은 패키지에 BEST 표시
- **추가 옵션**: `data/wedding.json` 의 `options` — 견적 계산기에 자동 반영
- **연혁 추가**: `data/brand.json` 의 `history` 맨 위에 추가

> JSON 주의: 항목 사이 쉼표(,)를 빠뜨리거나, 마지막 항목 뒤에 쉼표를 붙이면 페이지가 안 뜹니다.
> 수정 후 화면이 비어 있으면 https://jsonlint.com 에 붙여넣어 오류를 확인하세요.

## 3. 이미지 교체

- 현재 `ph-*.jpg` 파일은 **임시 이미지(SAMPLE IMAGE)** 입니다.
- `assets/images/` 에 같은 이름으로 덮어쓰거나, 새 파일을 올리고 JSON의 경로를 바꾸세요.
- 권장: 가로 1600~2400px, JPG, 1장당 500KB 이하 (용량이 크면 로딩이 느려집니다)

## 4. 문의 양식 실제로 받기

GitHub Pages는 서버가 없어서 양식 내용을 직접 저장할 수 없습니다. 현재는 **메일 앱을 여는 방식**이며,
실제 접수를 원하면 무료 폼 서비스를 연결하세요.

1. https://formspree.io 가입 → New Form → 받을 이메일 입력
2. 발급된 주소(예: `https://formspree.io/f/abcdwxyz`)를 `data/site.json` 의 `contactFormEndpoint` 에 입력
3. 이후 문의가 이메일로 도착합니다.

## 5. 지도 넣기

`assets/js/main.js` 에서 `MAP — 지도 삽입 위치` 부분의 `<div class="map">...</div>` 를
네이버/카카오/구글 지도의 "공유 → 퍼가기(iframe)" 코드로 바꾸면 됩니다.

## 6. 공식 도메인 연결 (예: imagineproduction.co.kr)

1. 저장소 **Settings → Pages → Custom domain** 에 도메인 입력 → Save (저장소에 `CNAME` 파일 자동 생성)
2. 도메인 구입처 DNS에 추가
   - `A` 레코드 4개: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → `CNAME` → `<아이디>.github.io`
3. 연결 후 **Enforce HTTPS** 체크

## 7. 새 메뉴/페이지 추가하기 (예: GALLERY)

1. `brand.html` 을 복사해 `gallery.html` 로 만들고 `<body data-page="gallery">` 로 변경
2. `data/site.json` 의 `menu` 에 `{ "label": "GALLERY", "href": "gallery.html" }` 추가 → 상단·하단 메뉴 자동 반영
3. `assets/js/main.js` 에 `renderGallery` 함수를 추가 (기존 `renderBrand` 참고)

## 로컬에서 미리보기

JSON을 불러오기 때문에 `index.html` 을 더블클릭하면 데이터가 안 보입니다. 폴더에서 아래 명령 실행 후
`http://localhost:8000` 접속:

```
python -m http.server 8000
```
(또는 VS Code의 Live Server 확장 사용)
