import babel = require("@babel/core");
import {
    AssignmentExpression, ExpressionStatement, Program, Node, ImportDeclaration,
    MemberExpression, Statement, StringLiteral,

    VariableDeclaration, VariableDeclarator, ImportNamespaceSpecifier
} from "@babel/types";
import { errors } from "./errors";

/**
 * 将 commonjs 代码转换为 amd
 * @param originalCode commonjs 代码
 */
export function commonjsToAmd(originalCode: string) {
    let options = {
        plugins: [
            ["@babel/transform-modules-amd", { noInterop: true }],
            ["@babel/transform-react-jsx", { "pragma": "Nerv.createElement" }],
        ]
    }

    let ast = babel.parseSync(originalCode, options) as Node;
    let g = new RequireToImport();
    ast = g.transform(ast);
    let program = (ast as any as babel.types.File).program;

    // 查找代码中是否有导出，例如： exports.default = IndexPage;;
    let exportsNode = program.body.filter(o => o.type == "ExpressionStatement" && o.expression.type == "AssignmentExpression")
        .map((o: ExpressionStatement) => o.expression as AssignmentExpression)
        .filter(o => o.left.type == "MemberExpression")
        .map(o => o.left as MemberExpression)
        .filter(o => o.object.type == "Identifier" && o.object.name == "exports")[0];


    // 没有 import 和 exports
    let importsCount = program.body.filter(o => o.type == "ImportDeclaration").length;
    if (importsCount == 0 && exportsNode == null) {
        return originalCode;
    }

    // import "require";
    let requireImport = Nodecreator.createImportDeclaration("require", "require");
    // import "exports";
    let exportsImport = Nodecreator.createImportDeclaration("exports", "exports");
    program.body.unshift(...[requireImport, exportsImport]);

    let r = babel.transformFromAstSync(ast, null, options);
    console.log(r.code);

    let code = `/** commonjs transform to amd */ \r\n` + r.code;
    return code;
}

class NodeConverter {
    transform(node: Node): Node {
        if (node == null) throw errors.argumentNull("node");
        switch (node.type) {
            case "Program":
                for (let i = 0; i < node.body.length; i++) {
                    node.body[i] = this.transform(node.body[i]) as Statement;
                }
                break;
            case "ImportDeclaration":
                node.source = this.transform(node.source) as StringLiteral;
                break;
            case "File":
                node.program = this.transform(node.program) as Program;
                break;
            case "VariableDeclaration":
                for (let i = 0; i < node.declarations.length; i++) {
                    node.declarations[i] = this.transform(node.declarations[i]) as VariableDeclarator;
                }
                break;
            case "VariableDeclarator":
                node.init = this.transform(node.init) as typeof node.init;
                break;
            case "CallExpression":
                node.callee = this.transform(node.callee) as typeof node.callee;
                for (let i = 0; i < node.arguments.length; i++) {
                    node.arguments[i] = this.transform(node.arguments[i]) as typeof node.arguments[0];
                }
                break;
            case "ExpressionStatement":
                node.expression = this.transform(node.expression) as typeof node.expression;
                break;
        }

        return node;

    }
}

/**
 * 将 require 语句转换为 import 语句 
 * 例如：const nervjs_1 = require("nervjs") 转换为 import * as nervjs_1 from "nervjs"
 * require("index.less") 转换为 import "index.less"
 */
class RequireToImport extends NodeConverter {

    transform(node: Node) {
        if (node.type == "VariableDeclaration") {
            return this.processVariableDeclaration(node);
        }
        else if (node.type == "ExpressionStatement") {
            return this.processRequireStatement(node);
        }

        return super.transform(node);
    }

    /**
     * 将如 const nervjs_1 = require("nervjs") 的语句转换为 import * as nervjs_1 from "nervjs"
     */
    private processVariableDeclaration(node: VariableDeclaration) {
        if (node.declarations.length != 1) {
            return super.transform(node);
        }

        let declaration = node.declarations[0];
        if (declaration.type != "VariableDeclarator" || declaration.id.type != "Identifier") {
            return super.transform(node);
        }

        let variableName: string;
        variableName = declaration.id.name;
        let initNode = declaration.init;
        if (initNode.type != "CallExpression" || initNode.callee.type != "Identifier" || initNode.callee.name != "require") {
            return super.transform(node);
        }

        let arg = initNode.arguments[0];
        if (arg == null || arg.type != "StringLiteral") {
            return super.transform(node);
        }

        let importDeclaration = this.createImportDeclaration(arg.value, variableName);
        return importDeclaration;
    }

    /**
     * 将如 require("index.less") 的语句转换为 import "index.less"
     */
    private processRequireStatement(node: Node) {
        if (node.type == "ExpressionStatement" && node.expression.type == "CallExpression" &&
            node.expression.callee.type == "Identifier" && node.expression.callee.name == "require" &&
            node.expression.arguments.length == 1 && node.expression.arguments[0].type == "StringLiteral") {
            let moduleName = node.expression.arguments[0].value;
            let s = this.createImportDeclaration(moduleName);
            return s;
        }

        return super.transform(node);
    }

    private createImportDeclaration(moduleName: string, variableName?: string): babel.types.ImportDeclaration {
        return Nodecreator.createImportDeclaration(moduleName, variableName);
    }
}



class Nodecreator {
    static createImportDeclaration(moduleName: string, variableName?: string): babel.types.ImportDeclaration {
        if (!moduleName) throw errors.argumentNull("moduleName");

        let specifiers: ImportNamespaceSpecifier[] = [];
        if (variableName) {
            let specifier: babel.types.ImportNamespaceSpecifier = {
                type: "ImportNamespaceSpecifier",
                local: { type: "Identifier", name: variableName },

            } as babel.types.ImportNamespaceSpecifier;
            specifiers = [specifier];
        }
        let node = {
            type: "ImportDeclaration", specifiers,
            source: { type: "StringLiteral", value: moduleName } as babel.types.StringLiteral,
        } as babel.types.ImportDeclaration

        return node;
    }
}
