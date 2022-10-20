// 아이디 유효성 검사
let idCh = 0;
$('#id').focusout(function(){
    const userId = $('#id').val();
    const idCheck = /^[a-z0-9]{4,12}$/;

    if(userId === '') {
        $('.text_id').text('필수 정보입니다.');
        $('.text_id').css('color', 'red');
        idCh = 0;
        return false;
    } else if(!idCheck.test(userId)) {
        $('.text_id').text('4~12자 영문 소문자, 숫자를 사용하세요');
        $('.text_id').css('color', 'red');
        idCh = 0;
        return false;
    };
    $.ajax({
        type : 'POST',
        url : "/signup/id",
        data : {id: userId},
    }).done(function(duplicatedId){
        // 아이디가 중복일 경우
        if(duplicatedId === '이미 사용중이거나 탈퇴한 아이디입니다.') {
            $('.text_id').css('color', 'red');
            $('.text_id').text(duplicatedId);
            idCh = 0;
        } else {
            $('.text_id').css('color', 'green');
            $('.text_id').text(duplicatedId);
            idCh = 1;
        };
    });
})

// 비밀번호 유효성 검사
let pwCh = 0;
$('#pw').focusout(function(){
    const userId = $('#id').val();
    const userPw = $('#pw').val();
    // const number = userPw.search(/[0-9]/g);
    // const english = userPw.search(/[a-z]/ig);
    // const spece = userPw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    const pwCheck = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;

    if(userPw === '') {
        $('.text_pw').text('필수 정보입니다.');
        $('.text_pw').css('color', 'red');
        pwCh = 0;
        return false;
    } else if(!pwCheck.test(userPw)) {
        $('.text_pw').text('8~16자 영문 대 소문자, 숫자, 특수문자를 혼합하여 사용하세요.');
        $('.text_pw').css('color', 'red');
        pwCh = 0;
        return false;
    } else if(/(\w)\1\1/.test(userPw)){
        $('.text_pw').text('같은 문자를 3번 이상 사용하실 수 없습니다.');
        $('.text_pw').css('color', 'red');
        pwCh = 0;
        return false;
    } else if((userId == '')){
        $('.text_pw').text('아이디를 먼저 입력해주세요.');
        $('.text_pw').css('color', 'red');
        pwCh = 0;
        return false;
    }else if(userPw.search(userId) > -1){
        $('.text_pw').text('비밀번호에 아이디가 포함되었습니다.');
        $('.text_pw').css('color', 'red');
        pwCh = 0;
        return false;
    }  else {
        $('.text_pw').text('비밀번호 사용가능');
        $('.text_pw').css('color', 'green');
        pwCh = 1;
        return true;
    };
});

// 비밀번호 재확인 유효성 검사
let rpwCh = 0; 
$('#rpw').focusout(function(){
    const userPw = $('#pw').val();
    const userRPw = $('#rpw').val();

    if(userRPw === '') {
        $('.text_rpw').text('필수 정보 입니다'); 
        $('.text_rpw').css('color', 'red');
        rpwCh = 0; 
        return false;
    } else if(userPw !== userRPw) {
        $('.text_rpw').text('설정하려는 비밀번호가 맞는지 확인하기 위해 다시 입력 해주세요.'); 
        $('.text_rpw').css('color', 'red');
        rpwCh = 0; 
        return false;
    } else {
        $('.text_rpw').text('비밀번호가 일치합니다.');
        $('.text_rpw').css('color', 'green');
        rpwCh = 1;
        return true;
    };
});

// 닉네임 유효성 검사
let nameCh = 0;
$('#name').focusout(function(){
    const userName = $('#name').val();
    const nameCheck = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
    if(userName === '') {
        $('.text_name').text('필수 정보입니다.');
        $('.text_name').css('color', 'red');
        nameCh = 0;
        return false;
    } else if(!nameCheck.test(userName)) {
        $('.text_name').text('2~8자의 한글, 영문 소문자, 숫자만 사용 가능합니다.');
        $('.text_name').css('color', 'red');
        nameCh = 0;
        return false;
    };
    $.ajax({
        type : 'POST',
        url : "/signup/name",
        data : {name: userName},
    }).done(function(duplicatedName){
        if(duplicatedName === '이미 사용중이거나 탈퇴한 닉네임입니다.') {
            $('.text_name').css('color', 'red');
            $('.text_name').text('이미 사용중이거나 탈퇴한 닉네임입니다.');
            nameCh = 0;
        } else {
            $('.text_name').css('color', 'green');
            $('.text_name').text('사용 가능한 닉네임 입니다.');
            nameCh = 1;
        };
    });
});

function signupClick() {
    const signupForm = document.signup;
    const userId = $('#id').val();
    const userPw = $('#pw').val();
    const userRPw = $('#rpw').val();
    const userName = $('#name').val();

    if (idCh === 1 && pwCh === 1 && rpwCh === 1 && nameCh === 1) {
        alert("회원가입을 축하합니다");
        signupForm.submit();
    } else if(userId === '') {
        $('#id').focus();
        $('.text_id').css('color', 'red');
        $('.text_id').text('필수 정보입니다.');
        return false;
    } else if(userPw === '') {
        $('#pw').focus();
        $('.text_pw').css('color', 'red');
        $('.text_pw').text('필수 정보입니다.');
        return false;
    } else if(userRPw === '') {
        $('#rpw').focus();
        $('.text_rpw').css('color', 'red');
        $('.text_rpw').text('필수 정보입니다.');
        return false;
    } else if(userName === '') {
        $('#name').focus();
        $('.text_name').css('color', 'red');
        $('.text_name').text('필수 정보입니다.');
        return false;
    }
}

window.history.forward(); function noBack() {
    window.history.forward();
}
