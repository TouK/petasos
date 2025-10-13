import ts from "typescript";
import path from "path";
import fs from "fs";

function findProjectRoot(startDir: string) {
    let dir = startDir;
    while (dir !== path.parse(dir).root) {
        if (fs.existsSync(path.join(dir, "tsconfig.json")) || fs.existsSync(path.join(dir, "package.json"))) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    return startDir;
}

const PROJECT_ROOT = findProjectRoot(process.cwd());

export default function relDynImportMultiTransformer(): ts.TransformerFactory<ts.SourceFile> {
    return (ctx) => {
        const visit =
            (sourceFile): ts.Visitor =>
            (node) => {
                if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === __pathOfImport.name) {
                    const arg = node.arguments[0];
                    if (ts.isCallExpression(arg) && arg.expression.kind === ts.SyntaxKind.ImportKeyword) {
                        const importArg = arg.arguments[0];
                        if (ts.isStringLiteral(importArg)) {
                            const callerDir = path.dirname(sourceFile.fileName);
                            const absolutePath = path.resolve(callerDir, importArg.text);
                            const relativePath = path.relative(PROJECT_ROOT, absolutePath).replace(/\\/g, "/");
                            return ts.factory.createStringLiteral(`./${relativePath}`);
                        }
                    }
                    return;
                }

                return ts.visitEachChild(node, visit(sourceFile), ctx);
            };

        return (sf) => ts.visitNode(sf, visit(sf));
    };
}

export function __pathOfImport<T>(_mod: T): string {
    throw new Error("_pathOfImport() should be replaced by transformer");
}
