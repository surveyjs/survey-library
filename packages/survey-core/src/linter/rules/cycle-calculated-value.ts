import { ILintRule, LintContext } from "../rule";
import { equalsCI, getDependencyRefs } from "../expression-utils";
import { classifySelfWrite } from "../self-write";
import { reportCycles } from "../cycle-report";
import { quoteValues } from "../message-utils";
import { CalculatedValueRecord, ParsedRef } from "../symbols";
import { ILintReproduction } from "../types";
import { SurveyLintReasons, SurveyLintReproductionReasons } from "../reasons";

const reasons = SurveyLintReasons["cycle/calculated-value"];

export const cycleCalculatedValueRule: ILintRule = {
  id: "cycle/calculated-value",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    const calcNames: Array<string> = [];
    // Maps, not object literals: calculated-value names come from user JSON
    const records = new Map<string, CalculatedValueRecord>();
    const refsByName = new Map<string, Array<ParsedRef>>();
    ctx.index.calculatedValues.forEach((record, name) => {
      calcNames.push(name);
      records.set(name.toLowerCase(), record);
      refsByName.set(name.toLowerCase(), record.site && record.site.ast
        ? getDependencyRefs(record.site, ctx.index, ctx.options)
        : []);
    });
    const getRecord = (name: string): CalculatedValueRecord => records.get(name.toLowerCase());
    const getTargetName = (ref: ParsedRef): string => {
      if (ref.resolvedKind !== "calculatedValue") return undefined;
      const target = ctx.index.calculatedValues.get(ref.segments[0].name);
      return target ? target.name : undefined;
    };
    // A value that reads itself only to keep its value once set settles after one run, and one that
    // only copies itself is cycle/value-write's warning: only one that computes from itself loops.
    const isRewritingItself = (name: string): boolean => {
      const record = getRecord(name);
      const refs = refsByName.get(name.toLowerCase());
      return classifySelfWrite(record.site.ast, variable => {
        const ref = refs.filter(item => item.raw === variable.variable)[0];
        const target = !!ref ? getTargetName(ref) : undefined;
        if (!target || !equalsCI(target, name)) return undefined;
        return ref.segments.length === 1 && ref.segments[0].index === undefined ? "whole" : "part";
      }) === "rewrite";
    };
    const getEdges = (name: string): Array<string> => {
      return refsByName.get(name.toLowerCase())
        .map(getTargetName)
        .filter(target => !!target && (!equalsCI(target, name) || isRewritingItself(name)));
    };

    reportCycles<CalculatedValueRecord>(ctx, {
      nodes: calcNames,
      edges: getEdges,
      member: getRecord,
      reasons: reasons,
      describe: ({ members, cycle, isSelf }) => {
        const first = members[0];
        // null-proto: keys are user names, plain {} would swallow "__proto__"
        const expressions: { [name: string]: string } = Object.create(null);
        members.forEach(member => expressions[member.name] = member.expression || "");
        // an input the cycle depends on but does not itself compute, for the reproduction steps
        let externalRef: string = undefined;
        members.forEach(member => {
          if (externalRef) return;
          refsByName.get(member.name.toLowerCase()).forEach(ref => {
            if (externalRef || ref.status === "skipped") return;
            if (ref.resolvedKind !== "calculatedValue" && ref.segments.length > 0) {
              externalRef = ref.segments[0].name;
            }
          });
        });
        return {
          message: isSelf
            ? "The calculated value \"" + first.name + "\" references itself in its own expression."
            : "Calculated values " + quoteValues(cycle) + " depend on each other.",
          path: first.site ? first.site.path : first.path,
          messageData: { expressions: expressions },
          elementName: first.name,
          elementType: "calculatedvalue",
          related: members.map(member => ({
            path: member.site ? member.site.path : member.path,
            elementName: member.name,
          })),
          reproduction: <ILintReproduction>{
            description: "The cycle never settles: each value re-triggers the others. Expected to produce a finite value once the cycle is broken.",
            reason: SurveyLintReproductionReasons.calculatedValueCycle,
            steps: [
              { set: { [externalRef || "<any input>"]: 1 } },
              { expect: { calculatedValue: { [first.name]: null } } },
            ],
          },
        };
      },
    });
  },
};
