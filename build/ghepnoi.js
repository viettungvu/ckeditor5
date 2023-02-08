
var leftOff = [{ "id": 1, "text": "" }, { "id": 2, "text": "" }, { "id": 3, "text": "" }, { "id": 4, "text": "" }]
var rigthOff = [{ "id": 5, "text": "" }, { "id": 6, "text": "" }, { "id": 7, "text": "" }, { "id": 8, "text": "" }]
var existOff = []
var fieldLinks
var linker_display

function genLinkerWithMode(questionId, leftColDataJson, rightColDataJson, existingLinkersJson) {
    if (questionId) {
        try {
            if (leftColDataJson) {
                console.log(JSON.stringify(leftColDataJson))
                leftOff = JSON.parse(leftColDataJson)
            }
            if (rightColDataJson) {
                console.log(rightColDataJson)
                rigthOff = JSON.parse(rightColDataJson)
            }
            if (existingLinkersJson) {
                existOff = JSON.parse(existingLinkersJson)
            }
        } catch (e) {
            console.error(e)
        }
    }
    fieldLinkerSetup()
}


function fieldLinkerSetup() {

    var input = {
        "localization": {
            "mandatoryErrorMessage": "Bắt buộc chọn",
        },
        "options": {
            "byName": true,
            "lineStyle": "square-ends",
            "autoDetect": "off",
            "effectHover": "on",
            "effectHoverBorderWidth": 2,
            "mobileClickIt": true
        },
        "listA":
        {
            "name": "<p style='text-align:center;font-weight:700;padding-bottom:10px'>Kéo cột A</p>",
            "list": leftOff
        },
        "listB":
        {
            "name": "<p style='text-align:center;font-weight:700;padding-bottom:10px'>Thả vào cột B</p>",
            "list": rigthOff
        },
        "existingLinks": existOff
    }
    fieldLinks = $("#bonds").fieldsLinkerAdmin("init", input)
    $(".FL-left input.li").change(function () {
        let offA = $(this).data("offset")
        leftOff[offA].text = $(this).val()
    })
    $(".FL-right input.li").change(function () {
        let offB = $(this).data("offset")
        rigthOff[offB].text = $(this).val()
    })
    $(".btn-add-left").on("click", function () {
        addMatchingInput()
    })
    $(".btn-add-right").on("click", function () {
        removeMatchingItem()
    })
    $(".btn-save").click(function (e) {
        e.preventDefault()
        var re = getAllLinkers()
        leftOff = []
        $("#bonds .FL-left input").each(function () {
            var obj = {}
            obj.text = $(this).val() || ""
            obj.id = $(this).data("name")

            leftOff.push(obj)
        })




        rigthOff = []
        $("#bonds .FL-right input").each(function () {
            var obj = {}
            obj.text = $(this).val() || ""
            obj.id = $(this).data("name")
            rigthOff.push(obj)
        })


        var results = fieldLinks.fieldsLinkerAdmin("getLinks")
        input = reInitFieldsLinkerAdmin(leftOff, rigthOff, true, results.links)

        //$("#linker_display").fieldsLinkerAdmin("init", input);
        initfieldsLinker("linker_display", leftOff, rigthOff, results.links)
    })
}
function reInitFieldsLinkerAdmin(_leftOff, _rigthOff, _isUpdate, _existOff) {
    var input = {
        "localization": {
            "mandatoryErrorMessage": "Bắt buộc chọn",
        },
        "options": {
            "byName": true,
            "lineStyle": "square-ends",
            "autoDetect": "off",
            "effectHover": "on",
            "effectHoverBorderWidth": 2,
            "mobileClickIt": true
        },
        "listA":
        {
            "name": "<p style='text-align:center;font-weight:700;padding-bottom:10px'>Kéo cột A</p>",
            "list": _leftOff
        },
        "listB":
        {
            "name": "<p style='text-align:center;font-weight:700;padding-bottom:10px'>Thả vào cột B</p>",
            "list": _rigthOff
        }
    }
    if (_isUpdate) {
        input["existingLinks"] = _existOff
    }
    return input
}
function addMatchingInput() {
    leftOff = []
    $("#bonds .FL-left input").each(function () {
        var obj = {}
        obj.text = $(this).val() || ""
        obj.id = $(this).data("name")

        leftOff.push(obj)
    })

    var arrayAll = [...leftOff, ...rigthOff]

    var max = Math.max.apply(Math, arrayAll.map(function (o) { return o.id }))
    leftOff.push({
        id: max + 1,
        text: ""
    })


    rigthOff = []
    $("#bonds .FL-right input").each(function () {
        var obj = {}
        obj.text = $(this).val() || ""
        obj.id = $(this).data("name")
        rigthOff.push(obj)
    })
    var arrayAll = [...leftOff, ...rigthOff]

    max = Math.max.apply(Math, arrayAll.map(function (o) { return o.id }))
    rigthOff.push({
        id: max + 1,
        text: ""
    })
    var results = fieldLinks.fieldsLinkerAdmin("getLinks")
    input = reInitFieldsLinkerAdmin(leftOff, rigthOff, true, results.links)
    fieldLinks.fieldsLinkerAdmin("init", input)
}
function removeMatchingItem() {
    leftOff = []
    $("#bonds .FL-left input").each(function () {
        var obj = {}
        obj.text = $(this).val() || ""
        obj.id = $(this).data("name")

        leftOff.push(obj)
    })

    rigthOff = []
    $("#bonds .FL-right input").each(function () {
        var obj = {}
        obj.text = $(this).val() || ""
        obj.id = $(this).data("name")
        rigthOff.push(obj)
    })
    leftOff.pop()
    rigthOff.pop()

    var results = fieldLinks.fieldsLinkerAdmin("getLinks")
    input = reInitFieldsLinkerAdmin(leftOff, rigthOff, true, results.links)
    fieldLinks.fieldsLinkerAdmin("init", input)
}
function getAllLinkers() {
    var dataAnNoi = []
    var results = fieldLinks.fieldsLinkerAdmin("getLinks")
    $("#bonds .FL-left input").each(function () {

        var obj = {}
        obj.Cot = 0
        obj.Des = ""
        obj.Text = $(this).val() || ""
        obj.Id = $(this).data("name")
        obj.RelateId = []

        var item = results.links.find((o) => { return o["from"] === obj.Id })
        if (item != null && item != undefined) {
            obj.RelateId.push(item.to)
        }
        dataAnNoi.push(obj)
    })
    $("#bonds .FL-right input").each(function () {
        var obj = {}
        obj.Cot = 1
        obj.Text = $(this).val() || ""
        obj.Des = ""
        obj.Id = $(this).data("name")
        obj.RelateId = []
        dataAnNoi.push(obj)
    })
    return dataAnNoi
}
function initfieldsLinker(key, leftOff, rightOff, existOff) {
    try {
        let fl = $("#" + key).fieldsLinker("init", reInitFieldsLinker(leftOff, rightOff, existOff))
        fl.fieldsLinker("disable")
    } catch (e) {

    }
}
function reInitFieldsLinker(left, right, existOff) {
    var input = {
        "localization": {
            "mandatoryErrorMessage": "Bắt buộc chọn",
        },
        "options": {
            "associationMode": "oneToOne",
            "lineStyle": "square-ends",
            "buttonErase": "Erase Links",
            "displayMode": "original",
            "whiteSpace": "nowrap",
            "mobileClickIt": true
        },
        "Lists": [
            {
                "name": "Click đáp án bên TRÁI sau đó click đáp án bên PHẢI",
                "list": left
            },
            {
                "name": "Đáp án bên PHẢI",
                "list": right
            }
        ]
    }
    input["existingLinks"] = existOff
    return input
}



