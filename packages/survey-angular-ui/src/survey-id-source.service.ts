import { Injectable } from "@angular/core";

/**
 * App-scoped source of SSR-stable `renderedIdSuffix` tokens for Angular (see v3-element-ids-02).
 *
 * Angular has no `useId` hook. Instead we provide an application-scoped counter: because a
 * hydration-capable Angular (16+/17+) bootstraps a **fresh application injector per server render**,
 * a `providedIn: "root"` service resets per request, so the Nth survey on the page gets the same
 * token on the server and on the hydrating client. (A module-level global would NOT reset and would
 * reintroduce the SSR mismatch.)
 *
 * Disabled by default because the current renderer target (Angular 12) has neither modern hydration
 * nor a per-request injector, so emitting tokens there would change ids (`sq_0` -> `sq_0_a0`) with no
 * SSR benefit. When the renderer is bumped to a hydration-capable Angular, set
 * `SurveyIdSourceService.isEnabled = true` (or provide a subclass that returns `true`) to turn on the
 * automatic multi-survey-SSR path. While disabled, `next()` returns `""` and `renderedIdSuffix` stays empty -
 * single-survey SSR and today's client behavior are unchanged.
 */
@Injectable({ providedIn: "root" })
export class SurveyIdSourceService {
  /**
   * Flip to `true` on a hydration-capable Angular to enable automatic per-survey `renderedIdSuffix` tokens.
   * Left `false` on Angular 12 so ids stay byte-identical to today's output.
   */
  public static isEnabled = false;

  private counter = 0;

  /** Returns the next SSR-stable token, or `""` when disabled (inert). */
  public next(): string {
    if (!SurveyIdSourceService.isEnabled) return "";
    return "_a" + (this.counter++);
  }
}
