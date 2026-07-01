# BSSM-CLUB-CONNETT

## BSSM-Club-Connect
### 프로젝트 소개
BSSM-Club-Connect는 부산소프트웨어마이스터고등학교 학생들이 교내 동아리 정보를 쉽고 편하게 확인하며 지원할 수 있도록 만든 동아리 홍보 및 모집 플랫폼. 학생들은 관심 있는 동아리를 찾아보고 모집 공고를 확인할 수 있으며, 동아리 담당자는 동아리 소개와 모집 정보를 등록할 수 있다.

### 핵심 기능
1. 회원가입 및 로그인
2. 동아리 목록 조회
3. 동아리 상세 정보 확인
4. 동아리 모집 공고 등록 및 관리
5. 동아리 모집 공고 조회
6. 동아리 지원서 작성
7. 마이페이지에서 지원 현황 확인

### 테이블 구성
1. User(user_id, name, student_number, email, password)
: 회원 정보를 저장하는 테이블
2. Club(club_id, club_name, category, description, leader_id)
: 동아리 정보를 저장하는 테이블
3. Recruitment(recruitment_id, club_id, title, content, start_date, end_date)
: 동아리 모집 공고 정보를 저장하는 테이블
4. Application(application_id, user_id, recruitment_id, motivation, status, apply_date)
: 동아리 지원 정보를 저장하는 테이블

### 화면 구성
1. 로그인 화면
2. 회원가입 화면
3. 메인 화면
4. 동아리 목록 화면
5. 동아리 상세 화면
6. 모집 공고 화면
7. 지원서 작성 화면
8. 마이페이지
9. 관리자(동아리 담당자) 화면

### 개발 환경
* HTML
* CSS
* JavaScript
* MySQL
* Docker
* GitHub
* Nginx
