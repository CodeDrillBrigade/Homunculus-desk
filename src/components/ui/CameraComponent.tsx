import { useState, useRef, useEffect } from "react"
import "../../styles/style.css"

const CameraComponent = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [isSecure, setIsSecure] = useState(false)
	const [framerate, setFramerate] = useState(0)
	const target_fps = 5

	useEffect(() => {
		setIsSecure(window.location.protocol.includes("https"))
	}, [])

	const startCamera = async () => {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			alert("Il tuo browser non supporta l'accesso alla fotocamera.")
			return
		}

		try {
			const newStream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					frameRate: {ideal: target_fps, min: 1, max: 60},
					facingMode: "environment",
				},
			})

			if (newStream === null){
				alert("Errore nella creazione dello stream")
				return
			}

			const videoTrack = newStream.getVideoTracks()[0]
			const settings = videoTrack.getSettings()
			await videoTrack.applyConstraints({
				frameRate: target_fps
			})

			if (settings.frameRate === undefined) {
				alert("Errore nell'impostazione del framerate")
				return
			}

			setFramerate(settings.frameRate)

			if (videoRef.current !== null) {
				videoRef.current.srcObject = newStream
				setStream(newStream)
			}
		} catch (err:any) {
			console.error("Errore nell'accesso alla fotocamera:", err.name, err.message)
			alert("Impossibile accedere alla fotocamera. Verifica i permessi. " + err.name + "\n" + err.message)
		}
	}

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach(track => track.stop())
			setStream(null)
			if (videoRef.current) {
				videoRef.current.srcObject = null

			}
		}
	}

	return (
		<span>
			{ !isSecure && <h2>Per usare la fotocamera, è necessaria una connessione sicura (HTTPS)</h2>}
			{ isSecure &&
          <div>
              <button onClick={!stream ? startCamera : stopCamera}>
								{stream ? "Disattiva" : "Attiva"} Fotocamera
              </button>
						{stream && <text> <br/>Target FPS: {target_fps}<br/>Actual FPS: {framerate} FPS</text>}
              <div id={"videoContainer"}>
                  <video ref={videoRef} autoPlay playsInline muted />
              </div>
          </div>
			}
    </span>
	)
}

export default CameraComponent
