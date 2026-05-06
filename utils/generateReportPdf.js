"use client";

import {
  pdf,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const HEADER_IMAGE_URL = "/header.png";
const FOOTER_LEFT_IMAGE_URL = "/footer_left.png";
const FOOTER_RIGHT_IMAGE_URL = "/footer_right.png";
const IMAGE_PROXY_ROUTE = "/api/image-proxy";

const getRenderableImageUrl = (url) => {
  if (!url) return null;

  if (
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("/")
  ) {
    return url;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `${IMAGE_PROXY_ROUTE}?url=${encodeURIComponent(url)}`;
  }

  return url;
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 14,
  },
  headerImage: {
    width: 100,
    height: 60,
  },
  websiteLinks: {
    fontSize: 8,
    color: "#474747",
    marginBottom: 2,
  },
  companySubtitle: {
    fontSize: 8,
    color: "#000000",
    marginBottom: 2,
  },
  mainTitle: {
    fontSize: 18,
    color: "#2D8D7C",
    marginBottom: 2,
    fontWeight: "bold",
  },
  attachmentText: {
    fontSize: 9,
    color: "#222325",
    marginTop: 1,
    fontWeight: "bold",
  },
  infoSection: {
    marginTop: 15,
    marginBottom: 8,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#EFEFF1",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    fontSize: 10,
    width: "100%",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 0,
  },
  infoRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 0,
    marginLeft: 16,
  },
  label: {
    fontWeight: "semibold",
    marginRight: 7,
    color: "#222325",
  },
  value: {
    flexShrink: 0,
  },
  subjectSection: {
    flexDirection: "row",
    alignItems: "start",
    width: "100%",
    marginBottom: 2,
  },
  subjectLabel: {
    fontSize: 10,
    fontWeight: "semibold",
    marginRight: 4,
    color: "#222325",
  },
  subjectValue: {
    fontSize: 10,
    marginTop: 0,
    flex: 1,
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#323539",
    textAlign: "center",
  },
  sectionContainer: {
    padding: 15,
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  imageContainer: {
    width: "70%",
  },
  imageSingle: {
    width: "70%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
  note: {
    fontSize: 9,
    color: "#555555",
    marginTop: 6,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  footerImage: {
    width: 45,
    height: 45,
  },
  footerText: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 15,
    fontSize: 7,
    fontWeight: "semibold",
    lineHeight: 1.5,
    color: "#333333",
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    fontSize: 9,
    color: "#000000",
    textAlign: "center",
  },
});

// Clean S3 URLs
const cleanImageUrl = (url) => {
  if (!url) return null;
  return url.split("?")[0];
};

const formatInspectionDate = (value) => {
  if (!value) {
    const today = new Date();
    return `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getMonth() + 1}-${value.getDate()}-${value.getFullYear()}`;
  }

  const rawValue = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(rawValue)) {
    const [year, month, day] = rawValue.slice(0, 10).split("-").map(Number);
    return `${month}-${day}-${year}`;
  }

  const normalizedValue = rawValue.replace(/\//g, "-");

  const match = normalizedValue.match(
    /^(\d{1,4})-(\d{1,2})-(\d{1,4})(?:\s.*)?$/,
  );

  if (match) {
    const first = Number(match[1]);
    const second = Number(match[2]);
    const third = Number(match[3]);

    let month = first;
    let day = second;
    let year = third;

    if (match[1].length === 4) {
      year = first;
      month = second;
      day = third;
    } else if (match[3].length === 4) {
      month = first;
      day = second;
      year = third;
    }

    return `${month}-${day}-${year}`;
  }

  const parsedDate = new Date(rawValue);
  if (!Number.isNaN(parsedDate.getTime())) {
    return `${parsedDate.getMonth() + 1}-${parsedDate.getDate()}-${parsedDate.getFullYear()}`;
  }

  return rawValue;
};

