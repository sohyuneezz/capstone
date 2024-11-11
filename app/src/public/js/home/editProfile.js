document.addEventListener('DOMContentLoaded', function () {
    let pwck = 0;

    function checkPasswordMatch() {
        const userPw = document.getElementById('userPw').value;
        const userPwChk = document.getElementById('userPwChk').value;
        const sameMessage = document.getElementById('same');

        if (userPw !== userPwChk) {
            sameMessage.innerHTML = '비밀번호가 일치하지 않습니다.';
            sameMessage.style.color = 'red';
            pwck = 0;
        } else {
            sameMessage.innerHTML = '비밀번호가 일치합니다.';
            sameMessage.style.color = 'green';
            pwck = 1;
        }
    }

    const editForm = document.getElementById('editForm'); 
    console.log("editForm:", editForm); // 폼 요소가 제대로 불러와졌는지 확인

    if (editForm) {
        editForm.addEventListener('submit', function (event) {
            event.preventDefault(); // 기본 폼 제출 방지

            const formData = {
                id: document.getElementById('userId').value,
                password: document.getElementById('userPw').value,
                grade: document.getElementById('grade-select').value, 
                email: document.getElementById('email').value + '@' + document.getElementById('domain').value
            };

            console.log("Form data to be sent:", formData); // 전송되는 데이터 확인

            fetch('/editprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log("Server response:", data); // 서버 응답 확인
                if (data.success) {
                    alert('프로필이 성공적으로 수정되었습니다.');
                } else {
                    alert('프로필 수정에 실패했습니다: ' + data.msg);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
    function fn_input_password() {
        document.getElementById('userPw').disabled = false;
        document.getElementById('userPwChk').disabled = false;
    }    
    document.getElementById('userPw').addEventListener('input', checkPasswordMatch);
    document.getElementById('userPwChk').addEventListener('input', checkPasswordMatch);
});
