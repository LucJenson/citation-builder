/* =========================================================
   CITATION BUILDER
   Version 0.2

   Current support:
   - MLA 9
       - Book Works Cited entry
       - Book in-text citation

   - Chicago 18 Notes & Bibliography
       - Book bibliography entry
       - First footnote
       - Shortened footnote

   Saved sources contain RAW SOURCE DATA.
   Formatting is generated dynamically from that data.
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const citationStyleSelect =
    document.getElementById("citationStyle");

const sourceTypeSelect =
    document.getElementById("sourceType");

const citationForm =
    document.getElementById("citationForm");


const authorFirstInput =
    document.getElementById("authorFirst");

const authorLastInput =
    document.getElementById("authorLast");

const bookTitleInput =
    document.getElementById("bookTitle");

const bookSubtitleInput =
    document.getElementById("bookSubtitle");

const publisherInput =
    document.getElementById("publisher");

const publicationYearInput =
    document.getElementById("publicationYear");

const editionInput =
    document.getElementById("edition");

const translatorInput =
    document.getElementById("translator");

const pageNumberInput =
    document.getElementById("pageNumber");


const styleExplanation =
    document.getElementById("styleExplanation");

const mainOutputLabel =
    document.getElementById("mainOutputLabel");

const mainOutputHelp =
    document.getElementById("mainOutputHelp");

const pageNumberHelp =
    document.getElementById("pageNumberHelp");


const citationPreview =
    document.getElementById("citationPreview");

const inTextPreview =
    document.getElementById("inTextPreview");

const firstFootnotePreview =
    document.getElementById("firstFootnotePreview");

const shortFootnotePreview =
    document.getElementById("shortFootnotePreview");


const mlaOutputs =
    document.getElementById("mlaOutputs");

const chicagoOutputs =
    document.getElementById("chicagoOutputs");


const validationMessage =
    document.getElementById("validationMessage");


const addCitationButton =
    document.getElementById("addCitationButton");

const copyMainCitationButton =
    document.getElementById("copyMainCitationButton");

const copyInTextButton =
    document.getElementById("copyInTextButton");

const copyFirstFootnoteButton =
    document.getElementById("copyFirstFootnoteButton");

const copyShortFootnoteButton =
    document.getElementById("copyShortFootnoteButton");

const copyCollectionButton =
    document.getElementById("copyCollectionButton");

const clearBibliographyButton =
    document.getElementById("clearBibliographyButton");


const collectionHeading =
    document.getElementById("collectionHeading");

const collectionDescription =
    document.getElementById("collectionDescription");

const paperHeading =
    document.getElementById("paperHeading");

const worksCitedList =
    document.getElementById("worksCitedList");


/* =========================================================
   STATE
========================================================= */

const STORAGE_KEY =
    "citationBuilderSourcesV2";


let savedSources =
    loadSources();


/* =========================================================
   STYLE CONFIGURATION
========================================================= */

const STYLE_CONFIG = {

    mla9: {

        name: "MLA 9",

        collectionName: "Works Cited",

        collectionPossessive: "Works Cited",

        mainLabel:
            "MLA 9 — Works Cited Entry",

        mainHelp:
            "This is the full citation that appears on your Works Cited page.",

        explanationTitle:
            "MLA 9",

        explanation:
            "MLA uses a Works Cited page for full source information and parenthetical in-text citations inside the paper."

    },


    chicago18: {

        name:
            "Chicago 18 — Notes & Bibliography",

        collectionName:
            "Bibliography",

        collectionPossessive:
            "Bibliography",

        mainLabel:
            "Chicago 18 — Bibliography Entry",

        mainHelp:
            "This is the full citation that appears in your bibliography.",

        explanationTitle:
            "Chicago Notes & Bibliography",

        explanation:
            "Chicago Notes & Bibliography uses numbered footnotes in the paper and a bibliography for full source information."

    }

};


/* =========================================================
   BASIC HELPERS
========================================================= */

