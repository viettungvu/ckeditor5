//function reloadScript() {

//    $('script').each(function (i, item) {
//        if ($(this).attr('src') != undefined && $(this).attr('src').lastIndexOf('jquery') == -1 && $(this).attr('src').includes('main.min.js')) {
//            var src = $(this).attr('src')

//            $.getScript(src)
//        }
//    })
//}

function generate_class(grade, ids_class, teacher_id) {
    if (ids_class == undefined) {
        ids_class = '[]'
    }
    if (grade) {
        $.ajax({
            method: 'get',
            url: '/classes/ajax/get-class-list',
            data: { grade: grade, ids_class: ids_class, teacher_id: teacher_id },
            success: function (res) {
                const options = {
                    buttonContainer: '<div></div>',
                    buttonTextAlignment: 'left',
                    buttonText: function (options, select) {
                        if (options.length === 0) {
                            return 'Chọn lớp'
                        }
                        else if (options.length >= 3) {
                            return 'Đã chọn ' + options.length + ' lớp'
                        }
                        else {
                            var labels = []
                            options.each(function () {
                                if ($(this).attr('label') !== undefined) {
                                    labels.push($(this).attr('label'))
                                }
                                else {
                                    labels.push($(this).html())
                                }
                            })
                            return labels.join(', ') + ''
                        }
                    },
                    onChange: function (element, checked) {
                        if (checked === true) {
                            //action taken here if true
                            //var val = $(element).find
                            $('.class-dropdown select[name="class"]').multiselect('select', element[0].value)
                        }
                        else {
                            $('.class-dropdown select[name="class"]').multiselect('deselect', element[0].value)
                        }
                    }
                }
                $('.class-dropdown select[name="class"]').multiselect(options)
                $('.class-dropdown select[name="class"]').multiselect('dataprovider', res.data)
            }
        })

    }
    else {
        $('.class-dropdown select[name="class"]').multiselect({
            buttonContainer: '<div></div>',
            buttonTextAlignment: 'left',
            buttonText: function (options, select) {
                if (options.length === 0) {
                    return 'Chọn lớp'
                }
                else if (options.length >= 3) {
                    return 'Đã chọn ' + options.length + ' lớp'
                }
                else {
                    var labels = []
                    options.each(function () {
                        if ($(this).attr('label') !== undefined) {
                            labels.push($(this).attr('label'))
                        }
                        else {
                            labels.push($(this).html())
                        }
                    })
                    return labels.join(', ') + ''
                }
            },
            onChange: function (element, checked) {
                if (checked === true) {
                    $('.class-dropdown select[name="class"]').multiselect('select', element[0].value)
                }
                else {
                    $('.class-dropdown select[name="class"]').multiselect('deselect', element[0].value)
                }
            }
        }
        )
    }
    $('.class-dropdown select[name="class"]').show()
}

// Lấy danh sách đối tượng đã check
function get_all_checked_class() {
    var value_checked = []
    var checked_option = $('select[name="class"]').closest('.multiselect-native-select').find('.multiselect-container.dropdown-menu').find('[type=button]').filter(function () {
        return $(this).hasClass('active')
    })
    if (checked_option != null) {
        //value_checked = checked_option.map((i, ele) => {
        //    return $(ele).find('[type=checkbox]').val()
        //})
        $(checked_option).each(function () {
            value_checked.push($(this).find('[type=checkbox]').val())
        })
    }
    console.log(value_checked)
    return value_checked
}

function generate_topic(grade, subtopics) {
    if (subtopics == undefined) {
        subtopics = null
    }
    $.ajax({
        method: 'get',
        url: '/topics/ajax/get-tree-topic',
        data: { grade: grade, subtopics: subtopics },
        success: function (res) {
            if (!res.success) {
                setAlertError(res.msg);
            }
            if (!res.optgroups || res.optgroups.length == 0) {
                setAlertError(`Không tìm thấy dữ liệu chủ đề/chủ diểm của khối ${grade}`)
            }
            const options = {
                enableFiltering: true,
                includeFilterClearBtn: false,
                enableCaseInsensitiveFiltering: true,
                buttonContainer: '<div></div>',
                buttonTextAlignment: 'left',
                buttonText: function (options, select) {
                    if (options.length === 0) {
                        return 'Chủ đề/ Chủ điểm'
                    }
                    else if (options.length > 3) {
                        return 'Đã chọn ' + options.length + ' chủ đề/ chủ điểm'
                    }
                    else {
                        var labels = []
                        options.each(function () {
                            if ($(this).attr('label') !== undefined) {
                                labels.push($(this).attr('label'))
                            }
                            else {
                                labels.push($(this).html())
                            }
                        })
                        return labels.join(', ') + ''
                    }
                },
                onChange: function (element, checked) {
                    if (checked === true) {
                        //action taken here if true
                        //var val = $(element).find
                        $(".subtopic-item").multiselect('select', element[0].value)
                    }
                    else {
                        $(".subtopic-item").multiselect('deselect', element[0].value)
                    }
                }
            }
            $(".topic-tree").find(".subtopic").multiselect(options)
            $(".topic-tree").find(".subtopic").multiselect('dataprovider', res.optgroups)
            $(".subtopic-item").multiselect(options)
            $(".subtopic-item").multiselect('dataprovider', res.optgroups)
            $('.topic-tree').find('.subtopic').multiselect({})
            $(".topic-tree").find(".subtopic").show()
            $(".subtopic-item").show()

        }
    })
}
// Lấy danh sách đối tượng đã check
function get_all_checked_main_topic() {
    var value_checked = []
    var checked_option = $('.subtopic').closest('.multiselect-native-select').find('.multiselect-container.dropdown-menu').find('[type=button]').filter(function () {
        return $(this).hasClass('active')
    })
    if (checked_option != null) {
        $(checked_option).each(function () {
            value_checked.push($(this).find('[type=checkbox]').val())
        })
    }
    return value_checked
}

