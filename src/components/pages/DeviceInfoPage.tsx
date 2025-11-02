import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {
  osName,
  deviceType,
  isMobile,
  isTablet,
} from "react-device-detect";

// ---- Define WebGL Info type ----
type WebGLInfo = {
  vendor: string;
  renderer: string;
} | null;

function getWebGLInfo(): WebGLInfo {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl || !(gl instanceof WebGLRenderingContext)) return null;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return null;

    const vendor = gl.getParameter((debugInfo as any).UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL);

    return { vendor, renderer };
  } catch {
    return null;
  }
}

export default function DeviceFingerprint() {
  const [visitorId, setVisitorId] = useState<string>("");
  const [deviceInfo, setDeviceInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setVisitorId(result.visitorId);

      // const battery = await (navigator as any).getBattery?.();
      const connection = (navigator as any).connection || {};
      console.log("Connection Info:", connection);

      const webgl = getWebGLInfo();

      setDeviceInfo({
        os: osName,
        // browser: browserName,
        type: deviceType,
        isMobile,
        isTablet,
        // language: navigator.language,
        // platform: navigator.platform,
        // userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        screen: `${window.screen.width} x ${window.screen.height}`,
        pixelRatio: window.devicePixelRatio,
        memory: `${(navigator as any).deviceMemory ?? "?"} GB`,
        cores: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        connectionType: connection.effectiveType || "unknown",
        // downlink: connection.downlink || "?",
        // batteryLevel: battery?.level ?? "?",
        // charging: battery?.charging ?? "?",
        webglVendor: webgl?.vendor ?? "?",
        // webglRenderer: webgl?.renderer ?? "?",
      });
    };

    loadFingerprint();
  }, []);

  return (
    <div className="min-h-screen w-full px-4 py-1 flex flex-col gap-1">
      <div className="flex flex-col justify-start items-start gap-1 px-6 py-1 bg-slate-100 rounded-md">
        <h2 className="text-xl font-bold">Visitor ID</h2>
        <p className="mb-4">{visitorId}</p>
      </div>
      <div className="flex flex-col justify-start items-start gap-1 px-6 py-1 bg-slate-200 rounded-md">
          <h2 className="text-xl font-bold">Device Info</h2>
          {Object.entries(deviceInfo).map(([key, value]) => (
            <div key={key}>
              <p className="flex flex-row gap-2">
                <strong>{key}:</strong> {String(value)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
