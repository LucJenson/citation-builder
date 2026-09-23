/* =========================================================
   CITATION BUILDER
   Version 1.0 Prototype

   Current support:
   - MLA 9
   - Books
   - Works Cited storage
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const citationForm = document.getElementById("citationForm");

const authorFirstInput = document.getElementById("authorFirst");
const authorLastInput = document.getElementById("authorLast");

const bookTitleInput = document.getElementById("bookTitle");
const bookSubtitleInput = document.getElementById("bookSubtitle");

const publisherInput = document.getElementById("publisher");
const publicationYearInput =
    document.getElementById("publicationYear");

const editionInput = document.getElementById("edition");
const translatorInput = document.getElementById("translator");

const citationPreview =
    document.getElementById("citationPreview");

const validationMessage =
    document.getElementById("validationMessage");

const addCitationButton =
    document.getElementById("addCitationButton");

const copyCitationButton =
    document.getElementById("copyCitationButton");

const copyBibliographyButton =
    document.getElementById("copyBibliographyButton");

const clearBibliographyButton =
    document.getElementById("clearBibliographyButton");

const worksCitedList =
    document.getElementById("worksCitedList");


/* =========================================================
   STATE
========================================================= */

let savedCitations =
    JSON.parse(localStorage.getItem("citationBuilderSources")) || [];


/* =========================================================
   HELPERS
========================================================= */

