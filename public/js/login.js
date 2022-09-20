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
        if(result === '오류') {
            $('#err').css('color', 'gray');
            $('#err').css('display', 'block');
        } else {
            loginForm.submit();
        };
    });
}