function get_all_checked_topic() {
    var value_checked = []
    var checked_option = $('.subtopic-item').closest('.multiselect-native-select').find('.multiselect-container.dropdown-menu').find('[type=button]').filter(function () {
        return $(this).hasClass('active')
    })
    if (checked_option != null) {
        $(checked_option).each(function () {
            value_checked.push($(this).find('[type=checkbox]').val())
        })
    }
    return value_checked
}

function create_edit_exercise(url, data, mode) {
    $.ajax({
        method: 'post',
        url: url,
        data: data,
        contentType: false, processData: false,
        success: function (res) {
            if (res.success) {
                $("#addNewToggle").find('.add-question').data('exercise-id', res.exercise_id)
                $("#addNewToggle").modal('show')
                if (mode == MODE.NEW) {
                    set_button_add_question()
                }
                $("#addNewToggle").on('hide.bs.modal', function () {
                    window.location.href = '/exercises/edit/' + res.exercise_id
                })
            }
            else {
                setAlertError(res.msg)
            }
        }
    })
}

function edit_info_exercise(e) {
    e.stopPropagation()
    e.preventDefault()
    $('input[name="name"]').removeAttr('disabled')
    $('select[name="topic"]').removeAttr('disabled')
    $('select[name="grade"]').removeAttr('disabled')
    $('select[name="class"]').removeAttr('disabled')
    $('input[name="exercises_duration"]').removeAttr('disabled')
    $('input[name="question_number"]').removeAttr('disabled')
    $('input[name="random"]').removeAttr('disabled')
    $('.btn-action').css('display', 'flex')
}

function set_button_add_question() {
    $("#addNewToggle").find(".add-question").click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        const param_href = [
            { name: 'exercise_id', value: $(this).data('exercise-id') },
            { name: 'mode', value: MODE.EDIT },
            { name: 'type', value: DangCauHoi.LUA_CHON_DAP_AN },
        ]
        window.location.href = renderRoute("/exercises/create-question", param_href)
    })
}

function question_created_binding(exercise_id, binding_tag) {
    $.ajax({
        method: 'get',
        url: '/exercises/ajax/load-created-question',
        data: { exercise_id: exercise_id },
        success: function (res) {
            $(binding_tag).empty()
            $(binding_tag).append(res.data)
            reloadScript()
            if (res.list_datas_linker && res.list_datas_linker.length > 0) {
                genAllViewLinkerWithMode(res.list_datas_linker)
            }
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
            $('.btn-edit').click(function (e) {
                e.preventDefault()
                let id = $(this).data('id')
                let type = $(this).data('type')
                window.location.href = renderRoute("/exercises/create-question", [
                    { name: 'exercise_id', value: $('#exercise_id').val() },
                    { name: 'question_id', value: id },
                    { name: 'type', value: type }
                ])
            })
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
            if (res.number_of_question >= 3) {
                $('.tab-menu.view-footer').addClass('active')
            }
            else {
                $('.tab-menu.view-footer').removeClass('active')
            }
        }
    })
}

function replaceSingleBackslash(input) {
    const matches = input.match(/([\u0000-\u0019\u0021-\uFFFF])+/gu)
    //const matches = input.match(/(?<!\\)(?:((\\)))(?![\\])/g)
    if (matches != null) {
        matches.forEach((m, i) => {
            input = input.replace(m, '\\\\')
        })
    }
    return input
}

