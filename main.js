const editor = document.querySelector("#editor");
const preview = document.querySelector("#preview");

// Headings
const h1 = /^ {0,3}#\s(.*)$/gm;
const h2 = /^ {0,3}##\s(.*)$/gm;
const h3 = /^ {0,3}###\s(.*)$/gm;
const h4 = /^ {0,3}####\s(.*)$/gm;
const h5 = /^ {0,3}#####\s(.*)$/gm;
const h6 = /^ {0,3}######\s(.*)$/gm;
const altH1 = /(\w+)\n={1,} *$/gm;
const altH2 = /(\w+)\n-{1,} *$/gm;

// const horizontalRule = /^(?:-|\*|_){3,}? *$/gm;

// Image + Link
const image = /!\[(.*?)\]\((.*?)\)/gm;
const link = /(?<!!)\[(.*?)\]\((.*?)\)/gm;
// Extended feature: image with caption: ![alt text|figcaption text](URL)
// const imageWithCaption = /!\[(.*?)\|(.*?)\]\((.*?)\)/gm;

// Blockquote
const blockquote = /(^>{1}[\S\s]*?(?=^(?!>))|^>{1}[\S\s]*)/gm;

// Ordered list
const orderedList = /^\d\. [\S\s]*?(?=^ *\n^(?!( *\d\.| *\n))|^- )|^\d\. [\S\s]*/gm;

// Unordered list
const unorderedList = /^- [\S\s]*?(?=^ *\n^(?!( *- | *\n))|^\d\. )|^- [\S\s]*/gm;

// Paragraph
const paragraph = /(^(?!<h2|<h1|<h3|<h4|<h5|<h6|<figure|<blockquote|<\/blockquote>|<p|<ol|<ul|( {4,}|\t)| *\n)[\S\s]+?(?=<blockquote>|^ *\n)|^(?!<h2|<h1|<h3|<h4|<h5|<h6|<figure|<blockquote|<\/blockquote>|<p|<ol|<ul|( {4,}|\t)| *\n)[\S\s]+)/gm;

// Codeblock
const codeblock = /(^(?:( {4,}|\t))[\S\s]+?(?=\n<p>|<h2|<h1|<h3|<h4|<h5|<h6|<figure|<blockquote|<\/blockquote>|<ol|<ul|^ *\n)|^(?:( {4,}|\t))[\S\s]+)/gm;

// Inline elements

// Linebreak
const linebreak = /(^(?!>).*?) {2,}\n/gm;

// Bold
const bold = /\*\*(.+?)\*\*/gm;
const bold2 = /__(.+?)__/gm;

// Italics
const italics = /\*(.+?)\*/gm;
const italics2 = /_(.+?)_/gm;

// Strikethrough
const strikethrough = /~~(.+?)~~/gm;

// Code
const code = /`(.*?)`/gm;

