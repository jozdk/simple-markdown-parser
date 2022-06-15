const editor = document.querySelector("#editor");
const preview = document.querySelector("#preview");

// Headings
const h1 = /^ {0,3}#\s(.*)$/gm;
const h2 = /^ {0,3}##\s(.*)$/gm;
const h3 = /^ {0,3}###\s(.*)$/gm;
const h4 = /^ {0,3}####\s(.*)$/gm;
const h5 = /^ {0,3}#####\s(.*)$/gm;
const h6 = /^ {0,3}######\s(.*)$/gm;
// const altH1 = /(\w+)\n={1,} *$/gm;
// const altH2 = /(\w+)\n-{1,} *$/gm;

const horizontalRule = /^(?:-|\*|_){3,}? *$/gm;

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
const paragraph = /(^(?!<h(?:1|2|3|4|6|r)>|<blockquote>|<\/blockquote>|<p>|<ol>|<ul>|( {4,}|\t)| *\n)[\S\s]+?(?=<h(?:1|2|3|4|6|r)>|<blockquote>|<\/blockquote>|<p>|<ol>|<ul>|^ *\n)|^(?!<h(?:1|2|3|4|6|r)>|<blockquote>|<\/blockquote>|<p>|<ol>|<ul>|( {4,}|\t)| *\n)[\S\s]+)/gm;

// Codeblock
const codeblock = /(^(?:( {4,}|\t))[\S\s]+?(?=\n<p>|<h(?:1|2|3|4|5|6|r)>|<blockquote>|<\/blockquote>|<ol>|<ul>|^ *\n)|^(?:( {4,}|\t))[\S\s]+)/gm;

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
const code = /`(.+?)`/gm;

function parseMarkdown(mdText) {
    const cache = { images: [], links: [], inlineCode: [] };
    let html;

    // Headings
    html = mdText.replace(h1, "<h1>$1</h1>")
        .replace(h2, "<h2>$1</h2>")
        .replace(h3, "<h3>$1</h3>")
        .replace(h4, "<h4>$1</h4>")
        .replace(h5, "<h5>$1</h5>")
        .replace(h6, "<h6>$1</h6>")
        // .replace(altH1, "<h1>$1</h1>")
        // .replace(altH2, "<h2>$1</h2>")
    
    // Horizonzal rule
    html = html.replace(horizontalRule, "<hr>");

    // Link + Image
    // html = html.replace(image, "<img src='$2' alt='$1'>");
    cache.images = [...html.matchAll(image)];
    cache.images.forEach((image, index) => {
        const id = Math.random();
        image["id"] = id;
        html = html.replace(image[0], `image-placeholder-${id}`);
    });

    cache.links = [...html.matchAll(link)];
    cache.links.forEach((link) => {
        const id = Math.random();
        link["id"] = id;
        html = html.replace(link[0], `link-placeholder-${id}`);
    })
    // html = html.replace(link, "<a href='$2'>$1</a>");

    // Extended feature: Image with capture
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
                    const nestedOLItemMatches = nestedListBody.match(/(?:^ {0,2}\d\. {1,})[\s\S]*?(?=\n(?= {0,2}\d\. +))|(?:^ {0,2}\d\. {1,})[\s\S]*/gm);
                    let nestedListItems = "";
                    
                    nestedOLItemMatches.forEach((nestedListItem) => {
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
                    // console.log("nested list match:", match.replace(/ /gm, "_"));
                    const nestedListBody = match.replace(/^ {0,2}/gm, "").replace(/^\t/gm, "");
                    // console.log("nested list body:", nestedListBody.replace(/ /gm, "_"));
                    const nestedULItemMatches = nestedListBody.match(/(?:^ {0,1}- +)[\s\S]*?(?=\n(?=^ {0,1}- +))|(?:^ {0,1}- +)[\s\S]*/gm);
                    let nestedListItems = "";
                    
                    nestedULItemMatches.forEach((nestedListItem) => {
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

    // Exclude codeblocks from inline element parsing
    // html = html.replace(/^(?! {4,})(.*)/gm, (match, lineText) => {
    //     lineText = lineText.replace(bold, "<b>$1</b>");        
    //     lineText = lineText.replace(bold2, "<b>$1</b>");
    //     lineText = lineText.replace(italics, "<i>$1</i>");       
    //     lineText = lineText.replace(italics2, "<i>$1</i>");
    //     lineText = lineText.replace(strikethrough, "<s>$1</s>");
    //     // lineText = lineText.replace(code, (match, group) => {
    //     //     group = group.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
    //     //     return `<code>${group}</code>`
    //     // });

    //     // console.log("line text: ", lineText);

    //     return lineText;
    // });

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

    // Codeblock
    // html = html.replace(codeblock, (match) => {
    //     // console.log("codeblock match: ", match);
    //     const trimmedMatch = match.replace(/ {4,}|\t/gm, "");
    //     const escaped = trimmedMatch.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
    //     return `<pre><code>${escaped}</code></pre>`;
    // });
    cache.codeblocks = [...html.matchAll(codeblock)];
    cache.codeblocks.forEach((codeblock) => {
        console.log(codeblock);
        const id = Math.random();
        codeblock["id"] = id;
        html = html.replace(codeblock[0], `codeblock-placeholder-${id}`);
    });

    // Inline Code
    cache.inlineCode = [...html.matchAll(code)];
    cache.inlineCode.forEach((inlineCode) => {
        const id = Math.random();
        inlineCode["id"] = id;
        inlineCode[1] = inlineCode[1].replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
        html = html.replace(inlineCode[0], `inline-code-placeholder-${id}`);
    });

    // Other inline elements
    html = html.replace(bold, "<b>$1</b>")
        .replace(bold2, "<b>$1</b>")
        .replace(italics, "<i>$1</i>")
        .replace(italics2, "<i>$1</i>")
        .replace(strikethrough, "<s>$1</s>");

    cache.links.forEach((link) => {
        if (link) {
            html = html.replace(`link-placeholder-${link.id}`, `<a href=${link[2]}>${link[1]}</a>`);
        }
    })
    cache.images.forEach((image) => {
        if (image) {
            html = html.replace(`image-placeholder-${image.id}`, `<img alt=${image[1]} src=${image[2]}>`);
        }
    })
    cache.inlineCode.forEach((inlineCode) => {
        if (inlineCode) {
            html = html.replace(`inline-code-placeholder-${inlineCode.id}`, `<code>${inlineCode[1]}</code>`);
        }
    })
    cache.codeblocks.forEach((codeblock) => {
        if (codeblock) {
            console.log(codeblock.id)
            codeblock[0] = codeblock[0].replace(/ {4,}|\t/gm, "").replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
            html = html.replace(`codeblock-placeholder-${codeblock.id}`, `<pre><code>${codeblock[0]}</code></pre>`);
        }
    })

    // console.log(html);

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