function clean(value) {

    return String(value || "").trim();

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value || "");

    return div.innerHTML;

}


function ensurePeriod(value) {

    const cleaned =
        clean(value);

    if (!cleaned) {
        return "";
    }


    if (/[.!?]$/.test(cleaned)) {
        return cleaned;
    }


    return cleaned + ".";

}


function stripFinalPunctuation(value) {

    return clean(value)
        .replace(/[.,;:!?]+$/, "");

}


function getFullTitle(source) {

    if (!source.subtitle) {
        return source.title;
    }


    return `${source.title}: ${source.subtitle}`;

}


function normalizeEdition(value) {

    const edition =
        clean(value);

    if (!edition) {
        return "";
    }


    if (
        /\b(ed|edition)\b/i.test(edition)
    ) {
        return edition;
    }


    return `${edition} ed.`;

}


/* =========================================================
   LOAD / SAVE
========================================================= */

function loadSources() {

    /*
        V2 stores raw bibliographic information.

        We intentionally do NOT migrate old formatted
        citation strings because they do not contain
        reliable structured source data.
    */

    try {

        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }


        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Could not load saved sources:",
            error
        );

        return [];

    }

}


function saveSources() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedSources)
    );

}


/* =========================================================
   READ CURRENT FORM
========================================================= */

function getCurrentSource() {

    return {

        id: null,

        type:
            sourceTypeSelect.value,

        author: {
            first:
                clean(authorFirstInput.value),

            last:
                clean(authorLastInput.value)
        },

        title:
            clean(bookTitleInput.value),

        subtitle:
            clean(bookSubtitleInput.value),

        publisher:
            clean(publisherInput.value),

        year:
            clean(publicationYearInput.value),

        edition:
            clean(editionInput.value),

        translator:
            clean(translatorInput.value)

    };

}


/* =========================================================
   VALIDATION
========================================================= */

function validateBook(source) {

    const missing = [];


    if (!source.title) {
        missing.push("book title");
    }


    if (!source.publisher) {
        missing.push("publisher");
    }


    if (!source.year) {
        missing.push("publication year");
    }


    return missing;

}


/* =========================================================
   MLA 9 — BOOK
========================================================= */

function formatMLABook(source) {

    const htmlParts = [];
    const plainParts = [];


    /* AUTHOR */

    if (
        source.author.last ||
        source.author.first
    ) {

        let author = "";


        if (
            source.author.last &&
            source.author.first
        ) {

            author =
                `${source.author.last}, ${source.author.first}`;

        } else {

            author =
                source.author.last ||
                source.author.first;

        }


        author =
            ensurePeriod(author);


        htmlParts.push(
            escapeHTML(author)
        );

        plainParts.push(author);

    }


    /* TITLE */

    if (source.title) {

        const title =
            ensurePeriod(
                getFullTitle(source)
            );


        htmlParts.push(
            `<em>${escapeHTML(title)}</em>`
        );

        plainParts.push(title);

    }


    /* TRANSLATOR */

    if (source.translator) {

        const translator =
            `Translated by ${source.translator},`;


        htmlParts.push(
            escapeHTML(translator)
        );

        plainParts.push(translator);

    }


    /* EDITION */

    if (source.edition) {

        const edition =
            `${normalizeEdition(source.edition)},`;


        htmlParts.push(
            escapeHTML(edition)
        );

        plainParts.push(edition);

    }


    /* PUBLISHER + YEAR */

    let publication = "";


    if (source.publisher) {

        publication +=
            source.publisher;

    }


    if (
        source.publisher &&
        source.year
    ) {

        publication += ", ";

    }


    if (source.year) {

        publication +=
            source.year;

    }


    if (publication) {

        publication =
            ensurePeriod(publication);


        htmlParts.push(
            escapeHTML(publication)
        );

        plainParts.push(publication);

    }


    return {

        html:
            htmlParts.join(" "),

        plain:
            plainParts.join(" ")

    };

}