function parseMarkdown(mdText) {
    let html;

    // Headings
    html = mdText.replace(h1, "<h1>$1</h1>")
        .replace(h2, "<h2>$1</h2>")
        .replace(h3, "<h3>$1</h3>")
        .replace(h4, "<h4>$1</h4>")
        .replace(h5, "<h5>$1</h5>")
        .replace(h6, "<h6>$1</h6>")
        .replace(altH1, "<h1>$1</h1>")
        .replace(altH2, "<h2>$1</h2>");

        // H1 and H2 with underlining
        // .replace(h1, "<h1 style='border-bottom: 1px solid lightgrey; margin-bottom: 0.5em;'>$1</h1>")
        // .replace(h2, "<h2 style='border-bottom: 1px solid lightgrey; margin-bottom: 0.5em;'>$1</h2>");
    
    // html = html.replace(horizontalRule, "<hr>");
    // First add to negative lookahead in paragraph, codeblock etc.

    // Link + Image
    html = html.replace(image, "<img src='$2' alt='$1'>");

    html = html.replace(link, "<a href='$2'>$1</a>");

    // Extended feature
    // html = html.replace(imageWithCaption, "<figure class='float-right'><img src='$3' alt='$1'></img><figcaption>$2</figcaption></figure>");

    // Blockquotes
    html = html.replace(blockquote, (match) => {
        // console.log("blockquote match: ", match);
        const blockQuoteText = match.replace(/^>{1}/gm, "").replace(/^ /gm, "");
        // console.log("cleaned up blockquote match: ", blockQuoteText.replace(/\n/gm, "LINEFEED"));
        const blockquoteWithParagraphs = blockQuoteText.replace(/(^(?!>)[\S\s]+?(?=>{1,}|^\n)|^(?!>)[\S\s]+)/gm, (match) => {
            // console.log("paragraph match: ", match.replace(/\n/gm, "LINEFEED"));
            const blockquoteParagraphOneline = match.trim().replace(/\n/gm, " ");
            // console.log("paragraph oneline: ", blockquoteParagraphOneline.replace(/\n/gm, "LINEFEED"));
            return `<p>${blockquoteParagraphOneline}</p>\n`;
        })
        // console.log("blockquote with paragraphs: ", blockquoteWithParagraphs);
        let n = 0;
        let blockquoteWithParagraphsAndNestedBlockquotes = blockquoteWithParagraphs;
        // console.log("Before nested search: ", blockquoteWithParagraphsAndNestedBlockquotes);
        while (/(^>{1}[\S\s]*?(?=^(?!>)|<\/blockquote>)|^>{1}[\S\s]*)/m.test(blockquoteWithParagraphsAndNestedBlockquotes)) {
            if (n >= 50) break;
            blockquoteWithParagraphsAndNestedBlockquotes = blockquoteWithParagraphsAndNestedBlockquotes.replace(/(^>{1}[\S\s]*?(?=^(?!>)|<\/blockquote>)|^>{1}[\S\s]*)/m, (match) => {
                // console.log("nested blockquote match: ", match);
                const nestedBlockquoteText = match.replace(/^>{1}/gm, "").replace(/^ /gm, "");
                // console.log("cleaned up blockquote match: ", nestedBlockquoteText);
                const nestedBlockquoteParagraphs = nestedBlockquoteText.replace(/(^(?!>)[\S\s]+?(?=>{1,}|^\n)|^(?!>)[\S\s]+)/gm, (match) => {
                    // console.log("nested bockquote paragraph match: ", match);
                    const nestedBlockquoteParagraphOneline = match.trim().replace(/\n/gm, " ");
                    // console.log("nested blockquote paragraph oneline: ", nestedBlockquoteParagraphOneline);
                    return `<p>${nestedBlockquoteParagraphOneline}</p>\n`;
                })
                return `<blockquote>${nestedBlockquoteParagraphs}</blockquote>`;
            });

            n++;
        }

        return `<blockquote>${blockquoteWithParagraphsAndNestedBlockquotes}</blockquote>\n`;
    });

    // Ordered list
    html = html.replace(orderedList, (match) => {
        // console.log("ordered list match:", match);
        const listItemMatches = match.match(/(?:^ {0,2}\d\. +)[\s\S]*?(?=\n(?=^ {0,2}\d\. +))|(?:^ {0,2}\d\. +)[\s\S]*/gm);
        // console.log(listItemMatches);
        let listItems = "";
        listItemMatches.forEach((item) => {
            // console.log("list item match:", item.replace(/ /gm, "_"))
            const itemClean = item.replace(/\n(?!(?: {3,}|\t*)\d\. +)/gm, " ").replace(/^ {0,2}\d\. +/g, "");
            // console.log("list item clean:", itemClean.replace(/ /gm, "_"));
            let itemWithNestedList = itemClean;
            let loops = 0;
            while (/(?:^ {3,}|\t)\d\. +[\s\S]+?(?=\n(?=\d\.)|<\/li>)|(?:^ {3,}|\t)\d\. +[\s\S]+/m.test(itemWithNestedList)) {
                if (loops >= 50) break;
                itemWithNestedList = itemWithNestedList.replace(/(?:^ {3,}|\t)\d\. +[\s\S]+?(?=\n(?=\d\.)|<\/li>)|(?:^ {3,}|\t)\d\. +[\s\S]+/m, (match) => {
                    // console.log("nested list match:", match.replace(/ /gm, "_"));
                    const nestedListBody = match.replace(/^ {0,3}/gm, "").replace(/^\t/gm, "");
                    // console.log("nested list body:", nestedListBody.replace(/\t/gm, "_"));
                    const nestedListItemMatches = nestedListBody.match(/(?:^ {0,2}\d\. {1,})[\s\S]*?(?=\n(?= {0,2}\d\. +))|(?:^ {0,2}\d\. {1,})[\s\S]*/gm);
                    let nestedListItems = "";
                    
                    nestedListItemMatches.forEach((nestedListItem) => {
                        // console.log("nested list item", nestedListItem.replace(/ /gm, "_"));
                        const nestedListItemClean = nestedListItem.replace(/\n(?!(?: {3,}|\t*)\d\. +)/gm, " ").replace(/^ {0,2}\d\. +/g, "");
                        // console.log("nested list item clean: ", nestedListItemClean.replace(/ /gm, "_"));
                        nestedListItems += `<li>${nestedListItemClean}</li>`;
                    });
                    return `<ol>${nestedListItems}</ol>`;
                })

                loops++;
            }
            
            listItems += `<li>${itemWithNestedList}</li>`;
        });
        return `<ol>${listItems}</ol>\n`
    });

    // Unordered list
    html = html.replace(unorderedList, (match) => {
        // console.log("unordered list match: ", match);
        const listItemMatches = match.match(/(?:^ {0,1}- +)[\s\S]*?(?=\n(?=^ {0,1}- +))|(?:^ {0,1}- +)[\s\S]*/gm);
        // console.log(listItemMatches);
        let listItems = "";
        listItemMatches.forEach((item) => {
            // console.log("list item match:", item.replace(/ /gm, "_"));
            const itemClean = item.replace(/\n(?!(?: {2,}|\t*)- +)/gm, " ").replace(/^ {0,1}- +/g, "");
            // console.log("list item clean:", itemClean.replace(/ /gm, "_"));
            let itemWithNestedList = itemClean;
            let loops = 0;
            while (/(?:^ {2,}|\t)- +[\s\S]+?(?=\n(?=- )|<\/li>)|(?:^ {2,}|\t)- +[\s\S]+/m.test(itemWithNestedList)) {
                if (loops >= 50) break;
                itemWithNestedList = itemWithNestedList.replace(/(?:^ {2,}|\t)- +[\s\S]+?(?=\n(?=- )|<\/li>)|(?:^ {2,}|\t)- +[\s\S]+/m, (match) => {
                    console.log("nested list match:", match.replace(/ /gm, "_"));
                    const nestedListBody = match.replace(/^ {0,2}/gm, "").replace(/^\t/gm, "");
                    // console.log("nested list body:", nestedListBody.replace(/ /gm, "_"));
                    const nestedListItemMatches = nestedListBody.match(/(?:^ {0,1}- +)[\s\S]*?(?=\n(?=^ {0,1}- +))|(?:^ {0,1}- +)[\s\S]*/gm);
                    let nestedListItems = "";
                    
                    nestedListItemMatches.forEach((nestedListItem) => {
                        // console.log("nested list item:", nestedListItem.replace(/ /gm, "_"));
                        const nestedListItemClean = nestedListItem.replace(/\n(?!(?: {2,}|\t*)- +)/gm, " ").replace(/^ {0,1}- +/g, "");
                        // console.log("nested list item clean:", nestedListItemClean.replace(/ /gm, "_"));
                        nestedListItems += `<li>${nestedListItemClean}</li>`;
                    });

                    return `<ul>${nestedListItems}</ul>`;
                })
                loops++;
            }
            listItems += `<li>${itemWithNestedList}</li>`;
        });
        return `<ul>${listItems}</ul>\n`;
    });

    // console.log(html)

    // Paragraphs
    html = html.replace(paragraph, (match) => {
        // console.log("paragraph match: ", match);
        const paragraphWithLinebreaks = match.replace(linebreak, "$1<br>");
        // console.log("paragraph with linebreaks: ", paragraphWithLinebreaks);
        const paragraphClean = paragraphWithLinebreaks.trim().replace(/\n/gm, " ");
        // console.log("p clean: ", paragraphClean);
        
        return `<p>${paragraphClean}</p>\n`;
    });

    // Exclude codeblocks from inline element parsing
    html = html.replace(/^(?! {4,})(.*)/gm, (match, lineText) => {
        
        lineText = lineText.replace(bold, "<b>$1</b>");        
        lineText = lineText.replace(bold2, "<b>$1</b>");
        lineText = lineText.replace(italics, "<i>$1</i>");       
        lineText = lineText.replace(italics2, "<i>$1</i>");
        lineText = lineText.replace(strikethrough, "<s>$1</s>");
        lineText = lineText.replace(code, (match, group) => {
            group = group.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
            return `<code>${group}</code>`
        });
        // console.log("line text: ", lineText);

        return lineText;
    });

    // Codeblock
    html = html.replace(codeblock, (match) => {
        // console.log("codeblock match: ", match);
        const trimmedMatch = match.replace(/ {4,}|\t/gm, "");
        const escaped = trimmedMatch.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
        return `<pre><code>${escaped}</code></pre>`;
    });
    
    console.log(html);

    return html;
}


