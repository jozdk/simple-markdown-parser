# Simple Markdown Parser

Parses the basic markdown syntax and displays it live in a preview window on the side.

Advanced markdown features are not supported.

## Supported syntax

| Element | Markdown Syntax | Annotations |
| ------- | --------------- | ------------|
| **Heading H1-H6** | # Heading 1 <br> ## Heading 2 <br> ### Heading 3 <br> #### Heading 4 <br> ##### Heading 5 <br> ###### Heading 6 | :exclamation: Don't forget the space after the `#` |
| **Alternate Heading H1 and H2** | Heading 1 <br> === <br> Heading 2 <br> --- | You can use 1 or any number of `=` or `-` on the line below the heading text to create a H1 or an H2 heading, respectively. |
| **Paragraphs** | This is one paragraph. <br> <br> This is another paragraph. | A blank line separates one paragraph from another |
| **Line Breaks** | A line with two or more trailing spaces <br> Another line. | Two or more spaces and a return at the end of a line create a line break. |
| **Bold** | This is \*\*bold\*\*. <br> This is \_\_also bold\_\_. | ´**´ or, alternatively, `__` before and after a word renders it bold. <br><br> :bulb: Bold, italic and strikethrough elements are combinable, for example \*like \*\*so\*\*\*. |
| **Italics** | This is \*italic\*. <br> This is \_also italic\_. | ´*´ or, alternatively, `_` before and after a word renders it italicized. <br> <br>:bulb: Bold, italic and strikethrough elements can be used in the middle of words, too. |
| **Strikethrough** | This is \~\~struck through\~\~. |
| **Blockquote** | > This is a blockquote. <br> > <br> > This is another paragragh inside a blockquote <br> > that can go over several lines. <br> >> This is a nested blockquote. <br> >> <br> >> This is a second paragraph inside of the nested blockquote. | Put a `>` before any text you want to quote. For separating one quoted paragraph from another, add a `>` before a blank line. <br><br> Blockquotes can also be nested any number of times. `>>` creates a new blockquote inside a blockquote, where the same rules regarding paragraphs apply. `>>>` creates a third blockquote level, and so forth. |
| **Ordered lists** | 1. item <br> 2. item <br> &nbsp;&nbsp;&nbsp;&nbsp;1. nested items, indented by one tab <br> &nbsp;&nbsp;&nbsp;&nbsp;2. or at least 3, but no more than 5 spaces<br> 3. item | Ordered list items are created by any digit followed by a period and a space. A list must be started at the beginning of a new line. <br><br> Ordered lists can be nested any number of times, by indenting list items with 1 tab or 3-5 spaces per nesting level. <br>:exclamation: Other elements inside lists, e.g. paragraphs, codeblocks, images, etc. are not supported. |
| **Unordered lists** | - item <br> - item <br> &nbsp;&nbsp;&nbsp;- nested items, indented by one tab <br> &nbsp;&nbsp;&nbsp;- or at least 2, but no more than 4 spaces <br> - item | A `-` followed by a space creates an unordered list item. Unordered lists, too, must be started at the beginning of a new line. <br><br> By indenting an item with 1 tab or 2-4 spaces per list level, unordered list items can be nested, as often as needed. <br>:exclamation: Too crazy a pattern will not be parsed correctly. |
| **Inline code** | \`console.log("inline code");\` | Anything wrapped in backticks will be rendered as inline code. <br><br> :exclamation: Unfortunately, other inline element syntax like enclosing `*` or `**` will be parsed as markdown. For actually displaying patterns like these, the only solution, as of now, is to write them in a codeblock instead |
| **Code block** | &emsp;&emsp;&emsp; &lt;p&gt;lines of code indented by 1 tab <br> &emsp;&emsp;&emsp; or at least 4 spaces&lt;/p&gt; | Lines, indented by 1 tab or 4+ spaces, will be rendered as a code block. |
| **Links** | \[Popular search engine\](ht<span>tp</span>s://google.com) | Text inside brackets, immediately followed by text in parentheses, will be rendered as a link, where the former is the link text and the latter the URL. |
| **Images** | \[\!Alt text goes here\](image/url/here) | Just like a link, but with an exclamation mark before the bracket text, which in this case is the alt text of the image. <br><br> :bulb: You can also add links to images. Just put the markdown expression for the image inside the brackets of the link. |