/* =========================================================
   MLA 9 — IN-TEXT CITATION
========================================================= */

function formatMLAInText(
    source,
    page
) {

    let identifier = "";


    if (source.author.last) {

        identifier =
            source.author.last;

    } else if (source.author.first) {

        identifier =
            source.author.first;

    } else if (source.title) {

        /*
            No author:
            use a shortened version of the title.

            For now we use the complete title.
            More sophisticated title shortening can
            be added later.
        */

        identifier =
            source.title;

    }


    if (!identifier) {

        return {
            html: "",
            plain: ""
        };

    }


    let plain =
        identifier;


    if (page) {

        plain += ` ${page}`;

    }


    plain =
        `(${plain})`;


    return {

        html:
            escapeHTML(plain),

        plain

    };

}


/* =========================================================
   CHICAGO 18 — BIBLIOGRAPHY
========================================================= */

function formatChicagoBookBibliography(
    source
) {

    const htmlParts = [];
    const plainParts = [];


    /* AUTHOR */

    if (
        source.author.last ||
        source.author.first
    ) {

        let author = "";


        if (
            source.author.last &&
            source.author.first
        ) {

            author =
                `${source.author.last}, ${source.author.first}`;

        } else {

            author =
                source.author.last ||
                source.author.first;

        }


        author =
            ensurePeriod(author);


        htmlParts.push(
            escapeHTML(author)
        );

        plainParts.push(author);

    }


    /* TITLE */

    if (source.title) {

        const title =
            ensurePeriod(
                getFullTitle(source)
            );


        htmlParts.push(
            `<em>${escapeHTML(title)}</em>`
        );

        plainParts.push(title);

    }


    /* TRANSLATOR */

    if (source.translator) {

        const translator =
            `Translated by ${source.translator}.`;


        htmlParts.push(
            escapeHTML(translator)
        );

        plainParts.push(translator);

    }


    /* EDITION */

    if (source.edition) {

        const edition =
            ensurePeriod(
                normalizeEdition(
                    source.edition
                )
            );


        htmlParts.push(
            escapeHTML(edition)
        );

        plainParts.push(edition);

    }


    /* PUBLISHER + YEAR */

    let publication = "";


    if (source.publisher) {

        publication +=
            source.publisher;

    }


    if (
        source.publisher &&
        source.year
    ) {

        publication += ", ";

    }


    if (source.year) {

        publication +=
            source.year;

    }


    if (publication) {

        publication =
            ensurePeriod(publication);


        htmlParts.push(
            escapeHTML(publication)
        );

        plainParts.push(publication);

    }


    return {

        html:
            htmlParts.join(" "),

        plain:
            plainParts.join(" ")

    };

}


/* =========================================================
   CHICAGO 18 — FIRST FOOTNOTE
========================================================= */

function formatChicagoFirstFootnote(
    source,
    page
) {

    const htmlParts = [];
    const plainParts = [];


    /* AUTHOR */

    let author = "";


    if (
        source.author.first &&
        source.author.last
    ) {

        author =
            `${source.author.first} ${source.author.last}`;

    } else {

        author =
            source.author.first ||
            source.author.last;

    }


    if (author) {

        htmlParts.push(
            escapeHTML(author)
        );

        plainParts.push(author);

    }


    /* TITLE */

    if (source.title) {

        const title =
            getFullTitle(source);


        htmlParts.push(
            `<em>${escapeHTML(title)}</em>`
        );

        plainParts.push(title);

    }


    /* PUBLICATION INFORMATION */

    let publicationInfo = "";


    if (source.publisher) {

        publicationInfo +=
            source.publisher;

    }


    if (
        source.publisher &&
        source.year
    ) {

        publicationInfo += ", ";

    }


    if (source.year) {

        publicationInfo +=
            source.year;

    }


    let html =
        htmlParts.join(", ");

    let plain =
        plainParts.join(", ");


    if (publicationInfo) {

        html +=
            ` (${escapeHTML(publicationInfo)})`;

        plain +=
            ` (${publicationInfo})`;

    }


    if (page) {

        html +=
            `, ${escapeHTML(page)}`;

        plain +=
            `, ${page}`;

    }


    html =
        ensureHTMLPeriod(html);

    plain =
        ensurePeriod(plain);


    return {
        html,
        plain
    };

}


