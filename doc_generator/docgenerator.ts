import * as ts from "typescript";
import * as fs from "fs";
interface DocEntry {
    name?: string,
    className?: string,
    jsonName?: string,
    fileName?: string,
    documentation?: string,
    see?: any,
    type?: string,
    baseType?: string,
    allTypes?: string[],
    constructors?: DocEntry[],
    parameters?: DocEntry[],
    returnType?: string,
    pmeType?: string,
    hasSet? : boolean,
    isSerialized? : boolean,
    defaultValue?: any,
    serializedChoices?: any[]
};

var jsonObjMetaData: any = null;
export function setJsonObj(obj: any) {
    jsonObjMetaData = obj;
}

/** Generate documentation for all classes in a set of .ts files */
export function generateDocumentation(fileNames: string[], options: ts.CompilerOptions): void {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);
    
    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();

    let outputClasses: DocEntry[] = [];
    let outputPMEs: DocEntry[] = [];
    let pmesHash = {};
    let classesHash = {};
    let curClass: DocEntry = null;
    let curJsonName: string = null;

    // Visit every sourceFile in the program    
    for (const sourceFile of program.getSourceFiles()) {
        if(sourceFile.fileName.indexOf("node_modules") > 0) continue;
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
    }
    for(var key in classesHash) {
        setAllParentTypes(key);
    }
    // print out the doc
    fs.writeFileSync(process.cwd() + "/doc_generator/classes.json", JSON.stringify(outputClasses, undefined, 4));
    fs.writeFileSync(process.cwd() + "/doc_generator/pmes.json", JSON.stringify(outputPMEs, undefined, 4));

    return;

    /** set allParentTypes */
    function setAllParentTypes(className: string) {
        if(!className) return;
        var curClass = classesHash[className];
        if(curClass.allTypes && curClass.allTypes.length > 0) return;
        curClass.allTypes = [];
        curClass.allTypes.push(curClass.name);
        if(!curClass.baseType) return;
        var baseClass = classesHash[curClass.baseType];
        if(baseClass && baseClass.allTypes) {
            for(var i = 0; i < baseClass.allTypes.length; i ++) {
                curClass.allTypes.push(baseClass.allTypes[i]);
            }
        }
    }
    /** visit nodes finding exported classes */    
    function visit(node: ts.Node) {
        // Only consider exported nodes
        if (!isNodeExported(node))  return;

        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            // This is a top level class, get its symbol
            let symbol = checker.getSymbolAtLocation((<ts.ClassDeclaration>node).name);
            if(isSymbolHasComments(symbol)) {
                visitDocumentedNode(node, symbol);
            }
        }
        else if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            // This is a top level class, get its symbol
            let symbol = checker.getSymbolAtLocation((<ts.InterfaceDeclaration>node).name);
            if(isSymbolHasComments(symbol)) {
                visitDocumentedNode(node, symbol);
            }
        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }
    function visitDocumentedNode(node: ts.Node, symbol: ts.Symbol) {
        curClass = serializeClass(symbol, node);
        classesHash[curClass.name] = curClass;
        outputClasses.push(curClass);
        curJsonName = null;
        ts.forEachChild(node, visitClassNode); 

        if(!curJsonName)  return;
        curClass.jsonName = curJsonName;
        if(!jsonObjMetaData) return;
        var properties = jsonObjMetaData.getProperties(curJsonName);
        for(var i = 0; i < outputPMEs.length; i ++) {
            if(outputPMEs[i].className == curClass.name) {
                var propName = outputPMEs[i].name;
                for(var j = 0; j < properties.length; j ++) {
                    if(properties[j].name == propName) {
                        outputPMEs[i].isSerialized = true;
                        if(properties[j].defaultValue) outputPMEs[i].defaultValue = properties[j].defaultValue;
                        if(properties[j].choices) outputPMEs[i].serializedChoices = properties[j].choices;
                        break;
                    }
                }
            }
        }
    }
    function visitClassNode(node: ts.Node) {
        if (!isPMENodeExported(node))  return;
        var symbol = null;
        if(node.kind === ts.SyntaxKind.MethodDeclaration) symbol = checker.getSymbolAtLocation((<ts.MethodDeclaration>node).name);
        if(node.kind === ts.SyntaxKind.FunctionDeclaration) symbol = checker.getSymbolAtLocation((<ts.FunctionDeclaration>node).name);
        if(node.kind === ts.SyntaxKind.PropertyDeclaration) symbol = checker.getSymbolAtLocation((<ts.PropertyDeclaration>node).name);
        if(node.kind === ts.SyntaxKind.GetAccessor) symbol = checker.getSymbolAtLocation((<ts.GetAccessorDeclaration>node).name);
        if(node.kind === ts.SyntaxKind.SetAccessor) symbol = checker.getSymbolAtLocation((<ts.SetAccessorDeclaration>node).name);
        if(node.kind === ts.SyntaxKind.PropertySignature) symbol = checker.getSymbolAtLocation((<ts.PropertySignature>node).name);
        if(node.kind === ts.SyntaxKind.MethodSignature) symbol = checker.getSymbolAtLocation((<ts.MethodSignature>node).name);
        if(symbol) {
            var ser = serializeMethod(symbol, node);
            let fullName = ser.name;
            if(curClass) {
                ser.className = curClass.name;
                fullName = curClass.name + '.' + fullName;
            }
            ser.pmeType = getPMEType(node.kind);
            if(ser.type.indexOf("Event") === 0) ser.pmeType = "event";
            if(node.kind === ts.SyntaxKind.GetAccessor) {
                let serSet = pmesHash[fullName];
                if(serSet) {
                    ser.hasSet = serSet.hasSet;
                }
                else ser.hasSet = false;
            }
            if(node.kind === ts.SyntaxKind.SetAccessor) {
                let serGet = pmesHash[fullName];
                if(serGet) serGet.hasSet = true;
                ser = null;
            }
            if(ser) {
                if(!ser.parameters) ser.parameters = [];
                pmesHash[fullName] = ser;
                outputPMEs.push(ser);
            }
            if(ser && ser.name === "getType") {
                curJsonName = getJsonTypeName(<ts.FunctionDeclaration>node);
            }
            if(isSymbolHasComments(symbol)) {
            }
        }
    }
    function getJsonTypeName(node : ts.FunctionDeclaration): string {
        let body = (<ts.FunctionDeclaration>node).getFullText();
        if(body) {
            var pos = body.indexOf('return "');
            if(pos > 0) {
                body = body.substr(pos + 'return "'.length);
                pos = body.indexOf('"');
                return body.substr(0, pos);
            }
        }
        return null;
    }
    function getPMEType(nodeKind: ts.SyntaxKind) {
        if(nodeKind === ts.SyntaxKind.MethodDeclaration) return "method";
        if(nodeKind === ts.SyntaxKind.FunctionDeclaration) return "function";
        return "property";
    }
    function getTypeOfSymbol(symbol: ts.Symbol): ts.Type {
        if(symbol.valueDeclaration)
            return checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        return checker.getDeclaredTypeOfSymbol(symbol);
    }
    /** Serialize a symbol into a json object */    
    function serializeSymbol(symbol: ts.Symbol): DocEntry {
        var type = getTypeOfSymbol(symbol);
        var res = {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(type),
        };
        var jsTags = symbol.getJsDocTags();
        if(jsTags) {
            var seeArray = [];
            for(var i = 0; i < jsTags.length; i ++) {
                if(jsTags[i].name == "see") {
                    seeArray.push(jsTags[i].text);
                }
            }
            if(seeArray.length > 0) {
                res["see"] = seeArray;
            }
        }
        return res;
    }

    /** Serialize a class symbol infomration */
    function serializeClass(symbol: ts.Symbol, node: ts.Node) {
        let details = serializeSymbol(symbol);

        if(node.kind !== ts.SyntaxKind.ClassDeclaration) return details;
        // Get the construct signatures
        let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType.getConstructSignatures().map(serializeSignature);

        //get base class
        details.baseType = "";
        const classDeclaration = <ts.ClassDeclaration>node;
        if(classDeclaration && classDeclaration.heritageClauses && classDeclaration.heritageClauses.length > 0) {
            const firstHeritageClause = classDeclaration.heritageClauses[0];
            const firstHeritageClauseType = firstHeritageClause.types[0];
            const extendsType = checker.getTypeAtLocation(firstHeritageClauseType.expression);
            if(extendsType) {
                details.baseType = extendsType.symbol.name;
            }
        }
        return details;
    }

    /** Serialize a method symbol infomration */
    function serializeMethod(symbol: ts.Symbol, node: ts.Node) {
        let details = serializeSymbol(symbol);
        if(node.kind === ts.SyntaxKind.MethodDeclaration || node.kind === ts.SyntaxKind.FunctionDeclaration) {
           let signature = checker.getSignatureFromDeclaration(<ts.SignatureDeclaration>node);
           let funDetails = serializeSignature(signature);
           details.parameters = funDetails.parameters;
           if(node.kind === ts.SyntaxKind.FunctionDeclaration) {
             details.returnType = funDetails.returnType;
           }
        }
        return details;
    }

    /** Serialize a signature (call or construct) */
    function serializeSignature(signature: ts.Signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node: ts.Node): boolean {
        return (node.flags & ts.NodeFlags["Export"]) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
    function isPMENodeExported(node: ts.Node): boolean {
        let modifier = ts.getCombinedModifierFlags(node);
        if((modifier & ts.ModifierFlags.Public) !== 0) return true;
        var parent = node.parent;
        return parent && (parent.kind  === ts.SyntaxKind.InterfaceDeclaration);
    }
    /** True if there is a comment before declaration */
    function isSymbolHasComments(symbol: ts.Symbol): boolean {
        let com = symbol.getDocumentationComment();
        return com && com.length > 0;
    }
}