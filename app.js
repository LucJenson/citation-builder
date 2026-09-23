/* =========================================================
   CITATION BUILDER
   Version 0.5

   Architecture:
   SOURCE TYPE SCHEMA
        ↓
   Dynamic Form
        ↓
   Raw Source Data
        ↓
   Citation Context
        ↓
   Style Formatter
        ↓
   Citation Output

   Current source types:
   - Book

   Current styles:
   - MLA 9
   - Chicago 18 Notes & Bibliography
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

const sourceFields =
    document.getElementById("sourceFields");

const sourceInstructionBox =
    document.getElementById("sourceInstructionBox");


const sourceInformationSection =
    document.getElementById("sourceInformationSection");

const citationOutputSection =
    document.getElementById("citationOutputSection");


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

const cancelEditButton =
    document.getElementById("cancelEditButton");

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

const paperHeading =
    document.getElementById("paperHeading");

const worksCitedList =
    document.getElementById("worksCitedList");


const editingNotice =
    document.getElementById("editingNotice");

const editingNoticeText =
    document.getElementById("editingNoticeText");

const citingNotice =
    document.getElementById("citingNotice");

const citingNoticeText =
    document.getElementById("citingNoticeText");

const stopCitingButton =
    document.getElementById("stopCitingButton");


/* =========================================================
   STATE
========================================================= */

const STORAGE_KEY =
    "citationBuilderSourcesV2";


let savedSources =
    loadSources();


let editingSourceId =
    null;


let citedSource =
    null;


/* =========================================================
   STYLE CONFIGURATION
========================================================= */