/* =========================================================
   CHICAGO 18 — SHORTENED FOOTNOTE
========================================================= */

function formatChicagoShortFootnote(
    source,
    page
) {

    const htmlParts = [];
    const plainParts = [];


    /* AUTHOR */

    const author =
        source.author.last ||
        source.author.first;


    if (author) {

        htmlParts.push(
            escapeHTML(author)
        );

        plainParts.push(author);

    }


    /* SHORT TITLE */

    if (source.title) {

        const title =
            source.title;


        htmlParts.push(
            `<em>${escapeHTML(title)}</em>`
        );

        plainParts.push(title);

    }


    let html =
        htmlParts.join(", ");

    let plain =
        plainParts.join(", ");


    if (page) {

        html +=
            `, ${escapeHTML(page)}`;

        plain +=
            `, ${page}`;

    }


    html =
        ensureHTMLPeriod(html);

    plain =
        ensurePeriod(plain);


    return {
        html,
        plain
    };

}


/* =========================================================
   HTML PERIOD HELPER
========================================================= */

function ensureHTMLPeriod(html) {

    const cleaned =
        clean(html);


    if (!cleaned) {
        return "";
    }


    if (/[.!?]$/.test(cleaned)) {
        return cleaned;
    }


    return cleaned + ".";

}


/* =========================================================
   FORMATTER ROUTER
========================================================= */

function formatMainCitation(
    source,
    style
) {

    if (
        source.type !== "book"
    ) {

        return {
            html: "",
            plain: ""
        };

    }


    if (style === "mla9") {

        return formatMLABook(source);

    }


    if (style === "chicago18") {

        return formatChicagoBookBibliography(
            source
        );

    }


    return {
        html: "",
        plain: ""
    };

}


/* =========================================================
   STYLE INTERFACE
========================================================= */

function updateStyleInterface() {

    const style =
        citationStyleSelect.value;

    const config =
        STYLE_CONFIG[style];


    styleExplanation.innerHTML =
        `<strong>${escapeHTML(
            config.explanationTitle
        )}</strong>
        ${escapeHTML(
            config.explanation
        )}`;


    mainOutputLabel.textContent =
        config.mainLabel;


    mainOutputHelp.textContent =
        config.mainHelp;


    collectionHeading.textContent =
        `My ${config.collectionName}`;


    paperHeading.textContent =
        config.collectionName;


    addCitationButton.textContent =
        `Add to My ${config.collectionName}`;


    copyCollectionButton.textContent =
        `Copy ${config.collectionName}`;


    if (style === "mla9") {

        mlaOutputs.hidden =
            false;

        chicagoOutputs.hidden =
            true;


        pageNumberHelp.textContent =
            "Enter the page containing the information you used. Note: This is not included on the Works Cited.";

    } else {

        mlaOutputs.hidden =
            true;

        chicagoOutputs.hidden =
            false;


        pageNumberHelp.textContent =
            "Enter the page containing the information you used. Note: This is not included in the Bibliography.";

    }


    updatePreview();

    renderCollection();

}


/* =========================================================
   LIVE PREVIEW
========================================================= */

