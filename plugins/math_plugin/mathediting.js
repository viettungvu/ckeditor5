import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import MathCommand from './mathcommand';
import Utils from '../utils/utils';

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
			// MathJax inline way (e.g. <script type="math/tex">\sqrt{\frac{a}{b}}</script>)
			// .elementToElement({
			// 	view: {
			// 		name: 'script',
			// 		attributes: {
			// 			type: 'math/tex'
			// 		}
			// 	},
			// 	model: (viewElement, { writer }) => {
			// 		const equation = viewElement.getChild(0).data.trim();
			// 		return writer.createElement('mathtex-inline', {
			// 			equation,
			// 			type: mathConfig.forceOutputType ? mathConfig.outputType : 'script',
			// 			display: false
			// 		});
			// 	}
			// })
			// // MathJax display way (e.g. <script type="math/tex; mode=display">\sqrt{\frac{a}{b}}</script>)
			// .elementToElement({
			// 	view: {
			// 		name: 'script',
			// 		attributes: {
			// 			type: 'math/tex; mode=display'
			// 		}
			// 	},
			// 	model: (viewElement, { writer }) => {
			// 		const equation = viewElement.getChild(0).data.trim();
			// 		return writer.createElement('mathtex-display', {
			// 			equation,
			// 			type: mathConfig.forceOutputType ? mathConfig.outputType : 'script',
			// 			display: true
			// 		});
			// 	}
			// })
			// CKEditor 5 way (e.g. <span class="math-tex">\( \sqrt{\frac{a}{b}} \)</span>)
			.elementToElement({
				view: {
					name: 'span',
					classes: ['math-tex']
				},
				model: (viewElement, { writer }) => {
					return writer.createElement('mathtex-inline', getMathtexDataFromViewElement(viewElement, writer))
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
					return toWidget(createMathtexEditingView(modelItem, writer), writer, 'span');
				}
			}).elementToElement({
				model: 'mathtex-display',
				view: (modelItem, { writer }) => {
					return toWidget(createMathtexEditingView(modelItem, writer), writer, 'div');
				}
			});

		// Model -> Data
		conversion.for('dataDowncast')
			.elementToElement({
				model: 'mathtex-inline',
				view: (modelItem, { writer: viewWriter }) => createMathtexEditingView(modelItem, viewWriter)
			})
			.elementToElement({
				model: 'mathtex-display',
				view: (modelItem, { writer: viewWriter }) => createMathtexEditingView(modelItem, viewWriter)
			});

		// Create view for editor
		function createMathtexEditingView(modelItem, writer) {
			const equation = modelItem.getAttribute('equation');
			const display = modelItem.getAttribute('display');
			const isNormalText = modelItem.getAttribute('isNormalText');

			const styles = 'user-select: none; ' + (display ? '' : 'display: inline-block;');
			const classes = 'ck-math-tex ' + (display ? 'ck-math-tex-display' : 'ck-math-tex-inline');

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

		function getMathtexDataFromViewElement(viewElement, writer) {
			try {
				const equation = viewElement?.getAttribute('data-value').trim();
				return Object.assign(Utils.extractDelimiters(equation, mathConfig.katexRenderOptions.delimiters), {
					type: mathConfig.forceOutputType ? mathConfig.outputType : 'span'
				});
			} catch (error) {
				console.error(error.stack);
			}
		}
	}
}
