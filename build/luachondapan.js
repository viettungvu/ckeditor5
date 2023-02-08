//Khởi tạo editor nhập đáp án cho các dạng trắc nghiệm
function initRightAnswer(rAnswerId, answerDatas, answerIds, type) {
    var listAsnwerDatas = (answerDatas != "") ? JSON.parse(answerDatas) : ""
    var rAnswerIds = []
    if (typeof (rAnswerId) === "string") {
        if (rAnswerId.includes("|||")) {
            rAnswerIds = rAnswerId.split("|||")
        }
        else {
            rAnswerIds.push(rAnswerId)
        }
    }
    if (Array.isArray(listAsnwerDatas)) {
        listAsnwerDatas.forEach(function (item, i) {
            var uniqueId = new Date().getTime().toString() + Math.round((Math.random() * 10000)).toString()
            const eAnswerTmpl = $.templates('#EDITOR_DAP_AN')
            const isChecked = rAnswerIds.indexOf(item.uid) != -1

            const editorRightAnswer = eAnswerTmpl.render({ editorId: 'dap-an' + uniqueId, text: item.noi_dung, answer_id: answerIds[i], current_index: i + 1, checked: isChecked ? "checked" : "", is_active: isChecked ? "active" : "", type: type == DangTracNghiem.TRAC_NGHIEM_MOT_DAP_AN ? "radio" : "checkbox", right_answer_identity: AnswerIdentity[i] })
            $('#box-view-right-answer').append(editorRightAnswer)
        })
    }
}

function checkMoreAnswer(sender) {
    if (sender.is(':checked')) {
        $('#box-view-right-answer input[name="list-radio"]').prop('type', 'checkbox')
        $('.question-list-radio input[type="checkbox"]').unbind('change')
        $('.question-list-radio input[type="checkbox"]').change(function () {
            $(this).closest(".question-list-radio").find(".item").removeClass("active");
            $('.question-list-radio input[type="checkbox"]').each(function (i, item) {
                var e = $(item).closest(".row");
                $(item).is(":checked") ? e.find(".item").addClass("active") : e.find(".item").removeClass("active");
            })
        })
    }
    else {
        $('#box-view-right-answer input[name="list-radio"]').prop('type', 'radio')
        $('.question-list-radio input[type="radio"]').unbind('change')
        $('.question-list-radio input[type="radio"]').change(function () {
            $(this).closest(".question-list-radio").find(".item").removeClass("active");
            var e = $(this).closest(".row");
            $(this).is(":checked") ? e.find(".item").addClass("active") : e.find(".item").removeClass("active");
        })
    }
    $('#box-view-right-answer input[name="list-radio"]').prop('checked', false)
    $('#box-view-right-answer input[name="list-radio"]').closest('.row.gutters-6').find('.item').removeClass('active')
}

function update_data() {
    // Đồng bộ dữ liệu trước khi update
    $('[id^=editor-cau-tra-loi]').each(function (i, item) {
        var content_answer_ele = $(item).find('.question-editor__content')
        var editorId = $(content_answer_ele).data('editor-id')
        $(content_answer_ele).html(getEditorContent(editorId))
        // đồng bộ với đáp án
        var right_answer_ele = $('[id^=dap-an]').filter(function () {
            return $(this).data('answer-id') == editorId
        })
        if (right_answer_ele != null && right_answer_ele != undefined) {
            $(right_answer_ele).find('[name="right_answer_content"]').html(getEditorContent(editorId))
        }
    })
}

function submitQuestionData() {
    // check lỗi
    var question_id = $('input[name="question_id"]') != null ? $('input[name="question_id"]').val() : ""
    var noi_dung_cau_hoi = getEditorContent('editor-cau-hoi')
    if (noi_dung_cau_hoi == null || noi_dung_cau_hoi == "") {
        setAlertWarning("Bạn chưa nhập nội dung câu hỏi.")
        return
    }
    $('[id^=editor-cau-tra-loi]').each(function (i, item) {
        if (getEditorContent($(item).attr('id')) == null || getEditorContent($(item).attr('id')) == "") {
            setAlertWarning("Câu trả lời không được để trống")
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
    if (countCheck == 1 && $('.chk-more-answer').prop('checked')) {
        setAlertWarning("Nếu tích chọn nhiều đáp án, số đáp án được chọn phải nhiều hơn một đáp án")
        return
    }

    var question_id = $('input[name="question_id"]') != null ? $('input[name="question_id"]').val() : ""
    var confirm_title = !question_id ? 'Xác nhận tạo mới' : 'Xác nhận cập nhật'
    var confirm_content = !question_id ? 'Bạn có xác nhận muốn tạo mới câu hỏi này?' : 'Bạn có xác nhận muốn cập nhật câu hỏi này?'
    showPopupConfirm(confirm_title, confirm_content, "Xác nhận", () => {
        update_data()
        var formData = new FormData()
        // lớp
        formData.set('grade', $('select[name="grade"] option:selected').val())
        // chủ đề chủ điểm
        var subtopics_id = get_all_checked_topic()
        formData.set('topic_question', JSON.stringify(subtopics_id))
        // get nội dung câu hỏi
        formData.set('content', getEditorContent('editor-cau-hoi', false))
        //// nội dung trả lời
        var answer_contents = []
        $('[id^=editor-cau-tra-loi]').each(function (i, item) {
            //var noi_dung = getEditorContent($(item).attr('id'))
            var noi_dung = $(item).find('.question-editor__content').html()
            answer_contents.push(noi_dung)
        })
        formData.set('answer_contents', JSON.stringify(answer_contents))
        // đáp án
        var right_answer = []
        $('[id^=dap-an]').each(function (i, item) {
            if ($(item).find('input[name="list-radio"]').prop('checked')) {
                let noi_dung = $(item).find('[name="right_answer_content"]').html()
                right_answer.push(noi_dung)
            }
        })
        formData.set('right_answer', JSON.stringify(right_answer))
        // lời giải
        formData.set('explain', getEditorContent('editor-loi-giai', false))
        // id câu hỏi (trường hợp chỉnh sửa)
        formData.set('question_id', question_id)
        // đáp án ngẫu nhiên
        formData.set('random_answer', $('[name="random_answer"]').prop('checked'))
        formData.set('exercise_id', $('#exercise_id').val())
        formData.set('type', DangCauHoi.LUA_CHON_DAP_AN)
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