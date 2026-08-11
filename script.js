/* =========================
   DIGITAL NOTES APPLICATION
========================= */


/* =========================
   VARIABLES
========================= */

const STORAGE_KEY = "digitalNotes";

let notes = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [];

let editingNoteId = null;


/* =========================
   GET HTML ELEMENTS
========================= */

const newNoteBtn =
    document.getElementById("newNoteBtn");

const noteEditor =
    document.getElementById("noteEditor");

const editorHeading =
    document.getElementById("editorHeading");

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const saveBtn =
    document.getElementById("saveBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const searchInput =
    document.getElementById("searchInput");

const notesContainer =
    document.getElementById("notesContainer");

const emptyMessage =
    document.getElementById("emptyMessage");

const noteCount =
    document.getElementById("noteCount");

const errorMessage =
    document.getElementById("errorMessage");


/* =========================
   OPEN NEW NOTE
========================= */

newNoteBtn.addEventListener("click", function () {

    editingNoteId = null;

    editorHeading.textContent =
        "Create New Note";

    noteTitle.value = "";

    noteContent.value = "";

    errorMessage.textContent = "";

    noteEditor.classList.remove("hidden");

    noteTitle.focus();

});


/* =========================
   SAVE NOTE
========================= */

saveBtn.addEventListener("click", function () {

    const title =
        noteTitle.value.trim();

    const content =
        noteContent.value.trim();


    /* =========================
       PREVENT EMPTY NOTES
    ========================= */

    if (title === "" || content === "") {

        errorMessage.textContent =
            "⚠️ Please enter both a title and note content.";

        return;
    }


    /* =========================
       EDIT EXISTING NOTE
    ========================= */

    if (editingNoteId !== null) {

        const note =
            notes.find(
                function (note) {
                    return note.id === editingNoteId;
                }
            );


        if (note) {

            note.title = title;

            note.content = content;

            note.updatedAt =
                new Date().toLocaleString();
        }

    }


    /* =========================
       CREATE NEW NOTE
    ========================= */

    else {

        const newNote = {

            id: Date.now(),

            title: title,

            content: content,

            updatedAt:
                new Date().toLocaleString()

        };


        notes.unshift(newNote);
    }


    /* =========================
       SAVE TO LOCAL STORAGE
    ========================= */

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
    );


    closeEditor();

    displayNotes();

});


/* =========================
   CANCEL
========================= */

cancelBtn.addEventListener(
    "click",
    closeEditor
);


function closeEditor() {

    noteEditor.classList.add("hidden");

    noteTitle.value = "";

    noteContent.value = "";

    errorMessage.textContent = "";

    editingNoteId = null;

}


/* =========================
   DISPLAY NOTES
========================= */

function displayNotes() {

    notesContainer.innerHTML = "";


    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    /* =========================
       SEARCH NOTES
    ========================= */

    const filteredNotes =
        notes.filter(function (note) {

            return (
                note.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                note.content
                    .toLowerCase()
                    .includes(searchTerm)
            );

        });


    /* =========================
       UPDATE NOTE COUNT
    ========================= */

    noteCount.textContent =
        filteredNotes.length +
        (filteredNotes.length === 1
            ? " note"
            : " notes");


    /* =========================
       NO NOTES FOUND
    ========================= */

    if (filteredNotes.length === 0) {

        emptyMessage.style.display =
            "block";


        if (searchTerm !== "") {

            emptyMessage.querySelector("h3")
                .textContent =
                "No matching notes";

            emptyMessage.querySelector("p")
                .textContent =
                "Try another title or keyword.";

        }

        else {

            emptyMessage.querySelector("h3")
                .textContent =
                "No notes yet";

            emptyMessage.querySelector("p")
                .textContent =
                'Click "New Note" to create your first note.';
        }


        return;
    }


    emptyMessage.style.display = "none";


    /* =========================
       CREATE NOTE CARDS
    ========================= */

    filteredNotes.forEach(function (note) {


        const card =
            document.createElement("div");

        card.className =
            "note-card";


        /* TITLE */

        const title =
            document.createElement("h3");

        title.textContent =
            note.title;


        /* CONTENT */

        const content =
            document.createElement("p");

        content.className =
            "note-content";

        content.textContent =
            note.content;


        /* DATE */

        const date =
            document.createElement("p");

        date.className =
            "note-date";

        date.textContent =
            "Last updated: " +
            note.updatedAt;


        /* BUTTON CONTAINER */

        const actions =
            document.createElement("div");

        actions.className =
            "note-actions";


        /* EDIT BUTTON */

        const editButton =
            document.createElement("button");

        editButton.textContent =
            "✏️ Edit";

        editButton.className =
            "edit-btn";


        editButton.addEventListener(
            "click",
            function () {

                editNote(note.id);

            }
        );


        /* DELETE BUTTON */

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "🗑️ Delete";

        deleteButton.className =
            "delete-btn";


        deleteButton.addEventListener(
            "click",
            function () {

                deleteNote(note.id);

            }
        );


        /* ADD BUTTONS */

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        /* ADD EVERYTHING TO CARD */

        card.appendChild(title);

        card.appendChild(content);

        card.appendChild(date);

        card.appendChild(actions);


        /* ADD CARD TO PAGE */

        notesContainer.appendChild(card);

    });

}


/* =========================
   EDIT NOTE
========================= */

function editNote(id) {

    const note =
        notes.find(function (note) {

            return note.id === id;

        });


    if (!note) {
        return;
    }


    editingNoteId = id;


    editorHeading.textContent =
        "Edit Note";


    noteTitle.value =
        note.title;


    noteContent.value =
        note.content;


    errorMessage.textContent = "";


    noteEditor.classList.remove(
        "hidden"
    );


    noteTitle.focus();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   DELETE NOTE
========================= */

function deleteNote(id) {

    const note =
        notes.find(function (note) {

            return note.id === id;

        });


    if (!note) {
        return;
    }


    const confirmation =
        confirm(
            'Are you sure you want to delete "' +
            note.title +
            '"?'
        );


    if (!confirmation) {
        return;
    }


    /* Remove note */

    notes =
        notes.filter(function (note) {

            return note.id !== id;

        });


    /* Save updated notes */

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
    );


    /* Display notes again */

    displayNotes();

}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    displayNotes
);


/* =========================
   DISPLAY NOTES WHEN PAGE LOADS
========================= */

displayNotes();