function convert_katex(input, delimiters) {
    input = input.replace(/(?<!data-equation=\")\[KATEX\](.+?)\[\/KATEX\]/gi, '<span class="math-tex" data-value="$1"></span>')
    input = input.replace(/(?<!data-equation=\")\${1,}(.+?)\${1,}/gi, '<span class="math-tex" data-value="$1"></span>')
    return input
}

function actionCommonBinding(subtopics, classes, teacher_id, exercise_id) {
    //------------------------------------------------exercise action
    generate_topic($('[name="grade"] option:selected').val(), subtopics)
    generate_class($('[name="grade"] option:selected').val(), classes, teacher_id)
    $('select[name="grade"]').change(function () {
        let grade = $(this).find("option:selected").val()
        generate_class(grade, null, teacher_id)
        generate_topic(grade)
    })
    $('.lua-chon-dap-an-tab').click(function (e) {
        e.stopPropagation()
        e.preventDefault()
    })
    $(".question-add-item").click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        var type = parseInt($('#question_type').val())
        var rAnsParam
        switch (type) {
            case DangCauHoi.LUA_CHON_DAP_AN:
                const type = $('.chk-more-answer').prop('checked') ? 'checkbox' : 'radio'
                rAnsParam = { text: "", checked: "", is_active: "", type: type }
                break
            case DangCauHoi.SAP_XEP:
                var type_view_sort = TypeOfViewSort.TICH_MUI_TEN_LEN_XUONG
                rAnsParam = { data: "", type_view_sort: type_view_sort }
                break
            case DangCauHoi.SAP_XEP_KEO_THA:
                var type_view_sort = TypeOfViewSort.KEO_THA
                rAnsParam = { data: "", type_view_sort: type_view_sort }
                break
        }
        addNewAnswer(type, $('#currentIndElement').val(), rAnsParam, '')
        var currentIndex = (parseInt($('#currentIndElement').val()) + 1).toString()
        $('#currentIndElement').val(currentIndex)
    })
    $('.tab-button').click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        let tab_type = $(this).data('type')
        let exercise_id = $('#exercise_id').val()
        window.location.href = renderRoute('/exercises/btl/test?', [
            { name: 'exercise_id', value: exercise_id },
            { name: 'type', value: tab_type }
        ])

    })
    $('#uploadFileExcel').change(function () {
        uploadQuestionPreview($(this), $("select[name='grade'] option:selected").val(), exercise_id)
    })
    $("#uploadToggle").on('hide.bs.modal', function () {
        clearTempData()
    })
    $('.btn-save-upload').click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        uploadQuestion($("select[name='grade'] option:selected").val())
    })
    $(document).scroll(function () {
        const page_footer = $('.add-new__footer')
        const tab_footer = $('.tab-menu.view-footer')
        //const rect = page_footer[0].getBoundingClientRect()
        if (!isScrolledIntoView(page_footer)) {
            $(tab_footer).css('display', '')
        }
        else {
            $(tab_footer).css('display', 'none')
        }
    })
}

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop()
    var docViewBottom = docViewTop + $(window).height()

    var elemTop = $(elem).offset().top
    var elemBottom = elemTop + $(elem).height()

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop))
}

function actionFooterButtonBinding(type) {
    let exerciseId = $('#exercise_id').val()
    $('.btn-add-new-question').click(function (e) {
        //e.preventDefault()
        //var allow_create = false
        //if ($('#isMaxQuestionCreated') != null && $('#isMaxQuestionCreated') != undefined) {
        //    allow_create = $('#isMaxQuestionCreated').val() == "true"
        //}
        //if (allow_create) {
        //    window.location.href = '/exercises/create-question?exercise_id=' + exerciseId + '&type=' + type
        //}
        //else {
        //    setAlertWarning("Không thể tạo mới câu hỏi vì đã đến giới hạn số câu hỏi trong bài luyện tập/nNếu cần tạo thêm câu hỏi thì cập nhật số câu trong bài luyện tập")
        //}
        //window.location.href = '/exercises/create-question?exercise_id=' + exerciseId + '&type=' + type
        window.location.href = renderRoute('/exercises/create-question', [
            { name: 'exercise_id', value: exerciseId },
            { name: 'type', value: type }
        ])
    })
    // giao bài
    $('.btn-assign').click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        showPopupConfirm("Xác nhận giao bài", "Bạn xác nhận giao bài luyện tập này?", "Xác nhận", () => {
            var id_doi_tuong_nhan_nhiem_vu = get_all_checked_class()
            var current_date = new Date()
            var exerciseName = $('[name="name"]').val()
            var nhiem_vu = {
                idBaiLuyenTap: exerciseId,
                tenNhiemVu: exerciseName,
                idDoiTuongNhan: JSON.stringify(id_doi_tuong_nhan_nhiem_vu),
                doiTuongNhan: DOI_TUONG_NHAN_NV.CLASS,
                noiDungNhiemVu: exerciseName,
                thoiGianBatDau: current_date.getDate().toString().padStart(2, '0') + "/" + (current_date.getMonth() + 1).toString().padStart(2, '0') + "/" + current_date.getFullYear(),
                idNoiDung: exerciseId
            }

            $.post('/missions/ajax/assign-mission', nhiem_vu, function (res, e) {
                if (res.success) {
                    setAlertSuccess(res.msg)
                }
                else {
                    setAlertError(res.msg)
                }
            })
        })
    })
    $('.btn-exercise-history').click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        // lịch sử luyện tập
    })
}

///#region CKEDITOR5
//Khởi tạo editor
var editors = new Map()
var mapEditorQuestions = new Map()
let map = []
let controlInserted = 0
const TYPE = XMEditor.ControlType
const BG_COLORS_CLASSES = XMEditor.BackgroundColorClass


function getBackgroundClass(controlClasses) {
    try {
        if (controlClasses) {
            const arrayClass = controlClasses.split(' ')
            return arrayClass.find(x => BG_COLORS_CLASSES.includes(x))
        }
        return ''
    } catch (e) {
        console.error(e)
    }
}