function submitQuestionData() {
    var question_id = $('input[name="question_id"]') != null ? $('input[name="question_id"]').val() : ''

    const noiDungCauHoi = getEditorContent('editor-cau-hoi')
    if (!noiDungCauHoi || noiDungCauHoi == '') {
        setAlertWarning('Bạn chưa nhập nội dung câu hỏi!')
        return
    }
    const linkersArray = getAllLinkers()
    const matchedLink = linkersArray.filter((linker) => linker.RelateId.length > 0)
    if (matchedLink.length <= 0) {
        setAlertWarning('Bạn cần nối ít nhất một hàng!')
        return
    }
    answer_contents = linkersArray.filter((link) => link.Text != '').map((link) => {
        return {
            nhom_cau: link.Cot,
            uid: link.Id,
            noi_dung: link.Text,
            relate_id: link.RelateId
        }
    })
    var confirm_title = !question_id ? 'Xác nhận tạo mới' : 'Xác nhận cập nhật'
    var confirm_content = !question_id ? 'Bạn có xác nhận muốn tạo mới câu hỏi này?' : 'Bạn có xác nhận muốn cập nhật câu hỏi này?'
    showPopupConfirm(confirm_title, confirm_content, "Xác nhận", () => {
        var formData = new FormData()
        formData.set('exercise_id', $('#exercise_id').val())
        formData.set('type', DangCauHoi.GHEP_NOI)
        formData.set('grade', $('select[name="grade"] option:selected').val())
        //formData.set('topic_question', 'Lw9QX4QB3WZtKvmStSkv'/* $('select[name="topic_question"] option:selected').val())*/)
        // chủ đề chủ điểm
        var subtopics_id = get_all_checked_topic()
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