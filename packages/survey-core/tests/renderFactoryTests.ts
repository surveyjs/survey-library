import { Question } from "../src/question";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { RendererFactory } from "../src/rendererFactory";

export default QUnit.module("RenderFactoryTests");

const inst = RendererFactory.Instance;

QUnit.test("check register/unregister methods", function (assert) {
  assert.equal(inst.getRenderer("testType", "testRenderAs"), "default");
  inst.registerRenderer("testType", "testRenderAs", "custom-component");

  assert.equal(inst.getRenderer("testType", "testRenderAs"), "custom-component");

  inst.unregisterRenderer("testType", "testRenderAs");

  assert.equal(inst.getRenderer("testType", "testRenderAs"), "default");
  inst.clear();
});
QUnit.test("check register with default/unregister methods", function (assert) {
  assert.equal(inst.getRenderer("testType", "testRenderAs1"), "default", "#1");
  assert.equal(inst.getRenderer("testType", "testRenderAs2"), "default", "2");

  inst.registerRenderer("testType", "testRenderAs1", "custom-component1");
  inst.registerRenderer("testType", "testRenderAs2", "custom-component2", true);
  assert.equal(inst.getRenderer("testType", "testRenderAs1"), "custom-component1", "#3");
  assert.equal(inst.getRenderer("testType", "testRenderAs2"), "custom-component2", "#4");
  assert.equal(inst.getRenderer("testType", ""), "custom-component2", "#5");
  assert.equal(inst.getRenderer("testType", "default"), "custom-component2", "#6");

  inst.unregisterRenderer("testType", "testRenderAs2");
  assert.equal(inst.getRenderer("testType", "testRenderAs1"), "custom-component1", "#7");
  assert.equal(inst.getRenderer("testType", "testRenderAs2"), "default", "#8");

  inst.unregisterRenderer("testType", "testRenderAs1");
  assert.equal(inst.getRenderer("testType", "testRenderAs1"), "default", "#9");
  assert.equal(inst.getRenderer("testType", "testRenderAs2"), "default", "#10");

  inst.clear();
});
QUnit.test("Override the default rendering for a question", function (assert) {
  const q = new QuestionRadiogroupModel("q1");
  assert.equal(q.isDefaultRendering(), true, "the rendering is default");
  assert.equal(q.getComponentName(), "default", "the default component name");

  inst.registerRenderer("radiogroup", "testRenderAs", "custom-component", true);
  assert.equal(q.isDefaultRendering(), false, "the rendering is not default");
  assert.equal(q.getComponentName(), "custom-component", "the default component is custom now");

  inst.clear();
  assert.equal(q.isDefaultRendering(), true, "the rendering is default again");
  assert.equal(q.getComponentName(), "default", "the default component name again");
});
