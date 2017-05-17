# What Input?

__A global utility for tracking the current input method (mouse, keyboard or touch).__

## What Input is now v4

What Input adds data attributes to the `<html>` tag based on the type of input being used. It also exposes a simple API that can be used for scripting interactions.

### Changes from v3

* `mousemove` and `pointermove` events no longer affect the `data-whatinput` attribute.
* A new `data-whatintent` attribute now works like v3. This change is intended to separate direct interaction from potential.
* Key logging and the corresponding `whatInput.keys()` API option have been removed.
* Event binding and attributes are now added to the `<html>` tag to eliminate the need to test for `DOMContentLoaded`.
* The `whatInput.set()` API option has been removed.
* A new set of `whatinput-types-[type]` classes are now added as inputs are detected. New classes are added but existing ones remain, creating the same output as what the `whatInput.types()` returns.

## How it works

What Input uses event bubbling on the `<html>` tag to watch for mouse, keyboard and touch events (via `mousedown`, `keydown` and `touchstart`). It then sets or updates a `data-whatinput` attribute.

Where present, Pointer Events are supported, but note that `pen` inputs are remapped to `touch`.

What Input also exposes a tiny API that allows the developer to ask for or set the current input.

_What Input does not make assumptions about the input environment before the page is directly interacted with._ However, the `mousemove` and `pointermove` events are used to set a `data-whatintent="mouse"` attribute to indicate that a mouse is being used _indirectly_.

### Interacting with Forms

Since interacting with a form requires use of the keyboard, What Input _does not switch the input type while form `<input>`s and `<textarea>`s are being interacted with_, preserving the last detected input type.

## Installing

Download the file directly...

or install via Bower...

```shell
bower install what-input
```

or install via NPM...

```shell
npm install what-input
```

## Usage

Include the script directly in your project.

```html
<script src="assets/scripts/what-input.js"></script>
```

Or require with a script loader.

```javascript
require('what-input');

// or

var whatInput = require('what-input');
```

What Input will start doing its thing while you do yours.

### Example Styling

```css
/**
 * set a custom default :focus style
 */

/* default styling before what input executes */
:focus {

}

/* initial styling after what input has executed but before any interaction */
[data-whatinput="initial"] :focus {
  outline: 2px dotted black;
}

/* mouse */
[data-whatinput="mouse"] :focus {
  outline-color: red;
}

/* keyboard */
[data-whatinput="keyboard"] :focus {
  outline-color: green;
}

/* touch */
[data-whatinput="touch"] :focus {
  outline-color: blue;
}
```
**Note:** If you remove outlines with `outline: none;`, be sure to provide clear visual `:focus` styles so the user can see which element they are on at any time for greater accessibility. Visit [W3C's WCAG 2.0 2.4.7 Guideline](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-visible.html) to learn more.

### Scripting

#### Current Input

Ask What Input what the current input method is. This works best if asked after the events What Input is bound to (`mousedown`, `keydown` and `touchstart`).

```javascript
whatInput.ask(); // returns `mouse`, `keyboard` or `touch`

myButton.addEventListener('click', function() {

  if (whatInput.ask() === 'mouse') {
    // do mousy things
  } else if (whatInput.ask() === 'keyboard') {
    // do keyboard things
  }

});
```

If it's necessary to know if `mousemove` is being used, use the `'loose'` option. For example:

```javascript

/*
  nothing has happened but the mouse has moved
*/

whatInput.ask(); // returns `initial` because the page has not been directly interacted with
whatInput.ask('loose'); // returns `mouse` because mouse movement was detected

/*
  the keyboard has been used, then the mouse was moved
*/

whatInput.ask(); // returns `keyboard` because the keyboard was the last direct page interaction
whatInput.ask('loose'); // returns `mouse` because mouse movement was the most recent action detected
```

Ask What Input to return an array of all the input types that have been used _so far_.

```javascript
whatInput.types(); // ex. returns ['mouse', 'keyboard']
```

## Compatibility

What Input works in all modern browsers. For compatibility with IE8, polyfills are required for:

* addEventListener
* IndexOf

Add your own, or grab the bundle included here.

```html
<!--[if lte IE 8]>
  <script src="lte-IE8.js"></script>
<![endif]-->
```

## Demo

Check out the demo to see What Input in action.

http://ten1seven.github.io/what-input

## Acknowledgments

Special thanks to [Viget](http://viget.com/) for their encouragement and commitment to open source projects. Visit [code.viget.com](http://code.viget.com/) to see more projects from [Viget](http://viget.com).

Thanks to [mAAdhaTTah](https://github.com/mAAdhaTTah) for the initial conversion to Webpack.

What Input is written and maintained by [@ten1seven](https://github.com/ten1seven).

## License

What Input is freely available under the [MIT License](http://opensource.org/licenses/MIT).
