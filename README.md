# Simple Markdown Parser

Parses the basic markdown syntax and displays it live in a preview window on the side.

Advanced markdown features (e.g. tables) are not supported.

## Set-up

This is the most minimal set-up for a markdown parser: a single JavaScript file with ~300 lines of code. A parsing function matches a markdown string against a bunch of regular expressions and returns an html string.

## Use cases

On account of its utmost simplicity, this markdown parser is not exactly built for complicated edge cases or too arbitrary a syntax pattern. But as long as you just want to check out some basic markdown (and don't mind adhering to slightly stricter syntax rules, when it comes to nesting your ordered and unordered lists --> see below), you're good to go for a snappy :zap: markdown live preview :zap:

## Supported syntax

| Element | Markdown Syntax| Annotations |
| ------- | --------------- | ------------|
| **Heading h1-h6** | # Heading 1 <br> ## Heading 2 <br> ### Heading 3 <br> #### Heading 4 <br> ##### Heading 5 <br> ###### Heading 6 | Headings from h1 to h6 are created with a `#` for each heading level in front of the heading text. <br><br>:exclamation: Don't forget the space after the `#` |
| **Paragraphs** | This is one paragraph. <br> <br> This is another paragraph. | A blank line separates one paragraph from another. |
| **Line Breaks** | A line.&nbsp;&nbsp;&nbsp;&nbsp;(--> 2+ spaces) <br> Another line. | Two or more spaces and a return at the end of a line create a line break. |
| **Bold** | This is \*\*bold\*\*. <br> This is \_\_also bold\_\_. | `**` or, alternatively, `__` before and after a word renders it bold. <br><br> :bulb: Bold, italic and strikethrough elements are combinable, for example \*like \*\*so\*\*\*. |
| **Italics** | This is \*italic\*. <br> This is \_also italic\_. | `*` or, alternatively, `_` before and after a word renders it italicized. <br><br>:bulb: Bold, italic and strikethrough elements can be used in the middle of words, too. |
| **Strikethrough** | This is \~\~struck through\~\~. | `~~` before and after a word renders it struck through.
| **Blockquote** | > This is a blockquote. <br> > <br> > This is another paragragh<br>> inside a blockquote that<br>> can go over several lines.<br> > <br> >> This is a nested<br>>> blockquote. <br> >> <br>>> This is a second<br>>> paragraph inside the<br>>> nested blockquote. | Put a `>` before any text you want to quote. For separating one quoted paragraph from another, add a `>` before a blank line. <br><br>:bulb: Blockquotes can be nested any number of times. `>>` creates a new blockquote inside a blockquote, where the same rules regarding paragraphs apply. `>>>` creates a third blockquote level, and so forth. |
| **Ordered lists** | 1. list item <br> 2. list item <br> &nbsp;&nbsp;&nbsp;&nbsp;1. nested list item<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. another nesting level<br> &nbsp;&nbsp;&nbsp;&nbsp;2. nested list item<br> 3. list item | Ordered list items are created by any digit followed by a period and a space. A list must be started at the beginning of a new line. <br><br>:bulb: Ordered lists can be nested any number of times, by indenting list items with 1 tab or 3-5 spaces per nesting level. <br><br>:exclamation: More than 5 spaces per nesting level will cause your list item not to be parsed |
| **Unordered lists** | - list item <br> - list item <br> &nbsp;&nbsp;&nbsp;- nested list item<br> &nbsp;&nbsp;&nbsp;- nested list item<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- another nesting level<br> - list item | A `-` followed by a space creates an unordered list item. Unordered lists, too, must be started at the beginning of a new line. <br><br>:bulb: By indenting an item with 1 tab or 2-4 spaces per list level, unordered list items can be nested, as often as needed. <br><br>:exclamation: More than 4 spaces per nesting level will not be parsed correctly |
| **Inline code** | \`console.log("hi");\` | Anything wrapped in backticks will be rendered as inline code. |
| **Code block** | &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;line of code&lt;/h1&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;line of code&lt;/p&gt;<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;| Lines, indented by 1 tab or 4+ spaces, will be rendered as a code block.<br><br>:exclamation: As of now, fenced codeblocks (with ` ``` `) are not supported |
| **Links** | \[Popular search engine\](ht<span>tp</span>s://google.com) | Text inside brackets, immediately followed by text in parentheses, will be rendered as a link, where the former is the link text and the latter the URL.<br><br>:exclamation: No return between brackets and parentheses - that's just a line wrap in the example, due to space |
| **Images** | \!\[Alt text goes here\](image/url/here) | Just like a link, but with an exclamation mark before the brackets, which in this case contain the alt text of the image. <br><br> :bulb: You can also add links to images. Just put the markdown expression for the image inside the brackets of the link. |
| **Horizontal rules** | \*\*\* <br> \-\-\- <br> \_\_\_ | 3 or more `*`, `-` or `_` by themselves at the beginning of a line create a horizontal rule. |