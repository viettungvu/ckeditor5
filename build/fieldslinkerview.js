var leftOff = [{ "id": 1, "text": "" }, { "id": 2, "text": "" }, { "id": 3, "text": "" }, { "id": 4, "text": "" }]
var rigthOff = [{ "id": 5, "text": "" }, { "id": 6, "text": "" }, { "id": 7, "text": "" }, { "id": 8, "text": "" }]
var existOff = []
var fieldLinks
var linker_display

function genAllViewLinkerWithMode(linkersArray) {
    if (linkersArray && Array.isArray(linkersArray) && linkersArray.length > 0) {
        linkersArray.forEach(function (item, i) {
            if (item.key && item.left_col_data_json && item.right_col_data_json && item.existing_linkers_json) {
                genViewLinkerWithMode(item.key, item.left_col_data_json, item.right_col_data_json, item.existing_linkers_json)
            }
        })
    }
}

function genViewLinkerWithMode(key, leftColDataJson, rightColDataJson, existingLinkersJson) {
    try {
        if (leftColDataJson) {
            leftOff = JSON.parse(leftColDataJson)
        }
        if (rightColDataJson) {
            rigthOff = JSON.parse(rightColDataJson)
        }
        if (existingLinkersJson) {
            existOff = JSON.parse(existingLinkersJson)
        }
        fieldLinkerViewSetup(key)
    } catch (e) {
        console.error(e)
    }
}

function fieldLinkerViewSetup(key) {

    var input = {
        "localization": {
            "mandatoryErrorMessage": "Bắt buộc chọn",
        },
        "options": {
            //"byName": true,
            //"lineStyle": "square-ends",
            //"autoDetect": "off",
            //"effectHover": "on",
            //"effectHoverBorderWidth": 2,
            "byName": true,
            "lineStyle": "square-ends",
            "autoDetect": "off",
            "effectHover": "on",
            "effectHoverBorderWidth": 2,
            "mobileClickIt": true
        },
        //"listA":
        //{
        //    "name": "",
        //    "list": leftOff
        //},
        //"listB":
        //{
        //    "name": "",
        //    "list": rigthOff
        //},
        Lists: [
            {
                "name": "Left",
                "list": leftOff
            },
            {
                "name": "Right",
                "list": rigthOff
            },
        ],
        "existingLinks": existOff
    }
    //fieldLinks = $("#" + key).fieldsLinkerAdmin("init", input)
    try {
        //let fl = $("#" + key).fieldsLinkerAdmin("init", input)
        let fl = $("#" + key).fieldsLinker("init", input)
        fl.fieldsLinker("disable")
    } catch (e) {

    }
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