import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
	toWidget,
	viewToModelPositionOutsideModelElement,
} from "@ckeditor/ckeditor5-widget/src/utils";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import ClipboardObserver from "@ckeditor/ckeditor5-clipboard/src/clipboardobserver";
import UpcastWriter from "@ckeditor/ckeditor5-engine/src/view/upcastwriter";
import MathCommand from "./mathcommand";
import Utils from "../utils/utils";
export default class MathEditing extends Plugin {
	static get requires() {
		return [Widget];
	}

	static get pluginName() {
		return "MathEditing";
	}

	init() {
		const editor = this.editor;
		const view = editor.editing.view;
		const viewDocument = view.document;

		editor.commands.add("math", new MathCommand(editor));

		this._defineSchema();
		this._defineConverters();
		editor.editing.mapper.on(
			"viewToModelPosition",
			viewToModelPositionOutsideModelElement(editor.model, (viewElement) =>
				viewElement.hasClass("math")
			)
		);
		editor.config.define("math", {
			engine: "katex",
			outputType: "span",
			forceOutputType: false,
			enablePreview: true,
			previewClassName: [],
			popupClassName: [],
			katexRenderOptions: {
				throwOnError: false,
				delimiters: [],
			},
		});
		editor.editing.view.addObserver(ClipboardObserver);
		// editor.plugins
		// 	.get("ClipboardPipeline")
		// 	.on("inputTransformation", (evt, data) => {
		// 		if (data.content.childCount == 1) {
		// 			const viewElement = data.content.getChild(0);
		// 			if (viewElement.is("element", "span") || viewElement.is("element", "div")
		// 			) {
		// 				const clipboardContent = viewElement.data;
		// 				const writer = new UpcastWriter(viewDocument);
		// 				const fragment = writer.createDocumentFragment();
		// 				writer.appendChild(
		// 					writer.createElement("span", {
		// 						class: "math-tex",
		// 						display: false,
		// 						"data-value": clipboardContent,
		// 					}),
		// 					fragment
		// 				);
		// 				data.content = fragment;
		// 			}
		// 		}

		// 	});
	}

	_defineSchema() {
		const schema = this.editor.model.schema;
		schema.register("mathtex-inline", {
			allowWhere: "$text",
			isInline: true,
			isObject: true,
			allowAttributes: ["equation", "type", "display"],
		});

		schema.register("mathtex-display", {
			allowWhere: "$block",
			isInline: false,
			isObject: true,
			allowAttributes: ["equation", "type", "display"],
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;
		const mathConfig = this.editor.config.get("math");

		// View -> Model
		conversion
			.for("upcast")
			.elementToElement({
				view: {
					name: "span",
					classes: ["math-tex"],
				},
				model: (viewElement, { writer }) => {
					return writer.createElement(
						"mathtex-inline",
						this.getMathtexDataFromViewElement(viewElement)
					);
				},
			})
			.elementToElement({
				view: {
					name: "span",
					classes: ["math-tex"],
				},
				model: (viewElement, { writer }) => {
					const equation = viewElement.getAttribute("data-value").trim();
					return writer.createElement("mathtex-inline", {
						equation,
						type: mathConfig.forceOutputType ? mathConfig.outputType : "span",
						display: false,
					});
				},
			});

		// Model -> View (element)
		conversion
			.for("editingDowncast")
			.elementToElement({
				model: "mathtex-inline",
				view: (modelItem, { writer }) => {
					return toWidget(
						this.createMathtexEditingView(modelItem, writer),
						writer,
						"span"
					);
				},
			})
			.elementToElement({
				model: "mathtex-display",
				view: (modelItem, { writer }) => {
					return toWidget(
						this.createMathtexEditingView(modelItem, writer),
						writer,
						"div"
					);
				},
			});

		// Model -> Data
		conversion
			.for("dataDowncast")
			.elementToElement({
				model: "mathtex-inline",
				view: (modelItem, { writer: viewWriter }) =>
					this.createMathtexEditingView(modelItem, viewWriter),
			})
			.elementToElement({
				model: "mathtex-display",
				view: (modelItem, { writer: viewWriter }) =>
					this.createMathtexEditingView(modelItem, viewWriter),
			});
	}
	// Create view for editor
	createMathtexEditingView(modelItem, writer) {
		const equation = modelItem.getAttribute("equation");
		const display = modelItem.getAttribute("display");
		const styles =
			"user-select: none; " + (display ? "" : "display: inline-block;");
		const classes =
			"ck-math-tex " + (display ? "ck-math-tex-display" : "ck-math-tex-inline");
		const mathConfig = this.editor.config.get("math");
		const mathtexView = writer.createContainerElement(
			display ? "div" : "span",
			{
				style: styles,
				class: classes,
			},
			writer.createRawElement(
				"span",
				{ class: "math-tex", "data-value": equation },
				function (domElement) {
					Utils.renderEquation(
						equation,
						domElement,
						mathConfig.engine,
						mathConfig.lazyLoad,
						display,
						false,
						mathConfig.previewClassName,
						null,
						mathConfig.katexRenderOptions
					);
					return domElement;
				}
			)
		);
		return mathtexView;
	}
	getMathtexDataFromViewElement(viewElement) {
		try {
			const mathConfig = this.editor.config.get("math");
			const equation = viewElement?.getAttribute("data-value").trim();
			return Object.assign(
				Utils.extractDelimiters(
					equation,
					mathConfig.katexRenderOptions.delimiters
				),
				{
					type: mathConfig.forceOutputType ? mathConfig.outputType : "span",
				}
			);
		} catch (error) {
			console.error(error.stack);
		}
	}
}
