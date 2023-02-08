//for (const dropdown of document.querySelectorAll(".xcustom-select-wrapper")) {
//    dropdown.addEventListener('click', function () {
//        this.querySelector('.xcustom-select').classList.toggle('xopen');
//    })
//}

//for (const option of document.querySelectorAll(".custom-option")) {
//    option.addEventListener('click', function () {
//        if (!this.classList.contains('selected')) {
//            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
//            this.classList.add('selected');
//            /*this.closest('.xcustom-select').querySelector('.xcustom-select__trigger span').textContent = this.textContent;*/
//            this.closest('.xcustom-select').querySelector('.xcustom-select__trigger span').innerHTML = this.innerHTML;
//        }
//    })
//}
//window.addEventListener('click', function (e) {
//    for (const select of document.querySelectorAll('.xcustom-select')) {
//        if (!select.contains(e.target)) {
//            select.classList.remove('xopen');
//        }
//    }
//});
function xSelectOptionCustom(dropdown) {
	dropdown.querySelector('.xcustom-select').classList.toggle('xopen');
    // dropdown.addEventListener('click', function () {
        // this.querySelector('.xcustom-select').classList.toggle('xopen');
    // })
    for (const option of dropdown.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function () {
            if (!this.classList.contains('selected')) {
                try {
                    let ob = this.parentNode.querySelector('.custom-option.selected');
                    if (typeof (ob) !== 'undefined')
                        ob.classList.remove('selected');
                } catch (e) {

                }
                this.classList.add('selected');
                this.closest('.xcustom-select').querySelector('.xcustom-select__trigger span').innerHTML = this.innerHTML;
                this.closest('.xcustom-select').classList.remove('xopen');
                try {
                    this.closest('.xcustom-select').getElementsByTagName("input")[0].value = this.getAttribute("value");
                } catch (e) {

                }
            }
			dropdown.querySelector('.xcustom-select').classList.toggle('xopen');
        })
    }
}