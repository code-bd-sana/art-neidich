"use client";

import {
  ArrowDownToLine,
  Download,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getReportById } from "@/action/report.action";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateReportPdf } from "@/utils/generateReportPdf";

export default function Photos({ jobData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [photoData, setPhotoData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (jobData?.reportId) {
          const data = await getReportById(jobData.reportId);
          console.log("Report data from API:", data); // debug

          if (data.success) {
            setReportData(data.data);

            const transformedPhotos =
              data.data.images?.map((imageGroup, index) => ({
                id: index + 1,
                location: imageGroup.imageLabel || `Photo Group ${index + 1}`,
                count: imageGroup.images?.length || 0,
                images: imageGroup.images || [],
              })) || [];

            setPhotoData(transformedPhotos);
          } else {
            throw new Error(data.message || "Failed to fetch report data");
          }
        } else {
          setPhotoData([]);
        }
      } catch (err) {
        console.error("Error fetching report photos:", err);
        setError(err.message || "Failed to load photos");
      } finally {
        setLoading(false);
      }
    };

    if (jobData?.reportId) {
      fetchReportData();
    } else {
      setLoading(false);
      setPhotoData([]);
    }
  }, [jobData]);

  // Single image download (blob method to force save)
  const downloadSingleImage = async (
    url,
    filename = "inspection-photo.jpg",
  ) => {
    if (!url) {
      alert("No image URL available");
      return;
    }

    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) {
        throw new Error(
          `Fetch failed: ${response.status} ${response.statusText}`,
        );
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      console.log("Single image downloaded:", filename);
    } catch (err) {
      console.error("Single image download error:", err);
      window.open(url, "_blank");
      alert("Download failed. Image opened in new tab instead.");
    }
  };

  // ZIP download
  const downloadZipForLabel = async (item) => {
    if (!item?.images?.length) {
      alert("No images to download");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder(item.location.replace(/\s+/g, "_")) || zip;

    const usedNames = new Set();

    for (let i = 0; i < item.images.length; i++) {
      const image = item.images[i];
      if (!image?.url) continue;

      let baseName = image.alt || image.imageLabel || `photo_${i + 1}`;
      let ext = image.mimeType?.split("/")[1] || "jpg";
      let filename = `${baseName}.${ext}`;

      // Make filename unique
      let counter = 1;
      let uniqueFilename = filename;
      while (usedNames.has(uniqueFilename)) {
        uniqueFilename = `${baseName} (${counter}).${ext}`;
        counter++;
      }
      usedNames.add(uniqueFilename);

      try {
        const response = await fetch(image.url, { mode: "cors" });
        if (!response.ok) continue;
        const blob = await response.blob();
        folder.file(uniqueFilename, blob);
      } catch (err) {
        console.error(`Failed to add ${image.url} to ZIP:`, err);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${item.location.replace(/\s+/g, "_")}_photos.zip`);
  };

  // PDF report download
  const handleDownloadReport = async () => {
    if (!photoData.length) return;

    const imagesByLabel = photoData.reduce((acc, group) => {
      acc[group.location] = group.images;
      return acc;
    }, {});

    await generateReportPdf(imagesByLabel, jobData);
  };

  // Mobile Card (fixed buttons)
  const MobilePhotoCard = ({ item }) => (
    <div className='bg-white border border-gray-200 rounded-lg p-4 mb-3'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <ImageIcon size={16} className='text-gray-400' />
          <span className='text-sm font-medium text-gray-900'>
            {item.location}
          </span>
        </div>
        <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
          {item.count} {item.count === 1 ? "Photo" : "Photos"}
        </span>
      </div>

      <div className='flex flex-col sm:flex-row gap-2'>
        <button
          onClick={() =>
            item.count === 1
              ? downloadSingleImage(item.images[0]?.url)
              : downloadZipForLabel(item)
          }
          className='flex-1 flex items-center justify-center gap-2 py-2 border border-teal-600 text-teal-600 rounded-lg text-sm hover:bg-teal-50 transition-colors'>
          <Download size={14} />
          <span>
            {item.count === 1
              ? "Download Photo"
              : `Download ZIP (${item.count})`}
          </span>
        </button>

        <button
          onClick={handleDownloadReport}
          className='flex-1 flex items-center justify-center gap-2 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors'>
          <ArrowDownToLine size={14} />
          <span>Report</span>
        </button>
      </div>
    </div>
  );

  // Loading, Error, No Photos states (unchanged)
  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <Loader2 className='animate-spin text-teal-600' size={24} />
        <span className='ml-3 text-gray-600'>Loading photos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <ImageIcon size={48} className='text-gray-300 mx-auto mb-3' />
        <p className='text-red-600 mb-2'>Error loading photos</p>
        <p className='text-gray-600 text-sm'>{error}</p>
      </div>
    );
  }

  if (photoData.length === 0) {
    return (
      <div className='text-center py-12'>
        <ImageIcon size={64} className='text-gray-300 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-800 mb-2'>
          No Photos Available
        </h3>
        <p className='text-gray-600 mb-6'>
          {jobData?.hasReport
            ? "No photos found for this report"
            : "Report not submitted yet. Photos will appear here once the report is submitted."}
        </p>
        {!jobData?.hasReport && (
          <div className='inline-flex items-center gap-2 text-sm text-gray-500'>
            <span>Report Status:</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                jobData?.reportStatus === "in_progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
              {jobData?.reportStatusLabel || "Not Started"}
            </span>
          </div>
        )}
      </div>
    );
  }

  const totalPhotos = photoData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      {/* Mobile Header */}
      <div className='md:hidden mb-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Photos</h2>
        </div>

        {reportData?.status && (
          <div className='mt-2'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                reportData.status === "completed"
                  ? "bg-green-50 text-green-700"
                  : reportData.status === "in_progress"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-yellow-50 text-yellow-700"
              }`}>
              Report Status: {reportData.status}
            </span>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className='hidden md:flex items-center justify-between mb-6'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Inspection Photos
          </h2>
        </div>

        <div className='flex justify-end items-center gap-x-2'>
          <div>
            {reportData?.status && (
              <div className='flex items-center gap-1'>
                <span className='text-sm text-gray-600'>Report Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reportData.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : reportData.status === "in_progress"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-yellow-50 text-yellow-700"
                  }`}>
                  {reportData.status.charAt(0).toUpperCase() +
                    reportData.status.slice(1)}
                </span>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={handleDownloadReport}
              className='flex items-center gap-2 px-4 py-1.5 border border-orange-500 text-orange-500 rounded-full text-sm hover:bg-orange-50 transition-colors'>
              <ArrowDownToLine size={14} />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className='md:hidden'>
        {photoData.map((item) => (
          <MobilePhotoCard key={item.id} item={item} />
        ))}
      </div>

      {/* Desktop View */}
      <div className='hidden md:block border border-gray-200 rounded-lg overflow-hidden'>
        {/* Table Header */}
        <div className='bg-gray-50 border-b border-gray-200'>
          <div className='grid grid-cols-12 gap-4 px-6 py-3'>
            <div className='col-span-8'>
              <span className='text-sm font-medium text-gray-700'>Photos</span>
            </div>
            <div className='col-span-2'>
              <span className='text-sm font-medium text-gray-700'>
                Inspector
              </span>
            </div>
            <div className='col-span-2'>
              <span className='text-sm font-medium text-gray-700'>Actions</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className='divide-y divide-gray-200 bg-white'>
          {photoData.map((item) => (
            <div
              key={item.id}
              className='grid grid-cols-12 gap-4 px-6 py-3 hover:bg-gray-50 transition-colors items-center'>
              <div className='col-span-8'>
                <div className='flex items-center gap-3'>
                  <span className='text-sm font-medium text-gray-900'>
                    {item.location}
                  </span>
                </div>
              </div>
              <div className='col-span-2'>
                <div className='flex items-center gap-2'>
                  <div className='flex -space-x-2'>
                    {item.images?.slice(0, 3).map((image, idx) => (
                      <Image
                        key={idx}
                        src={image.url}
                        alt='Img'
                        width={25}
                        height={25}
                        className='rounded border-2 border-white'
                        style={{
                          transform: `rotate(${(idx - 1) * 8}deg)`,
                          zIndex: idx,
                        }}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600'>
                    {item.count} {item.count === 1 ? "Photo" : "Photos"}
                  </span>
                </div>
              </div>
              <div className='col-span-2 text-teal-600 hover:text-teal-700 transition-colors'>
                <div className='flex items-center gap-3'>
                  <button
                    className='flex items-center justify-center gap-x-1'
                    onClick={() =>
                      item.count === 1
                        ? downloadSingleImage(item.images[0]?.url)
                        : downloadZipForLabel(item)
                    }>
                    <Download size={14} />
                    <span>
                      {item.count === 1
                        ? "Download Image"
                        : `Download ZIP (${item.count})`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Summary */}
      <div className='mt-6 bg-gray-50 rounded-lg p-4'>
        <h3 className='text-sm font-medium text-gray-900 mb-3'>
          Photo Summary
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-gray-900'>
              {photoData.length}
            </p>
            <p className='text-sm text-gray-600'>Photo Locations</p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-gray-900'>{totalPhotos}</p>
            <p className='text-sm text-gray-600'>Total Photos</p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-gray-900'>
              {reportData?.createdAt
                ? new Date(reportData.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p className='text-sm text-gray-600'>Report Date</p>
          </div>
        </div>
      </div>

      {/* Inspector Info */}
      {reportData?.inspector && (
        <div className='mt-6 bg-gray-50 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-900 mb-3'>
            Inspector Information
          </h3>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-900'>
                {reportData.inspector.firstName} {reportData.inspector.lastName}
              </p>
              <p className='text-xs text-gray-600'>
                {reportData.inspector.email}
              </p>
            </div>
            <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
              {reportData.inspector.role}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