const fetchImageAsDataUrl = async (url) => {
  const response = await fetch(getRenderableImageUrl(url), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load image: ${response.status}`);
  }

  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new window.Image();
      image.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(
          1,
          maxSide / image.naturalWidth,
          maxSide / image.naturalHeight,
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };

      image.onerror = () =>
        reject(new Error("Failed to decode image for resizing"));
      image.src = reader.result;
    };
    reader.onerror = () =>
      reject(new Error("Failed to convert image to data URL"));
    reader.readAsDataURL(blob);
  });
};

// Header Component - appear on every page
const Header = ({ jobData }) => (
  <View style={styles.headerContainer} fixed>
    <Image src={HEADER_IMAGE_URL} alt='Img' style={styles.headerImage} />
    {/* Link of both sites, that will redirect */}
    <Text style={styles.websiteLinks}>
      <Text
        onPress={() => window.open("https://www.FHAInspection.com", "_blank")}>
        www.FHAInspection.com
      </Text>{" "}
      /{" "}
      <Text onPress={() => window.open("https://www.artneidich.com", "_blank")}>
        www.artneidich.com
      </Text>
    </Text>
    <Text style={styles.companySubtitle}>
      A division of Lone Star Building Inspection, Inc.
    </Text>
    {/* <Text style={styles.mainTitle}>Inspection report</Text> */}
    <Text style={styles.attachmentText}>Attachment to FHA Form 92051</Text>
  </View>
);

// Footer Component - appear on every page
const Footer = () => (
  <View style={styles.footer} fixed>
    <Image src={FOOTER_LEFT_IMAGE_URL} alt='Img' style={styles.footerImage} />
    <Text style={styles.footerText}>
      All utilities are on and tested unless otherwise noted{"\n"}
      Properties without working utilities do not qualify for compliance{"\n"}
      TREC Lic. # 10546 | TSBPE Lic. # 3836 | Code Enforcement Lic. # 7055 |
      HUD-FHA Fee Reg.# D683 & 203K – D0931{"\n"}
      ICC Certified Residential Combination Inspector
    </Text>
    <Image src={FOOTER_RIGHT_IMAGE_URL} alt='Img' style={styles.footerImage} />
  </View>
);

// Section with report info - appear on every page
const ReportHeaderInfo = ({ jobData }) => (
  <View style={styles.infoSection}>
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Text style={styles.label}>Date of Inspection:</Text>
        <Text style={styles.label}>
          {formatInspectionDate(jobData?.createdAt || jobData?.inspectionDate)}
        </Text>
      </View>
      <View style={styles.infoRight}>
        <Text style={[styles.label, { marginLeft: 20 }]}>FHA Case #</Text>
        <Text
          style={[styles.value, { fontWeight: "semibold", color: "#222325" }]}>
          {jobData?.fhaCaseDetailsNo || jobData?.caseNumber || "N/A"}
        </Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Text style={styles.label}>Type of Inspection:</Text>
        <Text style={styles.value}>
          {jobData?.formType || "92051 - FHA Inspection"}
        </Text>
      </View>
      <View style={styles.infoRight}>
        <Text></Text>
      </View>
    </View>
    <View style={styles.subjectSection}>
      <Text style={styles.subjectLabel}>Subject Property:</Text>
      <Text style={styles.subjectValue}>{jobData?.streetAddress || "N/A"}</Text>
    </View>
  </View>
);

// Main function to generate PDF
export const generateReportPdf = async (imagesByLabel, jobData = {}) => {
  console.log("Original imagesByLabel:", imagesByLabel);

  const processedEntries = await Promise.all(
    Object.entries(imagesByLabel).map(async ([label, images]) => {
      const processedImages = await Promise.all(
        images.map(async (img) => {
          if (!img?.url) return img;

          try {
            const dataUrl = await fetchImageAsDataUrl(img.url);
            return { ...img, url: dataUrl };
          } catch (err) {
            console.warn(`Image conversion failed for ${img.fileName}:`, err);
            return { ...img, url: null };
          }
        }),
      );

      return [label, processedImages];
    }),
  );

  const processedByLabel = Object.fromEntries(processedEntries);

  const sections = Object.entries(processedByLabel);

  // Calculate how many sections per page
  const sectionsPerPage = 2;

  const blob = await pdf(
    <Document>
      {/* Page 1 */}
      <Page size='A4' style={styles.page}>
        {/* Header on every page */}
        <Header jobData={jobData} />

        <ReportHeaderInfo jobData={jobData} />

        {/* Dynamic sections for first page */}
        {sections.slice(0, sectionsPerPage).map(([label, images], index) => (
          <View key={`section-${label}-${index}`} wrap={false}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{label}</Text>
              {images.length === 1 ? (
                <View style={styles.imageSingle}>
                  {images[0]?.url ? (
                    <Image
                      src={cleanImageUrl(images[0].url)}
                      alt='Img'
                      style={styles.image}
                    />
                  ) : (
                    <Text style={{ color: "red", fontSize: 10 }}>
                      Image not available
                    </Text>
                  )}
                  {images[0]?.noteForAdmin && (
                    <Text style={styles.note}>
                      Note: {images[0].noteForAdmin}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.imageRow}>
                  {images.slice(0, 2).map((img, imgIndex) => (
                    <View
                      key={`img-${img._id || imgIndex}`}
                      style={styles.imageContainer}>
                      {img.url ? (
                        <Image
                          src={cleanImageUrl(img.url)}
                          alt='Img'
                          style={styles.image}
                        />
                      ) : (
                        <Text style={{ color: "red", fontSize: 10 }}>
                          Image not available
                        </Text>
                      )}
                      {img.noteForAdmin && (
                        <Text style={styles.note}>
                          Note: {img.noteForAdmin}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Footer on every page */}
        <Footer />

        {/* Page number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
          fixed
        />
      </Page>

      {/* Additional pages if there are more sections */}
      {Array.from({
        length: Math.ceil(
          (sections.length - sectionsPerPage) / sectionsPerPage,
        ),
      }).map((_, pageIndex) => {
        const startIndex = sectionsPerPage + pageIndex * sectionsPerPage;
        const endIndex = startIndex + sectionsPerPage;
        const pageSections = sections.slice(startIndex, endIndex);

        return (
          <Page key={`page-${pageIndex + 2}`} size='A4' style={styles.page}>
            {/* Header on every page */}
            <Header jobData={jobData} />

            <ReportHeaderInfo jobData={jobData} />

            {/* Dynamic sections for this page */}
            {pageSections.map(([label, images], index) => (
              <View key={`section-${label}-${startIndex + index}`} wrap={false}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{label}</Text>
                  {images.length === 1 ? (
                    <View style={styles.imageSingle}>
                      {images[0]?.url ? (
                        <Image
                          src={images[0].url}
                          alt='Img'
                          style={styles.image}
                        />
                      ) : (
                        <Text style={{ color: "red", fontSize: 10 }}>
                          Image not available
                        </Text>
                      )}
                      {images[0]?.noteForAdmin && (
                        <Text style={styles.note}>
                          Note: {images[0].noteForAdmin}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.imageRow}>
                      {images.slice(0, 2).map((img, imgIndex) => (
                        <View
                          key={`img-${img._id || imgIndex}`}
                          style={styles.imageContainer}>
                          {img.url ? (
                            <Image
                              src={img.url}
                              alt='Img'
                              style={styles.image}
                            />
                          ) : (
                            <Text style={{ color: "red", fontSize: 10 }}>
                              Image not available
                            </Text>
                          )}
                          {img.noteForAdmin && (
                            <Text style={styles.note}>
                              Note: {img.noteForAdmin}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}

            {/* Footer on every page */}
            <Footer />

            {/* Page number */}
            <Text
              style={styles.pageNumber}
              render={({ pageNumber }) => `${pageNumber}`}
              fixed
            />
          </Page>
        );
      })}
    </Document>,
  ).toBlob();

  saveAs(blob, "inspection_report.pdf");
};
