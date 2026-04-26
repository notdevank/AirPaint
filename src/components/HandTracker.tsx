import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as vision from '@mediapipe/tasks-vision';

const { HandLandmarker, FilesetResolver, DrawingUtils } = vision;

interface HandTrackerProps {
  onResults: (results: any) => void;
}

const HandTracker: React.FC<HandTrackerProps> = ({ onResults }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLandmarker = async () => {
      console.log("Starting Hand Landmarker initialization...");
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm"
        );
        console.log("FilesetResolver loaded");
        
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        landmarkerRef.current = handLandmarker;
        setIsReady(true);
        console.log("Hand Landmarker successfully created and assigned");
      } catch (error) {
        console.error("CRITICAL: Error initializing Hand Landmarker:", error);
      }
    };

    initLandmarker();

    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const processVideo = () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        landmarkerRef.current
      ) {
        const video = webcamRef.current.video;
        const startTimeMs = performance.now();
        
        const results = landmarkerRef.current.detectForVideo(video, startTimeMs);
        
        onResults({
          multiHandLandmarks: results.landmarks
        });

        const canvasCtx = canvasRef.current?.getContext('2d');
        if (canvasCtx && canvasRef.current) {
          const drawingUtils = new DrawingUtils(canvasCtx);
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          if (results.landmarks) {
            for (const landmarks of results.landmarks) {
              drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                color: "#00E5FF",
                lineWidth: 5
              });
              drawingUtils.drawLandmarks(landmarks, {
                color: "#FFFFFF",
                lineWidth: 2,
                radius: 4
              });
            }
          }
          canvasCtx.restore();
        }
      }
      requestRef.current = requestAnimationFrame(processVideo);
    };

    requestRef.current = requestAnimationFrame(processVideo);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [onResults]);

  return (
    <div className="fixed bottom-4 right-4 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-50 bg-slate-900 group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
      <Webcam
        ref={webcamRef}
        audio={false}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user"
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-20"
        width={640}
        height={480}
      />
      <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
        <span className="text-[8px] font-bold text-white uppercase tracking-widest opacity-80">
          {isReady ? 'Live Engine' : 'Initializing...'}
        </span>
      </div>
    </div>
  );
};

export default HandTracker;