function createEditor(editorId, editorType = TypeOfCk.DAP_AN, editorData = '', editorPlacehoder = '', questionType = DangCauHoi.LUA_CHON_DAP_AN) {
    const editorContent = $('#' + editorId).find('.question-editor__content')
    return XMEditor
        .create(editorContent[0], {
            controlConfig: {
                katexRenderOptions: {
                    throwOnError: false,
                    output: 'html',
                    delimiters: DELIMITERS_KATEX
                },
                display: false,  //Chỗ này cấu hình cho control hiển thị dạng block (display=true) hoặc dạng inline-block(display=false), mặc định nếu không cấu hình thì hiển thị dạng inline,
                forceOutputType: 'span' //Chỗ này chỉ định thẻ bao quanh control
            },
            math: {
                engine: 'katex',
                katexRenderOptions: {
                    throwOnError: false,
                    output: 'html',
                    delimiters: DELIMITERS_KATEX
                },
            },
            placeholder: editorPlacehoder,
            simpleUpload: {
                uploadUrl: 'http://192.168.1.223:98/upload/image',
            },
            image: {
                insert: {
                    type: 'inline'
                }
            }
        })
        .then(editor => {
            editors.set(editorId, editor)
            editor.setData(convert_katex(editorData))
            /*console.log(editor.getData())*/
            mapEditorQuestions.set(editor.id, {
                editorType: editorType,
                questionType: questionType,
                plainId: editorId,
            })

            bindingEditorActionById(editorId)
            console.log('[' + editor.id + ']: Editor has been initalized successful')
            editor.ui.view.toolbar.element.style.display = 'none'
            editor.model.document.on('change:data', (evt) => {
                try {
                    const mapEQ = mapEditorQuestions.get(editor.id)
                    if (mapEQ) {
                       
                        switch (mapEQ.questionType) {
                            case DangCauHoi.DIEN_VAO_CHO_TRONG: {
                                const change = editor.model.document.differ.getChanges().filter(c => c.name == 'xcontrol' || c.name == 'xcontrol-inline').slice(-1)[0]
                                if (change) {
                                    switch (mapEQ.editorType) {
                                        case TypeOfCk.CAU_HOI: {
                                            if (change.type === 'remove') {
                                                const prevPath = change.position.path
                                                const currentPath = editor.model.document.selection.getFirstPosition().path
                                                if (prevPath.length < 2 || JSON.stringify(prevPath) === JSON.stringify(currentPath)) {
                                                    removeAnswerInput(change.attributes.get('id'))
                                                }
                                            }
                                            if (change.type === 'insert') {
                                                const mapAttrs = change.attributes
                                                const controlType = mapAttrs.get('type')
                                                const controlId = mapAttrs.get('id')
                                                const controlValues = mapAttrs.get('value')
                                                const color = getBackgroundClass(mapAttrs.get('class'))
                                                if (controlType === TYPE.PHAN_SO) {
                                                    createAnwserInput(controlType, controlId, controlValues, color)
                                                }
                                                else if (controlType === TYPE.LUA_CHON) {
                                                    createAnwserInput(controlType, controlId, controlValues, color)
                                                }
                                                else if (controlType === TYPE.PHEP_CHIA) {
                                                    createAnwserInput(controlType, controlId, controlValues, color)
                                                }
                                                else if (controlType === TYPE.NHAP) {
                                                    createAnwserInput(controlType, controlId, null, color)
                                                }
                                                else {
                                                    console.error('Unsupported control')
                                                }
                                            }
                                            break
                                        }
                                        case TypeOfCk.DAP_AN: {
                                            //Câu hỏi điền vào chỗ trống không có Ckeditor đáp án
                                            break
                                        }
                                        case TypeOfCk.LOI_GIAI: {
                                            break
                                        }

                                        default: {
                                            console.error('Unsupport editor')
                                        }
                                    }
                                    break
                                }
                                break
                            }
                            case DangCauHoi.TU_LUAN: {
                                break
                            }
                            case DangCauHoi.GHEP_NOI: {
                                break
                            }
                            case DangCauHoi.SAP_XEP:
                            case DangCauHoi.SAP_XEP_KEO_THA:
                            case DangCauHoi.LUA_CHON_DAP_AN:
                            case DangCauHoi.LUA_CHON_DUNG_SAI: {
                                if (mapEQ.editorType == TypeOfCk.CAU_TRA_LOI) {
                                    const content = getEditorContent(editorId)
                                    //update content này xuống ô đáp án ở box tạo đáp án
                                    updateValueInputAnswerFromEditor(editorId, content)
                                }
                                
                                break
                            }
                            default: {
                                console.error('Unsupport question')
                                break
                            }
                        }

                    }
                }
                catch (err) {
                    console.log(err)
                }
            })
            editor.model.document.on('change', (evt, name, value) => {
                switch (questionType) {
                    case DangCauHoi.DIEN_VAO_CHO_TRONG: {
                        highlightSelectingControl(editor)
                        break
                    }
                    default: {
                        break
                    }
                }
                const mapEQ = mapEditorQuestions.get(editor.id)
                if (mapEQ) {
                    updateLivePreview(mapEQ.plainId)
                }
            })
        })
        .catch(err => console.error(err))
}

//Khởi tạo editor nhập câu hỏi và nhập lời giải
function init(questionId, questionType, questionContent, questionSolve) {
    const eQuestionTmpl = $.templates('#EDITOR_CAU_HOI')
    const editorQuestion = eQuestionTmpl.render({ editorId: 'editor-cau-hoi' })
    $('#box-editor-question').append(editorQuestion)

    const eSolveTmpl = $.templates('#EDITOR_LOI_GIAI')
    const editorSolve = eSolveTmpl.render({ editorId: 'editor-loi-giai' })
    $('#box-editor-solve').append(editorSolve)

    if (questionId) {
        createEditor('editor-cau-hoi', TypeOfCk.CAU_HOI, questionContent, '', questionType)
        createEditor('editor-loi-giai', TypeOfCk.LOI_GIAI, questionSolve, '', questionType)
    }
    else {
        createEditor('editor-cau-hoi', TypeOfCk.CAU_HOI, '', 'Nhập nội dung câu hỏi', questionType)
        createEditor('editor-loi-giai', TypeOfCk.LOI_GIAI, '', 'Nhập lời giải', questionType)
    }
    /*setTimeout(() => bindActionEditor(), 500)*/
}

