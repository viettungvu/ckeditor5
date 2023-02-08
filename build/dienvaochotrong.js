const DELI_MUST_RE_RENDER = [
    { left: '$$', right: '$$' },
    { left: '$', right: '$' },
    { left: '\\(', right: '\\)' },
    { left: '\\[', right: '\\]' },
    { left: '[math]', right: '[/math]' },
    { left: '<math>', right: '</math>' },
    { left: '[KATEX]', right: '[/KATEX]' }
]
//#region Create/Delete answer box
function createAnwserInput(type, id, values, color) {
    if (id && typeof id != typeof undefined) {
        if ($('.answer-box[data-id="' + id + '"]').length == 0) {
            if (type === TYPE.NHAP) {
                var template = $.templates('#NHAP')
                var htmlOutput = template.render({ id: id, bgColor: color })
                $('#form-dap-an').append(htmlOutput)
            }
            else if (type === TYPE.PHAN_SO) {
                var template = $.templates('#PHAN_SO')
                var htmlOutput = template.render({ id: id, values: values, bgColor: color })
                $('#form-dap-an').append(htmlOutput)
            }
            else if (type === TYPE.LUA_CHON) {
                var template = $.templates('#LUA_CHON')
                var htmlOutput = template.render({ id: id, values: values, bgColor: color })
                $('#form-dap-an').append(htmlOutput)
                //nếu có KATEX thì gọi hàm render lại
                for (var deli of DELI_MUST_RE_RENDER) {
                    const str = `data-equation="\\${deli.left}(.+?)\\${deli.right}"`
                    const regex = new RegExp(str, 'gi')
                    if (regex.test(htmlOutput)) {
                        renderMathInElement(document.body, {
                            delimiters: [
                                { left: '$$', right: '$$', display: true },
                                { left: '$', right: '$', display: false },
                                { left: '\\(', right: '\\)', display: false },
                                { left: '\\[', right: '\\]', display: true },
                                { left: '[math]', right: '[/math]', display: false },
                                { left: '<math>', right: '</math>', display: false },
                                { left: '[KATEX]', right: '[/KATEX]', display: false }
                            ],
                            output: "html",
                            throwOnError: false
                        })
                    }
                }
            }
            else if (type === TYPE.PHEP_CHIA) {
                var template = $.templates('#PHEP_CHIA')
                var htmlOutput = template.render({ id: id, values: values, bgColor: color })
                $('#form-dap-an').append(htmlOutput)
            }
            else {
                console.error('Invalid control type')
            }
        }
        else {
            console.log('Exist answerbox with id ' + id)
        }
    }
    else {
        console.error('invalid control id')
    }
}

function removeAnswerInput(id) {
    if (id != '') {
        if ($('.t-control.ck-widget[data-id="' + id + '"]').length === 1) {
            $('.answer-box[data-id="' + id + '"]').remove()
        }
    }
}

function updateValueInputDapAnTuEditor(editorId, value) {
    $('box-dap-an').find(editorId).val(value)
}

function submitQuestionData() {
    var question_id = $('input[name="question_id"]') != null ? $('input[name="question_id"]').val() : ''
    const noiDungCauHoi = getEditorContent('editor-cau-hoi')
    if (!noiDungCauHoi || noiDungCauHoi == '') {
        setAlertWarning('Bạn chưa nhập nội dung câu hỏi!')
        return
    }


    var answer_contents = new Array()
    let empty_answer = false
    let answerArray = $('#form-dap-an').serializeArray()
    for (var item of answerArray) {
        if (item.name.match(/^ANS_LUA_CHON_/g)) {
            $('#form-dap-an input[name="' + item.name + '"] ~ .xcustom-options > .custom-option').each((i, c) => {
                answer_contents.push({
                    name: item.name,
                    text: $(c).html(),
                    value: $(c).attr('value')
                })
            })
        } else {
            answer_contents.push(item)
        }
    }

    answer_contents.every(function (item) {
        if (item.value == '' || !item.value) {
            empty_answer = true
            return false
        }
    })
    if (empty_answer) {
        setAlertWarning('Bạn chưa nhập đủ đáp án!')
        return
    }
    var confirm_title = !question_id ? 'Xác nhận tạo mới' : 'Xác nhận cập nhật'
    var confirm_content = !question_id ? 'Bạn có xác nhận muốn tạo mới câu hỏi này?' : 'Bạn có xác nhận muốn cập nhật câu hỏi này?'
    showPopupConfirm(confirm_title, confirm_content, "Xác nhận", () => {
        var formData = new FormData()
        formData.set('exercise_id', $('#exercise_id').val())
        formData.set('type', DangCauHoi.DIEN_VAO_CHO_TRONG)
        formData.set('grade', $('select[name="grade"] option:selected').val())
        formData.set('random_answer', $('input[name="random_answer"]').val())
        //formData.set('topic_question', 'Lw9QX4QB3WZtKvmStSkv'/* $('select[name="topic_question"] option:selected').val())*/)
        // chủ đề chủ điểm
        var subtopics_id = get_all_checked_topic()
        formData.set('topic_question', JSON.stringify(subtopics_id))
        formData.set('control_answer_info', $('#form-dap-an').html())
        // get nội dung câu hỏi
        formData.set('content', noiDungCauHoi)
        //// nội dung trả lời
        formData.set('answer_content', JSON.stringify(answer_contents))
        // đáp án

        formData.set('right_answer', JSON.stringify(answerArray))
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