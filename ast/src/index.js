const parser = require('@babel/parser');
const generator = require("@babel/generator");
const traverse = require("@babel/traverse");


function compile(code) {
    // 1. parse
    const ast =  parser.parse(code);

    // 2. traverse
    const vistor = {
        CallExpression(path) {
            const { callee } = path.node;
            if (t.isMemberExpression(callee) && callee.object.name === 'console' && callee.property.name === 'log') {
              const funcPath = path.findParent(p => p.isFunctionDeclaration())
              path.node.arguments.unshift(	
                    t.stringLiteral(`[${funcPath.node.id.name}]`)
                )
            }
          }
    }

    traverse.default(ast, vistor);

    // 3.generator
    return generator.default(ast,{}, code);

}

const code = `function foo() {
    console.log("hello Babel");
}`;

const result = compile(code);

console.log("result", result);