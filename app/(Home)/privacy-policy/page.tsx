import Image from "next/image";
import Link from "next/link";
import HeaderImage from "../../../public/header/header.png";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      number: "1.",
      title: "Information We Collect",
      content:
        "We collect only the information needed to run the App properly:",
      subsections: [
        {
          label: "a. Account Info",
          text: "We collect your name and email address to identify whether you are an Inspector or an Admin and give you access to the right features.",
        },
        {
          label: "b. Photos & Images",
          text: "We access photos only when you take a photo or choose one from your gallery during a job submission. We never access your camera or gallery in the background.",
        },
        {
          label: "c. Device Info",
          text: "We collect basic details like your phone model and iOS/Android version to keep the App running smoothly. We also use a device token from Firebase to send you job-related notifications.",
        },
      ],
      bullets: [],
    },
    {
      number: "2.",
      title: "How We Use Your Information",
      content:
        "We use the information collected through this App for the following purposes:",
      subsections: [],
      bullets: [
        {
          label: "Job Management",
          text: "To assign, track, and manage inspection jobs across Pending, Overdue, and Completed statuses.",
        },
        {
          label: "Job Submission",
          text: "To allow Inspectors to submit completed jobs with labels and images attached.",
        },
        {
          label: "Report Generation",
          text: "To enable Admins to review submitted inspections and download reports in PDF format.",
        },
        {
          label: "Notifications",
          text: "To send real-time job alerts to Inspectors and Admins based on their notification preferences.",
        },
        {
          label: "Help & Support",
          text: "To facilitate communication via email, office calls, and inspection guideline downloads.",
        },
      ],
      note: "We do not use your data for advertising, profiling, or any purpose beyond what is described above.",
    },
    {
      number: "3.",
      title: "Permissions We Use",
      content:
        "This App requires the following device permissions to function properly:",
      subsections: [],
      bullets: [
        {
          label: "Camera",
          text: "Used to capture images during inspection job submissions.",
        },
        {
          label: "Photo & Media",
          text: "Used to select images from the device gallery for inspection reports.",
        },
        {
          label: "Notifications",
          text: "Used to send real-time job alerts such as Pending, Overdue, and Completed updates.",
        },
        {
          label: "Phone Dial",
          text: "Used to initiate calls via the Call Office feature in Help & Support. No call data is collected or stored by the App.",
        },
      ],
    },
    {
      number: "4.",
      title: "Data Sharing and Disclosure",
      content:
        "We do not sell or rent your personal data to any third party. Your data is only shared in the following cases:",
      subsections: [],
      bullets: [
        {
          label: "Internal Access",
          text: "Job details and images are accessible only to authorized admin users within the system.",
        },
        {
          label: "Service Providers",
          text: "We share necessary data with trusted providers such as Google Firebase (for push notifications) and Amazon Web Services (for secure storage). These providers are only allowed to use the data to provide their services and cannot use it for any other purpose.",
        },
        {
          label: "Legal Requirements",
          text: "We may disclose your information if required by law or in response to a valid request from a government or legal authority.",
        },
      ],
    },
    {
      number: "5.",
      title: "Data Retention",
      content:
        "We retain your data only for as long as necessary to manage inspection jobs and fulfill the purposes outlined in this policy:",
      subsections: [],
      bullets: [
        {
          label: "Job Data",
          text: "Retained as long as required for administrative review or PDF report generation.",
        },
        {
          label: "Media",
          text: "Images submitted during inspections are stored securely on our AWS servers until the associated job record is deleted.",
        },
        {
          label: "User Request",
          text: "You can request the deletion of your personal data at any time through the Help & Support section or via the contact details in Section 11.",
        },
      ],
    },
    {
      number: "6.",
      title: "Data Security",
      content:
        "We prioritize the safety of your information and implement industry-standard measures to protect against:",
      subsections: [],
      bullets: [
        { text: "Unauthorized access" },
        { text: "Data loss or misuse" },
      ],
      note: "All data is transmitted securely via HTTPS/TLS to our AWS servers. However, please note that no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      number: "7.",
      title: "User Rights",
      content: "As a user of this App, you have the following rights:",
      subsections: [],
      bullets: [
        {
          label: "Access",
          text: "You can request access to your personal data.",
        },
        {
          label: "Correction",
          text: "You can request correction of any inaccurate or incomplete information.",
        },
        {
          label: "Deletion",
          text: "You can request deletion of your personal data from our systems.",
        },
        {
          label: "Notifications",
          text: "You can enable or disable job notifications at any time via Settings > Notifications in the App.",
        },
      ],
      note: "To submit a request, please contact us through the Help & Support section or refer to Section 11.",
    },
    {
      number: "8.",
      title: "Third-Party Services",
      content:
        "We use trusted third-party service providers to support the core features of the App and ensure smooth operation. Your data is processed in accordance with their respective privacy policies:",
      subsections: [
        {
          label: "Google Firebase (FCM)",
          text: "We use Firebase Cloud Messaging to send real-time push notifications about job status updates. Firebase may collect device identifiers and usage data to deliver notifications properly.",
          link: {
            label: "Privacy Policy",
            url: "https://policies.google.com/privacy",
          },
        },
        {
          label: "Amazon Web Services (AWS)",
          text: "Our backend and application data are hosted on AWS. This includes secure storage of inspection job details, labels, and uploaded images. AWS uses industry-standard security to protect your data.",
          link: {
            label: "Privacy Policy",
            url: "https://aws.amazon.com/privacy/?nc1=f_pr",
          },
        },
      ],
      bullets: [],
      note: "These providers only process the minimum data required to perform their services and are not allowed to use your data for any other purpose.",
    },
    {
      number: "9.",
      title: "Children's Privacy",
      content:
        "This App is intended for use by professional inspectors and authorized administrative personnel only and is not directed to children under the age of 13. We do not knowingly collect, store, or process personal data from children. If we become aware that a child under 13 has submitted personal data without parental consent, we will take steps to delete that information promptly. If you believe a child has provided data through the App, please contact us using the details in Section 11.",
      subsections: [],
      bullets: [],
    },
    {
      number: "10.",
      title: "Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time. When such changes occur, we will update the Effective Date and notify users through in-app notifications. We recommend reviewing this policy occasionally to stay informed.",
      subsections: [],
      bullets: [],
    },
    {
      number: "11.",
      title: "Account & Data Deletion",
      content:
        "You have the right to request deletion of your account and all associated data at any time.",
      subsections: [],
      bullets: [
        {
          label: "In-App",
          text: "Go to Settings > Delete Account and follow the on-screen instructions.",
        },
        {
          label: "Via Email",
          text: 'Send a request to [Email] with the subject line "Data Deletion Request".',
        },
      ],
      note: "Once received, we will permanently delete your account, job data, submitted reports, and uploaded images from our servers within 7–15 business days.",
    },
  ];

  return (
    <div className='min-h-screen bg-white font-sans text-gray-700'>
      {/* Header */}
      <header className='border-b border-gray-100 px-6 py-4'>
        <Link
          href='/'
          className='text-lg font-semibold text-gray-900 tracking-tight'>
          <Image
            src={HeaderImage}
            alt='A-Inspect'
            className='w-auto'
            height={100}
            width={100}
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-6 py-10'>
        {/* Title */}
        <h1 className='text-3xl font-bold text-gray-600 mb-1'>
          Privacy Policy{" "}
          {/* <span className='text-[#FF7F60]'>FHA Inspector App</span> */}
        </h1>

        {/* Effective Date */}
        <p className='text-[#2D8D7C] font-medium text-base mb-4'>
          Effective Date: April 23, 2026
        </p>

        {/* Intro */}
        <p className='text-sm text-gray-600 mb-8 leading-relaxed'>
          This Privacy Policy explains how the{" "}
          <span className='font-medium text-gray-800'>FHA Inspector App</span>{" "}
          (&quot;App,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          collects, uses, and protects your information. This App is designed
          for professional use by Inspectors and Admins to manage and submit
          inspection jobs. By downloading or using this App, you agree to the
          terms of this Privacy Policy.
        </p>

        {/* Sections */}
        <div className='space-y-8'>
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className='text-2xl font-semibold text-gray-600 mb-2 pb-1 border-b border-gray-100'>
                {section.number} {section.title}
              </h2>

              {section.content && (
                <p className='text-sm text-gray-600 mb-3 leading-relaxed'>
                  {section.content}
                </p>
              )}

              {/* Subsections (a, b, c...) */}
              {section.subsections && section.subsections.length > 0 && (
                <div className='space-y-3 mb-3'>
                  {section.subsections.map((sub, j) => (
                    <div
                      key={j}
                      className='text-sm text-gray-600 leading-relaxed'>
                      <span className='font-medium text-gray-800'>
                        {sub.label}:{" "}
                      </span>
                      {sub.text}
                      {sub.link && (
                        <>
                          {" "}
                          <a
                            href={sub.link.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-[#2D8D7C] hover:underline'>
                            {sub.link.label}
                          </a>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bullets */}
              {section.bullets && section.bullets.length > 0 && (
                <ul className='space-y-2 mb-3'>
                  {section.bullets.map((b, j) => (
                    <li
                      key={j}
                      className='flex items-start gap-2 text-sm text-gray-600'>
                      <span className='mt-1.5 w-2 h-2 rounded-full bg-[#2D8D7C] shrink-0' />
                      <span>
                        {b.label && (
                          <span className='font-medium text-[#2D8D7C]'>
                            {b.label}:{" "}
                          </span>
                        )}
                        {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Note */}
              {section.note && (
                <p className='text-sm text-gray-500 italic leading-relaxed'>
                  {section.note}
                </p>
              )}
            </section>
          ))}

          {/* Contact Section */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-600  mb-2 pb-1 border-b border-gray-100'>
              12. Contact Us
            </h2>
            <p className='text-sm text-gray-600 mb-3'>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or your personal data, please feel free to reach
              out to us:
            </p>
            <ul className='space-y-2'>
              <li className='flex items-start gap-2 text-sm text-gray-600'>
                <span className='mt-1.5 w-2 h-2 rounded-full bg-[#2D8D7C] shrink-0' />
                <span>
                  <span className='font-medium text-[#2D8D7C]'>Email: </span>
                  <a
                    href='mailto:info@a-inspect.com'
                    className='text-[#2D8D7C] hover:underline'>
                    info@a-inspect.com
                  </a>
                </span>
              </li>
              <li className='flex items-start gap-2 text-sm text-gray-600'>
                <span className='mt-1.5 w-2 h-2 rounded-full bg-[#2D8D7C] shrink-0' />
                <span>
                  <span className='font-medium text-[#2D8D7C]'>Support: </span>
                  You can also contact us directly through the Help &amp;
                  Support section within the App.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-gray-100 mt-12 px-6 py-4 text-center text-xs text-gray-400'>
        © {new Date().getFullYear()} a-inspect.com · All rights reserved.
      </footer>
    </div>
  );
}
