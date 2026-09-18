import { Action, ActionContainer, createDropdownActionModel, DomWindowHelper, IAction, ListModel, SurveyModel } from "survey-core";
import { IPresencePeer, presenceColorSlot, presenceInitials } from "../presence/presence-envelope";
import { getCollabString } from "../collaboration-strings";

export type CollabBarStatus = "connecting" | "connected" | "closed";

export interface ICollabBarOptions {
  // Free-form rows shown on the left, e.g. [{label:"Room", value:"abc"}].
  info?: Array<{ label: string, value: string }>;
  // The Invite button copies whatever this returns; absent -> no button.
  getInviteLink?: () => string;
  // Avatars beyond this many collapse into a "+N" dropdown.
  maxVisibleParticipants?: number;
  // A participant chip was clicked.
  onParticipantClick?: (clientId: string) => void;
}

// The layout element id, so the plugin can remove exactly what it added.
export const COLLAB_BAR_ELEMENT_ID = "collab-bar";
// Sort order within the "header" container. Lower than the advanced header (-100)
// and the top progress bar (-150), so the strip stays the outermost chrome when a
// form uses either of them.
export const COLLAB_BAR_INDEX = -200;
const DEFAULT_MAX_VISIBLE = 8;
const COPIED_REVERT_MS = 1500;

// The collaboration strip above the form.
//
// It is a plain ActionContainer handed to survey.addLayoutElement under the
// already-registered "sv-action-bar" component, which is why this feature needs no
// component of its own in any UI package and no change to survey-core: the library
// already knows how to render an action bar in React, Vue, Angular and js-ui.
//
// The price is that everything here must be expressible as an Action - hence the
// avatars being buttons with an initials title and a colour-slot class, and the
// left/right split being a spacer action plus CSS rather than two containers.
export class CollabBarModel {
  public container: ActionContainer;

  private statusAction: Action;
  private spacerAction: Action;
  private inviteAction: Action;
  private overflowAction: Action;
  private participantActions: Array<Action> = [];
  private participants: Array<IPresencePeer> = [];
  private lastSignature = "";
  private inviteTimer: any;
  private disposed = false;

