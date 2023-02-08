function submitQuestionData() {
    var question_id = $('input[name="question_id"]') != null ? $('input[name="question_id"]').val() : ""
    var noi_dung_cau_hoi = getEditorContent('editor-cau-hoi')
    if (noi_dung_cau_hoi == null || noi_dung_cau_hoi == "") {
        setAlertWarning("Bạn chưa nhập nội dung câu hỏi.")
        return
    }
    let submit = true
    $('[id^=editor-cau-tra-loi]').each(function (i, item) {
        if (getEditorContent($(item).attr('id')) == null || getEditorContent($(item).attr('id')) == "") {
            setAlertWarning("Câu trả lời không được để trống")
            submit = false
            return
        }
    })

    var countCheck = 0
    $('[id^=dap-an]').each(function (i, item) {
        if ($(item).find('input[name="list-radio"]').prop('checked')) {
            countCheck++
        }
    })
    if (countCheck == 0) {
        setAlertWarning("Hãy chọn đáp án đúng")
        return
    }
    if (submit == false) return

    var confirm_title = !question_id ? 'Xác nhận tạo mới' : 'Xác nhận cập nhật'
    var confirm_content = !question_id ? 'Bạn có xác nhận muốn tạo mới câu hỏi này?' : 'Bạn có xác nhận muốn cập nhật câu hỏi này?'
    showPopupConfirm(confirm_title, confirm_content, "Xác nhận", () => {
        var formData = new FormData()
        // lớp
        formData.set('grade', $('select[name="grade"] option:selected').val())
        // chủ đề chủ điểm
        var subtopics_id = get_all_checked_topic()
        formData.set('topic_question', JSON.stringify(subtopics_id))
        // get nội dung câu hỏi
        formData.set('content', getEditorContent('editor-cau-hoi', false))
        // nội dung trả lời
        var answer_contents = []
        
        $('#box-view-right-answer .answer-item').each((i, item) => {
            const editorId = $(item).data('answer-id')
            const uid = $(item).attr('id')
            const noi_dung = getEditorContent(editorId)
            if (noi_dung) {
                /*if ($(item).find('input[name="list-radio"]:checked') != null) {*/
                if ($(item).find('input[name="list-radio"]:checked') != null && $(item).find('input[name="list-radio"]:checked').length != 0) {
                    answer_contents.push({
                        noi_dung: noi_dung,
                        uid: uid,
                        la_dap_an_dung:true
                    })
                }
                else {
                    answer_contents.push({
                        noi_dung: noi_dung,
                        uid: uid,
                        la_dap_an_dung: false
                    })
                }
            }
        })
        //$('[id^=editor-cau-tra-loi]').each(function (i, item) {
        //    var noi_dung = getEditorContent($(item).attr('id'))
        //    let ans_content = {
        //       noi_dung: noi_dung,
        //       uid: uid
        //    }
        //    if (($item).attr('id') == editorId) {
        //        ans_content.la_dap_an_dung = true
        //    }
        //    else {
        //        ans_content.la_dap_an_dung = false
        //    }
        //    answer_contents.push(ans_content)
        //})
        formData.set('answer_contents', JSON.stringify(answer_contents))
       /* formData.set('right_answer', right_answer)*/
        formData.set('control_answer_info', $('#answer-region').html())
        // lời giải
        formData.set('explain', getEditorContent('editor-loi-giai', false))
        // id câu hỏi (trường hợp chỉnh sửa)
        formData.set('question_id', question_id)
        // đáp án ngẫu nhiên
        formData.set('random_answer', $('[name="random_answer"]').prop('checked'))
        formData.set('exercise_id', $('#exercise_id').val())
        formData.set('type', DangCauHoi.LUA_CHON_DUNG_SAI)
        formData.set('knowledge_degree', $('[name="knowledge_degree"] option:selected').val())

        $.ajax({
            method: 'post',
            url: '/exercises/ajax/insert-update-question',
            contentType: false, processData: false,
            data: formData,
            success: function (res) {
                if (res.success) {
                    setAlertSuccess(res.msg)
                        .then(() => {
                            // di chuyển sang tạo mới (câu hỏi vừa tạo được view lại ở câu hỏi đã tạo bên dưới)
                            window.location.href = res.return_url
                        })
                }
                else {
                    setAlertError(res.msg)
                }
            }

        })
    })
}

function initRightAnswer(rAnswerId, answerDatas, answerIds, type) {
    var listAsnwerDatas = (answerDatas != "") ? JSON.parse(answerDatas) : ""
    if (Array.isArray(listAsnwerDatas)) {
        listAsnwerDatas.forEach(function (item, i) {
            var uniqueId = new Date().getTime().toString() + Math.round((Math.random() * 10000)).toString()
            const eAnswerTmpl = $.templates('#EDITOR_DAP_AN')
            const isChecked = item.uid == rAnswerId
            const editorRightAnswer = eAnswerTmpl.render({ editorId: 'dap-an' + uniqueId, text: item.noi_dung, answer_id: answerIds[i], is_active: isChecked?'active':'',checked:isChecked?'checked':'', type: 'radio', identity :0})
            $('#box-view-right-answer').append(editorRightAnswer)
        })
    }
}