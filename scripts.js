let data = [];
const firestoreApiURL = "https://firestore.googleapis.com/v1/projects/quotes-142bc/databases/(default)/documents/Quotes";
const proxyUrl = 'https://api.allorigins.win/raw?url=';
const apiURL = "https://zenquotes.io/api/quotes";

const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const nextQuoteBtn = document.getElementById("nextquote-btn");
const linkedinBtn = document.getElementById("linkedin-btn-section");


async function getQuotes() {
    try {
        const response = await fetch(firestoreApiURL);
        const json = await response.json();

        data = (json.documents || []).map(doc => {
            const fields = doc.fields || {};
            return {
                q: fields.q?.stringValue || "",
                a: fields.a?.stringValue || ""
            };
        }).filter(item => item.q.trim() !== "" && item.a.trim() !== "");

        if (data.length > 0) {
            showRandomQuote();
        } else {
            quoteText.textContent = "None found in the database";
            quoteAuthor.textContent = "~";
        }

    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

async function showRandomQuote() {
    if (data.length === 0) return;

    const randomIndex = Math.floor(Math.random() * data.length);
    const quote = data[randomIndex].q;
    const author = data[randomIndex].a;

    let quoteLength = quote.length;
    if (quoteLength > 150) {
        quoteText.style.fontSize = "0.6em";
        quoteAuthor.style.fontSize = "14px";
    }
    else {
        quoteText.style.fontSize = "0.8em";
        quoteAuthor.style.fontSize = "1rem";
    }

    quoteText.textContent = `" ${quote} "`;
    quoteAuthor.textContent = `~${author}`;

}

async function goToLinkedin() {
    try {
        const currentQuote = quoteText.textContent;
        const currentAuthor = quoteAuthor.textContent;

        let text = currentQuote + "\n" + currentAuthor;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?text=${encodeURIComponent(text)}`;

        window.open(linkedinUrl, 'my_linkedin_window', "width=500 height=600 top=100 left=900");
    }
    catch (error) {
        console.error("Error sharing to LinkedIn:", error);
    }

}

nextQuoteBtn.addEventListener("click", showRandomQuote);
linkedinBtn.addEventListener("click", goToLinkedin);
// On page load
getQuotes();