//Khởi tạo editor nhập câu trả lời và đáp án cho các dạng trắc nghiệm, sắp xếp
function initAnswers(questionId, questionType, answerDatas) {
    answerDatas = answerDatas.replace('"', '\"')
    var listAsnwerDatas = (answerDatas != "") ? JSON.parse(answerDatas) : ""
    if (Array.isArray(listAsnwerDatas)) {
        listAsnwerDatas.forEach(function (item, i) {
            //var uniqueId = new Date().getTime().toString() + (Math.random() * 10000).toString()
            var uniqueId = new Date().getTime().toString() + Math.round((Math.random() * 10000)).toString()
            var editorId = 'editor-cau-tra-loi' + uniqueId
            const eAnswerTmpl = $.templates('#EDITOR_CAU_TRA_LOI')

            const editorQuestion = eAnswerTmpl.render({ editorId: editorId, answer_number: i + 1, data: item.noi_dung })
            $('#box-editor-answer').append(editorQuestion)

            if (questionId) {
                createEditor(editorId, TypeOfCk.CAU_TRA_LOI, item.noi_dung, '', questionType)
            }
            else {
                createEditor(editorId, TypeOfCk.CAU_TRA_LOI, '', 'Nhập nội dung câu trả lời', questionType)
            }
            // Lưu tạm
            /*$('#' + editorId).find('.question-editor__content').html(item.noi_dung)*/
            //console.log(getEditorContent(editorId))
            //$('#' + editorId).find('.question-editor__content').html(getEditorContent(editorId))
            //setTimeout(() => bindingEditorActionById(editorId), 500)
        })
    }
}

function addNewAnswer(questionType, answerNumber, rAnswerParam, editorContent) {
    var uniqueId = new Date().getTime().toString() + Math.round((Math.random() * 10000)).toString()
    var editorId = 'editor-cau-tra-loi-' + uniqueId
    const eAnswerTmpl = $.templates('#EDITOR_CAU_TRA_LOI')

    const editorQuestion = eAnswerTmpl.render({ editorId: editorId, answer_number: answerNumber, data: "" })
    $('#box-editor-answer').append(editorQuestion)

    createEditor(editorId, TypeOfCk.CAU_TRA_LOI, editorContent, 'Nhập nội dung câu trả lời', questionType)
    /*setTimeout(() => bindingEditorActionById(editorId), 500)*/
    // Thêm đáp án
    if (questionType == DangCauHoi.LUA_CHON_DAP_AN || questionType == DangCauHoi.SAP_XEP || questionType == DangCauHoi.SAP_XEP_KEO_THA || questionType == DangCauHoi.LUA_CHON_DUNG_SAI) {
        addNewRightAnswer(questionType, editorId, answerNumber, rAnswerParam)
    }
    //else if (questionType == DangCauHoi.LUA_CHON_DUNG_SAI) {
    //    addNewRightAnswer(questionType, editorId, answerNumber, rAnswerParam)
    //}
}

//Khởi tạo editor nhập câu trả lời và đáp án cho các dạng trắc nghiệm, sắp xếp
function addNewRightAnswer(questionType, answerId, rAnswerNumber, rAnswerParam) {
    if (rAnswerParam != null) {
        var uniqueId = new Date().getTime().toString() + Math.round((Math.random() * 10000)).toString()
        var editorId = 'dap-an' + uniqueId
        rAnswerParam.editorId = editorId
        rAnswerParam.current_index = rAnswerNumber
        rAnswerParam.answer_id = answerId
        var eAnswerTmpl = $.templates('#EDITOR_DAP_AN')
        if (questionType == DangCauHoi.SAP_XEP) {
            eAnswerTmpl = (rAnswerParam.type_view_sort == TypeOfViewSort.KEO_THA) ? $.templates('#EDITOR_DAP_AN_KEO_THA') : $.templates('#EDITOR_DAP_AN_TICH_MUI_TEN')
        }

        if (questionType == DangCauHoi.LUA_CHON_DAP_AN) {
            rAnswerParam.right_answer_identity = AnswerIdentity[rAnswerNumber - 1]
            const editorQuestion = eAnswerTmpl.render(rAnswerParam)
            $('#box-view-right-answer').append(editorQuestion)
            reloadScript()
        }
        else if (questionType == DangCauHoi.SAP_XEP || questionType == DangCauHoi.SAP_XEP_KEO_THA) {
            var idBox = (rAnswerParam.type_view_sort == TypeOfViewSort.KEO_THA) ? 'drag-drop' : 'arrow'
            const editorQuestion = eAnswerTmpl.render(rAnswerParam)
            $('#box-view-right-answer').find('#' + idBox).find('.view-right-answer').append(editorQuestion)
            actionBoxRightAnswer()
        }
        else if (questionType == DangCauHoi.LUA_CHON_DUNG_SAI) {
            rAnswerParam.identity = 0
            const editorQuestion = eAnswerTmpl.render(rAnswerParam)
            $('#box-view-right-answer').append(editorQuestion)
        }
    }
}

