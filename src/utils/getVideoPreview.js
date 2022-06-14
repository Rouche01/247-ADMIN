export const getVideoCover = (fileOrUrl, isURL = false, seekTo = 0.1) => {
  return new Promise((resolve, reject) => {
    // load the file to a video player
    let duration;
    const videoPlayer = document.createElement("video");
    videoPlayer.setAttribute(
      "src",
      isURL ? fileOrUrl : URL.createObjectURL(fileOrUrl)
    );
    videoPlayer.load();
    videoPlayer.addEventListener("error", (ex) => {
      reject("error when loading video file", ex);
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener("loadedmetadata", () => {
      // seek to user defined timestamp (in seconds) if possible
      duration = videoPlayer.duration;
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener("seeked", () => {
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        // return the canvas image as a blob
        ctx.canvas.toBlob(
          (blob) => {
            resolve({ blob, duration });
          },
          "image/jpeg",
          0.75 /* quality */
        );
      });
    });
  });
};

// const getVideoInfo = (file) => {
//   const video = document.createElement("video");
//   video.preload = "metadata";

//   let duration;

//   video.onloadedmetadata = (ev) => {
//     window.URL.revokeObjectURL(video.src);
//     duration = video.duration;
//   };

//   return duration;
// };
