
function submitQuestionData() {
    var question_id = $('input[name="question_id"]') != null ? $('input[name="question_id"]').val() : ''
    const noiDungCauHoi = getEditorContent('editor-cau-hoi')
    if (!noiDungCauHoi || noiDungCauHoi == '') {
        setAlertWarning('Bạn chưa nhập nội dung câu hỏi!')
        return
    }


    var answer_contents = new Array()
    //let empty_answer = false
    $('#form-dap-an').serializeArray().every(function (item) {
        //if (item.value == '' || !item.value) {
        //    //empty_answer = true
        //    return false
        //}
        answer_contents.push({name:item.name, value:item.value})
    })
    //if (empty_answer) {
    //    setAlertWarning('Bạn chưa nhập đủ đáp án!')
    //    return
    //}
    var confirm_title = !question_id ? 'Xác nhận tạo mới' : 'Xác nhận cập nhật'
    var confirm_content = !question_id ? 'Bạn có xác nhận muốn tạo mới câu hỏi này?' : 'Bạn có xác nhận muốn cập nhật câu hỏi này?'
    showPopupConfirm(confirm_title, confirm_content, "Xác nhận", () => {
        var formData = new FormData()
        formData.set('exercise_id', $('#exercise_id').val())
        formData.set('type', DangCauHoi.TU_LUAN)
        formData.set('grade', $('select[name="grade"] option:selected').val())
        // chủ đề chủ điểm
        var subtopics_id = get_all_checked_topic();
        formData.set('topic_question', JSON.stringify(subtopics_id))
        // get nội dung câu hỏi
        formData.set('content', noiDungCauHoi)
        //nội dung trả lời
        formData.set('answer_content', JSON.stringify(answer_contents))
        // đáp án
        formData.set('right_answer', JSON.stringify(answer_contents))
        // lời giải
        formData.set('explain', getEditorContent('editor-loi-giai'))
        formData.set('question_id', question_id)
        formData.set('knowledge_degree', $('[name="knowledge_degree"] option:selected').val())

        $.ajax({
            type: 'post',
            url: '/exercises/ajax/insert-update-question',
            data: formData,
            processData: false,
            contentType: false,

            success: function (res) {
                if (res.success) {
                    setAlertSuccess(res.msg)
                        .then(() => {
                             window.location.href = res.return_url
                        })
                }
                else {
                    setAlertError(res.msg)
                }
            },
            error: function (err) {
                console.error(err)
            }
        })
    })
}