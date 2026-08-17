import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs } from "../expression-utils";
import { findCycles } from "../graph";
import { CalculatedValueRecord, ParsedRef } from "../symbols";
import { ILintReproduction } from "../types";

export const cycleCalculatedValueRule: ILintRule = {
  id: "cycle/calculated-value",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    const calcNames: Array<string> = [];
    const records: { [key: string]: CalculatedValueRecord } = {};
    const refsByName: { [key: string]: Array<ParsedRef> } = {};
    ctx.index.calculatedValues.forEach((record, name) => {
      calcNames.push(name);
      records[name.toLowerCase()] = record;
      refsByName[name.toLowerCase()] = record.site && record.site.ast
        ? classifySiteRefs(record.site, ctx.index, ctx.options)
        : [];
    });
    const getRecord = (name: string): CalculatedValueRecord => records[name.toLowerCase()];
    const getEdges = (name: string): Array<string> => {
      return refsByName[name.toLowerCase()]
        .filter(ref => ref.resolvedKind === "calculatedValue")
        .map(ref => {
          const target = ctx.index.calculatedValues.get(ref.segments[0].name);
          return target ? target.name : undefined;
        })
        .filter(target => !!target);
    };

    findCycles(calcNames, getEdges).forEach(cycle => {
      const members = cycle.map(getRecord);
      const first = members[0];
      const expressions: { [name: string]: string } = {};
      members.forEach(member => expressions[member.name] = member.expression || "");
      const message = cycle.length === 1
        ? "The calculated value \"" + first.name + "\" references itself in its own expression."
        : "Calculated values " + cycle.map(name => "\"" + name + "\"").join(", ") + " depend on each other.";
      // an input the cycle depends on but does not itself compute, for the reproduction steps
      let externalRef: string = undefined;
      members.forEach(member => {
        if (externalRef) return;
        refsByName[member.name.toLowerCase()].forEach(ref => {
          if (externalRef || ref.status === "skipped") return;
          if (ref.resolvedKind !== "calculatedValue" && ref.segments.length > 0) {
            externalRef = ref.segments[0].name;
          }
        });
      });
      const reproduction: ILintReproduction = {
        description: "The cycle never settles: each value re-triggers the others. Expected to produce a finite value once the cycle is broken.",
        steps: [
          { set: { [externalRef || "<any input>"]: 1 } },
          { expect: { calculatedValue: { [first.name]: null } } },
        ],
      };
      ctx.report({
        message: message,
        path: first.site ? first.site.path : first.path,
        messageData: { cycle: cycle.concat([cycle[0]]), expressions: expressions },
        elementName: first.name,
        elementType: "calculatedvalue",
        related: members.map(member => ({
          path: member.site ? member.site.path : member.path,
          elementName: member.name,
        })),
        reproduction: reproduction,
      });
    });
  },
};
