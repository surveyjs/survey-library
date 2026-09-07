import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs } from "../expression-utils";
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
        ? classifySiteRefs(record.site, ctx.index, ctx.options)
        : []);
    });
    const getRecord = (name: string): CalculatedValueRecord => records.get(name.toLowerCase());
    const getEdges = (name: string): Array<string> => {
      return refsByName.get(name.toLowerCase())
        .filter(ref => ref.resolvedKind === "calculatedValue")
        .map(ref => {
          const target = ctx.index.calculatedValues.get(ref.segments[0].name);
          return target ? target.name : undefined;
        })
        .filter(target => !!target);
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
