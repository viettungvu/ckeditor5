const DangCauHoi = {

    LUA_CHON_DAP_AN: 301,
    SAP_XEP: 302,
    DIEN_VAO_CHO_TRONG: 303,
    GHEP_NOI: 304,
    LUA_CHON_DUNG_SAI: 305,
    TU_LUAN: 306,
    SAP_XEP_KEO_THA: 307,
}


const MODE = {
    NEW: 1,
    DETAIL: 2,
    EDIT: 3
}

const TypeOfCk = {
    CAU_HOI: 1,
    LOI_GIAI: 2,
    DAP_AN: 3,
    CAU_TRA_LOI: 4
}

const TypeOfViewSort = {
    KEO_THA: 1,
    TICH_MUI_TEN_LEN_XUONG: 2
}

const AnswerIdentity = ["A.", "B.", "C.", "D.", "E.", "F."]

const DangTracNghiem = {
    TRAC_NGHIEM_MOT_DAP_AN: 1,
    TRAC_NGHIEM_NHIEU_DAP_AN: 2
}

const DOI_TUONG_NHAN_NV = {
    GRADE: 1,
    CLASS: 2,
    STUDENT: 3,
}

const VaiTro = {
    ALL: 0,
    HE_THONG: 1,
    TRUONG_HOC: 2,
    GIAO_VIEN: 3,
    PHU_HUYNH: 4,
    HOC_SINH: 5,
    TO_TRUONG_BO_MON: 6,
    TO_TRUONG_KHOI_BO_MON: 7,
    VAN_LAI: 8,

}


const DELIMITERS_KATEX = [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    //{ left: "\\begin{equation}", right: "\\end{equation}", display: true },
    //{ left: "\\begin{align}", right: "\\end{align}", display: true },
    //{ left: "\\begin{alignat}", right: "\\end{alignat}", display: true },
    //{ left: "\\begin{gather}", right: "\\end{gather}", display: true },
    //{ left: "\\begin{CD}", right: "\\end{CD}", display: true },
    { left: "\\[", right: "\\]", display: true },
    { left: "[KATEX]", right: "[/KATEX]", display: true }
]

const SPECIAL_CHAR_KATEX_UNKNOW=['%']