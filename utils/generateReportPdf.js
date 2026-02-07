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

// Images
const HEADER_IMAGE_URL = "/header.png";
const FOOTER_LEFT_IMAGE_URL = "/footer.png";
const FOOTER_RIGHT_IMAGE_URL = "/footer.png";

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
  companySubtitle: {
    fontSize: 8,
    color: "#474747",
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 18,
    color: "#2D8D7C",
    marginBottom: 2,
    fontWeight: "bold",
  },
  attachmentText: {
    fontSize: 10,
    color: "#666666",
    marginTop: 2,
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
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    fontSize: 10,
  },
  infoLeft: {
    flexDirection: "row",
    width: "56%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 15,
  },
  infoRight: {
    flexDirection: "row",
    width: "40%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
  },
  value: {
    flex: 1,
    color: "#5D5656",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#323539",
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
    width: "48%",
  },
  imageSingle: {
    width: "48%",
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
    fontSize: 8,
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

// Header Component - appear on every page
const Header = ({ jobData }) => (
  <View style={styles.headerContainer} fixed>
    <Image src={HEADER_IMAGE_URL} alt='Img' style={styles.headerImage} />
    <Text style={styles.companySubtitle}>
      A Div. of Lone Star Building Inspection, Inc.
    </Text>
    <Text style={styles.mainTitle}>Inspection report</Text>
    <Text style={styles.attachmentText}>
      Attachment to FHA form # {jobData?.fhaCaseDetailsNo || "92051"}
    </Text>
  </View>
);

// Footer Component - appear on every page
const Footer = () => (
  <View style={styles.footer} fixed>
    <Image src={FOOTER_LEFT_IMAGE_URL} alt='Img' style={styles.footerImage} />
    <Text style={styles.footerText}>
      All Utilities Are On And Tested Unless Otherwise Noted{"\n"}
      TREC Lic. #10546 | TSBPE Lic. #1-38386 | Code Enforcement Lic. #7055 |
      HUD-FHA Fee Reg. #{"\n"}
      D683 & 203K - D0931
    </Text>
    <Image src={FOOTER_RIGHT_IMAGE_URL} alt='Img' style={styles.footerImage} />
  </View>
);

const convertToPngBase64 = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new window.Image(); // ← Use window.Image instead of Image
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL("image/png"); // or "image/jpeg", 0.85
      resolve(base64);
    };

    img.onerror = (err) => {
      console.error("Image load failed:", url, err);
      reject(err);
    };

    img.src = url;
  });
};
export const generateReportPdf = async (imagesByLabel, jobData = {}) => {
  console.log("Original imagesByLabel:", imagesByLabel);

  const processedByLabel = {};

  for (const [label, images] of Object.entries(imagesByLabel)) {
    processedByLabel[label] = await Promise.all(
      images.map(async (img) => {
        if (!img?.url) return img;

        const cleanUrl = cleanImageUrl(img.url);
        const ext =
          (img.mimeType?.split("/")[1] || "").toLowerCase() ||
          cleanUrl.split(".").pop()?.split("?")[0]?.toLowerCase() ||
          "";

        if (ext === "webp") {
          try {
            const base64 = await convertToPngBase64(cleanUrl);
            console.log(`Converted ${img.fileName} to PNG base64`);
            return { ...img, url: base64 };
          } catch (err) {
            console.warn(`WebP conversion failed for ${img.fileName}:`, err);
            return { ...img, url: null }; // → will show your "Image not available" placeholder
          }
        }

        // Non-webp → just clean URL
        return { ...img, url: cleanUrl };
      }),
    );
  }

  console.log("Processed imagesByLabel:", processedByLabel);

  const sections = Object.entries(processedByLabel);

  // Calculate how many sections per page
  const sectionsPerPage = 2;

  const blob = await pdf(
    <Document>
      {/* Page 1 - with Info Section */}
      <Page size='A4' style={styles.page}>
        {/* Header on every page */}
        <Header jobData={jobData} />

        {/* Info Section - Only on first page */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.label}>Type of Inspection:</Text>
              <Text style={styles.value}>
                {jobData?.formType || "HUD-FHA 92051 Compliance - FINAL"}
              </Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.label}>Date of Inspection:</Text>
              <Text style={styles.value}>
                {jobData?.inspectionDate || new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.label}>Subject Property:</Text>
              <Text style={styles.value}>
                {jobData?.streetAddress || "N/A"},{" "}
                {jobData?.developmentName || ""}
              </Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.label}>Case #:</Text>
              <Text style={styles.value}>
                {jobData?.fhaCaseDetailsNo || jobData?.caseNumber || "N/A"}
              </Text>
            </View>
          </View>
        </View>

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

            {/* Dynamic sections for this page */}
            {pageSections.map(([label, images], index) => (
              <View key={`section-${label}-${startIndex + index}`} wrap={false}>
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
        );
      })}
    </Document>,
  ).toBlob();

  saveAs(blob, "inspection_report.pdf");
};