function updatePreview() {

    const source =
        getCurrentSource();

    const style =
        citationStyleSelect.value;

    const page =
        clean(pageNumberInput.value);


    const mainCitation =
        formatMainCitation(
            source,
            style
        );


    /* MAIN CITATION */

    if (!mainCitation.plain) {

        citationPreview.innerHTML =
            `<span class="placeholder-text">
                Your citation will appear here.
            </span>`;

    } else {

        citationPreview.innerHTML =
            mainCitation.html;

    }


    /* MLA */

    if (style === "mla9") {

        const inText =
            formatMLAInText(
                source,
                page
            );


        if (!inText.plain) {

            inTextPreview.innerHTML =
                `<span class="placeholder-text">
                    Your in-text citation will appear here.
                </span>`;

        } else {

            inTextPreview.innerHTML =
                inText.html;

        }

    }


    /* CHICAGO */

    if (style === "chicago18") {

        const firstFootnote =
            formatChicagoFirstFootnote(
                source,
                page
            );


        const shortFootnote =
            formatChicagoShortFootnote(
                source,
                page
            );


        if (!firstFootnote.plain) {

            firstFootnotePreview.innerHTML =
                `<span class="placeholder-text">
                    Your first footnote will appear here.
                </span>`;

        } else {

            firstFootnotePreview.innerHTML =
                firstFootnote.html;

        }


        if (!shortFootnote.plain) {

            shortFootnotePreview.innerHTML =
                `<span class="placeholder-text">
                    Your shortened footnote will appear here.
                </span>`;

        } else {

            shortFootnotePreview.innerHTML =
                shortFootnote.html;

        }

    }


    /* VALIDATION */

    const missing =
        validateBook(source);


    if (
        !source.title &&
        !source.publisher &&
        !source.year
    ) {

        validationMessage.textContent =
            "";

        return;

    }


    if (missing.length > 0) {

        validationMessage.textContent =
            `Still needed: ${missing.join(", ")}.`;

    } else {

        validationMessage.textContent =
            "";

    }

}


/* =========================================================
   ADD SOURCE
========================================================= */

function addSource() {

    const source =
        getCurrentSource();

    const missing =
        validateBook(source);


    if (missing.length > 0) {

        validationMessage.textContent =
            `Before adding this source, complete: ${missing.join(", ")}.`;

        return;

    }


    source.id =
        createSourceId();


    savedSources.push(source);

    saveSources();

    renderCollection();


    citationForm.reset();

    pageNumberInput.value =
        "";


    updatePreview();

}


/* =========================================================
   CREATE ID
========================================================= */

function createSourceId() {

    if (
        window.crypto &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now().toString() +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


/* =========================================================
   SORTING
========================================================= */

function getSortKey(source) {

    return (
        source.author.last ||
        source.author.first ||
        source.title ||
        ""
    ).toLowerCase();

}


/* =========================================================
   RENDER COLLECTION
========================================================= */

function renderCollection() {

    worksCitedList.innerHTML =
        "";


    if (savedSources.length === 0) {

        worksCitedList.innerHTML =
            `<p class="empty-message">
                You have not added any sources yet.
            </p>`;

        return;

    }


    const style =
        citationStyleSelect.value;


    const sorted =
        [...savedSources].sort(
            (a, b) =>
                getSortKey(a).localeCompare(
                    getSortKey(b),
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        );


    sorted.forEach(source => {

        const citation =
            formatMainCitation(
                source,
                style
            );


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
            () =>
                deleteSource(source.id)
        );


        entry.appendChild(
            citationText
        );


        entry.appendChild(
            deleteButton
        );


        worksCitedList.appendChild(
            entry
        );

    });

}


/* =========================================================
   DELETE SOURCE
========================================================= */

function deleteSource(id) {

    savedSources =
        savedSources.filter(
            source =>
                source.id !== id
        );


    saveSources();

    renderCollection();

}


/* =========================================================
   CLEAR COLLECTION
========================================================= */

function clearCollection() {

    if (
        savedSources.length === 0
    ) {

        return;

    }


    const collectionName =
        STYLE_CONFIG[
            citationStyleSelect.value
        ].collectionName;


    const confirmed =
        window.confirm(
            `Remove every source from your ${collectionName}?`
        );


    if (!confirmed) {

        return;

    }


    savedSources = [];

    saveSources();

    renderCollection();

}


/* =========================================================
   COPY HELPERS
========================================================= */

async function copyRichText(
    html,
    plain
) {

    if (!plain) {
        return false;
    }


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

                "text/html":
                    htmlBlob,

                "text/plain":
                    textBlob

            });


        await navigator.clipboard.write(
            [item]
        );


        return true;

    }


    if (navigator.clipboard) {

        await navigator.clipboard.writeText(
            plain
        );


        return true;

    }


    return false;

}


