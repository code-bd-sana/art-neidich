import Image from "next/image";
import Link from "next/link";
import HeaderImage from "../../../public/header/header.png";

export default function AccountDeletionPolicy() {
  const sections = [
    {
      number: "1.",
      title: "App Overview",
      content:
        "This application has two separate user roles: \n● Admin\n● Inspector\nEach role has a different access flow for account deletion, but both lead to permanent deletion of user data.",
    },
    {
      number: "2.",
      title: "ADMIN ACCOUNT DELETION FLOW",
      subsections: [
        {
          subNumber: "2.1",
          title: "Access Method",
          content:
            "Admin users can delete their account from:\n● Overview Screen\n● Tap 3-dot menu (AppBar)",
        },
        {
          subNumber: "2.2",
          title: "Deletion Steps",
          content:
            "1. Open Settings Screen\n2. Tap Delete Account\n3. Confirmation popup appears\n4. Input field is shown\n5. Type: DELETE\n6. Press Confirm delete account",
        },
        {
          subNumber: "2.3",
          title: "Result",
          content:
            "After confirmation:\n● Admin account is permanently deleted\n● All related data is removed\n● Action cannot be reversed",
        },
      ],
    },
    {
      number: "3.",
      title: "INSPECTOR ACCOUNT DELETION FLOW",
      subsections: [
        {
          subNumber: "3.1",
          title: "Access Method",
          content:
            "Inspector users can delete their account from:\n● Bottom Navigation Bar\n● Tap Settings tab",
        },
        {
          subNumber: "3.2",
          title: "Deletion Steps",
          content:
            "1. Open Settings screen\n2. Tap Delete Account\n3. Confirmation popup appears\n4. Input field is shown\n5. Type: DELETE\n6. Press Confirm delete account",
        },
        {
          subNumber: "3.3",
          title: "Result",
          content:
            "After confirmation:\n● Inspector account is permanently deleted\n● All associated data is removed\n● Action cannot be undone",
        },
      ],
    },
    {
      number: "4.",
      title: "IMPORTANT NOTES",
      content:
        "● Deletion is permanent and irreversible\n● All user data is fully removed from the system",
    },
    {
      number: "5.",
      title: "Support / Contact (Optional)",
      content:
        "If users face issues deleting their account, they may contact support via the app or official support email.",
    },
  ];

  return (
    <div className='min-h-screen bg-white font-sans text-gray-700'>
      {/* Header */}
      <header className='border-b border-gray-100 px-6 py-1 flex items-center justify-center'>
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
      <main className='max-w-5xl mx-auto p-6'>
        {/* Title */}
        <h1 className='text-3xl font-bold text-gray-600 mb-1'>
          Account Deletion Policy -{" "}
          <span className='text-[#FF7F60] text-[28px]'>FHA Inspector App</span>
        </h1>

        {/* Effective Date */}
        <p className='text-[#2D8D7C] font-medium text-base mb-4'>
          Effective Date: April 28, 2026
        </p>

        {/* Sections */}
        <div className='space-y-8'>
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className='text-2xl font-semibold text-gray-600 mb-2 pb-1 border-b border-gray-100'>
                {section.number} {section.title}
              </h2>

              {section.content && (
                <p className='text-sm text-gray-600 mb-3 leading-relaxed whitespace-pre-line'>
                  {section.content.split("\n").map((line, idx) => {
                    if (line.trim().startsWith("●")) {
                      return (
                        <span key={idx} className='block'>
                          <span className='text-[#2D8D7C] font-medium'>●</span>
                          {line.substring(1)}
                        </span>
                      );
                    }
                    return (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    );
                  })}
                </p>
              )}

              {section.subsections && (
                <div className='mt-4 space-y-4'>
                  {section.subsections.map((sub, j) => (
                    <div key={j}>
                      <h3 className='text-xl font-medium text-gray-700 mt-2 mb-2'>
                        {sub.subNumber} {sub.title}
                      </h3>
                      <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-line'>
                        {sub.content.split("\n").map((line, idx) => {
                          if (line.trim().startsWith("●")) {
                            return (
                              <span key={idx} className='block'>
                                <span className='text-[#2D8D7C] font-medium'>
                                  ●
                                </span>
                                {line.substring(1)}
                              </span>
                            );
                          }
                          if (line.trim().match(/^\d+\./)) {
                            return (
                              <span key={idx} className='block'>
                                <span className='text-[#2D8D7C] font-medium'>
                                  {line.match(/^\d+\./)?.[0]}
                                </span>
                                {line.substring(
                                  line.match(/^\d+\./)?.[0].length || 0,
                                )}
                              </span>
                            );
                          }
                          return (
                            <span key={idx}>
                              {line}
                              <br />
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Contact Section */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-600 mb-2 pb-1 border-b border-gray-100'>
              6. Contact Us
            </h2>
            <p className='text-sm text-gray-600 mb-3'>
              If you have any questions, concerns, or requests regarding this
              Account Deletion Policy, please feel free to reach out to us:
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