editor.addEventListener("input", (event) => {
    try {
        const html = parseMarkdown(event.target.value)
        preview.innerHTML = html;
    } catch (err) {
        const referral = document.createElement("p");
            const link = document.createElement("a");
            link.textContent = "https:/github.com/jozdk/simple-markdown-parser";
            link.href = "https:/github.com/jozdk/simple-markdown-parser";
            referral.style.color = "red";
            referral.append("For a complete list of supported syntax, go to ", link);
        if (err.message === "nestedOLItemMatches is null") {
            preview.innerHTML = "";
            const alert = document.createElement("h2");
            alert.textContent = "Sorry, your ordered list could not be parsed";
            alert.style.color = "red";
            const message = document.createElement("p");
            message.textContent = "Please make sure that list items are not indented by more than 5 spaces per nesting level"
            message.style.color = "red";
            preview.append(alert, message, referral);
        } else if (err.message === "nestedULItemMatches is null") {
            preview.innerHTML = "";
            const alert = document.createElement("h2");
            alert.textContent = "Sorry, your unordered list could not be parsed";
            alert.style.color = "red";
            const message = document.createElement("p");
            message.textContent = "Please make sure that list items are not indented by more than 4 spaces per nesting level"
            message.style.color = "red";
            preview.append(alert, message, referral);
        } else {
            preview.innerHTML = "";
            const alert = document.createElement("h2");
            alert.textContent = "Sorry, your markdown text could not be parsed";
            alert.style.color = "red";
            preview.append(alert, referral);
        }
    }
});