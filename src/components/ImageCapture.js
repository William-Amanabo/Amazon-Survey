import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Screen = styled.div`
  top: 50%;
  left: 50%;
  width: 90%;
  position: absolute;
  transform: translate(-50%, 10%);
  height: 80vh;
  z-index: ${({ visible }) => (visible ? 1 : 0)};
  transition: all 1s;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  //transform: translateX(${({ visible }) => (visible ? 0 : "-90px")});
  pointer-events: ${({ visible }) => (visible ? "all" : "none")};

  .screenshot-image {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    max-width: 100%;
    background: white;
  }

  video {
    width: 100%;
    background: rgba(16, 14, 23, 1);
    height: 100%;
  }

  .video-options {
    position: absolute;
    left: 20px;
    top: 30px;
  }

  .controls {
    position: absolute;
    right: 20px;
    top: 20px;
    display: flex;

    button {
      width: 45px;
      height: 45px;
      text-align: center;
      border-radius: 100%;
      margin: 0 6px;
      background: transparent;
      color: white;
      &:nth-child(1) {
        border: 2px solid #d2002e;
      }

      &:nth-child(2) {
        border: 2px solid #008496;
      }

      &:nth-child(3) {
        border: 2px solid #00b541;
      }
    }
  }

  .d-none {
    display: none;
  }

  @media (min-width: 300px) and (max-width: 400px) {
    .controls {
      flex-direction: column;
      button {
        margin: 5px 0 !important;
      }
    }
  }
`;

