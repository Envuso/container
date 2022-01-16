import {factory} from "ttypescript";
import * as ts from 'typescript';

export default function (program: ts.Program, pluginOptions: {}) {
	return (ctx: ts.TransformationContext) => {
		return (sourceFile: ts.SourceFile) => {
			function visitor(node: ts.Node): ts.Node {
				// if (ts.isCallExpression(node)) {
				//     return ts.createLiteral('call');
				// }


				if ((node as any)?.escapedText === 'TestingClass' && ts.isClassDeclaration(node)) {
					const t = (node as any).text;

					const n = (node as any).flowNode.node.locals.get('TestingClass');

					if(!n?.members) {
						return node;
					}

					const methods = [...n.members.values()].filter(v => {
						if(!v.valueDeclaration?.kind) {
							return false;
						}

						return v.valueDeclaration.kind === 168
					});


					methods.forEach((method:any) => {
						//@ts-ignore
						method.valueDeclaration.decorators = [
							factory.createCallExpression(
								factory.createIdentifier("RegisterMethodWithContainer"),
								undefined,
								[]
							)
						];
					})

					return node;


					debugger;
				}
				return ts.visitEachChild(node, visitor, ctx);
			}

			return ts.visitEachChild(sourceFile, visitor, ctx);
		};
	};
}