//bind các action của các nút trên editor
function bindActionEditor() {
    const editorKeys = (Array.from(editors.keys()))
    editorKeys.forEach((editorId) => {
        bindingEditorActionById(editorId)
    })
}

function bindingEditorActionById(editorId) {
    $('#lua-chon-form' + editorId).submit((e) => {
        e.preventDefault()
        let options = $(e.target).find('[name="inputOptions"]').val()
        let values = options.split('\n').filter(v => v && v != '')
        values = values.length <= 0 ? [0] : values
        map = map.filter(x => x.type != TYPE.LUA_CHON)
        map.push({
            type: TYPE.LUA_CHON,
            values: values
        })
        $('[aria-labelledby="dropdownMenuButton4"]').removeClass('show')
    })
    $('#lua-chon-form' + editorId).on('reset', (e) => {
        map = map.filter(x => x.type != TYPE.LUA_CHON)
        $('[aria-labelledby="dropdownMenuButton4"]').removeClass('show')
    })

    $('#phanso-form' + editorId).submit((e) => {
        e.preventDefault()
        const form = $(e.target)
        let tuSo = form.find('[name="inputTuSo"]').val()
        let mauSo = form.find('[name="inputMauSo"]').val()
        map = map.filter(x => x.type != TYPE.PHAN_SO)
        map.push({
            type: TYPE.PHAN_SO,
            values: {
                tuSo: tuSo,
                mauSo: mauSo
            }
        })
        $('[aria-labelledby="dropdownMenuButton2"]').removeClass('show')
    })
    $('#phanso-form' + editorId).on('reset', (e) => {
        map = map.filter(x => x.type != TYPE.PHAN_SO)
        $('[aria-labelledby="dropdownMenuButton2"]').removeClass('show')
    })



    $('#phep-chia-form' + editorId).submit((e) => {
        e.preventDefault()
        const form = $(e.target)
        const soBiChia = form.find('[name="inputSoBiChia"]').val()
        const soChia = form.find('[name="inputSoChia"]').val()
        const thuong = form.find('[name="inputThuong"]').val()
        const soDu = form.find('[name="inputSoDu"]').val()
        map = map.filter(x => x.type != TYPE.PHEP_CHIA)
        map.push({
            type: TYPE.PHEP_CHIA,
            values: {
                soBiChia: soBiChia,
                soChia: soChia,
                thuongSo: thuong,
                soDu: soDu
            }
        })
        $('[aria-labelledby="dropdownMenuButton1"]').removeClass('show')
    })
    $('#phep-chia-form' + editorId).on('reset', (e) => {
        map = map.filter(x => x.type != TYPE.PHAN_SO)
        $('[aria-labelledby="dropdownMenuButton1"]').removeClass('show')
    })

    $('#btn-ck-toolbar-' + editorId).click(function (e) {
        e.preventDefault()
        const editor = editors.get(editorId)
        if (editor != null) {
            const toolbar = editor.ui.view.toolbar.element
            if (toolbar.style.display == 'none') {
                toolbar.style.display = 'block'
            }
            else {
                toolbar.style.display = 'none'
            }
        }
    })

    $('#btn-reset-ckcontent-' + editorId).click((e) => {
        e.preventDefault()
        const editor = editors.get(editorId)
        if (editor != null) {
            editor.setData('')
        }
    })


    $('#selectBoxOptions' + editorId).on('dragstart', event => {
        const target = event.target.nodeType == 1 ? event.target : event.target.parentElement
        const draggable = target.closest('[draggable]')
        const evt = event.originalEvent
        evt.dataTransfer.setData('text/plain', draggable.innerText)
        evt.dataTransfer.setData('text/html', draggable.innerText)
        const controlType = draggable.getAttribute('data-type').toLowerCase()
        const sharedId = ""
        if (controlType === 'lua-chon') {
            let storageControl = map.find(i => i.type == TYPE.LUA_CHON)
            if (storageControl && storageControl.values) {
                ;
                evt.dataTransfer.setData('control', JSON.stringify({ id: sharedId, values: storageControl.values, type: TYPE.LUA_CHON }))
            }
            else {
                evt.dataTransfer.setData('control', JSON.stringify({ id: sharedId, values: [], type: TYPE.LUA_CHON }))
            }
        }
        else if (controlType === 'nhap') {
            evt.dataTransfer.setData('control', JSON.stringify({ id: sharedId, values: [], type: TYPE.NHAP }))
        }
        else if (controlType === 'phan-so') {
            let storageControl = map.find(i => i.type == TYPE.PHAN_SO)
            if (storageControl && storageControl.values) {
                evt.dataTransfer.setData('control', JSON.stringify({ id: sharedId, values: storageControl.values, type: TYPE.PHAN_SO }))
            }
            else {
                evt.dataTransfer.setData('control', JSON.stringify({ id: sharedId, values: { tuSo: '', mauSo: '' }, type: TYPE.PHAN_SO }))
            }
        }
        else if (controlType === 'phep-chia') {
            let storageControl = map.find(i => i.type == TYPE.PHEP_CHIA)
            if (storageControl && storageControl.values) {
                evt.dataTransfer.setData('control', JSON.stringify({ id: sharedId, values: storageControl.values, type: TYPE.PHEP_CHIA }))
            }
            else {
                evt.dataTransfer.setData('control', JSON.stringify({ id: sharedId, values: { soBiChia: '', soChia: '', soDu: '', thuongSo: '' }, type: TYPE.PHEP_CHIA }))
            }
        } else {
            console.error('Unsupported control')
        }
        evt.dataTransfer.setDragImage(draggable, 0, 0)
    })


    $('#collapseDragEquationQuestion' + editorId).on('show.bs.collapse', (e) => {
        const editorId = $(e.target).data('editor-id')
        $('#' + editorId).find('.question-group__left').addClass('select-box__opened')
    })
    $('#collapseDragEquationQuestion' + editorId).on('hide.bs.collapse', (e) => {
        const editorId = $(e.target).data('editor-id')
        $('#' + editorId).find('.question-group__left').removeClass('select-box__opened')
    })

    $('#preview' + editorId).on('shown.bs.collapse', (e) => {
        updateLivePreview(editorId)
    })
    $('#btn-save-question').click(function (e) {
        e.preventDefault()
        submitQuestionData()
    })

    $('#form-dap-an').on('change', 'input', function (e) {
        const _this = $(this)
        const value = _this.val()
        _this.attr('value', value)
    })

    $('#btn-save-question').click(function (e) {
        e.preventDefault()
        submitQuestionData()
    })
    $('.btn-delete-answer').click(function (e) {
        e.preventDefault()
        // tìm đáp án tương ứng và xóa
        var questionType
        var editor = editors.get(editorId)
        if (editor != null) {
            var mapQuestion = mapEditorQuestions.get(editor.id)
            if (mapQuestion != null) {
                questionType = mapQuestion.questionType
            }
        }
        if (questionType == DangCauHoi.LUA_CHON_DUNG_SAI) {
            return
        }
        deleteRightAnswerBox(this, questionType)
    })


    $('#box-editor-solve').on('show.bs.collapse', function (e) {
        $('#btn-hien-loi-giai> span').text('Ẩn lời giải')
        $('#btn-hien-loi-giai').removeClass('btn-gray-2').addClass('btn-primary-light-4')
    })
    $('#box-editor-solve').on('hide.bs.collapse', function (e) {
        $('#btn-hien-loi-giai> span').text('Hiện lời giải')
        $('#btn-hien-loi-giai').removeClass('btn-primary-light-4').addClass('btn-gray-2')
    })
}