/* =========================================================
   COPY MAIN CITATION
========================================================= */

async function copyMainCitation() {

    const source =
        getCurrentSource();

    const style =
        citationStyleSelect.value;


    const citation =
        formatMainCitation(
            source,
            style
        );


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
            copyMainCitationButton,
            "Copied!"
        );

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   COPY MLA IN-TEXT
========================================================= */

async function copyMLAInText() {

    const source =
        getCurrentSource();

    const page =
        clean(pageNumberInput.value);


    const citation =
        formatMLAInText(
            source,
            page
        );


    if (!citation.plain) {
        return;
    }


    await copyRichText(
        citation.html,
        citation.plain
    );


    showTemporaryButtonMessage(
        copyInTextButton,
        "Copied!"
    );

}


/* =========================================================
   COPY CHICAGO FOOTNOTES
========================================================= */

async function copyFirstFootnote() {

    const source =
        getCurrentSource();

    const page =
        clean(pageNumberInput.value);


    const citation =
        formatChicagoFirstFootnote(
            source,
            page
        );


    if (!citation.plain) {
        return;
    }


    await copyRichText(
        citation.html,
        citation.plain
    );


    showTemporaryButtonMessage(
        copyFirstFootnoteButton,
        "Copied!"
    );

}


async function copyShortFootnote() {

    const source =
        getCurrentSource();

    const page =
        clean(pageNumberInput.value);


    const citation =
        formatChicagoShortFootnote(
            source,
            page
        );


    if (!citation.plain) {
        return;
    }


    await copyRichText(
        citation.html,
        citation.plain
    );


    showTemporaryButtonMessage(
        copyShortFootnoteButton,
        "Copied!"
    );

}


/* =========================================================
   COPY COLLECTION
========================================================= */

async function copyCollection() {

    if (
        savedSources.length === 0
    ) {

        return;

    }


    const style =
        citationStyleSelect.value;


    const config =
        STYLE_CONFIG[style];


    const sorted =
        [...savedSources].sort(
            (a, b) =>
                getSortKey(a).localeCompare(
                    getSortKey(b),
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        );


    const formatted =
        sorted.map(
            source =>
                formatMainCitation(
                    source,
                    style
                )
        );


    const htmlEntries =
        formatted
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
                ${escapeHTML(
                    config.collectionName
                )}
            </div>

            ${htmlEntries}
        </div>`;


    const plainText =
        `${config.collectionName}\n\n` +
        formatted
            .map(
                citation =>
                    citation.plain
            )
            .join("\n\n");


    await copyRichText(
        fullHTML,
        plainText
    );


    showTemporaryButtonMessage(
        copyCollectionButton,
        "Copied!"
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


pageNumberInput.addEventListener(
    "input",
    updatePreview
);


citationStyleSelect.addEventListener(
    "change",
    updateStyleInterface
);


sourceTypeSelect.addEventListener(
    "change",
    updatePreview
);


addCitationButton.addEventListener(
    "click",
    addSource
);


copyMainCitationButton.addEventListener(
    "click",
    copyMainCitation
);


copyInTextButton.addEventListener(
    "click",
    copyMLAInText
);


copyFirstFootnoteButton.addEventListener(
    "click",
    copyFirstFootnote
);


copyShortFootnoteButton.addEventListener(
    "click",
    copyShortFootnote
);


copyCollectionButton.addEventListener(
    "click",
    copyCollection
);


clearBibliographyButton.addEventListener(
    "click",
    clearCollection
);


/* =========================================================
   INITIALIZE
========================================================= */

updateStyleInterface();
