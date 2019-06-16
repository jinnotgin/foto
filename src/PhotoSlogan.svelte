<script>
	import { userProfile, currentPhoto } from './stores';
    import { dateStringFormatter } from  './jinFunctions.js';
    export let photoSlogan = "";

    let photoDate = "";
    const getPhotoDate = timeString => dateStringFormatter(new Date(timeString));
</script>

<style>
div {
    margin-left: auto;
    font-size: 1.25rem;
    line-height: 1em;
    margin-right: 2rem;
    text-shadow: 1px 1px 2px black;
    text-align: right;
}
 p {
    margin: 0;
    margin-top: 0.6em;
 }
</style>

<div>
    <p>{$currentPhoto.mediaMetadata !== undefined ? getPhotoDate($currentPhoto.mediaMetadata.creationTime) : ''}</p>
    
    <p>{($userProfile.name === undefined) ? '' : `Google Photos • ${$userProfile.name}`}</p>
</div>