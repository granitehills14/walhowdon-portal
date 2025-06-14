// Walhowdon Farm Field Portal - Viewer Dashboard
// Technologies: React, Leaflet, File download links

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapContainer, LayersControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoTIFFLayer } from 'react-leaflet-geotiff';

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
      [layer]: !orthoLayers[layer]
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ortho">Map Viewer</TabsTrigger>
          <TabsTrigger value="pointcloud">Point Cloud</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        {/* Ortho Tab with Vector Overlay and Raw GeoTIFF Layers */}
        <TabsContent value="ortho">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div>
                  <h2 className="font-semibold">Ortho Layers</h2>
                  <label className="block">
                    <input type="checkbox" checked={orthoLayers.ortho1} onChange={() => toggleOrthoLayer('ortho1')} /> Ortho 1
                  </label>
                  <label className="block">
                    <input type="checkbox" checked={orthoLayers.ortho2} onChange={() => toggleOrthoLayer('ortho2')} /> Ortho 2
                  </label>
                  <label className="block">
                    <input type="checkbox" checked={orthoLayers.ortho3} onChange={() => toggleOrthoLayer('ortho3')} /> Ortho 3
                  </label>
                </div>
                <div>
                  <h2 className="font-semibold">Vector Layers</h2>
                  <label className="block">
                    <input type="checkbox" checked={vectorVisible} onChange={() => setVectorVisible(!vectorVisible)} /> Field Boundaries
                  </label>
                </div>
              </div>

              <div className="h-96">
                <MapContainer center={[43.999, -71.000]} zoom={16} className="h-full w-full" scrollWheelZoom={true}>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Point Cloud Tab */}
        <TabsContent value="pointcloud">
          <Card>
            <CardContent>
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <p>Potree Viewer Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Download Data</h2>
                <ul className="list-disc ml-6">
                  <li>
                    <a href="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho1.tif" download className="text-blue-600 underline">
                      Download Ortho 1 (.tif)
                    </a>
                  </li>
                  <li>
                    <a href="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho2.tif" download className="text-blue-600 underline">
                      Download Ortho 2 (.tif)
                    </a>
                  </li>
                  <li>
                    <a href="https://f005.backblazeb2.com/file/walhowdon/data/orthos/202506/rgb/202506_ortho3.tif" download className="text-blue-600 underline">
                      Download Ortho 3 (.tif)
                    </a>
                  </li>
                  <li>
                    <a href="/data/pointcloud.laz" download className="text-blue-600 underline">
                      Download Point Cloud (.laz)
                    </a>
                  </li>
                  <li>
                    <a href="/data/fields.geojson" download className="text-blue-600 underline">
                      Download Field Boundaries (.geojson)
                    </a>
                    <ul className="ml-6 list-disc">
                      <li>
                        <a href="/data/fields.shp.zip" download className="text-blue-600 underline">
                          Convert to SHP (.zip)
                        </a>
                      </li>
                      <li>
                        <a href="/data/fields.kmz" download className="text-blue-600 underline">
                          Convert to KMZ
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
