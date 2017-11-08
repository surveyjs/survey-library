import {Condition, ConditionNode, Operand, FunctionOperand, ExpressionOperand} from "./conditions";

export class ConditionsParser {
    private text: string;
    private root: ConditionNode;
    private expressionNodes: Array<any>;
    private node: any;
    private at: number;
    private length: number;
    public parse(text: string, root: ConditionNode): boolean {
        this.text = text;
        this.root = root;
        this.root.clear();
        this.at = 0;
        this.length = this.text.length;
        var res = this.parseText();
        return res;
    }
    public toString(root: ConditionNode): string { return root.toString(); }
    private parseText(): boolean {
        this.node = this.root;
        this.expressionNodes = [];
        this.expressionNodes.push(this.node);
        var res = this.readConditions();
        return res && this.at >= this.length;
    }
    private readConditions(): boolean {
        var res = this.readCondition();
        if (!res) return res;
        var connective = this.readConnective();
        if (connective) {
            this.addConnective(connective);
            return this.readConditions();
        }
        return true;
    }
    private readCondition(): boolean {
        var expRes = this.readExpression();
        if (expRes < 0) return false;
        if(expRes == 1) return true;
        var left = this.readExpressionOperand();
        if (!left) return false;
        var op = this.readOperator();
        if(!op) {
            if(left.isBoolean) {
                var c = new Condition();
                c.left = left;
                this.addCondition(c);
                return true;
            }
            return false;
        }
        var c = new Condition();
        c.left = left;
        c.operator = op;
        if (!Condition.isNoRightOperation(op)) {
            var right = this.readExpressionOperand();
            if (!right) return false;
            c.right = right;
        }
        this.addCondition(c);
        return true;
    }
    private readOperand(): Operand {
        var str = this.readString();
        if (!str) return null;
        var params = this.readParameters();
        if(params) {
            var res = new FunctionOperand(str);
            res.parameters = params;
            return res;
        }
        return new Operand(str);
    }
    private readExpression(): number {
        this.skip();
        if (this.at >= this.length || this.ch != '(') return 0;
        this.at++;
        this.pushExpression();
        var res = this.readConditions();
        if (res) {
            this.skip();
            res = this.ch == <string>')';
            this.at++;
            this.popExpression();
            return 1;
        }
        return -1;
    }
    private readExpressionOperand(prevExpr: ExpressionOperand = null, stack: Array<ExpressionOperand> = null): Operand {
        this.skip();
        if(this.at >= this.length) return null;
        var isOpenBracket = this.isOpenBracket(this.ch);
        if(isOpenBracket) {
            this.at ++;
            this.pushExpression();
        }
        var a = this.readOperand();
        if(!a) return null;
        var operator = this.readOperandOperator();
        if(!operator) { 
            if(prevExpr != null) {
                prevExpr.right = a;
                a = prevExpr;
            }
            if(this.isCloseBracket(this.ch)) {
                prevExpr = stack && stack.length > 0 ? stack.pop() : null;
                var saveAt = this.at;
                this.at ++;
                operator = this.readOperandOperator();
                var doPopExpression = operator || (prevExpr && prevExpr["isOpenBracket"]);
                if(!operator) {
                    this.at = saveAt + (doPopExpression ? 1 : 0);
                }
                if(doPopExpression) {
                    this.popExpression();
                }
            }
            if(operator) {
                var expr = new ExpressionOperand();
                expr.left = prevExpr ? prevExpr : a;
                expr.operator = operator;
                return this.readExpressionOperand(expr, stack);                        
            }
            return a;
        }
        var expr = new ExpressionOperand();
        expr["isOpenBracket"] = isOpenBracket;
        expr.left = a;
        expr.operator = operator;
        if(!stack) {
            stack = [];
        }
        if(stack.length == 0 || isOpenBracket) {
            stack.push(expr);
        }
        if(prevExpr) {
            if(!isOpenBracket && (this.isHighPriorityOperand(prevExpr.operator) || !this.isHighPriorityOperand(operator))) {
                prevExpr.right = a;
                expr.left = prevExpr;
                var index = stack.indexOf(prevExpr);
                if(index > -1) {
                    stack[index] = expr;
                }
            } else {
                prevExpr.right = this.readExpressionOperand(expr, stack);
                return prevExpr;
            }
        }
        return this.readExpressionOperand(expr, stack);
    }
    private get ch(): string { return this.text.charAt(this.at); }
    private skip() {
        while (this.at < this.length && this.isSpace(this.ch)) this.at++;
    }
    private isSpace(c: string): boolean {
        return c == ' ' || c == '\n' || c == '\t' || c == '\r';
    }
    private isQuotes(c: string): boolean {
        return c == "'" || c == '"'
    }
    private isComma(c: string): boolean { return c == ','; }
    private isOperatorChar(c: string): boolean {
        return c == '>' || c == '<' || c == '=' || c == '!' || c == '+' || c == '-' || c == '*' || c == '/';
    }
    private isOpenBracket(c: string): boolean { return c == '(';}
    private isCloseBracket(c: string): boolean { return c == ')';}
    private isBrackets(c: string): boolean {
        return this.isOpenBracket(c) || this.isCloseBracket(c);
    }
    private readString(): string {
        this.skip();
        if (this.at >= this.length) return null;
        var start = this.at;
        var hasQuotes = this.isQuotes(this.ch);
        var hasBraces = this.ch == '{';
        if (hasQuotes) this.at++;
        var isFirstOpCh = this.isOperatorChar(this.ch);
        while (this.at < this.length) {
            if (!hasQuotes && this.isSpace(this.ch)) break;
            if (this.isQuotes(this.ch)) {
                if (hasQuotes) this.at++;
                break;
            }
            if (!hasQuotes) {
                if ((!hasBraces || this.ch != '-') && isFirstOpCh != this.isOperatorChar(this.ch)) break;
                if (this.isBrackets(this.ch) || this.isComma(this.ch)) break;
            }
            this.at++;
        }
        if (this.at <= start) return null;
        var res = this.text.substr(start, this.at - start);
        if (res) {
            if (res.length > 1 && this.isQuotes(res[0])) {
                var len = res.length - 1;
                if (this.isQuotes(res[res.length - 1])) len--;
                res = res.substr(1, len);
            }
        }
        return res;
    }
    private readParameters(): Array<Operand> {
        if(!this.isOpenBracket(this.ch)) return null;
        var params = [];
        while (this.at < this.length && !this.isCloseBracket(this.ch)) {
            this.at++;
            var operand = this.readOperand();
            if(operand) {
                params.push(operand);
            }
        }
        this.at++;
        return params;
    }
    private isHighPriorityOperand(op: string) : boolean { return op == "*" || op == "/"; }
    private readOperandOperator(): string {
        this.skip();
        if(this.ch == '+' || this.ch == '-' || this.ch == '*' || this.ch == '/') {
            var res = this.ch;
            this.at++;
            return res;
        }
        return null;
    }
    private readOperator(): string {
        this.skip();
        var curAt = this.at;
        var op = this.readString();
        if (!op) return null;
        op = op.toLowerCase();
        if (op == '>') op = "greater";
        if (op == '<') op = "less";
        if (op == '>=' || op == '=>') op = "greaterorequal";
        if (op == '<=' || op == '=<') op = "lessorequal";
        if (op == '=' || op == '==') op = "equal";
        if (op == '<>' || op == '!=') op = "notequal";
        if (op == 'contain' || op == '*=') op = "contains";
        if (op == 'notcontain') op = "notcontains";
        if(Condition.isCorrectOperator(op)) return op;
        this.at = curAt;
        return null;
    }
    private readConnective(): string {
        var con = this.readString();
        if (!con) return null;
        con = con.toLowerCase();
        if (con == "&" || con == "&&") con = "and";
        if (con == "|" || con == "||") con = "or";
        if (con != "and" && con != "or") con = null;
        return con;
    }
    private pushExpression() {
        var node = null;
        this.expressionNodes.push(node);
        this.node = node;
    }
    private makeNodeCondition() {
        if(!this.node || !this.node.children) {
            this.node = new ConditionNode();
            this.expressionNodes[this.expressionNodes.length - 1] = this.node;
        }
    }
    private popExpression() {
        var node = this.expressionNodes.pop();
        this.node = this.expressionNodes[this.expressionNodes.length - 1];
        if(node) {
            this.makeNodeCondition();
            this.node.children.push(node);
        }
    }
    private addCondition(c: Condition) {
        this.makeNodeCondition();
        this.node.children.push(c);
    }
    private addConnective(con: string) {
        this.makeNodeCondition();
        if (this.node.children.length < 2) {
            this.node.connective = con;
        } else {
            if (this.node.connective != con) {
                var oldCon = this.node.connective;
                var oldChildren = this.node.children;
                this.node.clear();
                this.node.connective = con;
                var oldNode = new ConditionNode();
                oldNode.connective = oldCon;
                oldNode.children = oldChildren;
                this.node.children.push(oldNode);
                var newNode = new ConditionNode();
                this.node.children.push(newNode);
                this.node = newNode;
            }
        }
    }
}