//Lấy nội dung editor
function getEditorContent(editorId, removePTag = true) {
    try {
        let ckContent = editors.get(editorId).getData()
        //if (removePTag) {
        //    if (ckContent.startsWith('<p>')) {
        //        ckContent = ckContent.replace(/<p>(.*)<\/p>/g, '$1')
        //    }
        //}
        return ckContent
    } catch (e) {
        console.error(e.stack)
    }
}
///Cập nhật trực tiếp data từ editor xuống box xem trước
function updateLivePreview(editorId) {
    try {
        const previewBox = $('#preview' + editorId)
        var isExpanded = previewBox.hasClass('show')
        if (isExpanded) {
            const editor = editors.get(editorId)
            if (editor != null) {
                const editorContent = getEditorContent(editorId)
                console.log(editorContent)
                previewBox.find('.question-preview').html(editorContent)
            }
        }
    } catch (error) {
        console.error(error.stack)
    }
}


function highlightSelectingControl(editor) {
    $('.answer-box').removeClass('highlight')
    const selectedElement = editor.model.document.selection.getSelectedElement()
    if (selectedElement != null && selectedElement.name === 't-control') {
        const selectedElementId = selectedElement.getAttribute('id')
        $('.answer-box[data-id="' + selectedElementId + '"]').addClass('highlight')
    }
}
// Update value từ editor của câu trả lời vào đáp án
function updateValueInputAnswerFromEditor(editorId, value) {
    // loại câu hỏi
    var questionType
    var editor = editors.get(editorId)
    if (editor != null) {
        var mapQuestion = mapEditorQuestions.get(editor.id)
        if (mapQuestion != null) {
            questionType = mapQuestion.questionType
        }
    }
    // Lưu tạm
    $('#' + editorId).find('.question-editor__content').html(value)
    if (questionType == DangCauHoi.LUA_CHON_DAP_AN || questionType == DangCauHoi.LUA_CHON_DUNG_SAI) {
        var inputRightAnswer = $('#box-view-right-answer').find('.row.gutters-6').filter(function (i) {
            return $(this).data('answer-id') == editorId
        })
        // update giá trị nhập
        if ($(inputRightAnswer) != null) {
            $(inputRightAnswer).find('[name="right_answer_content"]').html(value)
        }
    }
    else if (questionType == DangCauHoi.SAP_XEP || questionType == DangCauHoi.SAP_XEP_KEO_THA) {
        var box_right_asnwer = $('#box-view-right-answer').find('#drag-drop')
        if (box_right_asnwer == null || box_right_asnwer == undefined || box_right_asnwer.length == 0) {
            box_right_asnwer = $('#box-view-right-answer').find('#arrow')
        }
        var inputRightAnswer = $(box_right_asnwer).find('.answer-region').filter(function (i) {
            return $(this).data('answer-id') == editorId
        })
        // update giá trị nhập
        if ($(inputRightAnswer).attr('name') == 'right_answer_content') {
            // box kéo thả
            $(inputRightAnswer).html(value)
        }
        else {
            // box tích chọn
            var answer_content_ele = $(inputRightAnswer).find('[name="right_answer_content"]')
            if (answer_content_ele != null && answer_content_ele != undefined) {
                $(answer_content_ele).html(value)
            }
        }
    }
}

