<script>
	import { fade } from 'svelte/transition';
	import { photos } from './stores.js';
	import { config } from  './config.js';

	const SLIDESHOW_INTERVAL = 30;

	function authenticate() {
		const authInstance = gapi.auth2.getAuthInstance();

		if (authInstance.isSignedIn.get()) {
			console.log("User already signed in.");
		} else {
			//authInstance.signIn({scope: "https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata"})
			authInstance.signIn({scope: "https://www.googleapis.com/auth/photoslibrary.readonly"})
			.then(function() { console.log("Sign-in successful"); },
				function(err) { console.error("Error signing in", err); });
		}
		return authInstance;
	}

	let googlePhotosClientLoaded = false;
	function loadClient() {
		gapi.client.setApiKey(config.API_KEY);
		return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
			.then(function() { 
				googlePhotosClientLoaded = true; 
				console.log("GAPI client loaded for API"); 

				getPictures();
			},
				function(err) { console.error("Error loading GAPI client for API", err); });
	}

	// change background image
	function changeBackgroundImage(imgUrl) {
		const img = new Image();

		img.onload = function() {
			document.querySelector('html').style.backgroundImage = `url(${img.src})`;
		};

		img.src = imgUrl;
	}

	function displayRandomPhoto() {
		const randomPhotoIndex = Math.round(Math.random() * $photos.length);

		return gapi.client.photoslibrary.mediaItems.get({
      		"mediaItemId": $photos[randomPhotoIndex],
    	})
        .then(
			function(response) {
				// Handle the results here (response.result has the parsed body).
				console.log("Getting photo URL", response);
				changeBackgroundImage(`${response.result.baseUrl}=w0-h0`);
				schedule_getPictures();
			},
			function(err) {
				console.error("Execute error", err); 
				schedule_getPictures();
			}
		);
 	}


	let pageToken = '';
	let getPictures_timeout;
	const schedule_getPictures = () => {
		clearInterval(getPictures_timeout);
		getPictures_timeout = setTimeout(getPictures, SLIDESHOW_INTERVAL*1000);
	}
	// Make sure the client is loaded and sign-in is complete before calling this method.
	function getPictures() {
		return gapi.client.photoslibrary.mediaItems.search({
		"resource": {
			"pageSize": 100,
			pageToken
		}
		})
			.then(function(response) {
					// Handle the results here (response.result has the parsed body).
					console.log("Increasing photos cache", response);
					const { result } = response;

					const newPhotoIds = result.mediaItems.map(item => item.id);
					photos.update(n => {
						return Array.from(new Set([...n, ...newPhotoIds]));
					});

					pageToken = result.nextPageToken;
					
					displayRandomPhoto();
				},
				function(err) { 
					console.error("Execute error", err); 
					schedule_getPictures();
				}
			);
	}

	gapi.load("client:auth2", function() {
		gapi.auth2.init({client_id: config.CLIENT_ID}).then( () => {
			const authInstance = gapi.auth2.getAuthInstance();
			if (authInstance.isSignedIn.get()) loadClient();
		});
	});
	
	$: {
		console.log({$photos});
	}
</script>

<style>
	div.content {
		width: 100%;
		height: 100%;
	}
</style>

<div class="content" on:click={displayRandomPhoto}>
{#if googlePhotosClientLoaded}
	<!-- <button on:click={getPictures}>execute</button> -->
{:else}
	<h1>You are not authenticated.</h1>
	<button on:click={() => authenticate().then(loadClient)}>authorize and load</button>

{/if}
</div>