import type { QuestionRatingModel, RenderedRatingItem } from "survey-core";

export interface IRatingItemProps {
  question: QuestionRatingModel;
  item: RenderedRatingItem;
  index: number;
}
