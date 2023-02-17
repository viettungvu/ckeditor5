import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import ClipboardObserver from '@ckeditor/ckeditor5-clipboard/src/clipboardobserver';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter'
import MathCommand from './mathcommand';
import Utils from '../utils/utils';
import Constants from '../utils/constants';
export default class MathEditing extends Plugin {
	static get requires() {
		return [Widget];
	}

	static get pluginName() {
		return 'MathEditing';
	}

	init() {
		const editor = this.editor;
		editor.commands.add('math', new MathCommand(editor));

		this._defineSchema();
		this._defineConverters();
		this._defineClipboardInputOutput();
		editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(editor.model, viewElement => viewElement.hasClass('math'))
		);
		editor.config.define('math', {
			engine: 'katex',
			outputType: 'span',
			forceOutputType: false,
			enablePreview: true,
			previewClassName: [],
			popupClassName: [],
			katexRenderOptions: {
				throwOnError: false,
				delimiters: [
					{ left: '$$', right: '$$', display: true },
					{ left: '$', right: '$', display: false },
					{ left: '\\(', right: '\\)', display: false },
					{ left: '\\[', right: '\\]', display: true }
				]
			}
		});
	}

	_defineSchema() {
		const schema = this.editor.model.schema;
		schema.register('mathtex-inline', {
			allowWhere: '$text',
			isInline: true,
			isObject: true,
			allowAttributes: ['equation', 'type', 'display']
		});

		schema.register('mathtex-display', {
			allowWhere: '$block',
			isInline: false,
			isObject: true,
			allowAttributes: ['equation', 'type', 'display']
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;
		const mathConfig = this.editor.config.get('math');

		// View -> Model
		conversion.for('upcast')
			.elementToElement({
				view: {
					name: 'span',
					classes: ['math-tex']
				},
				model: (viewElement, { writer }) => {
					return writer.createElement('mathtex-inline', this.getMathtexDataFromViewElement(viewElement))
				}
			})
			.elementToElement({
				view: {
					name: 'span',
					classes: ['math-tex']
				},
				model: (viewElement, { writer }) => {
					const equation = viewElement.getAttribute('data-value').trim();
					return writer.createElement('mathtex-inline', {
						equation,
						type: mathConfig.forceOutputType ? mathConfig.outputType : 'span',
						display: false
					});
				}
			});

		// Model -> View (element)
		conversion.for('editingDowncast')
			.elementToElement({
				model: 'mathtex-inline',
				view: (modelItem, { writer }) => {
					return toWidget(this.createMathtexEditingView(modelItem, writer), writer, 'span');
				}
			}).elementToElement({
				model: 'mathtex-display',
				view: (modelItem, { writer }) => {
					return toWidget(this.createMathtexEditingView(modelItem, writer), writer, 'div');
				}
			});

		// Model -> Data
		conversion.for('dataDowncast')
			.elementToElement({
				model: 'mathtex-inline',
				view: (modelItem, { writer: viewWriter }) => this.createMathtexEditingView(modelItem, viewWriter)
			})
			.elementToElement({
				model: 'mathtex-display',
				view: (modelItem, { writer: viewWriter }) => this.createMathtexEditingView(modelItem, viewWriter)
			});


	}
	// Create view for editor
	createMathtexEditingView(modelItem, writer) {
		const equation = modelItem.getAttribute('equation');
		const display = modelItem.getAttribute('display');
		const styles = 'user-select: none; ' + (display ? '' : 'display: inline-block;');
		const classes = 'ck-math-tex ' + (display ? 'ck-math-tex-display' : 'ck-math-tex-inline');
		const mathConfig = this.editor.config.get('math');
		const mathtexView = writer.createContainerElement(display ? 'div' : 'span', {
			style: styles,
			class: classes,
		}, writer.createRawElement('span', { class: 'math-tex', 'data-value': equation }, function (domElement) {
			Utils.renderEquation(equation, domElement, mathConfig.engine, mathConfig.lazyLoad, display, false, mathConfig.previewClassName,
				null, mathConfig.katexRenderOptions);
			return domElement;
		}));
		return mathtexView;
	}
	getMathtexDataFromViewElement(viewElement) {
		try {
			const mathConfig = this.editor.config.get('math');
			const equation = viewElement?.getAttribute('data-value').trim();
			return Object.assign(Utils.extractDelimiters(equation, mathConfig.katexRenderOptions.delimiters), {
				type: mathConfig.forceOutputType ? mathConfig.outputType : 'span'
			});
		} catch (error) {
			console.error(error.stack);
		}
	}


	// Integration with the clipboard pipeline.
	_defineClipboardInputOutput() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;

		// Processing pasted or dropped content.
		this.listenTo(viewDocument, 'clipboardInput', (evt, data) => {
			// The clipboard content was already processed by the listener on the higher priority
			// (for example while pasting into the code block).
			if (data.content) {
				return;
			}
			const xmequation = data.dataTransfer.getData('xmequation');
			if (xmequation) {
				// Use JSON data encoded in the DataTransfer.
				const equationData = JSON.parse(xmequation);
				// Translate the h-card data to a view fragment.
				const writer = new UpcastWriter(viewDocument);
				const fragment = writer.createDocumentFragment();
				try {
					const equation = data.content.getChild(0).data;
					const modeKatex = localStorage.getItem(editor.id);
					const writer = new UpcastWriter(viewDocument);
					if (typeof modeKatex == typeof undefined || modeKatex != Constants.ModeKatex.PHUC_TAP) {
						const fragment = writer.createDocumentFragment();
						writer.appendChild(
							writer.createText(equation),
							fragment
						);
						data.content = fragment;
					}
					else {
						const fragment = writer.createDocumentFragment();
						writer.appendChild(
							writer.createElement('span', { class: 'math-tex', 'display': false, 'data-value': equation }),
							fragment
						);
						data.content = fragment;
						localStorage.removeItem(editor.id);
					}
				} catch (error) {
					console.error('Error from _defineClipboard: ' + error);
				}
				data.content = fragment;
			}
		});

		// Processing copied, pasted or dragged content.
		this.listenTo(document, 'clipboardOutput', (evt, data) => {
			if (data.content.childCount != 1) {
				return;
			}

			const viewElement = data.content.getChild(0);
			if ((viewElement.is('element', 'span') || viewElement.is('element', 'div'))) {
				if (viewElement.hasClass('math-tex')) {
					data.dataTransfer.setData('xmequation', JSON.stringify(this.getMathtexDataFromViewElement(viewElement)));
				}
			}
		});
	}
}