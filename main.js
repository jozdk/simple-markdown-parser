const editor = document.querySelector("#editor");
const preview = document.querySelector("#preview");
const editorForm = document.querySelector("#editor-form");
// const submitButton = document.querySelector("#show-markdown-btn");


function parseMarkdown(mdText) {
    //console.log(mdText);

    // let re = /##\s(.*)$/m;
    // let match = mdText.match(re);

    // console.log(match);

    // let html = mdText.replace(match[0], `<h1>${match[1]}</h1>`);

    // preview.innerHTML = html;


    let h1 = /^ {0,3}#\s(.*)$/gm;
    //console.log(mdText.match(h1), mdText.match(h1)[1]);
    let html = mdText.replace(h1, "<h1>$1</h1>");

    //preview.innerHTML = html;

    let h2 = /^ {0,3}##\s(.*)$/gm;
    html = html.replace(h2, "<h2>$1</h2>");

    let h3 = /^ {0,3}###\s(.*)$/gm;
    html = html.replace(h3, "<h3>$1</h3>");

    const h4 = /^ {0,3}####\s(.*)$/gm;
    html = html.replace(h4, "<h4>$1</h4>");

    const h5 = /^ {0,3}#####\s(.*)$/gm;
    html = html.replace(h5, "<h5>$1</h5>");

    const h6 = /^ {0,3}######\s(.*)$/gm;
    html = html.replace(h6, "<h6>$1</h6>");

    // let altH1 = /(.*)\n={4,}$/gim
    // html = html.replace(altH1, "<h1 style='margin-bottom: 0;'>$1</h1><hr style='margin: 0 0 0.67em 0; background-color: #ccc; height: 1px; border: none;'>");

    // let altH2 = /(.*)\n-{4,}$/gim;
    // html = html.replace(altH2, "<h2 style='margin-bottom: 0;'>$1</h2><hr style='margin: 0 0 0.67em 0; background-color: #ccc; height: 1px; border: none;'>");

    let altH1 = /(.*)\n={4,}$/gm
    html = html.replace(altH1, "<h1 style='border-bottom: 1px solid lightgrey; margin-bottom: 0.5em;'>$1</h1>");

    let altH2 = /(.*)\n-{4,}$/gm;
    html = html.replace(altH2, "<h2 style='border-bottom: 1px solid lightgrey; margin-bottom: 0.5em;'>$1</h2>");

    // Exclude code blocks from inline elements search
    // html = html.replace(/^(?! {4,})(.*)/gm, (match, lineText) => {
    //     let bold = /\*\*(.+?)\*\*/gm;
    //     lineText = lineText.replace(bold, "<b>$1</b>");

    //     let bold2 = /__(.+?)__/gm;
    //     lineText = lineText.replace(bold2, "<b>$1</b>");

    //     let italics = /\*(.+?)\*/gm;
    //     lineText = lineText.replace(italics, "<i>$1</i>");

    //     let italics2 = /_(.+?)_/gm;
    //     lineText = lineText.replace(italics2, "<i>$1</i>");

    //     let strikethrough = /~~(.+?)~~/gm;
    //     lineText = lineText.replace(strikethrough, "<s>$1</s>");

    //     let code = /`(.*?)`/gm;
    //     lineText = lineText.replace(code, (match, group) => {
    //         group = group.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
    //         return `<code>${group}</code>`
    //     });

    //     // console.log("line text: ", lineText);
    //     return lineText;
    // })

    // console.log("html with line replacement:\n", html);

    // let code = /`(.*?)`/gm;
    // html = html.replace(code, (match, group) => {
    //     group = group.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
    //     return `<code>${group}</code>`
    // });

    // let bold = /\*\*(.+?)\*\*/gm;
    // html = html.replace(bold, "<b>$1</b>");

    // let bold2 = /__(.+?)__/gm;
    // html = html.replace(bold2, "<b>$1</b>");

    // let italics = /\*(.+?)\*/gm;
    // html = html.replace(italics, "<i>$1</i>");

    // let italics2 = /_(.+?)_/gm;
    // html = html.replace(italics2, "<i>$1</i>");

    // let strikethrough = /~~(.+?)~~/gm;
    // html = html.replace(strikethrough, "<s>$1</s>");


    // let linebreak = /(^(?!>).*?) {2,}\n/gm;
    // html = html.replace(linebreak, "$1<br>");



    // [Linktext/URL in eins]
    // let link = /\[(.*?)\]/gim;
    // html = html.replace(link, "<a href='$1.html'>$1</a>");

    // ![alt text|figcaption text](URL)
    let imageWithCaption = /!\[(.*?)\|(.*?)\]\((.*?)\)/gm;
    html = html.replace(imageWithCaption, "<figure class='float-right'><img src='$3' alt='$1'></img><figcaption>$2</figcaption></figure>");

    let image = /!\[(.*?)\]\((.*?)\)/gm;
    //html = html.replace(image, "<figure class='float-right'><img src='$2' alt='$1'></figure>");
    html = html.replace(image, "<img src='$2' alt='$1'>")

    // [Link text](URL)
    let link = /(?<!!)\[(.*?)\]\((.*?)\)/gm;
    html = html.replace(link, "<a href='$2'>$1</a>");

    // Blockquotes
    const blockquote = /(^>{1}[\S\s]*?(?=^(?!>))|^>{1}[\S\s]*)/gm;
    html = html.replace(blockquote, (match) => {
        console.log("blockquote match: ", match);
        const blockQuoteText = match.replace(/^>{1}/gm, "").replace(/^ /gm, "");
        console.log("cleaned up blockquote match: ", blockQuoteText.replace(/\n/gm, "LINEFEED"));
        const blockquoteWithParagraphs = blockQuoteText.replace(/(^(?!>)[\S\s]+?(?=>{1,}|^\n)|^(?!>)[\S\s]+)/gm, (match) => {
            console.log("paragraph match: ", match.replace(/\n/gm, "LINEFEED"));
            const blockquoteParagraphOneline = match.trim().replace(/\n/gm, " ");
            console.log("paragraph oneline: ", blockquoteParagraphOneline.replace(/\n/gm, "LINEFEED"));
            return `<p>${blockquoteParagraphOneline}</p>\n`;
        })
        console.log("blockquote with paragraphs: ", blockquoteWithParagraphs);
        let n = 0;
        let blockquoteWithParagraphsAndNestedBlockquotes = blockquoteWithParagraphs;
        console.log("Before nested search: ", blockquoteWithParagraphsAndNestedBlockquotes);
        while (/(^>{1}[\S\s]*?(?=^(?!>)|<\/blockquote>)|^>{1}[\S\s]*)/m.test(blockquoteWithParagraphsAndNestedBlockquotes)) {
            if (n >= 50) break;
            blockquoteWithParagraphsAndNestedBlockquotes = blockquoteWithParagraphsAndNestedBlockquotes.replace(/(^>{1}[\S\s]*?(?=^(?!>)|<\/blockquote>)|^>{1}[\S\s]*)/m, (match) => {
                console.log("nested blockquote match: ", match);
                const nestedBlockquoteText = match.replace(/^>{1}/gm, "").replace(/^ /gm, "");
                console.log("cleaned up blockquote match: ", nestedBlockquoteText);
                const nestedBlockquoteParagraphs = nestedBlockquoteText.replace(/(^(?!>)[\S\s]+?(?=>{1,}|^\n)|^(?!>)[\S\s]+)/gm, (match) => {
                    console.log("nested bockquote paragraph match: ", match);
                    const nestedBlockquoteParagraphOneline = match.trim().replace(/\n/gm, " ");
                    console.log("nested blockquote paragraph oneline: ", nestedBlockquoteParagraphOneline);
                    return `<p>${nestedBlockquoteParagraphOneline}</p>\n`;
                })
                return `<blockquote>${nestedBlockquoteParagraphs}</blockquote>`;
            });

            n++;
        }

        return `<blockquote>${blockquoteWithParagraphsAndNestedBlockquotes}</blockquote>\n`;
    })

    // Ordered list
    let orderedList = /^\d\.[\S\s]*?(?=^ *\n^(?!( *\d\.| *\n))|^- )|^\d\.[\S\s]*/gm;
    html = html.replace(orderedList, (match) => {
        // const listBody = match.replace(/^ {3}/gm, "");
        // console.log("whole list body:", listBody);
        //const listItemMatches = match.match(/(?<=\d\.)[\s\S]+?(?=\n(?=\d\. +))|(?<=\d\.)[\s\S]+/gm);
        // const listBody = match.replace(/^ {0,3}/gm, "");
        // console.log("list body: ", listBody.replace(/ /gm, "_"))
        console.log("ordered list match:", match);
        const listItemMatches = match.match(/(?:^ {0,2}\d\. +)[\s\S]*?(?=\n(?=^ {0,2}\d\. +))|(?:^ {0,2}\d\. +)[\s\S]*/gm);
        console.log(listItemMatches);
        let listItems = "";
        listItemMatches.forEach((item) => {
            console.log("list item match:", item.replace(/ /gm, "_"))
            const itemClean = item.replace(/\n(?! {3,}\d\. +)/gm, " ").replace(/^ {0,2}\d\. +/g, "");
            console.log("list item clean:", itemClean.replace(/ /gm, "_"));
            let itemWithNestedList = itemClean;
            let loops = 0;
            while (/(?:^ {3,}|\t)\d\. +[\s\S]+?(?=\n(?=\d\.)|<\/li>)|(?:^ {3,}|\t)\d\. +[\s\S]+/m.test(itemWithNestedList)) {
                if (loops >= 50) break;
                itemWithNestedList = itemWithNestedList.replace(/(?:^ {3,}|\t)\d\. +[\s\S]+?(?=\n(?=\d\.)|<\/li>)|(?:^ {3,}|\t)\d\. +[\s\S]+/m, (match) => {
                    console.log("nested list match:", match.replace(/ /gm, "_"));
                    const nestedListBody = match.replace(/^ {0,3}/gm, "");
                    console.log("nested list body:", nestedListBody.replace(/ /gm, "_"));
                    //const nestedListItemMatches = nestedListBody.match(/(?<=\d\.)[\s\S]+?(?=\n(?=\d\. +))|(?<=\d\.)[\s\S]+/gm);
                    const nestedListItemMatches = nestedListBody.match(/(?:^ {0,2}\d\. {1,})[\s\S]*?(?=\n(?= {0,2}\d\. +))|(?:^ {0,2}\d\. {1,})[\s\S]*/gm);
                    let nestedListItems = "";
                    
                    nestedListItemMatches.forEach((nestedListItem) => {
                        console.log("nested list item", nestedListItem.replace(/ /gm, "_"));
                        const nestedListItemClean = nestedListItem.replace(/\n(?! {3,}\d\. +)/gm, " ").replace(/^ {0,2}\d\. +/g, "");
                        console.log("nested list item clean: ", nestedListItemClean.replace(/ /gm, "_"));
                        nestedListItems += `<li>${nestedListItemClean}</li>`;
                    });
                    return `<ol>${nestedListItems}</ol>`;
                })

                // itemWithNestedList = `<ol>${nestedListItems}</ol>`;

                loops++;
            }
            
            listItems += `<li>${itemWithNestedList}</li>`;
        });
        return `<ol>${listItems}</ol>\n`
    })

    // Unordered list
    let unorderedList = /^- [\S\s]*?(?=^ *\n^(?!( *- | *\n))|^\d\. )|^- [\S\s]*/gm;
    html = html.replace(unorderedList, (match) => {
        console.log("unordered list match: ", match);
        const listItemMatches = match.match(/(?:^ {0,1}- +)[\s\S]*?(?=\n(?=^ {0,1}- +))|(?:^ {0,1}- +)[\s\S]*/gm);
        console.log(listItemMatches);
        let listItems = "";
        listItemMatches.forEach((item) => {
            console.log("list item match:", item.replace(/ /gm, "_"));
            const itemClean = item.replace(/\n(?! {2,}- +)/gm, " ").replace(/^ {0,1}- +/g, "");
            console.log("list item clean:", itemClean.replace(/ /gm, "_"));
            let itemWithNestedList = itemClean;
            let loops = 0;
            while (/(?:^ {2,}|\t)- +[\s\S]+?(?=\n(?=- )|<\/li>)|(?:^ {2,}|\t)- +[\s\S]+/m.test(itemWithNestedList)) {
                if (loops >= 50) break;
                itemWithNestedList = itemWithNestedList.replace(/(?:^ {2,}|\t)- +[\s\S]+?(?=\n(?=- )|<\/li>)|(?:^ {2,}|\t)- +[\s\S]+/m, (match) => {
                    console.log("nested list match:", match.replace(/ /gm, "_"));
                    const nestedListBody = match.replace(/^ {0,2}/gm, "");
                    console.log("nested list body:", nestedListBody.replace(/ /gm, "_"));
                    const nestedListItemMatches = nestedListBody.match(/(?:^ {0,1}- +)[\s\S]*?(?=\n(?=^ {0,1}- +))|(?:^ {0,1}- +)[\s\S]*/gm);
                    let nestedListItems = "";
                    
                    nestedListItemMatches.forEach((nestedListItem) => {
                        console.log("nested list item:", nestedListItem.replace(/ /gm, "_"));
                        const nestedListItemClean = nestedListItem.replace(/\n(?! {2,}- +)/gm, " ").replace(/^ {0,1}- +/g, "");
                        console.log("nested list item clean:", nestedListItemClean.replace(/ /gm, "_"));
                        nestedListItems += `<li>${nestedListItemClean}</li>`;
                    });

                    return `<ul>${nestedListItems}</ul>`;
                })
                loops++;
            }
            listItems += `<li>${itemWithNestedList}</li>`;
        });
        return `<ul>${listItems}</ul>\n`;
    })

    // console.log(html)

    let paragraph = /(^(?!<h2|<h1|<h3|<h4|<h5|<h6|<figure|<blockquote|<\/blockquote>|<p|<ol|<ul|( {4,}|\t)| *\n)[\S\s]+?(?=<blockquote>|^ *\n)|^(?!<h2|<h1|<h3|<h4|<h5|<h6|<figure|<blockquote|<\/blockquote>|<p|<ol|<ul|( {4,}|\t)| *\n)[\S\s]+)/gm;
    // html = html.replace(paragraph, `<p>$1</p>\n`);
    html = html.replace(paragraph, (match) => {
        console.log("paragraph match: ", match);
        let linebreak = /(^(?!>).*?) {2,}\n/gm;
        const paragraphWithLinebreaks = match.replace(linebreak, "$1<br>");
        console.log("paragraph with linebreaks: ", paragraphWithLinebreaks)

        const paragraphClean = paragraphWithLinebreaks.trim().replace(/\n/gm, " ");
        console.log("p clean: ", paragraphClean);
        
        return `<p>${paragraphClean}</p>\n`;
    });

    html = html.replace(/^(?! {4,})(.*)/gm, (match, lineText) => {
        let bold = /\*\*(.+?)\*\*/gm;
        lineText = lineText.replace(bold, "<b>$1</b>");

        let bold2 = /__(.+?)__/gm;
        lineText = lineText.replace(bold2, "<b>$1</b>");

        let italics = /\*(.+?)\*/gm;
        lineText = lineText.replace(italics, "<i>$1</i>");

        let italics2 = /_(.+?)_/gm;
        lineText = lineText.replace(italics2, "<i>$1</i>");

        let strikethrough = /~~(.+?)~~/gm;
        lineText = lineText.replace(strikethrough, "<s>$1</s>");

        let code = /`(.*?)`/gm;
        lineText = lineText.replace(code, (match, group) => {
            group = group.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
            return `<code>${group}</code>`
        });

        // console.log("line text: ", lineText);
        return lineText;
    })

    // let codeBlock = /(^(?=( {4,}|\t))[\S\s]+?(?:(?!(\n<p>){1}).)*|^(?=( {4,}|\t))[\S\s]+)/gm
    let codeblock = /(^(?:( {4,}|\t))[\S\s]+?(?=\n<p>|<h2|<h1|<h3|<h4|<h5|<h6|<figure|<blockquote|<\/blockquote>|<ol|<ul|^ *\n)|^(?:( {4,}|\t))[\S\s]+)/gm;
    html = html.replace(codeblock, (match) => {
        console.log("codeblock match: ", match);
        const trimmedMatch = match.replace(/ {4,}|\t/gm, "");
        const escaped = trimmedMatch.replace(/(<)/gm, "&lt;").replace(/(>)/gm, "&gt;");
        return `<pre><code>${escaped}</code></pre>`;
    })
    // html = html.replace(codeBlock, (match) => {
    //     const codeBlockContent = match.replace(/\n/gm, "");
    //     console.log("codeblock content: ", codeBlockContent);
    //     return `<pre><code>${codeBlockContent}</code></pre>`
    // })



    // let emptyLine = /^ *\n/gm;
    // html = html.replace(emptyLine, "");

    // console.log("cleaned up (hopefully):\n", html);

    









    //   Kopie der aktuellen Version:
    //   let paragraph = /(^(?!<h2|<h1)[\S\s]+?^\n|^(?!<h2|<h1)[\S\s]+)/gm;
    //   html = html.replace(paragraph, `<p>$1</p>
    // `);

    // /(^(?!<h2|<h1)[\S\s]+?^\n|^(?!<h2|<h1)[\S\s]+)/gm;






    //     let paragraph = /(^(?!<h2|<h1)[\S\s]+?\n\n|^(?!<h2|<h1)[\S\s]+?\Z)/gm;
    //     html = html.replace(paragraph, `<p>$1</p>
    // `);

    // let lastParagraph = /((?<=\n)[\S\s]+?)$/g;
    // html = html.replace(lastParagraph, `<p>$1</p>`);

    // let paragraph = /([\S\s]+?)\n\n/gm;
    // html = html.replace(paragraph, `<p>$1</p>`);

    // let lastParagraph = /((?<=\n)[\S\s]+?)$/g;
    // html = html.replace(lastParagraph, `<p>$1</p>`);


    //let paragraph = /(?<=^|\/h2>|\/h1>|\/p>)(^(?!<h2|<h1)[\S\s]+?)/gm;

    //^(?!<h2|<h1)

    // let newParagraph = 
    // html = html.replace(newParagraph, "<p>$1</p>");


    // let newParagraph = /(?<=\n)(.+)/gm;
    // html = html.replace(newParagraph, );



    // let newParagraph = /^\s+/gm;
    // html = html.replace()

    ///(.*)\n^\n/gm


    // !\[(.*?)\|(.*?)\]\((.*?)\)|\[(.*?)\]\((.*?)\)


    console.log(html);






    preview.innerHTML = html;

}


// editorForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     parseMarkdown(editor.value)
// });

// submitButton.addEventListener("click", () => {
//     parseMarkdown(editor.value);
// })

editor.addEventListener("input", (event) => {
    parseMarkdown(event.target.value)
})


/*let re = /##\s(\w.*)\n/ */



//let h1 = /#\s(.*)\n/;

//let h2 = /##\s(.*)\n/;


// let altH1 = /(.*)\n======\n/
//     html = html.replace(altH1, "<h1 style='margin-bottom: 0;'>$1</h1><hr style='margin: 0 0 0.67em 0; background-color: #ccc; height: 1px; border: none;'>");


// let doubleLinebreak = /\n\n/gim;
// html = html.replace(doubleLinebreak, "<br><br>");