function clean(value) {
    return value.trim();
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


function ensurePeriod(value) {

    if (!value) {
        return "";
    }

    return /[.!?]$/.test(value)
        ? value
        : value + ".";
}


/* =========================================================
   READ FORM
========================================================= */

function getBookData() {

    return {
        authorFirst: clean(authorFirstInput.value),
        authorLast: clean(authorLastInput.value),

        title: clean(bookTitleInput.value),
        subtitle: clean(bookSubtitleInput.value),

        publisher: clean(publisherInput.value),
        year: clean(publicationYearInput.value),

        edition: clean(editionInput.value),
        translator: clean(translatorInput.value)
    };

}


/* =========================================================
   MLA BOOK CITATION
========================================================= */

function buildMLABookCitation(data) {

    let htmlParts = [];
    let plainParts = [];


    /* AUTHOR */

    if (data.authorLast || data.authorFirst) {

        let author = "";

        if (data.authorLast && data.authorFirst) {

            author =
                `${data.authorLast}, ${data.authorFirst}`;

        } else {

            author =
                data.authorLast || data.authorFirst;

        }

        author = ensurePeriod(author);

        htmlParts.push(escapeHTML(author));
        plainParts.push(author);

    }


    /* TITLE */

    if (data.title) {

        let fullTitle = data.title;

        if (data.subtitle) {

            fullTitle += `: ${data.subtitle}`;

        }

        fullTitle = ensurePeriod(fullTitle);

        htmlParts.push(
            `<em>${escapeHTML(fullTitle)}</em>`
        );

        plainParts.push(fullTitle);

    }


    /* TRANSLATOR */

    if (data.translator) {

        const translator =
            `Translated by ${data.translator},`;

        htmlParts.push(
            escapeHTML(translator)
        );

        plainParts.push(translator);

    }


    /* EDITION */

    if (data.edition) {

        let edition = data.edition;

        if (!edition.toLowerCase().includes("ed")) {

            edition += " ed.";

        }

        edition += ",";

        htmlParts.push(
            escapeHTML(edition)
        );

        plainParts.push(edition);

    }


    /* PUBLISHER + YEAR */

    if (data.publisher || data.year) {

        let publication = "";

        if (data.publisher) {

            publication += data.publisher;

        }


        if (data.publisher && data.year) {

            publication += ", ";

        }


        if (data.year) {

            publication += data.year;

        }


        publication = ensurePeriod(publication);

        htmlParts.push(
            escapeHTML(publication)
        );

        plainParts.push(publication);

    }


    return {
        html: htmlParts.join(" "),
        plain: plainParts.join(" ")
    };

}


/* =========================================================
   VALIDATION
========================================================= */

function validateBook(data) {

    const missing = [];


    if (!data.title) {

        missing.push("book title");

    }


    if (!data.publisher) {

        missing.push("publisher");

    }


    if (!data.year) {

        missing.push("publication year");

    }


    return missing;

}


/* =========================================================
   LIVE PREVIEW
========================================================= */

function updatePreview() {

    const data = getBookData();

    const citation =
        buildMLABookCitation(data);


    if (!citation.plain) {

        citationPreview.innerHTML =
            `<span class="placeholder-text">
                Your citation will appear here.
            </span>`;

        validationMessage.textContent = "";

        return;

    }


    citationPreview.innerHTML =
        citation.html;


    const missing =
        validateBook(data);


    if (missing.length > 0) {

        validationMessage.textContent =
            `Still needed: ${missing.join(", ")}.`;

    } else {

        validationMessage.textContent = "";

    }

}


/* =========================================================
   ADD CITATION
========================================================= */

function addCitation() {

    const data = getBookData();

    const missing =
        validateBook(data);


    if (missing.length > 0) {

        validationMessage.textContent =
            `Before adding this source, complete: ${missing.join(", ")}.`;

        return;

    }


    const citation =
        buildMLABookCitation(data);


    const citationObject = {

        id: Date.now(),

        type: "book",

        style: "mla9",

        sortKey:
            data.authorLast ||
            data.title,

        html:
            citation.html,

        plain:
            citation.plain

    };


    savedCitations.push(citationObject);

    saveCitations();

    renderWorksCited();

    citationForm.reset();

    updatePreview();

}


/* =========================================================
   SAVE
========================================================= */

function saveCitations() {

    localStorage.setItem(
        "citationBuilderSources",
        JSON.stringify(savedCitations)
    );

}


/* =========================================================
   RENDER WORKS CITED
========================================================= */

function renderWorksCited() {

    worksCitedList.innerHTML = "";


    if (savedCitations.length === 0) {

        worksCitedList.innerHTML =
            `<p class="empty-message">
                You have not added any sources yet.
            </p>`;

        return;

    }


    const sorted =
        [...savedCitations].sort(
            (a, b) =>
                a.sortKey.localeCompare(
                    b.sortKey,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        );


    sorted.forEach(citation => {

        const entry =
            document.createElement("div");

        entry.className =
            "works-cited-entry";


        const citationText =
            document.createElement("span");

        citationText.innerHTML =
            citation.html;


        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "delete-citation";

        deleteButton.textContent =
            "Remove";


        deleteButton.addEventListener(
            "click",
            () => deleteCitation(citation.id)
        );


        entry.appendChild(citationText);
        entry.appendChild(deleteButton);

        worksCitedList.appendChild(entry);

    });

}


/* =========================================================
   DELETE
========================================================= */

function deleteCitation(id) {

    savedCitations =
        savedCitations.filter(
            citation =>
                citation.id !== id
        );


    saveCitations();

    renderWorksCited();

}


/* =========================================================
   CLEAR
========================================================= */

function clearBibliography() {

    if (savedCitations.length === 0) {

        return;

    }


    const confirmed =
        window.confirm(
            "Remove every source from your Works Cited list?"
        );


    if (!confirmed) {

        return;

    }


    savedCitations = [];

    saveCitations();

    renderWorksCited();

}


/* =========================================================
   COPY ONE CITATION
========================================================= */

async function copyCurrentCitation() {

    const data =
        getBookData();

    const citation =
        buildMLABookCitation(data);


    if (!citation.plain) {

        validationMessage.textContent =
            "Enter source information before copying.";

        return;

    }


    try {

        await copyRichText(
            citation.html,
            citation.plain
        );


        showTemporaryButtonMessage(
            copyCitationButton,
            "Copied!"
        );

    } catch (error) {

        console.error(error);

        validationMessage.textContent =
            "Your browser could not copy the citation automatically.";

    }

}


/* =========================================================
   COPY WORKS CITED
========================================================= */

async function copyWorksCited() {

    if (savedCitations.length === 0) {

        return;

    }


    const sorted =
        [...savedCitations].sort(
            (a, b) =>
                a.sortKey.localeCompare(
                    b.sortKey,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        );


    const htmlEntries =
        sorted
            .map(
                citation =>
                    `<div style="
                        margin-bottom: 1em;
                        padding-left: 2em;
                        text-indent: -2em;
                    ">
                        ${citation.html}
                    </div>`
            )
            .join("");


    const fullHTML =
        `<div>
            <div style="
                text-align: center;
                margin-bottom: 2em;
            ">
                Works Cited
            </div>

            ${htmlEntries}
        </div>`;


    const plainText =
        "Works Cited\n\n" +
        sorted
            .map(
                citation =>
                    citation.plain
            )
            .join("\n\n");


    try {

        await copyRichText(
            fullHTML,
            plainText
        );


        showTemporaryButtonMessage(
            copyBibliographyButton,
            "Copied!"
        );

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   RICH TEXT CLIPBOARD
========================================================= */

async function copyRichText(html, plain) {

    /*
        Modern browsers can copy both HTML and plain text.

        Google Docs and Word should use the HTML version,
        which preserves italics and other formatting.

        Plain text remains available as a fallback.
    */


    if (
        navigator.clipboard &&
        window.ClipboardItem
    ) {

        const htmlBlob =
            new Blob(
                [html],
                {
                    type: "text/html"
                }
            );


        const textBlob =
            new Blob(
                [plain],
                {
                    type: "text/plain"
                }
            );


        const item =
            new ClipboardItem({
                "text/html": htmlBlob,
                "text/plain": textBlob
            });


        await navigator.clipboard.write(
            [item]
        );


        return;

    }


    /*
        Fallback for browsers without
        rich clipboard support.
    */

    await navigator.clipboard.writeText(
        plain
    );

}


/* =========================================================
   BUTTON FEEDBACK
========================================================= */

function showTemporaryButtonMessage(
    button,
    message
) {

    const original =
        button.textContent;


    button.textContent =
        message;


    setTimeout(
        () => {

            button.textContent =
                original;

        },
        1500
    );

}


/* =========================================================
   EVENTS
========================================================= */

citationForm.addEventListener(
    "input",
    updatePreview
);


addCitationButton.addEventListener(
    "click",
    addCitation
);


copyCitationButton.addEventListener(
    "click",
    copyCurrentCitation
);


copyBibliographyButton.addEventListener(
    "click",
    copyWorksCited
);


clearBibliographyButton.addEventListener(
    "click",
    clearBibliography
);


/* =========================================================
   INITIALIZE
========================================================= */

updatePreview();

renderWorksCited();
