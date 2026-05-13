import { IAction } from "./action";
import { ILocalizableOwner } from "../localizablestring";

export interface IListModel {
  items: Array<IAction>;
  onSelectionChanged?: (item: IAction, ...params: any[]) => void;
  allowSelection?: boolean;
  searchEnabled?: boolean;
  selectedItem?: IAction;
  elementId?: string;
  locOwner?: ILocalizableOwner;
  cssClasses?: any;
  listRole?: string;
  listItemRole?: string;
  listAriaLabel?: string;
  onFilterStringChangedCallback?: (text: string) => void;
  onTextSearchCallback?: (item: IAction, textToSearch: string) => boolean;
  disableSearch?: boolean;
}