function deleteRightAnswerBox(sender, questionType) {
    let editorId = $(sender).data('editor-id')
    var inputAnswer = $('#box-editor-answer').find('.question-name').filter(function (i) {
        return $(this).data('editor-id') == editorId
    })
    var labelAnswer = $('#box-editor-answer').find('.question-group').filter(function (i) {
        return $(this).attr('id') == editorId
    })
    var inputRightAnswer
    if (questionType == DangCauHoi.LUA_CHON_DAP_AN) {
        inputRightAnswer = $('#box-view-right-answer').find('.row.gutters-6').filter(function (i) {
            return $(this).data('answer-id') == editorId
        })
    }
    else if (questionType == DangCauHoi.SAP_XEP || questionType == DangCauHoi.SAP_XEP_KEO_THA) {
        var box_right_asnwer = $('#box-view-right-answer').find('#drag-drop')
        if (box_right_asnwer != null && box_right_asnwer != undefined && box_right_asnwer.length > 0) {
            inputRightAnswer = box_right_asnwer.find('.answer-region').filter(function (i) {
                return $(this).data('answer-id') == editorId
            })
        }
        else {
            box_right_asnwer = $('#box-view-right-answer').find('#arrow')
            inputRightAnswer = box_right_asnwer.find('.answer-region').filter(function (i) {
                return $(this).data('answer-id') == editorId
            })
        }
    }
    else if (questionType == DangCauHoi.LUA_CHON_DUNG_SAI) {
        return
    }
    //// loại câu hỏi
    //var questionType
    //var editor = editors.get(editorId)
    //if (editor != null) {
    //    var mapQuestion = mapEditorQuestions.get(editor.id)
    //    if (mapQuestion != null) {
    //        questionType = mapQuestion.questionType
    //    }
    //}

    // xóa hàng
    if ($(inputRightAnswer) != null) {
        $(inputAnswer).remove()
        $(labelAnswer).remove()
        if (inputRightAnswer != null && inputRightAnswer != undefined) {
            $(inputRightAnswer).remove()
        }

        if (questionType == DangCauHoi.LUA_CHON_DAP_AN || questionType == DangCauHoi.SAP_XEP || questionType == DangCauHoi.SAP_XEP_KEO_THA) {
            // update lại câu
            $('#box-editor-answer').find('.question-name').each(function (i, item) {
                $(item).text("Câu trả lời " + (i + 1))
            })
            if (questionType == DangCauHoi.LUA_CHON_DAP_AN) {
                // nếu không có đáp án đúng nào đang được check thì
                var countAnswer = $('#box-view-right-answer').find('.row.gutters-6').length
                // update lại đáp án
                $('#box-view-right-answer').find('.row.gutters-6').each(function (i, item) {
                    var newId = 'q' + (i + 1)
                    $(item).find('.answer-identity').text(AnswerIdentity[i])
                    $(item).find('.item').attr('for', newId)
                    $(item).find('[name="list-radio"]').attr('id', newId)
                })
                // số đáp án hiện tại
                $('#currentIndElement').val((countAnswer + 1).toString())
                // vị trí định danh hiện tại
                $('#currentAnswerIdentity').val((countAnswer != 0) ? AnswerIdentity[countAnswer - 1] : AnswerIdentity[0])
            }
            else {
                var box_right_answer = $('#box-view-right-answer').find('#drag-drop')
                if (box_right_answer == null || box_right_answer == undefined || box_right_answer.length == 0) {
                    box_right_answer = $('#box-view-right-answer').find('#arrow')
                }
                var countAnswer = $(box_right_answer).length
                $('#currentIndElement').val((countAnswer + 1).toString())
            }
        }
    }
}

function actionBoxRightAnswer() {
    $('#drag-drop').find('.view-right-answer').sortable()
    $('.answer_up').unbind('click')
    $('.answer_down').unbind('click')
    $('.answer_up').click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        // get div
        var id = $(this).data('id')
        if (id != null && id != "" && id != undefined) {
            // find closet
            var list_answer_region = $("#arrow").find('.item.answer-region')
            var ind = $('#' + id).index()
            //var ind = list_answer_region.indexOf($('#' + id))
            if (ind > 0) {
                $('#' + id).insertBefore($(list_answer_region)[ind - 1])
            }
        }
    })
    $('.answer_down').click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        // get div
        var id = $(this).data('id')
        if (id != null && id != "" && id != undefined) {
            // find closet
            var list_answer_region = $("#arrow").find('.item.answer-region')
            var ind = $('#' + id).index()
            if (ind >= 0 && ind < list_answer_region.length - 1) {
                //$('#' + id).insertBefore($(list_answer_region)[ind - 1])
                $((list_answer_region)[ind + 1]).insertBefore($('#' + id))
            }
        }
    })
}
///#endregion