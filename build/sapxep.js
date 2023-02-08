//Khởi tạo editor nhập đáp án cho các dạng trắc nghiệm
function initRightAnswer(rAnswerId, answerDatas, answerIds, answerProp) {
    var listAsnwerDatas = (answerDatas != "") ? JSON.parse(answerDatas) : ""
    var rAnswerIds = rAnswerId.split(">>>")
    if (Array.isArray(listAsnwerDatas)) {
        rAnswerIds.forEach(function (item, i) {
            var uniqueId = new Date().getTime().toString() + Math.round((Math.random() * 10000)).toString()
            var indAnsData = -1
            var itemAnswer
            listAsnwerDatas.forEach(function (subitem, j) {
                if (subitem.uid == item) {
                    itemAnswer = subitem
                    indAnsData = j
                }
            })
            const eAnswerTmpl = answerProp == DangCauHoi.SAP_XEP_KEO_THA ? $.templates('#EDITOR_DAP_AN_KEO_THA') : $.templates('#EDITOR_DAP_AN_TICH_MUI_TEN')

            const editorRightAnswer = eAnswerTmpl.render({ editorId: 'dap-an' + uniqueId, answer_id: answerIds[indAnsData], data: itemAnswer.noi_dung })
            if (answerProp == DangCauHoi.SAP_XEP_KEO_THA) {
                $('#drag-drop').find('.view-right-answer').append(editorRightAnswer)
            }
            else {
                $('#arrow').find('.view-right-answer').append(editorRightAnswer)
            }
        })
    }
    actionBoxRightAnswer()
}
function render_region_drag_drop() {
    // Lấy data box tich chọn
    var answer_datas = []
    $('#arrow').find('.item.answer-region').each(function (i, item) {
        let data = $(item).find('[name="right_answer_content"]').html()
        let id_cau_tra_loi = $(item).data('answer-id')
        answer_datas.push({ data: data, id_cau_tra_loi: id_cau_tra_loi })
    })
    // clear box
    $('#box-view-right-answer').empty()
    // new template
    var template = $.templates('#BOX_KEO_THA')
    var htmlOutput = template.render()
    $('#box-view-right-answer').append(htmlOutput)
    // template data
    template = $.templates('#EDITOR_DAP_AN_KEO_THA')
    answer_datas.forEach((item, i) => {
        var editorId = new Date().getTime() + i
        htmlOutput = template.render({ editorId: editorId, answer_id: item.id_cau_tra_loi, data: item.data })
        $('#drag-drop').find(".view-right-answer").append(htmlOutput)
    })
    $('[name="question_type"]').val(DangCauHoi.SAP_XEP_KEO_THA)
    actionBoxRightAnswer()
}
function render_region_arrow() {
    // Lấy data box tich chọn
    var answer_datas = []
    $('#drag-drop').find('.item.answer-region').each(function (i, item) {
        let data = $(item).html()
        let id_cau_tra_loi = $(item).data('answer-id')
        answer_datas.push({ data: data, id_cau_tra_loi: id_cau_tra_loi })
    })
    // clear box
    $('#box-view-right-answer').empty()
    // new template
    var template = $.templates('#BOX_TICH_MUI_TEN_LEN_XUONG')
    var htmlOutput = template.render()
    $('#box-view-right-answer').append(htmlOutput)
    // template data
    template = $.templates('#EDITOR_DAP_AN_TICH_MUI_TEN')
    answer_datas.forEach((item, i) => {
        var editorId = new Date().getTime() + i
        htmlOutput = template.render({ editorId: editorId, answer_id: item.id_cau_tra_loi, data: item.data })
        $('#arrow').find(".view-right-answer").append(htmlOutput)
    })
    $('[name="question_type"]').val(DangCauHoi.SAP_XEP)
    actionBoxRightAnswer()
}

function removeCauTraLoi(id_cau_tra_loi) {
    $("#box-tra-loi").find('#' + id_cau_tra_loi).remove()
    var dap_an_input = $("#view-dap-an").find('.row.gutters-6').filter(function (i) {
        return $(this).data('id-cau-tra-loi') == id_cau_tra_loi
    })
    if ($(dap_an_input) != null) {
        $(dap_an_input).remove()
    }
}