export default function ImageCapture() {
  const [visible, setVisible] = useState(false);
  const [streamElement, setStreamElement] = useState();
  const [streamStarted, setStreamStarted] = useState(false);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [callback, setCallback] = useState({});
  const [devices, setDevices] = useState();
  const screenShotRef = useRef();
  const stopRef = useRef();
  const videoRef = useRef();
  const screenshotImageRef = useRef();
  const doneRef = useRef();
  const [cropper, setCropper] = useState();
  const [constraints, setConstraints] = useState({
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440,
      },
    },
  });

  let cropperStyle = {
    width: "100%",
    height: "100%",
    top: 0,
    display: image ? "" : "none",
    position: "absolute",
  };

  useEffect(() => {
    getCameraSelection();
    document.addEventListener("imageCapture", captureHandler);
    /* setCropper(
      new Cropper(screenshotImageRef.current, {
          aspectRatio: 16 / 9, 
        crop(event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      })
    ) */ streamStarted ? displayCameraView(true) : displayCameraView(false);
  }, [streamStarted]);

  const captureHandler = ({ detail }) => {
    console.log(detail);
    console.log(detail.image, detail.callback, detail.mediaOptions);
    setVisible(true);
    detail.image
      ? (() => {
          setImage(detail.image);
          displayScreenShot();
        })()
      : setStreamStarted(true);
    if (detail.callback) setCallback({ callback: detail.callback });
    if (detail.mediaOptions) setConstraints(detail.mediaOptions);
    /* detail.callback ? (()=>setCallback({ callback: detail.callback }))() : null;
    detail.mediaOptions ? (()=>setConstraints(detail.mediaOptions))() : null; */
  };
  const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    setDevices(videoDevices);
  };
  // used as state holder for streamstate
  const cameraOptions = (e) => {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: e.value,
      },
    };
    startStream(updatedConstraints);
  };

  const displayCameraView = (toggle) => {
    if (toggle) {
      videoRef.current.play();

      if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
          ...constraints,
          deviceId: {
            exact: cameraOptions.value,
          },
        };
        startStream(updatedConstraints);
      } else {
        console.log(
          "Sorry this device has no camera or video support. This component cannot be used"
        );
      }
    } else {
      videoRef.current.pause();
    }
  };

  const startStream = async (constraints) => {
    let streamElement = await navigator.mediaDevices.getUserMedia(constraints);
    setStreamElement(streamElement);
    console.log(streamElement);
    handleStream(streamElement);
  };

  const handleStream = (stream) => {
    videoRef.current.srcObject = stream;
    screenShotRef.current.classList.remove("d-none");
    setStreamStarted(true);
  };

  const doScreenshot = async () => {
    console.log(videoRef.current.srcObject)
    if (videoRef.current.srcObject && videoRef.current.srcObject.active !== false) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL("image/webp"));
      displayScreenShot();
    } else {
      console.log("nothing to screen shot; no videoRef.current.srcObject", videoRef.current.srcObject);
    }
  };

  const displayScreenShot = () => {
    if (image) {
      screenshotImageRef.current.src = image;
      screenShotRef.current.classList.add("d-none");
      screenshotImageRef.current.classList.remove("d-none");
      console.log(cropper);
      cropper.start();
    } else {
      screenshotImageRef.current.src = "";
      screenShotRef.current.classList.remove("d-none");
      screenshotImageRef.current.classList.add("d-none");
    }
    /* image ? () => {
          screenshotImageRef.current.src = image;
          screenshotImageRef.current.classList.remove("d-none");
        }
      : () => {
          screenshotImageRef.current.src = "";
          screenshotImageRef.current.classList.add("d-none");
        }; */
  };

  const stopStream = () => {
    setStreamStarted(false);
    if (streamElement) {
      var track = streamElement.getTracks();
      track.forEach((track) => track.stop());
      screenshotImageRef.current.classList.add("d-none");
    }
    setImage(null);
    setVisible(false);
  };

  const downloadImage = () => {
    if (!callback.callback) {
      /* canvasRef.current
        .getContext("2d")
        .drawImage(screenshotImageRef.current, 0, 0);
      canvasRef.current.toBlob((blob) => {
        let link = document.createElement("a");
        link.download = "modified-image.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }); */

      cropper.getCroppedCanvas().toBlob((blob) => {
        let link = document.createElement("a");
        link.download = "modified-image.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      });
    } else {
      cropper.getCroppedCanvas().toBlob((blob) => {
        console.log("callback", callback.callback);
        console.log("blob", blob);
        callback.callback(blob);
      });
    }

    setImage(null);
    stopStream();
    setVisible(false);
  };

  return (
    <Screen visible={visible}>
      <video autoPlay ref={videoRef} id="cropper-video"></video>
      <div className="video-options">
        <select className="custom-select" onChange={cameraOptions}>
          {devices
            ? devices.map((videoDevice) => {
                return (
                  <option value={videoDevice.deviceId}>
                    {videoDevice.label}
                  </option>
                );
              })
            : null}
        </select>
      </div>

      {/* <img
        className="screenshot-image d-none"
        alt=""
        ref={screenshotImageRef}
      /> */}
      <Cropper
        style={cropperStyle}
        zoomTo={1}
        initialAspectRatio={1}
        preview=".img-preview"
        src={image}
        viewMode={1}
        guides={true}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
        onInitialized={(instance) => {
          setCropper(instance);
        }}
        ref={screenshotImageRef}
      />
      <div className="controls">
        <button
          className="btn btn-outline-success screenshot d-none"
          title="ScreenShot"
          ref={screenShotRef}
          onClick={doScreenshot}
        >
          snap
        </button>
        <button
          className="btn btn-outline-success screenshot"
          title="stop"
          ref={stopRef}
          onClick={stopStream}
        >
          stop
        </button>
        <button
          className="btn btn-outline-success screenshot"
          title="Done"
          ref={doneRef}
          onClick={downloadImage}
        >
          Done
        </button>
      </div>
    </Screen>
  );
}

ImageCapture.show = (image, callback, mediaOptions) => {
  document.dispatchEvent(
    new CustomEvent("imageCapture", {
      detail: { image: image, callback: callback, mediaOptions: mediaOptions },
    })
  );
};
