function uploadQuestionPreview(sender, grade, exercise_id) {
    if (grade == null || grade == undefined || grade.lendth == 0) {
        setAlertError("Hãy chỉ định khối cho bài luyện tập")
        return
    }
    var input = sender[0];
    var url = $(input).val();
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    var file_name = url.substring(url.lastIndexOf('\\') + 1);
    if (input.files && input.files[0] && (ext == "xlsx" || ext == "xls")) {
        var formData = new FormData($('#formUploadExcel')[0])
        formData.set('file', input.files[0])
        formData.set('exercise_id', exercise_id ? exercise_id : "")
        const data = {
            formData: formData,
            exercise_id: exercise_id ? exercise_id : ""
        }
        $.ajax({
            //url: '/exercises/ajax/import-excel-confirm',
            url: '/exercises/ajax/import-excel2',
            type: 'POST',
            data: formData,
            //data: data,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.success) {
                    const uploadQuestionBodyTemplate = $.templates('#UPLOAD_BODY')
                    const uploadQuestion = uploadQuestionBodyTemplate.render({ file_name: file_name })
                    $('#uploadToggle').find('.modal-body').empty()
                    $('#uploadToggle').find('.modal-body').append(uploadQuestion)
                    $('#uploadToggle').find('#viewQuestionTable').empty()
                    $('#uploadToggle').find('#viewQuestionTable').append(res.data_upload_render)
                    $('#uploadToggle').find('.modal-footer').show()
                    $('#uploadToggle').find('#viewQuestionPreview').empty()
                    $('#uploadToggle').find('#viewQuestionPreview').append(res.data_view_cau_hoi)
                    $('.show-explain').click(function (e) {
                        if ($(this).hasClass('collapsed')) {
                            $(this).find('span').text("Hiển thị lời giải")
                            $(this).removeClass('btn-success-light-6')
                            $(this).addClass('btn-primary-light-4')
                        }
                        else {
                            $(this).find('span').text("Ẩn lời giải")
                            $(this).removeClass('btn-primary-light-4')
                            $(this).addClass('btn-success-light-6')
                        }
                    })

                    $('#view-cong-thuc-tab').click(function (e) {
                        //e.preventDefault()
                        setTimeout(() => {
                            if (res.list_datas_linker && res.list_datas_linker.length > 0) {
                                genAllViewLinkerWithMode(res.list_datas_linker)
                                console.log("Done")
                                renderMathInElement(document.body, {
                                    // customised options
                                    // • auto-render specific keys, e.g.:
                                    delimiters: [
                                        { left: '$$', right: '$$', display: true },
                                        { left: '$', right: '$', display: false },
                                        { left: '\\(', right: '\\)', display: false },
                                        { left: '\\[', right: '\\]', display: true },
                                        { left: '[KATEX]', right: '[/KATEX]', display: true }
                                    ],
                                    // • rendering keys, e.g.:
                                    throwOnError: false
                                })
                                $('.katex-display').removeClass('katex-display')
                            }
                        }, 500)
                    })
                    renderMathInElement(document.body, {
                        // customised options
                        // • auto-render specific keys, e.g.:
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '\\[', right: '\\]', display: true },
                            { left: '[KATEX]', right: '[/KATEX]', display: true }
                        ],
                        // • rendering keys, e.g.:
                        throwOnError: false
                    })
                    $('.katex-display').removeClass('katex-display')
                }
                else {
                    showPopupError("Có lỗi", res.msg)
                }
            }
        })
    }
    else {
        setAlertError("File upload không tồn tại hoặc không đúng định dạng excel")
    }
}

function clearTempData() {
    $('#uploadToggle .modal-body').empty()
    $('#uploadToggle .modal-footer').hide()
    $('#uploadToggle #uploadFileExcel').val('')
    $('#uploadToggle #uploadFileExcel').attr('files', '')
}

function uploadQuestion(grade) {
    showPopupConfirm("Xác nhận upload", "Bạn xác nhận upload dữ liệu bài luyện tập này? Bài hiện tại sẽ được upload vào khối " + grade, "Xác nhận", () => {
        $.ajax({
            method: 'post',
            //url: '/exercises/ajax/import-excel',
            url: '/exercises/ajax/upload-excel-data',
            data: { grade: grade },
            success: function (res) {
                if (res.success) {
                    setAlertSuccess(res.msg)
                        .then(() => {
                            location.href = res.return_url
                        })
                }
                else {
                    setAlertError(res.msg)
                }
            }
        })
    })
}