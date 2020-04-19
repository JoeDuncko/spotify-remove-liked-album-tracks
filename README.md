# spotify-remove-liked-album-tracks

## Reasoning

Previously on Spotify, when you added an album to your library (aka "Liked"), Spotify would automatically add all the tracks in that album to your library as well.

This was not great as it meant you could only add 1,000 10 track albums before hitting Spotify's 10,000 track cap. (Actually less, as [each album previously counted as a saved track](https://community.spotify.com/t5/Subscriptions/Album-limit-reached-WT-actual-F/m-p/4674140/highlight/true#M112422).)

That's no longer the case - adding an album no longer automatically adds all the album's tracks to your library.

This is better, as it makes hitting the 10,000 song limit more difficult. (Ignoring the fact that the cap [should probably be higher in the first place](https://community.spotify.com/t5/Live-Ideas/All-Platforms-Your-Library-Increase-maximum-Songs-allowed-in/idi-p/733759)).

In light of this new system, I decided that I wanted to clean up my library by going through and removing all tracks that a) I have the album saved and b) I have ALL tracks on the album saved.

Here's a script that does just that.

## Usage

- Install Node (I developed this on node 12 via nvm)
- Clone this repo
- `cd` into this repo
- `npm install`
- Get a Spotify token
  - It's easy to get one from Spotify's web console by going to https://developer.spotify.com/console/get-current-user-saved-tracks/ , logging into Spotify, clicking "Get Token", selecting `user-library-read` and `user-library-modify`, then clicking "Request token". Copy the "OAuth Token".
- `npm start  -- --token="<YOUR SPOTIFY TOKEN HERE>"`
- Done!