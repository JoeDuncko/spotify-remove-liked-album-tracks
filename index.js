const fetch = require('node-fetch');
const chunks = require('array.chunk');

const token = "BQBpwO5cJhRLqoa3b1CWfi3iAe_uZvOVXfkhsJbrJ2HZyEm3-EFJzAJkrXu4L67AfVOAMiAEj1-d7g3hv4LP77W_pv0ZyWDSu77D-ucTftWkaKOPeFV7XAs8k8iFAfFSQNdXay4uKiSApJitlwTG3mcAuvWWTwRqAOtNmBXaQzL0xqOLRE1pCdOOZpaJhml73S8"
const bearer = 'Bearer ' + token;

async function deleteItem(itemIds) {
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
        console.log('error');
    }
}


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
    console.log("total albums", albums.length);

    const albumsWhoseTracksToRemove = albums.filter((album) => {
        const found = tracks.filter((track) => {
            return album.album.id === track.track.album.id;
        });

        // If all tracks are in my library
        if (found.length > album.album.total_tracks) {
            return true;
        }
        else {
            return false;
        }
    }, []);

    console.log("number of albums Whose Tracks ToRemove", albumsWhoseTracksToRemove.length);

    const tracksToRemove = tracks.filter((track) => {
        const found = albumsWhoseTracksToRemove.find((album) => {
            return album.album.id === track.track.album.id;
        });

        return found;
    })

    console.log("Tracks to remove", tracksToRemove.length);

    const tracksToRemoveIds = tracksToRemove.map((track) => {
        return track.track.id;
    })

    const chunkedTracksToRemoveIds = chunks(tracksToRemoveIds, 50);

    chunkedTracksToRemoveIds.forEach(async (trackIds, index) => {
        console.log(`deleting tracks ${index} out of ${chunkedTracksToRemoveIds.length}`)
        await new Promise(r => setTimeout(r, 250));
        await deleteItem(trackIds.toString());
    });
}

init();