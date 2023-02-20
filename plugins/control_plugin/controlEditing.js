import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import UpcastWriter from "@ckeditor/ckeditor5-engine/src/view/upcastwriter";
import {
    toWidget,
    viewToModelPositionOutsideModelElement,
} from "@ckeditor/ckeditor5-widget/src/utils";
import Utils from "../utils/utils";
import Constants from "../utils/constants";
import { ControlType, BackgroundColorClass } from "../../enums/enums";
export default class ControlEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;
        this._defineSchema();
        this._defineConverters();
        this._defineClipboardInputOutput();
        editor.editing.mapper.on(
            "viewToModelPosition",
            viewToModelPositionOutsideModelElement(editor.model, (viewElement) =>
                viewElement.hasClass("t-control")
            )
        );
        editor.config.define("controlConfig", {
            katexRenderOptions: {},
        });
    }
    getControlIdAsEpoch() {
        return new Date().getTime();
    }
    createControlView(modelItem, viewWriter) {
        const cfig = this.editor.config.get("controlConfig");
        const display = cfig.display ? cfig.display : false;
        var cardView;
        if (modelItem != null) {
            var id = modelItem.getAttribute("id");
            var values = modelItem.getAttribute("value") || [];
            var type = modelItem.getAttribute("type");
            var classList = modelItem.getAttribute("class");
            var styles = display ? "display:block;" : "display: inline-block;";
            var containerName = cfig.forceOutputType
                ? cfig.forceOutputType
                : display
                    ? "div"
                    : "span";
            if (type === ControlType.LUA_CHON) {
                try {
                    let optionsView;
                    let displayElement = viewWriter.createRawElement(
                        "span",
                        {},
                        function (domElement) {
                            domElement.innerHTML = "Chọn";
                        }
                    );
                    if (values.length == 0) {
                        optionsView = viewWriter.createRawElement(
                            "span",
                            {
                                class: "custom-option",
                                value: "option1",
                                "data-equation": "option1",
                            },
                            "Option 1"
                        );
                    } else {
                        optionsView = values.map((v, index) =>
                            viewWriter.createRawElement(
                                "span",
                                {
                                    class: "custom-option",
                                    value: v.value,
                                    "data-equation": v.equation,
                                },
                                function (domElement) {
                                    Utils.renderEquationControl(
                                        v.equation,
                                        domElement,
                                        cfig.katexRenderOptions
                                    );
                                    return domElement;
                                }
                            )
                        );
                    }
                    cardView = viewWriter.createContainerElement(
                        containerName,
                        {
                            class: classList,
                            style: styles,
                            "data-type": type,
                            "data-id": id,
                        },
                        viewWriter.createContainerElement(
                            "span",
                            {
                                class: "xcustom-select-wrapper",
                                onclick: "xSelectOptionCustom(this)",
                            },
                            viewWriter.createContainerElement(
                                "span",
                                { class: "xcustom-select" },
                                [
                                    viewWriter.createContainerElement("input", {
                                        type: "hidden",
                                        name: "ANS_LUA_CHON_" + id,
                                        value: "",
                                    }),
                                    viewWriter.createContainerElement(
                                        "span",
                                        { class: "xcustom-select__trigger" },
                                        [
                                            displayElement,
                                            viewWriter.createContainerElement("span", {
                                                class: "arrow",
                                            }),
                                        ]
                                    ),
                                    viewWriter.createContainerElement(
                                        "span",
                                        { class: "xcustom-options" },
                                        optionsView
                                    ),
                                ]
                            ),
                            { renderUnsafeAttributes: ["onclick"] }
                        )
                    );
                } catch (error) {
                    console.error("Lỗi tạo control lựa chọn " + error);
                }
            } else if (type === ControlType.NHAP) {
                return viewWriter.createContainerElement(
                    containerName,
                    {
                        class: classList,
                        style: styles,
                        "data-type": type,
                        "data-id": id,
                    },
                    viewWriter.createContainerElement(
                        "span",
                        { class: "input-number" },
                        viewWriter.createContainerElement("input", {
                            class: "katex",
                            type: "text",
                            name: "ANS_" + id,
                        })
                    )
                );
            } else if (type === ControlType.PHAN_SO) {
                try {
                    var childrenElements = [];
                    if (values.tuSo == "") {
                        childrenElements.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "tu-so", value: "" },
                                viewWriter.createContainerElement("input", {
                                    type: "text",
                                    class: "katex",
                                    name: "ANS_TU_SO_" + id,
                                })
                            )
                        );
                    } else {
                        childrenElements.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "tu-so", value: values.tuSo },
                                viewWriter.createRawElement("span", {}, function (domElement) {
                                    Utils.renderEquationControl(
                                        values.tuSo,
                                        domElement,
                                        cfig.katexRenderOptions
                                    );
                                    return domElement;
                                })
                            )
                        );
                    }
                    if (values.mauSo == "") {
                        childrenElements.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "mau-so", value: "" },
                                viewWriter.createContainerElement("input", {
                                    type: "text",
                                    class: "katex",
                                    name: "ANS_MAU_SO_" + id,
                                })
                            )
                        );
                    } else {
                        childrenElements.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "mau-so", value: values.mauSo },
                                viewWriter.createRawElement("span", {}, function (domElement) {
                                    Utils.renderEquationControl(
                                        values.mauSo,
                                        domElement,
                                        cfig.katexRenderOptions
                                    );
                                    return domElement;
                                })
                            )
                        );
                    }
                    cardView = viewWriter.createContainerElement(
                        containerName,
                        {
                            class: classList,
                            style: styles,
                            "data-type": type,
                            "data-id": id,
                        },
                        viewWriter.createContainerElement(
                            "span",
                            { class: "frac frac-input" },
                            childrenElements
                        )
                    );
                } catch (error) {
                    console.error("Lỗi tạo control phân số " + error);
                }
            } else if (type === ControlType.PHEP_CHIA) {
                try {
                    let firstChilds = [];
                    let secondChilds = [];
                    if (values.soBiChia == "") {
                        firstChilds.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "so-bi-chia" },
                                viewWriter.createContainerElement("input", {
                                    class: "katex ",
                                    type: "text",
                                    name: "ANS_SO_BI_CHIA_" + id,
                                })
                            )
                        );
                    } else {
                        firstChilds.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "so-bi-chia", value: values.soBiChia },
                                viewWriter.createRawElement("span", {}, function (domElement) {
                                    Utils.renderEquationControl(
                                        values.soBiChia,
                                        domElement,
                                        cfig.katexRenderOptions
                                    );
                                    return domElement;
                                })
                            )
                        );
                    }
                    if (values.soChia == "") {
                        secondChilds.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "so-chia" },
                                viewWriter.createContainerElement("input", {
                                    class: "katex",
                                    type: "text",
                                    name: "ANS_SO_CHIA_" + id,
                                })
                            )
                        );
                    } else {
                        secondChilds.push(
                            viewWriter.createRawElement(
                                "span",
                                { class: "so-chia", value: values.soChia },
                                function (domElement) {
                                    Utils.renderEquationControl(
                                        values.soChia,
                                        domElement,
                                        cfig.katexRenderOptions
                                    );
                                    return domElement;
                                }
                            )
                        );
                    }

                    if (values.thuongSo == "") {
                        secondChilds.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "thuong-so" },
                                viewWriter.createContainerElement("input", {
                                    class: "katex",
                                    type: "text",
                                    name: "ANS_SO_THUONG_" + id,
                                })
                            )
                        );
                    } else {
                        secondChilds.push(
                            viewWriter.createRawElement(
                                "span",
                                { class: "thuong-so", value: values.thuongSo },
                                function (domElement) {
                                    Utils.renderEquationControl(
                                        values.thuongSo,
                                        domElement,
                                        cfig.katexRenderOptions
                                    );
                                    return domElement;
                                }
                            )
                        );
                    }
                    if (values.soDu == "") {
                        firstChilds.push(
                            viewWriter.createContainerElement(
                                "span",
                                { class: "so-du" },
                                viewWriter.createContainerElement("input", {
                                    class: "katex",
                                    type: "text",
                                })
                            )
                        );
                    } else {
                        firstChilds.push(
                            viewWriter.createRawElement(
                                "span",
                                { class: "so-du", value: values.soDu },
                                function (domElement) {
                                    Utils.renderEquationControl(
                                        values.soDu,
                                        domElement,
                                        cfig.katexRenderOptions
                                    );
                                    return domElement;
                                }
                            )
                        );
                    }

                    cardView = viewWriter.createContainerElement(
                        containerName,
                        {
                            class: classList,
                            style: styles,
                            "data-type": type,
                            "data-id": id,
                        },
                        viewWriter.createContainerElement("span", { class: "division" }, [
                            viewWriter.createContainerElement(
                                "span",
                                { class: "division__left" },
                                firstChilds
                            ),
                            viewWriter.createContainerElement(
                                "span",
                                { class: "division__right" },
                                secondChilds
                            ),
                        ])
                    );
                } catch (error) {
                    console.error("Lỗi tạo control phép chia " + error);
                }
            } else {
                console.warn("CreateControlView: Unsupported control");
            }
        }
        return cardView;
    }
    getControlDataFromViewElement(viewElement) {
        if (viewElement != null) {
            try {
                let controlId = viewElement.getAttribute("data-id")
                    ? viewElement.getAttribute("data-id")
                    : getControlIdAsEpoch();
                let children = Array.from(viewElement.getChildren());
                let controlType = viewElement.getAttribute("data-type");
                let elementClasses = Array.from(viewElement.getClassNames());
                let filteredArray = BackgroundColorClass.filter((value) =>
                    elementClasses.includes(value)
                );
                let classList = "";
                if (filteredArray.length == 0) {
                    classList +=
                        "t-control " +
                        BackgroundColorClass[controlId % BackgroundColorClass.length];
                } else {
                    if (!elementClasses.includes("t-control")) {
                        elementClasses.push("t-control");
                    }
                    classList = elementClasses.join(" ");
                }
                if (controlType === ControlType.LUA_CHON) {
                    try {
                        let customOptions = Array.from(
                            viewElement.getChild(0).getChild(0).getChild(2).getChildren()
                        );
                        let values = customOptions.map((e) => {
                            if (e.is("element", "span")) {
                                return {
                                    value: Utils.getInputValue(e),
                                    text: Utils.getText(e),
                                    equation: Utils.getEquation(e),
                                };
                            }
                        });
                        return {
                            id: controlId,
                            value: values,
                            type: controlType,
                            class: classList,
                        };
                    } catch (error) {
                        console.error("[getControlDataFromView]-luachon: " + error);
                    }
                } else if (controlType === ControlType.PHAN_SO) {
                    try {
                        let phanSoElement = children.find(
                            (e) => e.is("element", "span") && e.hasClass("frac", "frac-input")
                        );
                        let phanSoChild = Array.from(phanSoElement.getChildren());
                        let tuSoElement = phanSoChild.find(
                            (element) =>
                                element.is("element", "span") && element.hasClass("tu-so")
                        );
                        let mauSoElement = phanSoChild.find(
                            (element) =>
                                element.is("element", "span") && element.hasClass("mau-so")
                        );
                        return {
                            id: controlId,
                            value: {
                                tuSo: Utils.getInputValue(tuSoElement),
                                mauSo: Utils.getInputValue(mauSoElement),
                            },
                            type: controlType,
                            class: classList,
                        };
                    } catch (error) {
                        console.error("[getControlDataFromView]-phanso: " + error);
                    }
                } else if (controlType === ControlType.NHAP) {
                    try {
                        return {
                            id: controlId,
                            type: controlType,
                            class: classList,
                        };
                    } catch (error) {
                        console.error("[getControlDataFromView]-nhap: " + error);
                    }
                } else if (controlType === ControlType.PHEP_CHIA) {
                    try {
                        let divisionElement = children.find(
                            (e) => e.is("element", "span") && e.hasClass("division")
                        );
                        let divisionLeftElement = divisionElement.getChild(0);
                        let divisionRightElement = divisionElement.getChild(1);
                        let soBiChiaElement = divisionLeftElement.getChild(0);
                        let soDuElement = divisionLeftElement.getChild(1);
                        let soChiaElement = divisionRightElement.getChild(0);
                        let thuongElement = divisionRightElement.getChild(1);
                        return {
                            id: controlId,
                            value: {
                                soBiChia: Utils.getInputValue(soBiChiaElement),
                                soChia: Utils.getInputValue(soChiaElement),
                                thuongSo: Utils.getInputValue(thuongElement),
                                soDu: Utils.getInputValue(soDuElement),
                            },
                            type: controlType,
                            class: classList,
                        };
                    } catch (error) {
                        console.error("[getControlDataFromView]-phepchia: " + error);
                    }
                } else {
                    console.warn("Cannot get control data");
                    return {
                        id: "chua-xu-ly",
                        values: [],
                        type: "unknow",
                    };
                }
            } catch (error) {
                console.error(error);
            }
        }
        return {
            id: "",
            value: "",
            type: "unknow",
        };
    }
    _defineSchema() {
        const schema = this.editor.model.schema;
        //#region Define Schema Widget Control
        schema.register("xcontrol-inline", {
            isInline: true,
            isObject: true,
            allowWhere: "$text",
            allowAttributes: ["id", "value", "type", "class"],
        });
        schema.register("xcontrol", {
            isInline: false,
            isObject: true,
            allowWhere: "$block",
            allowAttributes: ["id", "value", "type", "class"],
        });
        //#endregion
    }
    _defineConverters() {
        const conversion = this.editor.conversion;

        //#region Convert Widget Control
        // Data-to-model conversion.
        conversion.for("upcast").elementToElement({
            view: {
                name: "span",
                classes: ["t-control"],
            },
            model: (viewElement, { writer }) => {
                return writer.createElement(
                    "xcontrol-inline",
                    this.getControlDataFromViewElement(viewElement)
                );
            },
            converterPriority: "high",
        });
        conversion.for("upcast").elementToElement({
            view: {
                name: "div",
                classes: ["t-control"],
            },
            model: (viewElement, { writer }) => {
                return writer.createElement(
                    "xcontrol",
                    this.getControlDataFromViewElement(viewElement)
                );
            },
        });

        // Model-to-data conversion.
        conversion
            .for("dataDowncast")
            .elementToElement({
                model: "xcontrol-inline",
                view: (modelItem, { writer: viewWriter }) =>
                    this.createControlView(modelItem, viewWriter),
            })
            .elementToElement({
                model: "xcontrol",
                view: (modelItem, { writer: viewWriter }) =>
                    this.createControlView(modelItem, viewWriter),
            });
        // Model-to-view conversion.
        conversion
            .for("editingDowncast")
            .elementToElement({
                model: "xcontrol-inline",
                view: (modelItem, { writer: viewWriter }) =>
                    toWidget(this.createControlView(modelItem, viewWriter), viewWriter),
            })
            .elementToElement({
                model: "xcontrol",
                view: (modelItem, { writer: viewWriter }) =>
                    toWidget(this.createControlView(modelItem, viewWriter), viewWriter),
            });

        //#endregion
    }
    // Integration with the clipboard pipeline.
    _defineClipboardInputOutput() {
        const editor = this.editor;
        const view = editor.editing.view;
        const viewDocument = view.document;

        // Processing pasted or dropped content.
        this.listenTo(viewDocument, "clipboardInput", (evt, data) => {
            // The clipboard content was already processed by the listener on the higher priority
            // (for example while pasting into the code block).
            if (data.content) {
                return;
            }
            const xmcontrol = data.dataTransfer.getData("xmcontrol");
            if (xmcontrol) {
                // Use JSON data encoded in the DataTransfer.
                const controlData = JSON.parse(xmcontrol);
                // Translate the h-card data to a view fragment.
                const writer = new UpcastWriter(viewDocument);
                const fragment = writer.createDocumentFragment();
                try {
                    const sharedId =
                        controlData.id == "" ? this.getControlIdAsEpoch() : controlData.id;
                    if (controlData.type === ControlType.LUA_CHON) {
                        let optionsElement = null;
                        if (controlData.values && controlData.values.length > 0) {
                            optionsElement = controlData.values.map((v, index) =>
                                writer.createElement(
                                    "span",
                                    {
                                        value: `opt_${index}_${sharedId}`,
                                        "data-equation": v,
                                        class: "custom-option",
                                    },
                                    v
                                )
                            );
                        } else {
                            optionsElement = writer.createElement(
                                "span",
                                {
                                    value: `opt_0_${sharedId}`,
                                    "data-equation": "null",
                                    class: "custom-option",
                                },
                                "null"
                            );
                        }
                        writer.appendChild(
                            writer.createElement(
                                "span",
                                {
                                    class: "t-control",
                                    "data-type": controlData.type,
                                    "data-id": sharedId,
                                },
                                writer.createElement(
                                    "span",
                                    { class: "xcustom-select-wrapper" },
                                    [
                                        writer.createElement("span", { class: "xcustom-select" }, [
                                            writer.createElement("input", { type: "hidden" }),
                                            writer.createElement("span", {
                                                class: "xcustom-select__trigger",
                                            }),
                                            writer.createElement(
                                                "span",
                                                { class: "xcustom-options" },
                                                optionsElement
                                            ),
                                        ]),
                                    ]
                                )
                            ),
                            fragment
                        );
                    } else if (controlData.type === ControlType.NHAP) {
                        writer.appendChild(
                            writer.createElement(
                                "span",
                                {
                                    class: "t-control",
                                    "data-type": controlData.type,
                                    "data-id": sharedId,
                                },
                                []
                            ),
                            fragment
                        );
                    } else if (controlData.type === ControlType.PHEP_CHIA) {
                        if (controlData.values) {
                            var firstChilds = [
                                writer.createElement("span", {
                                    class: "so-bi-chia",
                                    value: controlData.values.soBiChia || "",
                                }),
                                writer.createElement("span", {
                                    class: "so-du",
                                    value: controlData.values.soDu || "",
                                }),
                            ];
                            var secondChilds = [
                                writer.createElement("span", {
                                    class: "so-chia",
                                    value: controlData.values.soChia || "",
                                }),
                                writer.createElement("span", {
                                    class: "so-thuong",
                                    value: controlData.values.thuongSo || "",
                                }),
                            ];

                            writer.appendChild(
                                writer.createElement(
                                    "span",
                                    {
                                        class: "t-control",
                                        "data-type": controlData.type,
                                        "data-id": sharedId,
                                    },
                                    writer.createElement("span", { class: "division" }, [
                                        writer.createElement(
                                            "span",
                                            { class: "division__left" },
                                            firstChilds
                                        ),
                                        writer.createElement(
                                            "span",
                                            { class: "division__right" },
                                            secondChilds
                                        ),
                                    ])
                                ),
                                fragment
                            );
                        }
                    } else if (controlData.type === ControlType.PHAN_SO) {
                        if (controlData.values) {
                            var childrenElements = [
                                writer.createElement("span", {
                                    class: "tu-so",
                                    value: controlData.values.tuSo,
                                }),
                                writer.createElement("span", {
                                    class: "mau-so",
                                    value: controlData.values.mauSo,
                                }),
                            ];
                            writer.appendChild(
                                writer.createElement(
                                    "span",
                                    {
                                        class: "t-control",
                                        "data-type": controlData.type,
                                        "data-id": sharedId,
                                    },
                                    writer.createElement(
                                        "span",
                                        { class: "frac frac-input" },
                                        childrenElements
                                    )
                                ),
                                fragment
                            );
                        }
                    } else {
                        console.warn("Unsupported control");
                    }
                } catch (error) {
                    console.error("Error from _defineClipboard: " + error);
                }
                data.content = fragment;
            }
        });

        //Processing copied, pasted or dragged content.
        this.listenTo(document, "clipboardOutput", (evt, data) => {
            if (data.content.childCount != 1) {
                return;
            }

            const viewElement = data.content.getChild(0);
            if (
                viewElement.is("element", "span") ||
                viewElement.is("element", "div")
            ) {
                if (viewElement.hasClass("t-control")) {
                    data.dataTransfer.setData(
                        "xmcontrol",
                        JSON.stringify(getControlDataFromViewElement(viewElement))
                    );
                }
            }
        });

    }
}