  constructor(private survey: SurveyModel, private options: ICollabBarOptions = {}) {
    this.container = new ActionContainer();
    this.container.containerCss = "sv-collab-bar";
    // The library's own compact size rather than a CSS override: x-small means 32px
    // buttons and 12px labels, which is how survey-core makes its own dense bars
    // (question title actions, matrix row actions, the file question).
    //
    // Set on the CONTAINER, not on each action, so it also reaches participant chips -
    // they are rebuilt on every roster change, and ActionContainer re-applies the
    // stored appearance to every action it creates.
    //
    // style and mode are the library defaults; only the size changes.
    this.container.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "x-small" });

    this.statusAction = new Action({
      id: "collab-status",
      css: "sv-collab-bar__status",
      enabled: false,
      visible: false,
      title: "",
    });
    // Pushes everything after it to the right edge; see collab-bar.scss.
    this.spacerAction = new Action({
      id: "collab-spacer",
      css: "sv-collab-bar__spacer",
      enabled: false,
      title: "",
    });
    this.overflowAction = this.createOverflowAction();
    this.inviteAction = new Action({
      id: "collab-invite",
      title: getCollabString("collabInvite"),
      tooltip: getCollabString("collabInviteTooltip"),
      visible: !!options.getInviteLink,
      action: () => this.copyInviteLink(),
    });
    // An action's own appearance overrides the container's predefined one
    // (Object.assign({}, predefinedAppearance, appearance, ...) in getActionBarItemCss),
    // so Invite has to be set to the compact size explicitly - otherwise it stays 40px
    // tall and keeps the whole strip that tall with it.
    this.inviteAction.appearance = { style: "brand", mode: "primary", size: "x-small" };

    this.rebuild();
    // "header" rather than "contentTop": contentTop renders inside .sd-body, which
    // wraps its content in a column div, pads it from the top, and only exists while
    // a page is showing. That put the strip below the form title with an inherited
    // 40px offset, made its position:sticky inert (the wrapper is exactly the strip's
    // own height, so there is nothing to stick within), and made it vanish once the
    // form was completed. The header container renders with needRenderWrapper: false,
    // so the strip is a direct child of .sd-container-modern and has none of that.
    //
    // Being ABOVE the title is then done by CSS order, not by this index: the basic
    // title is not a layout element at all, it is emitted just before this container.
    // The index only orders the strip against the elements that DO share the
    // container - the advanced header (-100) and the top progress bar (-150).
    this.survey.addLayoutElement({
      id: COLLAB_BAR_ELEMENT_ID,
      container: "header",
      index: COLLAB_BAR_INDEX,
      component: "sv-action-bar",
      data: this.container,
    });
  }

  public setStatus(status: CollabBarStatus): void {
    // Only a problem is worth a row: "connected" is the state the form is supposed
    // to be in, and saying so permanently is noise.
    const text = status === "connecting"
      ? getCollabString("collabStatusConnecting")
      : (status === "closed" ? getCollabString("collabStatusClosed") : "");
    this.statusAction.title = text;
    this.statusAction.visible = !!text;
    this.statusAction.css = "sv-collab-bar__status sv-collab-bar__status--" + status;
  }

  public setParticipants(peers: ReadonlyMap<string, IPresencePeer> | Array<IPresencePeer>): void {
    const list: Array<IPresencePeer> = [];
    (peers as any).forEach((peer: IPresencePeer) => list.push(peer));
    // Presence fires on every cursor move; rebuilding the actions twenty times a
    // second would be both wasteful and visibly jumpy.
    const signature = JSON.stringify(list.map((p) => [p.clientId, p.name, p.colorIndex]));
    if (signature === this.lastSignature) return;
    this.lastSignature = signature;
    this.participants = list;
    this.rebuild();
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.inviteTimer !== undefined) clearTimeout(this.inviteTimer);
    this.survey.removeLayoutElement(COLLAB_BAR_ELEMENT_ID);
    this.container.dispose();
  }

  private get maxVisible(): number {
    return this.options.maxVisibleParticipants ?? DEFAULT_MAX_VISIBLE;
  }

  private rebuild(): void {
    const visible = this.participants.slice(0, this.maxVisible);
    const overflow = this.participants.slice(this.maxVisible);

    this.participantActions = visible.map((peer, index) => this.createParticipantAction(peer, index));
    this.overflowAction.title = getCollabString("collabMoreParticipants", overflow.length);
    this.overflowAction.visible = overflow.length > 0;
    (this.overflowAction.popupModel?.contentComponentData?.model as ListModel)?.setItems(
      overflow.map((peer) => this.createParticipantItem(peer))
    );

    const actions: Array<IAction> = [this.statusAction];
    (this.options.info || []).forEach((row, index) => {
      actions.push(new Action({
        id: "collab-info-" + index,
        css: "sv-collab-bar__info",
        enabled: false,
        title: getCollabString("collabInfoRow", row.label, row.value),
      }));
    });
    actions.push(this.spacerAction);
    this.participantActions.forEach((action) => actions.push(action));
    actions.push(this.overflowAction);
    actions.push(this.inviteAction);
    this.container.setItems(actions, false);
  }

  private createParticipantAction(peer: IPresencePeer, index: number): Action {
    // The same slot the ring and the cursor resolve, so one person is one colour.
    const slot = peer.colorIndex;
    const action = new Action({
      id: "collab-peer-" + peer.clientId,
      title: presenceInitials(peer.name),
      tooltip: peer.name,
      // Two classes, two elements: `css` lands on the action's wrapper div, `innerCss`
      // on its button. The stack lives on the wrapper because that is what takes part
      // in the bar's flex flow; the circle lives on the button.
      //
      // Every avatar but the first is marked here rather than picked out by a CSS
      // sibling selector: Angular renders a hidden <sv-ng-action> host between the
      // items, which silently breaks `+`, `:first-child` and `:nth-child` there.
      css: "sv-collab-bar__participant" + (index > 0 ? " sv-collab-bar__participant--stacked" : ""),
      // The colour comes from the theme's user-colour slot as a CLASS rather than an
      // inline hex, so the avatar stays legible in light and dark alike.
      innerCss: "sv-collab-bar__avatar sv-collab-bar__avatar--color-" + slot,
      visibleIndex: index,
      action: () => this.options.onParticipantClick?.(peer.clientId),
    });
    return action;
  }

  private createParticipantItem(peer: IPresencePeer): IAction {
    return {
      id: "collab-peer-item-" + peer.clientId,
      title: peer.name,
      css: "sv-collab-bar__roster-item sv-collab-bar__roster-item--color-" + peer.colorIndex,
      action: () => this.options.onParticipantClick?.(peer.clientId),
    };
  }

  private createOverflowAction(): Action {
    return createDropdownActionModel({
      id: "collab-overflow",
      title: "",
      visible: false,
      css: "sv-collab-bar__overflow",
    }, {
      items: [],
      onSelectionChanged: (item: IAction) => item.action?.(),
    });
  }

  private copyInviteLink(): void {
    if (!this.options.getInviteLink) return;
    const link = this.options.getInviteLink();
    const clipboard = (DomWindowHelper.getWindow() as any)?.navigator?.clipboard;
    // The caption flip is optimistic: clipboard access can still be refused in an
    // insecure context, and there is nothing useful to say about that here.
    clipboard?.writeText?.(link)?.catch(() => {});
    this.inviteAction.title = getCollabString("collabInviteCopied");
    if (this.inviteTimer !== undefined) clearTimeout(this.inviteTimer);
    this.inviteTimer = setTimeout(() => {
      this.inviteTimer = undefined;
      if (!this.disposed)this.inviteAction.title = getCollabString("collabInvite");
    }, COPIED_REVERT_MS);
  }
}
