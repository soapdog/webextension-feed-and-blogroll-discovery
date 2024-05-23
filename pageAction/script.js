function copyToClipboard(str) {
    console.log("copying", str)
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(str)
    }

    return Promise.reject('The Clipboard API is not available.')
}


function getCurrentActiveTab(tabs) {
    console.log("got tabs", tabs)

    function handleResponse(res) {
        console.log("got response", res)

        if (!res) {
            return
        }

        if (res.atom) {
            document.getElementById("atom_link").setAttribute("href", res.atom.replace("https:","feed:").replace("http:","feed:"))
            document.getElementById("atom_item").style.display = "block"
            document.getElementById("atom_copy").addEventListener("click", ev => {
                copyToClipboard(res.atom)
            })
        }

        if (res.rss) {
            document.getElementById("rss_link").setAttribute("href", res.rss.replace("https:","feed:").replace("http:","feed:"))
            document.getElementById("rss_item").style.display = "block"
            document.getElementById("rss_copy").addEventListener("click", ev => {
                copyToClipboard(res.rss)
            })
        }

        if (res.blogroll) {
            document.getElementById("blogroll_link").setAttribute("href", res.blogroll)
            document.getElementById("blogroll_item").style.display = "block"
            document.getElementById("blogroll_copy").addEventListener("click", ev => {
                copyToClipboard(res.blogroll)
            })
        }
    }

    let tab = tabs[0];

    const sending = browser.runtime.sendMessage({
        tab: tab.id,
    });

    sending.then(handleResponse, onError);
    
}

function onError(error) {
    console.log(`Error: ${error}`);
}


var querying = browser.tabs.query({ currentWindow: true, active: true });
querying.then(getCurrentActiveTab, onError);

const version = browser.runtime.getManifest().version;
document.getElementById('version').innerText = version;