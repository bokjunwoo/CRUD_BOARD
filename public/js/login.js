function loginClick() {
    const loginForm = document.login;
    const userId = $('#id').val();
    const userPw = $('#pw').val();

    if (userId == '' || userPw == '') {
        $('#err').css('color', 'gray')
        $('#err').css('display', 'block')
    };

    $.ajax({
        type : 'POST',
        url : "/login",
        data : {
            id: userId,
            pw: userPw,
        },
    }).done(function(result){ 
        if (result === '비밀번호가 다릅니다.') {
            $('#err').css('color', 'gray');
            $('#err').css('display', 'block');
            return false;
        } else if (result === '해당 id 가 없습니다.') {
            $('#err').css('color', 'gray');
            $('#err').css('display', 'block');
            return false;
        } else {
            loginForm.submit();
        };
    });
}
