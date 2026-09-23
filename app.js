/* =========================================================
   CITATION BUILDER
   Version 0.3

   Current support:
   - MLA 9
       - Book Works Cited entry
       - Book in-text citation

   - Chicago 18 Notes & Bibliography
       - Book bibliography entry
       - First footnote
       - Shortened footnote

   Features:
   - Raw source storage
   - Style switching
   - Edit saved sources
   - Cite saved sources
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


const sourceInformationSection =
    document.getElementById("sourceInformationSection");

const citationOutputSection =
    document.getElementById("citationOutputSection");


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


/*
    citedSource is deliberately separate from editing.

    When it contains a source, Step 3 uses this source instead
    of whatever happens to be in the Step 2 form.
*/
let citedSource =
    null;


/* =========================================================
   STYLE CONFIGURATION
========================================================= */

const STYLE_CONFIG = {

    mla9: {

        name: "MLA 9",

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
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   STORAGE
========================================================= */

function loadSources() {

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
   FORM DATA
========================================================= */

function getCurrentSource() {

    return {

        id: editingSourceId,

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


function populateForm(source) {

    sourceTypeSelect.value =
        source.type || "book";


    authorFirstInput.value =
        source.author?.first || "";

    authorLastInput.value =
        source.author?.last || "";

    bookTitleInput.value =
        source.title || "";

    bookSubtitleInput.value =
        source.subtitle || "";

    publisherInput.value =
        source.publisher || "";

    publicationYearInput.value =
        source.year || "";

    editionInput.value =
        source.edition || "";

    translatorInput.value =
        source.translator || "";

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
   MLA — BOOK
========================================================= */

function formatMLABook(source) {

    const htmlParts = [];
    const plainParts = [];


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


    if (source.translator) {

        const translator =
            `Translated by ${source.translator},`;


        htmlParts.push(
            escapeHTML(translator)
        );

        plainParts.push(translator);

    }


    if (source.edition) {

        const edition =
            `${normalizeEdition(source.edition)},`;


        htmlParts.push(
            escapeHTML(edition)
        );

        plainParts.push(edition);

    }


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
   CITATION CONTEXT
========================================================= */

/*
    A citation sometimes depends on the student's entire
    source collection rather than only the source being cited.

    Example:

    One Orwell source:
        (Orwell 42)

    Multiple Orwell sources:
        (Orwell, 1984 42)
        (Orwell, Animal Farm 17)

    Future contextual rules can be added here without
    changing every individual formatter.
*/


function normalizeForComparison(value) {

    return clean(value)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();

}


function getAuthorKey(source) {

    /*
        For now, books have individual authors.

        Later, this function can be expanded to support:
        - multiple authors
        - organizations
        - editors used as primary contributors
        - other creator types
    */

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


    /*
        Last name is currently the important identifier
        because that is what appears in the parenthetical
        citation.

        Including first name prevents two unrelated authors
        with the same surname from being treated as the same
        person at this stage.
    */

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
                    getAuthorKey(otherSource) ===
                    authorKey
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
                    getFullTitle(otherSource)
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

    /*
        For short titles, preserving the recognizable
        beginning of the work is more useful than applying
        an arbitrary word-count cutoff.

        Most ordinary book titles in our students' projects
        are already short:

            1984
            Animal Farm
            The Hobbit
            The Great Gatsby

        Initial articles can be omitted when the title must
        function as a shortened identifying title.

        We will expand this function later for:
        - article titles
        - very long titles
        - quotation-mark titles
        - webpages
        - chapters
    */

    const title =
        removeInitialArticle(
            source.title
        );


    return title ||
        source.title ||
        "";

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


    /* =====================================================
       SOURCE HAS AN AUTHOR
    ====================================================== */

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
            If this author has more than one work in the
            student's collection, identify which work is
            being cited by adding its title.
        */

        if (
            context.authorHasMultipleWorks &&
            source.title
        ) {

            const shortTitle =
                getShortTitle(source);


            plain +=
                `, ${shortTitle}`;


            /*
                Books are independent works, so their titles
                remain italicized inside the citation.
            */

            html +=
                `, <em>${escapeHTML(shortTitle)}</em>`;

        }

    }


    /* =====================================================
       SOURCE HAS NO AUTHOR
    ====================================================== */

    else if (source.title) {

        const shortTitle =
            getShortTitle(source);


        plain =
            shortTitle;


        html =
            `<em>${escapeHTML(shortTitle)}</em>`;

    }


    else {

        return {
            html: "",
            plain: ""
        };

    }


    /* =====================================================
       LOCATION
    ====================================================== */

    if (page) {

        plain +=
            ` ${page}`;

        html +=
            ` ${escapeHTML(page)}`;

    }


    /* =====================================================
       PARENTHESES
    ====================================================== */

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
   CHICAGO — BIBLIOGRAPHY
========================================================= */

function formatChicagoBookBibliography(
    source
) {

    const htmlParts = [];
    const plainParts = [];


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


    if (source.translator) {

        const translator =
            `Translated by ${source.translator}.`;


        htmlParts.push(
            escapeHTML(translator)
        );

        plainParts.push(translator);

    }


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


    if (source.title) {

        const title =
            getFullTitle(source);


        htmlParts.push(
            `<em>${escapeHTML(title)}</em>`
        );

        plainParts.push(title);

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


    return {

        html:
            ensureHTMLPeriod(html),

        plain:
            ensurePeriod(plain)

    };

}


/* =========================================================
   CHICAGO — SHORTENED FOOTNOTE
========================================================= */

function formatChicagoShortFootnote(
    source,
    page
) {

    const htmlParts = [];
    const plainParts = [];


    const author =
        source.author.last ||
        source.author.first;


    if (author) {

        htmlParts.push(
            escapeHTML(author)
        );

        plainParts.push(author);

    }


    if (source.title) {

        htmlParts.push(
            `<em>${escapeHTML(source.title)}</em>`
        );

        plainParts.push(
            source.title
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

function formatMainCitation(
    source,
    style
) {

    if (
        !source ||
        source.type !== "book"
    ) {

        return {
            html: "",
            plain: ""
        };

    }


    if (style === "mla9") {

        return formatMLABook(
            source
        );

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
   ACTIVE CITATION SOURCE
========================================================= */

function getActiveCitationSource() {

    /*
        Cite mode takes priority.

        This lets a student retrieve a saved source without
        overwriting whatever they may currently be entering
        in Step 2.
    */

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
        clean(pageNumberInput.value);


    const mainCitation =
        formatMainCitation(
            source,
            style
        );


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


    /*
        Don't show form validation while Cite mode is active.
        The user is working with an already-saved source.
    */

    if (citedSource) {

        validationMessage.textContent =
            "";

        return;

    }


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
   ADD OR SAVE SOURCE
========================================================= */

function saveCurrentSource() {

    const source =
        getCurrentSource();

    const missing =
        validateBook(source);


    if (missing.length > 0) {

        validationMessage.textContent =
            `Before saving this source, complete: ${missing.join(", ")}.`;

        return;

    }


    /*
        EDIT EXISTING SOURCE
    */

    if (editingSourceId) {

        const index =
            savedSources.findIndex(
                item =>
                    item.id === editingSourceId
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


    /*
        ADD NEW SOURCE
    */

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


    /*
        Stop Cite mode first so the edited form controls
        the preview normally.
    */

    stopCiting();


    editingSourceId =
        id;


    populateForm(source);


    editingNotice.hidden =
        false;


    editingNoticeText.textContent =
        getSourceDisplayName(source);


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


    resetEntryForm();

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


    resetEntryForm();

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


    /*
        We copy the source object rather than referencing
        the original directly.

        Cite mode should never accidentally modify saved data.
    */

    citedSource =
        JSON.parse(
            JSON.stringify(source)
        );


    citingNotice.hidden =
        false;


    citingNoticeText.textContent =
        getSourceDisplayName(source);


    pageNumberInput.value =
        "";


    validationMessage.textContent =
        "";


    updatePreview();


    scrollToElement(
        citationOutputSection
    );


    /*
        Put the cursor directly in the page field.
        Students will often want to type a page immediately.
    */

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
   RESET ENTRY FORM
========================================================= */

function resetEntryForm() {

    citationForm.reset();

    pageNumberInput.value =
        "";


    citedSource =
        null;


    citingNotice.hidden =
        true;


    citingNoticeText.textContent =
        "";


    validationMessage.textContent =
        "";


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


        result += name;

    }


    if (source.title) {

        if (result) {
            result += " — ";
        }


        result +=
            getFullTitle(source);

    }


    return result ||
        "Saved source";

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


        /* CITATION TEXT */

        const citationText =
            document.createElement("div");


        citationText.innerHTML =
            citation.html;


        /* ACTIONS */

        const actions =
            document.createElement("div");


        actions.className =
            "source-actions";


        /* CITE */

        const citeButton =
            createActionButton(
                "Cite",
                "cite-button",
                () =>
                    citeSource(source.id)
            );


        /* EDIT */

        const editButton =
            createActionButton(
                "Edit",
                "",
                () =>
                    editSource(source.id)
            );


        /* REMOVE */

        const removeButton =
            createActionButton(
                "Remove",
                "remove-button",
                () =>
                    removeSource(source.id)
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

    });

}


/* =========================================================
   ACTION BUTTON FACTORY
========================================================= */

function createActionButton(
    label,
    extraClass,
    handler
) {

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.className =
        `source-action-button ${extraClass}`.trim();


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
            `Remove "${getSourceDisplayName(source)}"?`
        );


    if (!confirmed) {
        return;
    }


    savedSources =
        savedSources.filter(
            item =>
                item.id !== id
        );


    /*
        If the removed source was being edited or cited,
        clear those states.
    */

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

    resetEntryForm();

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
   COPY CURRENT MAIN CITATION
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
        clean(pageNumberInput.value);


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


/* =========================================================
   COPY CHICAGO SHORT NOTE
========================================================= */

async function copyShortFootnote() {

    const source =
        getActiveCitationSource();

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
    () => {

        /*
            If the student begins changing the form while a
            saved source is in Cite mode, leave Cite mode.

            This prevents the preview from appearing "stuck"
            on the cited source.
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

updateStyleInterface();
