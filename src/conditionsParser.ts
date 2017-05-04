import {Condition, ConditionNode} from "./conditions";

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
    public toString(root: ConditionNode): string {
        this.root = root;
        return this.nodeToString(root);
    }
    private toStringCore(value: any): string {
        if (!value) return "";
        if (value["children"]) return this.nodeToString(value);
        if (value["left"]) return this.conditionToString(value);
        return "";
    }
    private nodeToString(node: ConditionNode): string {
        if (node.isEmpty) return "";
        var res = "";
        for (var i = 0; i < node.children.length; i++) {
            var nodeText = this.toStringCore(node.children[i]);
            if (nodeText) {
                if (res) res += ' ' + node.connective + ' ';
                res += nodeText;
            }
        }
        if (node != this.root && node.children.length > 1) {
            res = '(' + res + ')';
        }
        return res;
    }
    private conditionToString(condition: Condition): string {
        if (!condition.right || !condition.operator) return "";
        var left = condition.left;
        if (left && !this.isNumeric(left)) left = "'" + left + "'";
        var res = left + ' ' + this.operationToString(condition.operator);
        if (this.isNoRightOperation(condition.operator)) return res;
        var right = condition.right;
        if (right && !this.isNumeric(right)) right = "'" + right + "'";
        return res + ' ' + right;
    }
    private operationToString(op: string): string {
        if (op == "equal") return "=";
        if (op == "notequal") return "!=";
        if (op == "greater") return ">";
        if (op == "less") return "<";
        if (op == "greaterorequal") return ">=";
        if (op == "lessorequal") return "<=";
        return op;
    }
    private isNumeric(value: string): boolean {
        var val = parseFloat(value);
        if (isNaN(val)) return false;
        return isFinite(val);
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
        var expRes = this.readExpression();
        if (expRes < 0) return false;
        if(expRes == 1) return true;
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
            if (!hasQuotes && this.isSpace(this.ch)) break;
            if (this.isQuotes(this.ch)) {
                if (hasQuotes) this.at++;
                break;
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