function delete_cau_tra_loi(sender) {
    var editor_id = $(sender).data('editor-id');
    var question_name = $('.question-name').filter(function (i) {
        return $(this).data('editor-id') == editor_id;
    })
    if (question_name != null && question_name != undefined) {
        $(question_name).remove()
    }
    var question_group = $('.question-group').filter(function (i) {
        return $(this).data('editor-id') == editor_id;
    })
    if (question_group != null && question_group != undefined) {
        $(question_group).remove()
    }

    $('.view-dap-an').each(function (i, item) {
        var answer_delete = $(item).find('.item').filter(function (i) {
            return $(this).data('id-cau-tra-loi') == editor_id
        })
        if (answer_delete != null && answer_delete != undefined) {
            $(answer_delete).remove()
        }
    })

    // reset lại identity (trả lời) + tên câu hỏi
    $('.question-name').each(function (i, item) {
        $(item).text('Câu trả lời ' + (i + 1) + ':')
        $('#currentQuestion').val(i)
    })


    var dsach_dap_an_keo_tha = $('#drag-drop').find('.item')
    $(dsach_dap_an_keo_tha).each(function (i, item) {
        var current_identity = $(item).text().substring(0, 2)
        var new_text = $(item).text().replace(current_identity, answer_identity[i])
        $(item).text(new_text)
        current_answer_identity = answer_identity[i]
    })

    var dsach_dap_an_tich_chon = $('#arrow').find('.item')
    $(dsach_dap_an_tich_chon).each(function (i, item) {
        $(item_update)
        var current_identity = $(item_update).text().substring(0, 2)
        var new_text = $(item_update).text().replace(current_identity, answer_identity[i])
        $(item_update).text(new_text)
    })

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
        console.log(getEditorContent(editorId))
        console.log($('#drag-drop'))
        if (right_answer_ele != null && right_answer_ele != undefined) {
            if ($('#drag-drop') != null && $('#drag-drop') != undefined && $('#drag-drop').length !== 0) {
                // case kéo thả
                $(right_answer_ele).html(getEditorContent(editorId))
            }
            else {
                // case tích mũi tên
                $(right_answer_ele).find('[name="right_answer_content"]').html(getEditorContent(editorId))
            }
        }
    })
}

function submitQuestionData() {
    var question_id = $('input[name="question_id"]') != null ? $('input[name="question_id"]').val() : ""
    var noi_dung_cau_hoi = getEditorContent('editor-cau-hoi')
    if (noi_dung_cau_hoi == null || noi_dung_cau_hoi == "") {
        setAlertWarning("Bạn chưa nhập nội dung câu hỏi.")
        return
    }
    //var loi_giai = getEditorContent('editor-loi-giai')
    //if (loi_giai == null || loi_giai == "") {
    //    setAlertWarning("Bạn chưa nhập lời giải.")
    //    return
    //}
    $('[id^=editor-cau-tra-loi]').each(function (i, item) {
        if (getEditorContent($(item).attr('id')) == null || getEditorContent($(item).attr('id')) == "") {
            setAlertWarning("Câu trả lời không được để trống")
            return
        }
    })

    var confirm_title = !question_id ? 'Xác nhận tạo mới' : 'Xác nhận cập nhật'
    var confirm_content = !question_id ? 'Bạn có xác nhận muốn tạo mới câu hỏi này?' : 'Bạn có xác nhận muốn cập nhật câu hỏi này?'
    showPopupConfirm(confirm_title, confirm_content, "Xác nhận", () => {
        update_data()
        var formData = new FormData();
        // lớp
        formData.set('grade', $('select[name="grade"] option:selected').val())
        // chủ đề chủ điểm
        var subtopics_id = get_all_checked_topic();
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
        if ($('#drag-drop-check').prop('checked')) {
            // case kéo thả
            $('[id^=dap-an]').each(function (i, item) {
                let noi_dung = $(item).html()
                right_answer.push(noi_dung)
            })
        }
        else {
            // case tích mũi tên
            $('[id^=dap-an]').each(function (i, item) {
                let noi_dung = $(item).find('[name="right_answer_content"]').html()
                right_answer.push(noi_dung)
            })
        }
        formData.set('right_answer', JSON.stringify(right_answer))
        // lời giải
        formData.set('explain', getEditorContent('editor-loi-giai', false))
        // id câu hỏi (trường hợp chỉnh sửa)
        formData.set('question_id', question_id)
        // đáp án ngẫu nhiên
        var d = $('[name="random_answer"]').prop('checked')
        formData.set('random_answer', $('[name="random_answer"]').prop('checked'))
        formData.set('exercise_id', $('#exercise_id').val())
        formData.set('type', $('#drag-drop-check').prop('checked') ? DangCauHoi.SAP_XEP_KEO_THA : DangCauHoi.SAP_XEP)
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