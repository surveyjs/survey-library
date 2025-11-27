import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { QuestionImageMapModel } from "survey-core";

export class SurveyQuestionImageMap extends SurveyQuestionElementBase {

  constructor(props: any) {
    super(props);
    this.state = { width: undefined, height: undefined, scale: undefined };
  }

  protected get question(): QuestionImageMapModel {
    return this.questionBase as QuestionImageMapModel;
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  backgroundImage: HTMLImageElement | null = null;
  setBackgroundImage(e: HTMLImageElement): void {

    if (!e) return;

    // this.backgroundImage = e;

    e.onload = () => {
      const scale = e.width / e.naturalWidth;
      this.setState({ scale });
      this.setState({ naturalWidth: e.naturalWidth });
      this.setState({ naturalHeight: e.naturalHeight });
    };
  }

  selectedCanvas: HTMLCanvasElement | null = null;
  setSelectedCanvas(e: HTMLCanvasElement): void {

    this.selectedCanvas = e;
    this.drawSelectedCanvas();
  }
  public drawSelectedCanvas(): void {

    if (!this.selectedCanvas) return;

    const ctx = this.selectedCanvas.getContext("2d");

    ctx.clearRect(0, 0, this.selectedCanvas.width, this.selectedCanvas.height);

    for (const item of this.question.imageMap) {

      if (!this.question.isItemSelected(item)) continue;
      let coords = item.coords.split(",").map((coord) => Number(coord));

      ctx.beginPath();
      switch(item.shape) {
        case "rect":
          ctx.rect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
          break;
        case "circle":
          ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
          break;
        case "poly":
          for (let i = 0; i < coords.length; i += 2) {
            ctx.lineTo(coords[i], coords[i + 1]);
          }
          ctx.closePath();
          break;
      }
      ctx.fill();
    }
  }

  public renderElement(): React.JSX.Element {

    const imageMap = (this.state.scale && <map name={`imagemap-${ this.question.id }`}>
      {this.question.imageMap.map((item, index) => {

        let scale = this.state.scale;
        let coords = item.coords.split(",").map((coord) => Number(coord) * scale).join(",");

        return <area key={index} shape={item.shape} coords={coords} href="#" alt={item.text}
          onClick={(e) => { e.preventDefault(); this.question.mapItemTooggle(item); this.drawSelectedCanvas(); }} />;
      })}
    </map>);

    return (<>
      <div style={{ position: "relative" }}>
        <img
          style={{ width: "100%" }}
          src={this.question.imageLink}
          useMap={`#imagemap-${ this.question.id }`}
          ref={(e) => this.setBackgroundImage(e)}
        />
        <canvas
          style={{ position: "absolute", top: 0, left: 0, width: "100%", pointerEvents: "none" }}
          height={this.state.naturalHeight}
          width={this.state.naturalWidth}
          ref={(e) => { this.setSelectedCanvas(e); }}></canvas>
      </div>

      { imageMap }
    </>);
  }
}

ReactQuestionFactory.Instance.registerQuestion("imagemap", (props) => {
  return React.createElement(SurveyQuestionImageMap, props);
});
