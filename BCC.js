document.addEventListener('DOMContentLoaded', () => {

    // --- 전역 변수 및 DOM 요소 ---
    const pages = document.querySelectorAll('.page');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const clubRegisterForm = document.getElementById('club-register-form');
    const logoutButton = document.getElementById('logout-button');
    let currentUser = null;

    // --- 데이터 (DB 역할) ---
    // <<< 변경점 1: let을 사용하여 변수를 선언하고, loadData 함수를 통해 초기화합니다.
    let users;
    let clubs;
    let applications;

    // --- 데이터 영속성 함수 (localStorage) ---

    // <<< 추가된 함수 1: 로컬 스토리지에서 데이터를 불러오는 함수
    function loadData() {
        // localStorage에서 'users' 데이터를 가져옵니다. 데이터가 없으면 (||) 기본 배열을 사용합니다.
        const usersData = localStorage.getItem('club_users');
        users = usersData ? JSON.parse(usersData) : [
            { id: 'user1', pw: 'pw1', name: '김철수', studentId: '20230001' },
            { id: 'user2', pw: 'pw2', name: '이영희', studentId: '20230002' }
        ];

        // localStorage에서 'clubs' 데이터를 가져옵니다.
        const clubsData = localStorage.getItem('club_clubs');
        clubs = clubsData ? JSON.parse(clubsData) : [
            { id: 1, name: '코딩 동아리 "DevCrew"', category: 'IT/개발', description: '함께 배우고 성장하는 코딩 동아리입니다. 웹, 앱, AI 등 다양한 스터디를 진행합니다.', creatorId: 'user1' },
            { id: 2, name: '사진 동아리 "찰칵"', category: '예술/사진', description: '일상의 순간을 렌즈에 담습니다. 출사, 전시회 등 다양한 활동을 합니다.', creatorId: 'user2' },
            { id: 3, name: '농구 동아리 "건우최고"', category: '스포츠', description: '농구를 사랑하는 사람들의 모임입니다. 매주 정기적으로 경기를 가집니다. 농구부 1짱은 정건우입니다.', creatorId: 'user1' },
            { id: 4, name: '홍보 동아리 "홍보부"', category: '홍보', description: '부소마고의 얼굴 최고 홍보부입니다. 우리 학교를 홍보하기 위해 열심히 회의합니다.', creatorId: 'user1' },
            { id: 5, name: '배드민턴 동아리 "배드민턴"', category: '스포츠', description: '배드민턴을 사랑하는 사람들의 모임입니다. 매주 정기적으로 연습을 가집니다.', creatorId: 'user1' },
            { id: 6, name: '배구 동아리 "배구"', category: '스포츠', description: '배구를 사랑하는 사람들의 모임입니다. 매주 정기적으로 연습을 가집니다.', creatorId: 'user1' },
            { id: 7, name: '디자인 동아리 "디자인"', category: 'IT/디자인', description: '부소마고의 성장의 임계점 디자인 동아리입니다. 졸업작품전, 굿즈, 포토존 등 다 디자인 동아리에서 디자인합니다.', creatorId: 'user1' },
            { id: 8, name: '밴드 동아리 "Semicolon"', category: '예술/음악', description: '없으면 오류나는 밴드하는 동아리입니다. 악기 연주합니다.', creatorId: 'user1' },
        ];

        // localStorage에서 'applications' 데이터를 가져옵니다.
        const applicationsData = localStorage.getItem('club_applications');
        applications = applicationsData ? JSON.parse(applicationsData) : [];
        
        // 처음 로드 시 데이터가 없다면 기본 데이터를 저장해줍니다.
        if (!usersData || !clubsData || !applicationsData) {
            saveData();
        }
    }

    // <<< 추가된 함수 2: 데이터를 로컬 스토리지에 저장하는 함수
    function saveData() {
        // 배열/객체를 문자열로 변환(JSON.stringify)하여 localStorage에 저장합니다.
        localStorage.setItem('club_users', JSON.stringify(users));
        localStorage.setItem('club_clubs', JSON.stringify(clubs));
        localStorage.setItem('club_applications', JSON.stringify(applications));
    }


    // --- 핵심 함수 ---
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.toggle('active', page.id === pageId);
        });
        updateNav();
    }

    function updateNav() {
        const loggedInLinks = document.querySelectorAll('.nav-button.logged-in');
        const loggedOutLinks = document.querySelectorAll('.nav-button.logged-out');

        if (currentUser) {
            loggedInLinks.forEach(link => link.style.display = 'inline-block');
            loggedOutLinks.forEach(link => link.style.display = 'none');
        } else {
            loggedInLinks.forEach(link => link.style.display = 'none');
            loggedOutLinks.forEach(link => link.style.display = 'inline-block');
        }
    }

    // --- 페이지 렌더링 함수 ---
    function renderMainPage() {
        if (currentUser) {
            document.getElementById('welcome-message').textContent = `${currentUser.name}님, 환영합니다!`;
        }
    }

    function renderClubList() {
        const container = document.getElementById('club-list-container');
        container.innerHTML = '';
        clubs.forEach(club => {
            const clubDiv = document.createElement('div');
            clubDiv.className = 'club-item';
            clubDiv.innerHTML = `
                <h3>${club.name}</h3>
                <p>카테고리: ${club.category}</p>
            `;
            clubDiv.addEventListener('click', () => {
                renderClubDetail(club.id);
                showPage('club-detail-page');
            });
            container.appendChild(clubDiv);
        });
    }

    function renderClubDetail(clubId) {
        const club = clubs.find(c => c.id === clubId);
        const container = document.getElementById('club-detail-container');
        if (!club) {
            container.innerHTML = '<p>동아리 정보를 찾을 수 없습니다.</p>';
            return;
        }

        let buttonHtml = '';
        const hasApplied = applications.some(app => app.userId === currentUser.id && app.clubId === club.id);
        const isCreator = club.creatorId === currentUser.id;

        if (isCreator) {
            buttonHtml = `<button class="button" disabled>내가 만든 동아리입니다.</button>`;
        } else if (hasApplied) {
            buttonHtml = `<button class="button" disabled>신청 완료</button>`;
        } else {
            buttonHtml = `<button class="button" id="join-club-button" data-club-id="${club.id}">가입 신청</button>`;
        }

        container.innerHTML = `
            <h3>${club.name}</h3>
            <p><strong>카테고리:</strong> ${club.category}</p>
            <p><strong>소개:</strong> ${club.description}</p>
            ${buttonHtml}
        `;

        if (!hasApplied && !isCreator) {
            document.getElementById('join-club-button').addEventListener('click', (e) => {
                const clickedClubId = parseInt(e.target.dataset.clubId, 10);
                applications.push({
                    userId: currentUser.id,
                    clubId: clickedClubId,
                    name: currentUser.name,
                    studentId: currentUser.studentId
                });
                
                // <<< 변경점 2: 데이터 변경 후 저장 함수 호출
                saveData(); 
                
                alert(`'${club.name}' 동아리에 가입 신청이 완료되었습니다!`);
                renderClubDetail(clickedClubId); // 버튼 상태 업데이트를 위해 다시 렌더링
            });
        }
    }

    function renderMyPage() {
        if (!currentUser) return;

        // 1. 내 정보 렌더링
        document.getElementById('mypage-info').innerHTML = `
            <p><strong>아이디:</strong> ${currentUser.id}</p>
            <p><strong>이름:</strong> ${currentUser.name}</p>
            <p><strong>학번:</strong> ${currentUser.studentId}</p>
        `;

        // 2. 내가 가입 신청한 동아리 목록 렌더링
        const myAppsContainer = document.getElementById('my-applications-list');
        const myApplications = applications.filter(app => app.userId === currentUser.id);
        if (myApplications.length > 0) {
            myAppsContainer.innerHTML = '<ul class="my-application-list">' + myApplications.map(app => {
                const club = clubs.find(c => c.id === app.clubId);
                return `<li>${club ? club.name : '알 수 없는 동아리'}</li>`;
            }).join('') + '</ul>';
        } else {
            myAppsContainer.innerHTML = '<p>가입 신청한 동아리가 없습니다.</p>';
        }

        // 3. 내가 등록한 동아리 및 신청자 목록 렌더링
        const myClubsContainer = document.getElementById('my-clubs-and-applicants');
        const myClubs = clubs.filter(club => club.creatorId === currentUser.id);
        if (myClubs.length > 0) {
            myClubsContainer.innerHTML = myClubs.map(club => {
                const applicants = applications.filter(app => app.clubId === club.id);
                let applicantsHtml = '';
                if (applicants.length > 0) {
                    applicantsHtml = '<ul class="applicant-list">' + applicants.map(app =>
                        `<li>${app.name} (${app.studentId})</li>`
                    ).join('') + '</ul>';
                } else {
                    applicantsHtml = '<p>아직 신청자가 없습니다.</p>';
                }
                return `
                    <div class="my-club-item">
                        <h5>${club.name}</h5>
                        ${applicantsHtml}
                    </div>
                `;
            }).join('');
        } else {
            myClubsContainer.innerHTML = '<p>등록한 동아리가 없습니다.</p>';
        }
    }

    // --- 이벤트 리스너 ---
    document.body.addEventListener('click', (e) => {
        const pageLink = e.target.closest('[data-page]');
        if (pageLink) {
            e.preventDefault();
            const pageId = pageLink.getAttribute('data-page');
            if (pageId === 'mypage-page') renderMyPage();
            if (pageId === 'club-list-page') renderClubList();
            showPage(pageId);
        }
        if (e.target.closest('#logo')) {
            e.preventDefault();
            if (currentUser) {
                renderMainPage();
                showPage('main-page');
            } else {
                showPage('login-page');
            }
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('login-id').value;
        const pw = document.getElementById('login-pw').value;
        const user = users.find(u => u.id === id && u.pw === pw);

        if (user) {
            currentUser = user;
            renderMainPage();
            showPage('main-page');
            loginForm.reset();
        } else {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('signup-id').value;
        const pw = document.getElementById('signup-pw').value;
        const name = document.getElementById('signup-name').value;
        const studentId = document.getElementById('signup-student-id').value;

        if (users.some(u => u.id === id)) {
            alert('이미 존재하는 아이디입니다.');
        } else {
            users.push({ id, pw, name, studentId });
            
            // <<< 변경점 3: 데이터 변경 후 저장 함수 호출
            saveData();

            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            showPage('login-page');
            signupForm.reset();
        }
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentUser = null;
        showPage('login-page');
    });

    clubRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('club-name').value;
        const category = document.getElementById('club-category').value;
        const description = document.getElementById('club-description').value;
        const newClub = {
            id: clubs.length > 0 ? Math.max(...clubs.map(c => c.id)) + 1 : 1,
            name,
            category,
            description,
            creatorId: currentUser.id
        };
        clubs.push(newClub);

        // <<< 변경점 4: 데이터 변경 후 저장 함수 호출
        saveData();
        
        alert('새로운 동아리가 성공적으로 등록되었습니다!');
        clubRegisterForm.reset();
        renderClubList();
        showPage('club-list-page');
    });

    // --- 초기화 ---
    // <<< 변경점 5: 스크립트 시작 시 로컬 스토리지에서 데이터를 불러옵니다.
    loadData();
    showPage('login-page');
});