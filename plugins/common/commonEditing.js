import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import UpcastWriter from "@ckeditor/ckeditor5-engine/src/view/upcastwriter";
import ClipboardObserver from "@ckeditor/ckeditor5-clipboard/src/clipboardobserver";
export default class Common extends Plugin {
    init() {
        const editor = this.editor;
        const view = editor.editing.view;
        const viewDocument = view.document;

        editor.editing.view.addObserver(ClipboardObserver);
        editor.plugins
            .get("ClipboardPipeline")
            .on("inputTransformation", (evt, data) => {
                if (data.content.childCount == 1) {
                    const viewElement = data.content.getChild(0);
                    if (viewElement.is("element", "span") || viewElement.is("element", "div")
                    ) {
                        if (viewElement.hasClass('t-control')) {

                        }
                        else if (viewElement.hasClass('math-tex')) {
                            const clipboardContent = viewElement.data;
                            const writer = new UpcastWriter(viewDocument);
                            const fragment = writer.createDocumentFragment();
                            writer.appendChild(
                                writer.createElement("span", {
                                    class: "math-tex",
                                    display: false,
                                    "data-value": clipboardContent,
                                }),
                                fragment
                            );
                            data.content = fragment;
                        }
                        else {
                            //Do nothing
                        }


                    }
                }

            });
    }
}