const STYLE_CONFIG = {

    mla9: {

        name:
            "MLA 9",

        collectionName:
            "Works Cited",

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
   SOURCE TYPE SCHEMAS
========================================================= */

/*
    THIS is now where source forms are defined.

    A source type describes:

    - its name
    - where students should look for information
    - its field groups
    - individual fields
    - which fields are required

    Future source types such as Website and Journal Article
    will be added here.
*/

const SOURCE_TYPES = {

    book: {

        label:
            "Book",

        instructionTitle:
            "Using a book?",

        instruction:
            "You can usually find most citation information on the title page and copyright page near the beginning of the book.",


        groups: [

            /* ---------------------------------------------
               AUTHOR
            --------------------------------------------- */

            {

                legend:
                    "Author",

                explanation:
                    "Who wrote the book?",

                help:
                    "If the book does not identify an author, leave these fields blank. The citation can begin with the title.",


                fields: [

                    {
                        key:
                            "author.first",

                        label:
                            "First Name",

                        type:
                            "text",

                        placeholder:
                            "George",

                        required:
                            false
                    },


                    {
                        key:
                            "author.last",

                        label:
                            "Last Name",

                        type:
                            "text",

                        placeholder:
                            "Orwell",

                        required:
                            false
                    }

                ]

            },


            /* ---------------------------------------------
               TITLE
            --------------------------------------------- */

            {

                legend:
                    "Book Title",

                explanation:
                    "What is the complete title of the book?",


                fields: [

                    {
                        key:
                            "title",

                        label:
                            "Title",

                        type:
                            "text",

                        placeholder:
                            "1984",

                        required:
                            true
                    },


                    {
                        key:
                            "subtitle",

                        label:
                            "Subtitle",

                        type:
                            "text",

                        placeholder:
                            "Leave blank if there is no subtitle",

                        required:
                            false
                    }

                ]

            },


            /* ---------------------------------------------
               PUBLICATION
            --------------------------------------------- */

            {

                legend:
                    "Publication",

                explanation:
                    "Who published the book, and when was this edition published?",

                help:
                    "Use the publication year for the edition you are actually using, not necessarily the year the book was first published.",


                fields: [

                    {
                        key:
                            "publisher",

                        label:
                            "Publisher",

                        type:
                            "text",

                        placeholder:
                            "Penguin Books",

                        required:
                            true
                    },


                    {
                        key:
                            "year",

                        label:
                            "Publication Year",

                        type:
                            "number",

                        placeholder:
                            "2021",

                        min:
                            "1000",

                        max:
                            "2100",

                        required:
                            true
                    }

                ]

            },


            /* ---------------------------------------------
               OTHER INFORMATION
            --------------------------------------------- */

            {

                legend:
                    "Other Information",

                explanation:
                    "Some books include additional information that belongs in the citation.",


                fields: [

                    {
                        key:
                            "edition",

                        label:
                            "Edition",

                        type:
                            "text",

                        placeholder:
                            "2nd",

                        required:
                            false
                    },


                    {
                        key:
                            "translator",

                        label:
                            "Translator",

                        type:
                            "text",

                        placeholder:
                            "Gregory Rabassa",

                        required:
                            false
                    }

                ]

            }

        ]

    }

};


/* =========================================================
   BASIC HELPERS
========================================================= */

function clean(value) {

    return String(value || "")
        .trim();

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


function scrollToElement(element) {

    element.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}


/* =========================================================
   OBJECT PATH HELPERS
========================================================= */

/*
    Dynamic forms use keys such as:

        title
        publisher
        author.first
        author.last

    These helpers allow the form engine to read/write nested
    properties without knowing anything about Books.
*/

function getNestedValue(
    object,
    path
) {

    return path
        .split(".")
        .reduce(
            (current, key) =>
                current?.[key],
            object
        );

}


function setNestedValue(
    object,
    path,
    value
) {

    const keys =
        path.split(".");


    let current =
        object;


    keys.forEach(
        (key, index) => {

            const isLast =
                index ===
                keys.length - 1;


            if (isLast) {

                current[key] =
                    value;

                return;

            }


            if (
                !current[key] ||
                typeof current[key] !== "object"
            ) {

                current[key] = {};

            }


            current =
                current[key];

        }
    );

}


/* =========================================================
   STORAGE
========================================================= */

function loadSources() {

    try {

        const stored =
            localStorage.getItem(
                STORAGE_KEY
            );


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
   BUILD SOURCE TYPE SELECT
========================================================= */

function buildSourceTypeOptions() {

    sourceTypeSelect.innerHTML =
        "";


    Object.entries(
        SOURCE_TYPES
    ).forEach(
        ([key, config]) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                key;


            option.textContent =
                config.label;


            sourceTypeSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   DYNAMIC FORM RENDERER
========================================================= */

function renderSourceForm(
    sourceData = null
) {

    const sourceType =
        sourceTypeSelect.value;


    const config =
        SOURCE_TYPES[sourceType];


    if (!config) {
        return;
    }


    sourceFields.innerHTML =
        "";


    /* INSTRUCTION BOX */

    sourceInstructionBox.innerHTML =
        `<strong>${escapeHTML(
            config.instructionTitle
        )}</strong>
        ${escapeHTML(
            config.instruction
        )}`;


    /* FIELD GROUPS */

    config.groups.forEach(
        group => {

            const fieldset =
                document.createElement(
                    "fieldset"
                );


            /* LEGEND */

            const legend =
                document.createElement(
                    "legend"
                );


            legend.textContent =
                group.legend;


            fieldset.appendChild(
                legend
            );


            /* EXPLANATION */

            if (group.explanation) {

                const explanation =
                    document.createElement(
                        "p"
                    );


                explanation.className =
                    "field-explanation";


                explanation.textContent =
                    group.explanation;


                fieldset.appendChild(
                    explanation
                );

            }


            /* FIELD GRID */

            const fieldContainer =
                document.createElement(
                    "div"
                );


            fieldContainer.className =
                group.fields.length > 1
                    ? "two-column"
                    : "";


            group.fields.forEach(
                field => {

                    const formGroup =
                        createFormField(
                            field,
                            sourceData
                        );


                    fieldContainer.appendChild(
                        formGroup
                    );

                }
            );


            fieldset.appendChild(
                fieldContainer
            );


            /* HELP */

            if (group.help) {

                const help =
                    document.createElement(
                        "p"
                    );


                help.className =
                    "help-text";


                help.textContent =
                    group.help;


                fieldset.appendChild(
                    help
                );

            }


            sourceFields.appendChild(
                fieldset
            );

        }
    );


    /*
        Fields have just been recreated, so attach their
        live-preview events.
    */

    attachDynamicFieldEvents();

}


/* =========================================================
   CREATE FIELD
========================================================= */

function createFormField(
    field,
    sourceData
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "form-group";


    /* LABEL */

    const label =
        document.createElement(
            "label"
        );


    const fieldId =
        createFieldId(
            field.key
        );


    label.htmlFor =
        fieldId;


    label.append(
        document.createTextNode(
            field.label + " "
        )
    );


    /* REQUIRED / OPTIONAL BADGE */

    const badge =
        document.createElement(
            "span"
        );


    if (field.required) {

        badge.className =
            "required-label";


        badge.textContent =
            "Required";

    } else {

        badge.className =
            "optional-label";


        badge.textContent =
            "If available";

    }


    label.appendChild(
        badge
    );


    /* INPUT */

    const input =
        document.createElement(
            "input"
        );


    input.type =
        field.type || "text";


    input.id =
        fieldId;


    input.dataset.sourceKey =
        field.key;


    input.placeholder =
        field.placeholder || "";


    input.required =
        Boolean(field.required);


    if (field.min !== undefined) {

        input.min =
            field.min;

    }


    if (field.max !== undefined) {

        input.max =
            field.max;

    }


    if (sourceData) {

        input.value =
            getNestedValue(
                sourceData,
                field.key
            ) || "";

    }


    wrapper.appendChild(
        label
    );


    wrapper.appendChild(
        input
    );


    return wrapper;

}


/* =========================================================
   FIELD ID
========================================================= */

function createFieldId(key) {

    return (
        "sourceField_" +
        key.replaceAll(".", "_")
    );

}


/* =========================================================
   DYNAMIC FIELD EVENTS
========================================================= */

function attachDynamicFieldEvents() {

    const inputs =
        sourceFields.querySelectorAll(
            "[data-source-key]"
        );


    inputs.forEach(
        input => {

            input.addEventListener(
                "input",
                () => {

                    /*
                        If a student starts entering/editing
                        source information, Cite mode ends.
                    */

                    if (citedSource) {

                        citedSource =
                            null;


                        citingNotice.hidden =
                            true;


                        citingNoticeText.textContent =
                            "";

                    }


                    updatePreview();

                }
            );

        }
    );

}


/* =========================================================
   READ DYNAMIC FORM
========================================================= */

function getCurrentSource() {

    const source = {

        id:
            editingSourceId,

        type:
            sourceTypeSelect.value

    };


    const inputs =
        sourceFields.querySelectorAll(
            "[data-source-key]"
        );


    inputs.forEach(
        input => {

            setNestedValue(
                source,
                input.dataset.sourceKey,
                clean(input.value)
            );

        }
    );


    return source;

}


/* =========================================================
   VALIDATION
========================================================= */

function validateSource(source) {

    const config =
        SOURCE_TYPES[source.type];


    if (!config) {

        return [
            "valid source type"
        ];

    }


    const missing = [];


    config.groups.forEach(
        group => {

            group.fields.forEach(
                field => {

                    if (!field.required) {
                        return;
                    }


                    const value =
                        getNestedValue(
                            source,
                            field.key
                        );


                    if (!clean(value)) {

                        missing.push(
                            field.label.toLowerCase()
                        );

                    }

                }
            );

        }
    );


    return missing;

}


/* =========================================================
   CITATION CONTEXT
========================================================= */

function normalizeForComparison(value) {

    return clean(value)
        .toLowerCase()
        .replace(
            /[^\p{L}\p{N}]+/gu,
            " "
        )
        .trim();

}


function getAuthorKey(source) {

    const last =
        normalizeForComparison(
            source.author?.last
        );


    const first =
        normalizeForComparison(
            source.author?.first
        );


    if (!last && !first) {
        return "";
    }


    return `${last}|${first}`;

}


function getCitationContext(
    source,
    allSources
) {

    const authorKey =
        getAuthorKey(source);


    let sameAuthorSources = [];


    if (authorKey) {

        sameAuthorSources =
            allSources.filter(
                otherSource =>
                    getAuthorKey(
                        otherSource
                    ) === authorKey
            );

    }


    const titleKey =
        normalizeForComparison(
            getFullTitle(source)
        );


    const sameAuthorSameTitleSources =
        sameAuthorSources.filter(
            otherSource =>
                normalizeForComparison(
                    getFullTitle(
                        otherSource
                    )
                ) === titleKey
        );


    return {

        sameAuthorSources,

        sameAuthorSameTitleSources,

        authorHasMultipleWorks:
            sameAuthorSources.length > 1,

        authorHasDuplicateTitle:
            sameAuthorSameTitleSources.length > 1,

        authorMissing:
            !authorKey

    };

}


/* =========================================================
   SHORT TITLES
========================================================= */

function removeInitialArticle(title) {

    return clean(title)
        .replace(
            /^(a|an|the)\s+/i,
            ""
        );

}


function getShortTitle(source) {

    const title =
        removeInitialArticle(
            source.title
        );


    return (
        title ||
        source.title ||
        ""
    );

}


/* =========================================================
   MLA — BOOK
========================================================= */

function formatMLABook(source) {

    const htmlParts = [];
    const plainParts = [];


    /* AUTHOR */

    if (
        source.author?.last ||
        source.author?.first
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


        plainParts.push(
            author
        );

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


        plainParts.push(
            title
        );

    }


    /* TRANSLATOR */

    if (source.translator) {

        const translator =
            `Translated by ${source.translator},`;


        htmlParts.push(
            escapeHTML(translator)
        );


        plainParts.push(
            translator
        );

    }


    /* EDITION */

    if (source.edition) {

        const edition =
            `${normalizeEdition(
                source.edition
            )},`;


        htmlParts.push(
            escapeHTML(edition)
        );


        plainParts.push(
            edition
        );

    }


    /* PUBLICATION */

    let publication = "";


    if (source.publisher) {

        publication +=
            source.publisher;

    }


    if (
        source.publisher &&
        source.year
    ) {

        publication +=
            ", ";

    }


    if (source.year) {

        publication +=
            source.year;

    }


    if (publication) {

        publication =
            ensurePeriod(
                publication
            );


        htmlParts.push(
            escapeHTML(publication)
        );


        plainParts.push(
            publication
        );

    }


    return {

        html:
            htmlParts.join(" "),

        plain:
            plainParts.join(" ")

    };

}


/* =========================================================
   MLA — IN-TEXT
========================================================= */

function formatMLAInText(
    source,
    page,
    allSources = []
) {

    const context =
        getCitationContext(
            source,
            allSources
        );


    let plain = "";
    let html = "";


    /* AUTHOR */

    if (
        source.author?.last ||
        source.author?.first
    ) {

        const author =
            source.author.last ||
            source.author.first;


        plain =
            author;


        html =
            escapeHTML(author);


        /*
            Multiple works by the same author require
            the title to distinguish the source.
        */

        if (
            context.authorHasMultipleWorks &&
            source.title
        ) {

            const shortTitle =
                getShortTitle(source);


            plain +=
                `, ${shortTitle}`;


            html +=
                `, <em>${escapeHTML(
                    shortTitle
                )}</em>`;

        }

    }


    /* NO AUTHOR */

    else if (source.title) {

        const shortTitle =
            getShortTitle(source);


        plain =
            shortTitle;


        html =
            `<em>${escapeHTML(
                shortTitle
            )}</em>`;

    }


    else {

        return {
            html: "",
            plain: ""
        };

    }


    /* PAGE */

    if (page) {

        plain +=
            ` ${page}`;


        html +=
            ` ${escapeHTML(page)}`;

    }


    plain =
        `(${plain})`;


    html =
        `(${html})`;


    return {
        html,
        plain
    };

}


/* =========================================================
   CHICAGO — BOOK BIBLIOGRAPHY
========================================================= */

function formatChicagoBookBibliography(
    source
) {

    const htmlParts = [];
    const plainParts = [];


    /* AUTHOR */

    if (
        source.author?.last ||
        source.author?.first
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


        plainParts.push(
            author
        );

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


        plainParts.push(
            title
        );

    }


    /* TRANSLATOR */

    if (source.translator) {

        const translator =
            `Translated by ${source.translator}.`;


        htmlParts.push(
            escapeHTML(translator)
        );


        plainParts.push(
            translator
        );

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


        plainParts.push(
            edition
        );

    }


    /* PUBLICATION */

    let publication = "";


    if (source.publisher) {

        publication +=
            source.publisher;

    }


    if (
        source.publisher &&
        source.year
    ) {

        publication +=
            ", ";

    }


    if (source.year) {

        publication +=
            source.year;

    }


    if (publication) {

        publication =
            ensurePeriod(
                publication
            );


        htmlParts.push(
            escapeHTML(publication)
        );


        plainParts.push(
            publication
        );

    }


    return {

        html:
            htmlParts.join(" "),

        plain:
            plainParts.join(" ")

    };

}


/* =========================================================
   CHICAGO — FIRST FOOTNOTE
========================================================= */

function formatChicagoFirstFootnote(
    source,
    page
) {

    const htmlParts = [];
    const plainParts = [];


    let author = "";


    if (
        source.author?.first &&
        source.author?.last
    ) {

        author =
            `${source.author.first} ${source.author.last}`;

    } else {

        author =
            source.author?.first ||
            source.author?.last ||
            "";

    }


    if (author) {

        htmlParts.push(
            escapeHTML(author)
        );


        plainParts.push(
            author
        );

    }


    if (source.title) {

        const title =
            getFullTitle(source);


        htmlParts.push(
            `<em>${escapeHTML(title)}</em>`
        );


        plainParts.push(
            title
        );

    }


    let publicationInfo = "";


    if (source.publisher) {

        publicationInfo +=
            source.publisher;

    }


    if (
        source.publisher &&
        source.year
    ) {

        publicationInfo +=
            ", ";

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
            ` (${escapeHTML(
                publicationInfo
            )})`;


        plain +=
            ` (${publicationInfo})`;

    }


    if (page) {

        html +=
            `, ${escapeHTML(page)}`;


        plain +=
            `, ${page}`;

    }


    return {

        html:
            ensureHTMLPeriod(html),

        plain:
            ensurePeriod(plain)

    };

}


/* =========================================================
   CHICAGO — SHORT FOOTNOTE
========================================================= */

function formatChicagoShortFootnote(
    source,
    page
) {

    const htmlParts = [];
    const plainParts = [];


    const author =
        source.author?.last ||
        source.author?.first ||
        "";


    if (author) {

        htmlParts.push(
            escapeHTML(author)
        );


        plainParts.push(
            author
        );

    }


    if (source.title) {

        const shortTitle =
            getShortTitle(source);


        htmlParts.push(
            `<em>${escapeHTML(
                shortTitle
            )}</em>`
        );


        plainParts.push(
            shortTitle
        );

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


    return {

        html:
            ensureHTMLPeriod(html),

        plain:
            ensurePeriod(plain)

    };

}


/* =========================================================
   FORMATTER ROUTER
========================================================= */

const FORMATTERS = {

    mla9: {

        book:
            formatMLABook

    },


    chicago18: {

        book:
            formatChicagoBookBibliography

    }

};


function formatMainCitation(
    source,
    style
) {

    if (!source) {

        return {
            html: "",
            plain: ""
        };

    }


    const formatter =
        FORMATTERS[style]?.[
            source.type
        ];


    if (!formatter) {

        return {
            html: "",
            plain: ""
        };

    }


    return formatter(source);

}


/* =========================================================
   ACTIVE CITATION SOURCE
========================================================= */

function getActiveCitationSource() {

    if (citedSource) {

        return citedSource;

    }


    return getCurrentSource();

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


    copyCollectionButton.textContent =
        `Copy ${config.collectionName}`;


    if (!editingSourceId) {

        addCitationButton.textContent =
            `Add to My ${config.collectionName}`;

    }


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
        getActiveCitationSource();


    const style =
        citationStyleSelect.value;


    const page =
        clean(
            pageNumberInput.value
        );


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
                page,
                savedSources
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


    if (citedSource) {

        validationMessage.textContent =
            "";

        return;

    }


    const missing =
        validateSource(source);


    /*
        Don't show warnings while the form is completely
        untouched.
    */

    const hasAnyData =
        sourceFields.querySelector(
            "[data-source-key]"
        )
        &&
        Array.from(
            sourceFields.querySelectorAll(
                "[data-source-key]"
            )
        ).some(
            input =>
                clean(input.value)
        );


    if (!hasAnyData) {

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
   SAVE SOURCE
========================================================= */

function saveCurrentSource() {

    const source =
        getCurrentSource();


    const missing =
        validateSource(source);


    if (missing.length > 0) {

        validationMessage.textContent =
            `Before saving this source, complete: ${missing.join(", ")}.`;

        return;

    }


    /* EDIT */

    if (editingSourceId) {

        const index =
            savedSources.findIndex(
                item =>
                    item.id ===
                    editingSourceId
            );


        if (index !== -1) {

            source.id =
                editingSourceId;


            savedSources[index] =
                source;

        }


        saveSources();

        finishEditing();

        renderCollection();

        return;

    }


    /* ADD */

    source.id =
        createSourceId();


    savedSources.push(
        source
    );


    saveSources();

    renderCollection();

    resetEntryForm();

}


/* =========================================================
   EDIT SOURCE
========================================================= */

function editSource(id) {

    const source =
        savedSources.find(
            item =>
                item.id === id
        );


    if (!source) {
        return;
    }


    stopCiting();


    editingSourceId =
        id;


    sourceTypeSelect.value =
        source.type;


    renderSourceForm(
        source
    );


    editingNotice.hidden =
        false;


    editingNoticeText.textContent =
        getSourceDisplayName(
            source
        );


    cancelEditButton.hidden =
        false;


    addCitationButton.textContent =
        "Save Changes";


    validationMessage.textContent =
        "";


    updatePreview();


    scrollToElement(
        sourceInformationSection
    );

}


/* =========================================================
   FINISH / CANCEL EDIT
========================================================= */

function finishEditing() {

    editingSourceId =
        null;


    editingNotice.hidden =
        true;


    editingNoticeText.textContent =
        "";


    cancelEditButton.hidden =
        true;


    const collectionName =
        STYLE_CONFIG[
            citationStyleSelect.value
        ].collectionName;


    addCitationButton.textContent =
        `Add to My ${collectionName}`;


    renderSourceForm();

    pageNumberInput.value =
        "";


    updatePreview();

}


function cancelEditing() {

    editingSourceId =
        null;


    editingNotice.hidden =
        true;


    editingNoticeText.textContent =
        "";


    cancelEditButton.hidden =
        true;


    const collectionName =
        STYLE_CONFIG[
            citationStyleSelect.value
        ].collectionName;


    addCitationButton.textContent =
        `Add to My ${collectionName}`;


    renderSourceForm();

    pageNumberInput.value =
        "";


    updatePreview();

}


/* =========================================================
   CITE SAVED SOURCE
========================================================= */

function citeSource(id) {

    const source =
        savedSources.find(
            item =>
                item.id === id
        );


    if (!source) {
        return;
    }


    citedSource =
        JSON.parse(
            JSON.stringify(source)
        );


    citingNotice.hidden =
        false;


    citingNoticeText.textContent =
        getSourceDisplayName(
            source
        );


    pageNumberInput.value =
        "";


    validationMessage.textContent =
        "";


    updatePreview();


    scrollToElement(
        citationOutputSection
    );


    setTimeout(
        () => {

            pageNumberInput.focus();

        },
        500
    );

}


/* =========================================================
   STOP CITING
========================================================= */

function stopCiting() {

    citedSource =
        null;


    citingNotice.hidden =
        true;


    citingNoticeText.textContent =
        "";


    pageNumberInput.value =
        "";


    updatePreview();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetEntryForm() {

    citedSource =
        null;


    citingNotice.hidden =
        true;


    citingNoticeText.textContent =
        "";


    pageNumberInput.value =
        "";


    validationMessage.textContent =
        "";


    renderSourceForm();

    updatePreview();

}


/* =========================================================
   SOURCE DISPLAY NAME
========================================================= */

function getSourceDisplayName(source) {

    let result = "";


    if (
        source.author?.first ||
        source.author?.last
    ) {

        const name = [

            source.author.first,
            source.author.last

        ]
            .filter(Boolean)
            .join(" ");


        result +=
            name;

    }


    if (source.title) {

        if (result) {

            result +=
                " — ";

        }


        result +=
            getFullTitle(source);

    }


    return (
        result ||
        "Saved source"
    );

}


/* =========================================================
   SORTING
========================================================= */

function getSortKey(source) {

    return (
        source.author?.last ||
        source.author?.first ||
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


    if (
        savedSources.length === 0
    ) {

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
                getSortKey(a)
                    .localeCompare(
                        getSortKey(b),
                        undefined,
                        {
                            sensitivity:
                                "base"
                        }
                    )
        );


    sorted.forEach(
        source => {

            const citation =
                formatMainCitation(
                    source,
                    style
                );


            const entry =
                document.createElement(
                    "div"
                );


            entry.className =
                "works-cited-entry";


            /* CITATION */

            const citationText =
                document.createElement(
                    "div"
                );


            citationText.innerHTML =
                citation.html;


            /* ACTIONS */

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "source-actions";


            const citeButton =
                createActionButton(
                    "Cite",
                    "cite-button",
                    () =>
                        citeSource(
                            source.id
                        )
                );


            const editButton =
                createActionButton(
                    "Edit",
                    "",
                    () =>
                        editSource(
                            source.id
                        )
                );


            const removeButton =
                createActionButton(
                    "Remove",
                    "remove-button",
                    () =>
                        removeSource(
                            source.id
                        )
                );


            actions.appendChild(
                citeButton
            );


            actions.appendChild(
                editButton
            );


            actions.appendChild(
                removeButton
            );


            entry.appendChild(
                citationText
            );


            entry.appendChild(
                actions
            );


            worksCitedList.appendChild(
                entry
            );

        }
    );

}


/* =========================================================
   ACTION BUTTON
========================================================= */

function createActionButton(
    label,
    extraClass,
    handler
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        `source-action-button ${extraClass}`
            .trim();


    button.textContent =
        label;


    button.addEventListener(
        "click",
        handler
    );


    return button;

}


/* =========================================================
   REMOVE SOURCE
========================================================= */

function removeSource(id) {

    const source =
        savedSources.find(
            item =>
                item.id === id
        );


    if (!source) {
        return;
    }


    const confirmed =
        window.confirm(
            `Remove "${getSourceDisplayName(
                source
            )}"?`
        );


    if (!confirmed) {
        return;
    }


    savedSources =
        savedSources.filter(
            item =>
                item.id !== id
        );


    if (
        editingSourceId === id
    ) {

        cancelEditing();

    }


    if (
        citedSource &&
        citedSource.id === id
    ) {

        stopCiting();

    }


    saveSources();

    renderCollection();

    updatePreview();

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


    editingSourceId =
        null;


    citedSource =
        null;


    editingNotice.hidden =
        true;


    citingNotice.hidden =
        true;


    cancelEditButton.hidden =
        true;


    saveSources();

    renderSourceForm();

    updateStyleInterface();

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
                    type:
                        "text/html"
                }
            );


        const textBlob =
            new Blob(
                [plain],
                {
                    type:
                        "text/plain"
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
        getActiveCitationSource();


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


    await copyRichText(
        citation.html,
        citation.plain
    );


    showTemporaryButtonMessage(
        copyMainCitationButton,
        "Copied!"
    );

}


/* =========================================================
   COPY MLA IN-TEXT
========================================================= */

async function copyMLAInText() {

    const source =
        getActiveCitationSource();


    const page =
        clean(
            pageNumberInput.value
        );


    const citation =
        formatMLAInText(
            source,
            page,
            savedSources
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
   COPY CHICAGO FIRST NOTE
========================================================= */

async function copyFirstFootnote() {

    const source =
        getActiveCitationSource();


    const page =
        clean(
            pageNumberInput.value
        );


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


/* =========================================================
   COPY CHICAGO SHORT NOTE
========================================================= */

async function copyShortFootnote() {

    const source =
        getActiveCitationSource();


    const page =
        clean(
            pageNumberInput.value
        );


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
                getSortKey(a)
                    .localeCompare(
                        getSortKey(b),
                        undefined,
                        {
                            sensitivity:
                                "base"
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
    () => {

        /*
            Changing source type starts a fresh source form.
        */

        editingSourceId =
            null;


        citedSource =
            null;


        editingNotice.hidden =
            true;


        citingNotice.hidden =
            true;


        cancelEditButton.hidden =
            true;


        pageNumberInput.value =
            "";


        const collectionName =
            STYLE_CONFIG[
                citationStyleSelect.value
            ].collectionName;


        addCitationButton.textContent =
            `Add to My ${collectionName}`;


        renderSourceForm();

        updatePreview();

    }
);


addCitationButton.addEventListener(
    "click",
    saveCurrentSource
);


cancelEditButton.addEventListener(
    "click",
    cancelEditing
);


stopCitingButton.addEventListener(
    "click",
    stopCiting
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

buildSourceTypeOptions();

renderSourceForm();

updateStyleInterface();
