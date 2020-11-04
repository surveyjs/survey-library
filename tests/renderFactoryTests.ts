import { Question } from "../src/question";
import { RendererFactory } from "../src/rendererFactory";

export default QUnit.module("RenderFactoryTests");

var q1 = new Question("q1");
q1.type = "testType";
q1.renderAs = "testRenderAs";

const inst = RendererFactory.Instance;

QUnit.skip("check register/unregister methods", function (assert) {
  assert.equal(inst.getRenderer("testType", "testRenderAs"), "default");

  inst.registerRenderer("testType", "testRenderAs", "custom-component");

  assert.equal(
    inst.getRenderer("testType", "testRenderAs"),
    "custom-component"
  );

  inst.unregisterRenderer("testType", "testRenderAs");

  assert.equal(inst.getRenderer("testType", "testRenderAs"), "default");
});
