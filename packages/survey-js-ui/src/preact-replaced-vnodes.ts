import { options } from "preact";

// The Preact 10 internals the hooks below read and write, under their mangled names (stable across Preact 10:
// preact/debug and the devtools read them too): a vnode's __k is _children, __c is _component; a component's __v is
// its current vnode; the options' __c is the _commit hook.
interface IPreactVNode {
  __k?: Array<IPreactVNode> | null;
  __c?: { __v?: IPreactVNode } | null;
}
interface IPreactOptions {
  vnode?: (vnode: IPreactVNode) => void;
  __c?: (root: IPreactVNode, commitQueue: Array<any>) => void;
}

const installed: Array<IPreactOptions> = [];

/* A component that re-renders on its own (setState, forceUpdate) gets a shallow copy of its vnode, diffed and put in
   its parent's _children. The vnode the copy replaces is still in the props.children of the vnode that rendered it,
   and Preact clears only its _dom and _parent: its _children keeps the subtree it rendered, with the DOM nodes,
   detached as the component goes on rendering. Where shouldComponentUpdate returns false, a vnode and its successor
   share one _children array, so the replaced subtrees chain up and the detached DOM grows with every re-render: a
   sort of a dynamic matrix keeps the cells it hides and the actions it rebuilds. React keeps no such references.
   The copy reaches options.vnode before the diff, while its component still points to the vnode it replaces (and the
   two share _children); the diff is the last reader of the replaced vnode's _children, so the commit drops them. */
export function releaseReplacedVNodes(opts: IPreactOptions = options as any): void {
  if (installed.indexOf(opts) > -1) return;
  installed.push(opts);
  const replaced: Array<IPreactVNode> = [];
  const prevVNode = opts.vnode;
  opts.vnode = (vnode: IPreactVNode): void => {
    const component = vnode.__c;
    const prev = !!component ? component.__v : undefined;
    if (!!prev && prev !== vnode && !!prev.__k && prev.__k === vnode.__k) {
      replaced.push(prev);
    }
    if (!!prevVNode) prevVNode(vnode);
  };
  const prevCommit = opts.__c;
  opts.__c = (root: IPreactVNode, commitQueue: Array<any>): void => {
    for (let i = 0; i < replaced.length; i++) {
      replaced[i].__k = null;
    }
    replaced.length = 0;
    if (!!prevCommit) prevCommit(root, commitQueue);
  };
}
