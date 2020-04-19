const fetch = require('node-fetch');
const chunks = require('array.chunk');

const token = "BQAN1JGZ7VgFGyZkXToVRDLItqRSh_Tx7tGcJxISBeAjdlZUdiEkQrqhTN01vM6kGN7ZUQXAJysuJyw9jQGJccipAh6ntJ6f7Achf2lhV2C8BJ6YA5PKX0unHVhxa-_JHg0qd36zlGkrghNXELub2ma3zPaj6yMJ7g6rIw75xYKrD3j0PLXe_t9eTg-QIen_yls"
const bearer = 'Bearer ' + token;

async function deleteTrack(itemIds) {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/tracks?ids=${itemIds}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': bearer
                }
            }
        );
    }
    catch {
        console.log('Error removing tracks - maybe you hit the rate limit or your API key is invalid');
    }
}

async function deleteTracks(chunkedItemIds) {
    chunkedItemIds.forEach(async (trackIds, index) => {
        await new Promise(r => setTimeout(r, 250));
        await deleteTrack(trackIds.toString());
    });
}

async function getItems(nextUrl) {
    let tracks = [];

    try {
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
            }
            else {
                nextUrl = false;
            }
        }
    }
    catch {
        console.log('Error getting albums or tracks - maybe you hit the rate limit or your API key is invalid');
    }



    return tracks;
}

async function init() {
    console.log("Getting tracks...");
    const tracks = await getItems('https://api.spotify.com/v1/me/tracks?limit=50');
    console.log(`Got ${tracks.length} tracks!`)

    console.log("Getting albums...");
    const albums = await getItems('https://api.spotify.com/v1/me/albums?limit=50');
    console.log(`Got ${albums.length} albums!`)

    const albumsWhoseTracksToRemove = albums.filter((album) => {
        const found = tracks.filter((track) => {
            return album.album.id === track.track.album.id;
        });

        // If all tracks are in my library
        if (found.length === album.album.total_tracks) {
            return true;
        }
        else {
            return false;
        }
    }, []);

    console.log("Number of saved albums whose tracks are all saved:", albumsWhoseTracksToRemove.length);

    const tracksToRemove = tracks.filter((track) => {
        const found = albumsWhoseTracksToRemove.find((album) => {
            return album.album.id === track.track.album.id;
        });

        return found;
    })

    console.log("Tracks to remove:", tracksToRemove.length);

    if (tracksToRemove.length > 0){
        console.log("Removing tracks...");

        const tracksToRemoveIds = tracksToRemove.map((track) => {
            return track.track.id;
        })

        const chunkedTracksToRemoveIds = chunks(tracksToRemoveIds, 50);

        await deleteTracks(chunkedTracksToRemoveIds);
    }

    console.log("Done!");
}

init();