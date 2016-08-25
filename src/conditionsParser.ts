/// <reference path="base.ts" />
/// <reference path="conditions.ts" />
module Survey {
    export class ConditionsParser {
        private text: string;
        private root: ConditionNode;
        private expressionNodes: Array<ConditionNode>;
        private node: ConditionNode;
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
            if (!this.readExpression()) return false;
            var left = this.readString();
            if (!left) return false;
            var op = this.readOperator();
            if (!op) return false;
            var c = new Condition();
            c.left = left; c.operator = op; 
            if (!this.isNoRightOperation(op)) {
                var right = this.readString();
                if (!right) return false; 
                c.right = right;
            }
            this.addCondition(c);
            return true;
        }
        private readExpression(): boolean {
            this.skip();
            if (this.at >= this.length || this.ch != '(') return true;
            this.at++;
            this.pushExpression();
            var res = this.readConditions();
            if (res) {
                this.skip();
                res = this.ch == ')';
                this.at++;
                this.popExpression();
            }
            return res;
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
        private isOperatorChar(c: string): boolean {
            return c == '>' || c == '<' || c == '=' || c == '!';
        }
        private isBrackets(c: string): boolean {
            return c == '(' || c == ')';
        }
        private readString(): string {
            this.skip();
            if (this.at >= this.length) return null;
            var start = this.at;
            var hasQuotes = this.isQuotes(this.ch);
            if (hasQuotes) this.at++;
            var isFirstOpCh = this.isOperatorChar(this.ch);
            while (this.at < this.length) {
                if (this.isSpace(this.ch)) break;
                if (this.isQuotes(this.ch)) {
                    this.at++; break;
                }
                if (!hasQuotes) {
                    if (isFirstOpCh != this.isOperatorChar(this.ch)) break;
                    if (this.isBrackets(this.ch)) break;
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
        private isNoRightOperation(op: string) {
            return op == "empty" || op == "notempty";
        }
        private readOperator(): string {
            var op = this.readString();
            if (!op) return null;
            op = op.toLowerCase();
            if (op == '>') op = "greater";
            if (op == '<') op = "less";
            if (op == '>=' || op == '=>') op = "greaterorequal";
            if (op == '<=' || op == '=<') op = "lessorequal";
            if (op == '=' || op == '==') op = "equal";
            if (op == '<>' || op == '!=') op = "notequal";
            if (op == 'contain') op = "contains";
            if (op == 'notcontain') op = "notcontains";
            return op;
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
            var node = new ConditionNode();
            this.expressionNodes.push(node);
            this.node = node;
        }
        private popExpression() {
            var node = this.expressionNodes.pop();
            this.node = this.expressionNodes[this.expressionNodes.length - 1];
            this.node.children.push(node);
        }
        private addCondition(c: Condition) {
            this.node.children.push(c);
        }
        private addConnective(con: string) {
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
}