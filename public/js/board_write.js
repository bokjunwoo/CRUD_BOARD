function subPost() {
    const writeForm = document.write;
    const boardTitle = $('#title').val();
    const boardContent = $('#content').val();

    if (boardTitle === '') {
        alert('제목을 입력 해주세요');
        return false;
    } else if (boardContent === '') {
        alert('내용을 입력 해주세요');
        return false;
    } else {
        alert('저장 되었습니다');
        writeForm.submit();
    }
}