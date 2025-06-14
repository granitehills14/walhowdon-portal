// Walhowdon Farm Field Portal - Viewer Dashboard (Simplified with useState tabs)
// Technologies: React, Leaflet, GeoTIFF support, scientific colormap-ready

import React, { useState, useEffect } from 'react';
import { MapContainer, LayersControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoTIFFLayer } from 'leaflet-geotiff-2';

export default function WalhowdonViewerDashboard() {
  const [activeTab, setActiveTab] = useState("ortho");
  const [orthoLayers, setOrthoLayers] = useState({
    ortho1: true,
    ortho2: false,
    ortho3: false,
  });
  const [vectorVisible, setVectorVisible] = useState(true);
  const [geojsonData, setGeojsonData] = useState(null);

  const toggleOrthoLayer = (layer) => {
    setOrthoLayers({
      ...orthoLayers,
      [layer]: !orthoLayers[layer],
    });
  };

  useEffect(() => {
    if (vectorVisible) {
      fetch("/data/fields.geojson")
        .then((res) => res.json())
        .then((data) => setGeojsonData(data));
    } else {
      setGeojsonData(null);
    }
  }, [vectorVisible]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Walhowdon Farm Field Portal</h1>

      <div className="space-x-4 mb-4">
        <button onClick={() => setActiveTab("ortho")}>Map Viewer</button>
        <button onClick={() => setActiveTab("pointcloud")}>Point Cloud</button>
        <button onClick={() => setActiveTab("downloads")}>Downloads</button>
      </div>

      {activeTab === "ortho" && (
        <div>
          <div className="flex space-x-4 mb-4">
            <div>
              <h2 className="font-semibold">Ortho Layers</h2>
              <label className="block">
                <input
                  type="checkbox"
                  checked={orthoLayers.ortho1}
                  onChange={() => toggleOrthoLayer("ortho1")}
                />
                Ortho 1
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={orthoLayers.ortho2}
                  onChange={() => toggleOrthoLayer("ortho2")}
                />
                Ortho 2
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={orthoLayers.ortho3}
                  onChange={() => toggleOrthoLayer("ortho3")}
                />
                Ortho 3
              </label>
            </div>
            <div>
              <h2 className="font-semibold">Vector Layers</h2>
              <label className="block">
                <input
                  type="checkbox"
                  checked={vectorVisible}
                  onChange={() => setVectorVisible(!vectorVisible)}
                />
                Field Boundaries
              </label>
            </div>
          </div>

          <div className="h-96">
            <MapContainer
              center={[43.999, -71.0]}
              zoom={16}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <LayersControl position="topright">
                {orthoLayers.ortho1 && (
                  <LayersControl.Overlay checked name="Ortho 1">
                    <GeoTIFFLayer
                      url="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho1.tif"
                      attribution="&copy; 202506 Ortho 1"
                    />
                  </LayersControl.Overlay>
                )}
                {orthoLayers.ortho2 && (
                  <LayersControl.Overlay checked name="Ortho 2">
                    <GeoTIFFLayer
                      url="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho2.tif"
                      attribution="&copy; 202506 Ortho 2"
                    />
                  </LayersControl.Overlay>
                )}
                {orthoLayers.ortho3 && (
                  <LayersControl.Overlay checked name="Ortho 3">
                    <GeoTIFFLayer
                      url="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho3.tif"
                      attribution="&copy; 202506 Ortho 3"
                    />
                  </LayersControl.Overlay>
                )}
              </LayersControl>
              {vectorVisible && geojsonData && <GeoJSON data={geojsonData} />}
            </MapContainer>
          </div>
        </div>
      )}

      {activeTab === "pointcloud" && (
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <p>Potree Viewer Placeholder</p>
        </div>
      )}

      {activeTab === "downloads" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Download Data</h2>
          <ul className="list-disc ml-6">
            <li>
              <a
                href="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho1.tif"
                download
                className="text-blue-600 underline"
              >
                Download Ortho 1 (.tif)
              </a>
            </li>
            <li>
              <a
                href="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho2.tif"
                download
                className="text-blue-600 underline"
              >
                Download Ortho 2 (.tif)
              </a>
            </li>
            <li>
              <a
                href="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho3.tif"
                download
                className="text-blue-600 underline"
              >
                Download Ortho 3 (.tif)
              </a>
            </li>
            <li>
              <a
                href="https://f005.backblazeb2.com/file/walhowdon/data/pointcloud.laz"
                download
                className="text-blue-600 underline"
              >
                Download Point Cloud (.laz)
              </a>
            </li>
            <li>
              <a
                href="/data/fields.geojson"
                download
                className="text-blue-600 underline"
              >
                Download Field Boundaries (.geojson)
              </a>
              <ul className="ml-6 list-disc">
                <li>
                  <a
                    href="/data/fields.shp.zip"
                    download
                    className="text-blue-600 underline"
                  >
                    Convert to SHP (.zip)
                  </a>
                </li>
                <li>
                  <a
                    href="/data/fields.kmz"
                    download
                    className="text-blue-600 underline"
                  >
                    Convert to KMZ
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
