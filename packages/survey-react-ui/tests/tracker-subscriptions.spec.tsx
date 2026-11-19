import { SurveyModel, Base, settings } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact, SurveyElementBase } from "../entries/index";
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";

const containers: Array<HTMLElement> = [];
function mount(element: React.JSX.Element): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(element, container);
  });
  return container;
}
function unmount(container: HTMLElement): void {
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
  });
  container.remove();
  containers.splice(containers.indexOf(container), 1);
}
let prevAnimationEnabled: boolean;
beforeEach(() => {
  // The leave animation keeps a hidden row mounted.
  prevAnimationEnabled = settings.animationEnabled;
  settings.animationEnabled = false;
});
afterEach(() => {
  [...containers].forEach(container => unmount(container));
  vi.restoreAllMocks();
  settings.animationEnabled = prevAnimationEnabled;
});
// The UI callbacks of a model: components keep their tracker's callback in both sets while they are mounted.
function uiCallbackCount(model: Base): number {
  const valueCallbacks: Set<any> = (model as any).onPropertyValueCoreChanged;
  const arrayCallbacks: Set<any> = (model as any).onArrayChanged;
  return (valueCallbacks?.size || 0) + (arrayCallbacks?.size || 0);
}

class ThrowingElement extends SurveyElementBase<any, any> {
  protected renderElement(): React.JSX.Element {
    throw new Error("render error");
  }
}
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.hasError ? <div>error</div> : this.props.children;
  }
}

describe("Components subscribe to what they render and nothing else", () => {
  it("unmounting a survey leaves no callback on the survey, the page, a row or a question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "First" },
        { type: "panel", name: "panel1", elements: [{ type: "checkbox", name: "q2", choices: ["a", "b"] }] },
        { type: "dropdown", name: "q3", choices: ["a", "b"] }
      ]
    });
    const container = mount(<SurveyReact model={survey} />);
    const page = survey.currentPage;
    const panel = survey.getPanelByName("panel1");
    const models: Array<Base> = [survey, page, panel, ...page.rows, ...panel.rows, ...survey.getAllQuestions()];
    expect(uiCallbackCount(survey), "the survey is subscribed while it is rendered").toBeGreaterThan(0);
    expect(page.rows.every(row => uiCallbackCount(row) > 0), "every row is subscribed while it is rendered").toBe(true);

    unmount(container);
    expect(models.map(model => uiCallbackCount(model)), "no callback is left").toEqual(models.map(() => 0));
    survey.dispose();
  });
  it("a render that throws does not stop other components from updating", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mount(<ErrorBoundary><ThrowingElement /></ErrorBoundary>);
    expect(Base.currentPropertyAccessListener, "the render that threw restored the listener").toBeUndefined();

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "First" },
        { type: "text", name: "q2", title: "Second" }
      ]
    });
    const container = mount(<SurveyReact model={survey} />);
    expect(container.textContent).toContain("Second");
    // The page re-renders its rows through the tracker; a title change would reach the DOM through its string
    act(() => { survey.getQuestionByName("q2").visible = false; });
    expect(container.textContent, "the hidden question is removed").not.toContain("Second");
    survey.dispose();
  });
});

describe("The complete, completed-before and loading pages follow their HTML", () => {
  const elements = [{ type: "text", name: "q1" }];

  it("the complete page shows completedHtml changed after completion", () => {
    const survey = new SurveyModel({ completedHtml: "<h3>Thank you</h3>", elements });
    const container = mount(<SurveyReact model={survey} />);
    act(() => { survey.doComplete(); });
    expect(container.textContent).toContain("Thank you");

    act(() => { survey.completedHtml = "<h3>Response saved</h3>"; });
    expect(container.textContent).toContain("Response saved");
    expect(container.textContent).not.toContain("Thank you");
    survey.dispose();
  });
  it("the complete page follows completedHtml through the save flow", () => {
    const survey = new SurveyModel({ completedHtml: "<h3>Thank you</h3>", elements });
    let saveOptions: any;
    survey.onComplete.add((sender, options) => {
      saveOptions = options;
      sender.completedHtml = "<h3>Sending your message...</h3>";
      options.showSaveInProgress("Saving");
    });
    survey.registerPropertyChangedHandlers(["completedState"], () => {
      if (survey.completedState === "error") survey.completedHtml = "<h3>Your message hasn't been saved.</h3>";
    });
    const container = mount(<SurveyReact model={survey} />);
    act(() => { survey.doComplete(); });
    expect(container.textContent, "saving").toContain("Sending your message...");

    act(() => { saveOptions.showSaveError("Error"); });
    expect(container.textContent, "error").toContain("Your message hasn't been saved.");
    expect(container.textContent, "error").not.toContain("Sending your message...");

    act(() => {
      survey.completedHtml = "<h3>Saved, ID 42</h3>";
      saveOptions.showSaveSuccess("Success");
    });
    expect(container.textContent, "success").toContain("Saved, ID 42");
    expect(container.textContent, "success").not.toContain("hasn't been saved");
    survey.dispose();
  });
  it("the complete page shows a variable in completedHtml that changes after completion", () => {
    const survey = new SurveyModel({ completedHtml: "<h3>Response ID: {responseId}</h3>", elements });
    survey.setVariable("responseId", 1);
    const container = mount(<SurveyReact model={survey} />);
    act(() => { survey.doComplete(); });
    expect(container.textContent).toContain("Response ID: 1");

    act(() => { survey.setVariable("responseId", 42); });
    expect(container.textContent).toContain("Response ID: 42");
    survey.dispose();
  });
  it("the complete page shows the html of a completedHtmlOnCondition item changed after completion", () => {
    const survey = new SurveyModel({
      completedHtmlOnCondition: [{ expression: "{q1} = 1", html: "<h3>Condition first</h3>" }],
      elements
    });
    survey.setValue("q1", 1);
    const container = mount(<SurveyReact model={survey} />);
    act(() => { survey.doComplete(); });
    expect(container.textContent).toContain("Condition first");

    act(() => { survey.completedHtmlOnCondition[0].html = "<h3>Condition second</h3>"; });
    expect(container.textContent).toContain("Condition second");
    survey.dispose();
  });
  it("the completed-before page shows completedBeforeHtml changed while it is shown", () => {
    const survey = new SurveyModel({ completedBeforeHtml: "<h3>Before first</h3>", elements });
    const container = mount(<SurveyReact model={survey} />);
    act(() => { survey.isCompletedBefore = true; });
    expect(container.textContent).toContain("Before first");

    act(() => { survey.completedBeforeHtml = "<h3>Before second</h3>"; });
    expect(container.textContent).toContain("Before second");
    survey.dispose();
  });
  it("the loading page shows loadingHtml changed while it is shown", () => {
    const survey = new SurveyModel({ loadingHtml: "<h3>Loading first</h3>", elements });
    const container = mount(<SurveyReact model={survey} />);
    act(() => { survey.beginLoading(); });
    expect(container.textContent).toContain("Loading first");

    act(() => { survey.loadingHtml = "<h3>Loading second</h3>"; });
    expect(container.textContent).toContain("Loading second");
    survey.dispose();
  });
});
