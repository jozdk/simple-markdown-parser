const editor = document.querySelector("#editor");
const preview = document.querySelector("#preview");
const editorForm = document.querySelector("#editor-form");
const submitButton = document.querySelector("#show-markdown-btn");


function parseMarkdown(mdText) {
    //console.log(mdText);

    // let re = /##\s(.*)$/m;
    // let match = mdText.match(re);

    // console.log(match);

    // let html = mdText.replace(match[0], `<h1>${match[1]}</h1>`);

    // preview.innerHTML = html;


    let h1 = /^#\s(.*)$/gm;
    //console.log(mdText.match(h1), mdText.match(h1)[1]);
    let html = mdText.replace(h1, "<h1>$1</h1>");

    //preview.innerHTML = html;

    let h2 = /^##\s(.*)$/gm;
    html = html.replace(h2, "<h2>$1</h2>");

    let h3 = /^###\s(.*)$/gm;
    html = html.replace(h3, "<h3>$1</h3>");

    const h4 = /^####\s(.*)$/gm;
    html = html.replace(h4, "<h4>$1</h4>");

    const h5 = /^#####\s(.*)$/gm;
    html = html.replace(h5, "<h5>$1</h5>");

    const h6 = /^######\s(.*)$/gm;
    html = html.replace(h6, "<h6>$1</h6>");

    // let altH1 = /(.*)\n={4,}$/gim
    // html = html.replace(altH1, "<h1 style='margin-bottom: 0;'>$1</h1><hr style='margin: 0 0 0.67em 0; background-color: #ccc; height: 1px; border: none;'>");

    // let altH2 = /(.*)\n-{4,}$/gim;
    // html = html.replace(altH2, "<h2 style='margin-bottom: 0;'>$1</h2><hr style='margin: 0 0 0.67em 0; background-color: #ccc; height: 1px; border: none;'>");

    let altH1 = /(.*)\n={4,}$/gm
    html = html.replace(altH1, "<h1 style='border-bottom: 1px solid lightgrey; margin-bottom: 0.5em;'>$1</h1>");

    let altH2 = /(.*)\n-{4,}$/gm;
    html = html.replace(altH2, "<h2 style='border-bottom: 1px solid lightgrey; margin-bottom: 0.5em;'>$1</h2>");

    let bold = /\*\*(.*?)\*\*/gm;
    html = html.replace(bold, "<b>$1</b>");

    let italics = /\*(.*?)\*/gm;
    html = html.replace(italics, "<i>$1</i>");

    let code = /`(.*?)`/gm;
    html = html.replace(code, "<code>$1</code>")

    let linebreak = /^(?!>).* {2,}\n/gm;
    html = html.replace(linebreak, "<br>");

    // [Link text](URL)
    let link = /(?<!!)\[(.*?)\]\((.*?)\)/gm;
    html = html.replace(link, "<a href='$2'>$1</a>");

    // [Linktext/URL in eins]
    // let link = /\[(.*?)\]/gim;
    // html = html.replace(link, "<a href='$1.html'>$1</a>");

    // ![alt text|figcaption text](URL)
    let imageWithCaption = /!\[(.*?)\|(.*?)\]\((.*?)\)/gm;
    html = html.replace(imageWithCaption, "<figure class='float-right'><img src='$3' alt='$1'></img><figcaption>$2</figcaption></figure>");

    let image = /!\[(.*?)\]\((.*?)\)/gm;
    html = html.replace(image, "<figure class='float-right'><img src='$2' alt='$1'></figure>");



    // Blockquotes
    const blockquote = /(^>{1}[\S\s]*?(?=^(?!>))|^>{1}[\S\s]*)/gm;
    // html = html.replace(blockquote, `<blockquote>$1</blockquote>`);
    // html = html.replace(blockquote, (match) => {
    //     console.log("blockquote match: ", match);
    //     // const blockQuoteText = match.replace(/^>\s/, "").replace(/\n/gm, " ");
    //     const blockQuoteText = match.replace(/\n(?!>)/gm, " ");
    //     console.log("cleaned up blockquote match: ", blockQuoteText);
    //     // let blockquoteWithParagraphs = blockQuoteText.replace(/(?<=^> )([\S\s]*?(?=^\n|^>(?! *\S)|>{2,}){1}|[\S\s>]*)/gm, (match) => {
    //     //     const paragraphText = match.replace(/(?<!b|i|>)>/gm, "").trim().replace(/\n(?!>)/gm, "");
    //     //     console.log("paragraph text: ", paragraphText)
    //     //     // console.log("paragraph text inside quote: ", paragraphText);
    //     //     if (paragraphText) {
    //     //         return `<p>${paragraphText}</p>\n`;
    //     //     } else {
    //     //         return "";
    //     //     }
    //     // });
    //     let blockquoteWithParagraphs2 = blockQuoteText;
    //     let maxLoops = 0;
    //     while (/(^>[\S\s]*?(?=^\n|^>(?! *\S)|>{2,}){1}|^>{1}[\S\s]*)/m.test(blockQuoteText)) {
    //         if (maxLoops >= 100) break;
    //         blockquoteWithParagraphs2 = blockquoteWithParagraphs2.replace(/(^>[\S\s]*?(?=^\n|^>(?! *\S)){1}|^>{1}[\S\s]*)/m, (match) => {
    //             console.log("bq paragraph match: ", match)
    //             const paragraphText = match.replace(/(?<!b|i|>)>/gm, "").trim().replace(/\n/gm, "");
    //             console.log("bq paragraph text: ", paragraphText);
    //             if (paragraphText) {
    //                 return `<p>${paragraphText}</p>\n`;
    //             } else {
    //                 return "";
    //             }
    //         })
    //         maxLoops++;
    //     }
    //     console.log("blockquote with paragraphs: ", blockquoteWithParagraphs2);
    //     let max = 0;
    //     // while (/(^>{1}[\S\s]*?(?=^(?!>))|^>{1}[\S\s]*)/gm.test(blockquoteWithParagraphs)) {
    //     //     if (max >= 10) break;

    //     //     blockquoteWithParagraphs = blockquoteWithParagraphs.replace(/(^>{1}[\S\s]*?(?=^(?!>))|^>{1}[\S\s]*)/gm, (match) => {
    //     //         console.log("nested blockquote match: ", match);
    //     //         console.log("nested blockquote: ", parseNestedBlockquotes(match));
    //     //         return parseNestedBlockquotes(match);
    //     //     });
    //     //     max++;
    //     // }

    //     // console.log("blockquote text with paragraphs (hopefully): ", blockquoteWithParagraphs)
    //     return (
    //         `<blockquote>${blockquoteWithParagraphs2}</blockquote>\n`
    //     );
    // })

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
    let orderedList = /\d\.[\S\s]*?(?=^\n|^- |^ {4,}|\t)|\d\.[\S\s]*/gm;
    html = html.replace(orderedList, (match) => {
        const matches = match.match(/(?<=\d\.)[\s\S]+?(?=\n(?=\d\.))|(?<=\d\.)[\s\S]*/gm);
        console.log(matches);
        let listItems = "";
        matches.forEach((item) => {
            const itemClean = item.replace(/\n/gm, " ");
            listItems += `<li>${itemClean}</li>`
        });
        return `<ol>${listItems}</ol>\n`
    })

    // Unordered list
    let unorderedList = /- [\S\s]+?(?=^\n|^<ol>|^ {4,}|\t)|- [\S\s]+/gm;
    html = html.replace(unorderedList, (match) => {
        console.log("unordered list match: ", match);
        const matches = match.match(/(?<=-)[\s\S]+?(?=\n(?=-))|(?<=-)[\s\S]*/gm);
        let listItems = "";
        matches.forEach((item) => {
            const cleanItem = item.replace(/\n/gm, " ");
            listItems += `<li>${cleanItem}</li>`
        });
        return `<ul>${listItems}</ul>\n`;
    })

    console.log(html)

    let paragraph = /(^(?!<h2|<h1|<figure|<blockquote|<\/blockquote>|<p|<ol|<ul|( {4,}|\t)|\n)[\S\s]+?(?=<blockquote>|^\n)|^(?!<h2|<h1|<figure|<blockquote|<\/blockquote>|<p|<ol|<ul|( {4,}|\t)|\n)[\S\s]+)/gm;
    // html = html.replace(paragraph, `<p>$1</p>\n`);
    html = html.replace(paragraph, (match) => {
        console.log("paragraph match: ", match);
        const paragraphText = match.trim();
        console.log("paragraph text: ", paragraphText);
        return `<p>${paragraphText}</p>\n`;
    });

    // let codeBlock = /(^(?=( {4,}|\t))[\S\s]+?(?:(?!(\n<p>){1}).)*|^(?=( {4,}|\t))[\S\s]+)/gm
    let codeblock = /(^(?:( {4,}|\t))[\S\s]+?(?=\n<p>)|^(?:( {4,}|\t))[\S\s]+)/gm;
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

function parseBlockquoteParagraphs(blockQuoteText) {
    const blockquoteWithParagraphs = blockQuoteText.replace(/(^>[\S\s]*?(?=^\n|^>(?! *\S)|>{2,}){1}|^>{1}[\S\s]*)/m, (match) => {
        const paragraphText = match.replace(/(?<!b|i|>)>/gm, "").trim().replace(/\n/gm, "");
        if (paragraphText) {
            return `<p>${paragraphText}</p>\n`;
        } else {
            return "";
        }
    })
    return blockquoteWithParagraphs;
}

function parseNestedBlockquotes(blockQuoteText) {
    const blockquoteWithParagraphs = blockQuoteText.replace(/(^>[\S\s]*?(?=^\n|^>(?! *\S)|>{2,}){1}|^>{1}[\S\s]*)/gm, (match) => {
        const paragraphText = match.replace(/(?<!b|i|>)>/gm, "").trim().replace(/\n(?!>)/gm, "");
        console.log("parsing nested blockquote paragraphs: ", paragraphText)
        // console.log("paragraph text inside quote: ", paragraphText);
        if (paragraphText) {
            return `<p>${paragraphText}</p>\n`;
        } else {
            return "";
        }
    });
    console.log("nested blockquote with paragraphs: ", blockquoteWithParagraphs);
    return `<blockquote>${blockquoteWithParagraphs}</blockquote>\n`;
}

// editorForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     parseMarkdown(editor.value)
// });

submitButton.addEventListener("click", () => {
    parseMarkdown(editor.value);
})

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