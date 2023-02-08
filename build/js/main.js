$(".select-checkbox__active").length > 0 &&
    $(".select-checkbox__active").click(function () {
        $(this).parent().toggleClass("open")
    }),
    $(function () {
        function t() {
            $(".site-header .dropdown-toggle.show").length ? $("#overlay").addClass("show") : $("#overlay").removeClass("show")
        }
        $(".site-header .dropdown-toggle").each(function () {
            $(this).on("click", function () {
                t()
            })
        }),
            $(document).on("click", function () {
                $(".site-header").length && t()
            }),
            $(".site-header .dropdown-menu").on("click", function (t) {
                t.stopPropagation()
            }),
            $(".js-notification-close").on("click", function (t) {
                $(".nav-notification__wrapper, .nav-notification__menu, #overlay").removeClass("show")
            }),
            $(".nav-search-toggler").on("click", function (t) {
                t.stopPropagation(), $(".nav-search-form").toggleClass("active").find("input").focus()
            }),
            $(".nav-search-form").on("click", function (t) {
                t.stopPropagation()
            }),
            $(document).on("click", function () {
                $(".nav-search-form").removeClass("active")
            }),
            $(".nav-tabs-responsive > li button").click(function () {
                $(this).parent().addClass("active").siblings().removeClass("active").parent().toggleClass("open")
            }),
            $(".nav-lang select").change(function () {
                $(this).next().find("span").text($(this).find(":selected").text())
            })
    }),
    $(".js-check-all").length > 0 &&
    $(".js-check-all").change(function () {
        var t = $(this).closest(".js-check-wrapper")
        this.checked
            ? t.find(".form-check-class input[type=checkbox], .form-check-small input[type=checkbox]").prop("checked", !0)
            : t.find(".form-check-class input[type=checkbox], .form-check-small input[type=checkbox]").prop("checked", !1)
    }),
    $(".tnav .js-check-all").length > 0 &&
    $(".tnav .js-check-all").change(function () {
        var t = $(this).closest(".tnav")
        this.checked ? (t.find(".tnav-normal").hide(), t.find(".tnav-selected").show()) : (t.find(".tnav-normal").show(), t.find(".tnav-selected").hide())
    }),
    $(".js-select-value").length > 0 &&
    $(".js-select-value").change(function () {
        $(this).attr("data-value", $(this).val())
    }),
    $('[data-toggle="datepicker"]').datepicker(),
    $(".question-list-radio").length > 0 &&
    $(".question-list-radio input[type=radio]").change(function () {
        $(this).closest(".question-list-radio").find(".item").removeClass("active")
        var t = $(this).closest(".row")
        $(this).is(":checked") ? t.find(".item").addClass("active") : t.find(".item").removeClass("active")
    }) &&
    $(".question-list-radio input[type=checkbox]").change(function () {
        $(this).closest(".question-list-radio").find(".item").removeClass("active")
        $(".question-list-radio input[type=checkbox]").each(function () {
            var t = $(this).closest(".row")
            $(this).is(":checked") ? t.find(".item").addClass("active") : t.find(".item").removeClass("active")
        })
    }),
    // $(".number-options").length > 0 &&
    // ($(".number-options").click(function (t) {
    // t.stopPropagation(),
    // $(this).toggleClass("active"),
    // $(this)
    // .find("span > span")
    // .click(function (t) {
    // var text = $(this).text();
    // var val=$(this).attr('value')
    // $(this).parent().parent().attr("data-value", text), $(this).parent().parent().find("input").val(val);
    // });
    // }),
    $(document).click(function () {
        $(".number-options.active").removeClass("active")
    })
$(".select-box__options .dropdown-menu").length > 0 &&
    $(".select-box__options .dropdown-menu").click(function (t) {
        t.stopPropagation()
    })
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')),
    tooltipList = tooltipTriggerList.map(function (t) {
        return new bootstrap.Tooltip(t, { container: ".tooltip-container" })
    })

$(document).on('click', '.number-options', function (e) {
    e.stopPropagation()
    $(this).toggleClass('active')
    $(this).find('span > span')
        .click(function (t) {
            var text = $(this).data('equation')
            var val = $(this).attr('value')
            $(this).parent().parent().attr('data-value', text), $(this).parent().parent().find('input').val(val)
        })
})
