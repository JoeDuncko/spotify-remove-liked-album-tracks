const fetch = require('node-fetch');

const token = "BQC7QxnNMs9K4UVnLMcGJ_6LdC9QcZv2-WTQClrMCG6sTsa0c9XXaxooB9wZJ9t4Yph_Mqz336DWb-QQiYVQ_tXMgFewdWItq9fOJ13UkR0V3seX-TagBA0kqsxSl3MiqFLN0pPMx0PoT1duWmS-abmtVK1j4AZwlBitr-2w729GIeKWuIzxXVwYdGZEZq3LtVE"
const bearer = 'Bearer ' + token;


async function getItems(nextUrl) {
    let tracks = [];

    while(nextUrl) {
        const response = await fetch(
            nextUrl,
            {
                headers: {
                    'Authorization': bearer
                }
            }
        );

        if (response) {
            const parsedResponse = await response.json();

            tracks.push(...parsedResponse.items);
            nextUrl = parsedResponse.next;

            console.log(nextUrl);
        }
        else {
            nextUrl = false;

            console.log("Done!");
        }
    }

    return tracks;
}

async function init() {
    const tracks = await getItems('https://api.spotify.com/v1/me/tracks?limit=50');

    const albums = await getItems('https://api.spotify.com/v1/me/albums?limit=50');

    console.log("total tracks", tracks.length);

    const tracksInAlbums = tracks.filter((song) => {
        const found = albums.find((album) => {
            return song.track.album.id === album.album.id;
        });

        return found;
    });

    console.log("tracks in albums", tracksInAlbums);
}

init();