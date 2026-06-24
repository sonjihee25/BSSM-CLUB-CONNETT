document.addEventListener('DOMContentLoaded', () => {

    // ======================================================================
    // 1. 화면 전환(페이지 넘기기) 로직
    // ======================================================================
    
    // 화면 전환을 트리거하는 모든 버튼과 링크([data-target] 속성을 가진 요소)를 선택합니다.
    const navLinks = document.querySelectorAll('[data-target]');
    // 모든 화면 섹션을 선택합니다.
    const sections = document.querySelectorAll('.page-section');

    // 특정 ID를 가진 화면을 보여주는 함수
    function showSection(targetId) {
        // 모든 섹션에서 'active' 클래스를 제거하여 숨깁니다.
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // 목표로 하는 섹션을 ID로 찾습니다.
        const targetSection = document.getElementById(targetId);
        // 해당 섹션이 존재하면 'active' 클래스를 추가하여 보여줍니다.
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // 각 네비게이션 링크에 클릭 이벤트를 추가합니다.
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // a 태그의 기본 동작(페이지 새로고침 등)을 막습니다.
            event.preventDefault(); 
            
            // 클릭된 링크의 'data-target' 속성 값을 가져옵니다.
            const targetId = link.dataset.target;
            
            // 해당 ID를 가진 섹션을 보여주는 함수를 호출합니다.
            showSection(targetId);
        });
    });


    // ======================================================================
    // 2. 회원가입 및 로그인 처리 로직
    // ======================================================================

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    // 회원가입 폼 제출 이벤트 처리
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault(); // 폼 기본 제출 동작 방지
            
            // 입력값 가져오기
            const name = document.getElementById('name').value.trim();
            const studentNumber = document.getElementById('student-number').value.trim();
            const email = document.getElementById('email-signup').value.trim();
            const password = document.getElementById('password-signup').value.trim();

            if (!name || !studentNumber || !email || !password) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('bssm_users')) || [];
            const isUserExist = users.find(user => user.email === email);
            if (isUserExist) {
                alert('이미 가입된 이메일입니다.');
                return;
            }

            const newUser = { name, studentNumber, email, password };
            users.push(newUser);
            localStorage.setItem('bssm_users', JSON.stringify(users));

            alert('회원가입이 성공적으로 완료되었습니다! 로그인 해주세요.');
            signupForm.reset();
            
            // 회원가입 성공 후 로그인 화면으로 자동 전환
            showSection('login-screen');
        });
    }

    // 로그인 폼 제출 이벤트 처리
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                alert('이메일과 비밀번호를 모두 입력해주세요.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('bssm_users')) || [];
            const user = users.find(u => u.email === email);

            if (!user) {
                alert('존재하지 않는 이메일입니다.');
            } else if (user.password !== password) {
                alert('비밀번호가 일치하지 않습니다.');
            } else {
                alert(`${user.name}님, 환영합니다!`);
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                loginForm.reset();

                // 로그인 성공 후 메인 화면으로 자동 전환
                showSection('main-screen');
            }
        });
    }
});