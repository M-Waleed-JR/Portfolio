"use client";

import { useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import styles from "./Contact.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const INQUIRY_INTENTS = [
  { id: "fulltime", label: "Full-Time Role", icon: BriefcaseIcon },
  { id: "project", label: "Next.js / React App", icon: CodeIcon },
  { id: "freelance", label: "Freelance Project", icon: ZapIcon },
  { id: "connect", label: "Saying Hi / Networking", icon: MessageIcon },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState("fulltime");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const emailAddress = "mooowalid@gmail.com";
  const whatsappNumber = "201282184424";
  const whatsappDisplay = "Contact me directly";
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";

  const handleSpotlight = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = emailAddress;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleOpenMailApp = (e) => {
    e.preventDefault();
    const activeIntent = INQUIRY_INTENTS.find((i) => i.id === selectedIntent);
    const intentLabel = activeIntent ? activeIntent.label : "General Inquiry";

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${encodeURIComponent(`[Studio Inquiry] ${intentLabel}`)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const getWhatsappLink = () => {
    const activeIntent = INQUIRY_INTENTS.find((i) => i.id === selectedIntent);
    const topic = activeIntent ? activeIntent.label : "a general inquiry";
    const text = `Hi Waleed, I found your portfolio and I'd like to talk about: ${topic}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.state === "error") {
      setStatus({ state: "idle", message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessKey) {
      setStatus({
        state: "error",
        message:
          "Web3Forms Access Key is missing! Please check your .env.local file.",
      });
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setStatus({
        state: "error",
        message: "Please fill in your name, email, and message before sending.",
      });
      return;
    }

    setStatus({ state: "loading", message: "" });

    try {
      const activeIntent = INQUIRY_INTENTS.find((i) => i.id === selectedIntent);
      const intentLabel = activeIntent ? activeIntent.label : "General";

      const submitData = new FormData();
      submitData.append("access_key", accessKey);
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("message", formData.message);
      submitData.append("inquiry_type", intentLabel);
      submitData.append(
        "subject",
        `[Studio Inquiry] ${formData.name} - ${intentLabel}`,
      );

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          state: "success",
          message:
            "Thank you! Your message has been sent directly to " + emailAddress,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          state: "error",
          message:
            result.message ||
            "Failed to send message. Please try emailing directly.",
        });
      }
    } catch {
      setStatus({
        state: "error",
        message:
          "Network error encountered. Please check your connection or email directly.",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLoading = status.state === "loading";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={`${styles.section} ${bricolage.className}`}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.container}>
        {/* ================= SECTION HEADER ================= */}
        <header className={styles.header}>
          <div className={styles.statusPill} role="status">
            <span className={styles.statusBeacon} aria-hidden="true">
              <span className={styles.beaconCore} />
              <span className={styles.beaconRing} />
            </span>
            <span className={styles.statusText}>
              Available for Junior Front-End Roles & Projects
            </span>
          </div>

          <h2 id="contact-heading" className={styles.heroTitle}>
            Let’s build something{" "}
            <span className={styles.glowText}>remarkable</span> together.
          </h2>

          <p className={styles.heroSubtitle}>
            Have an open position, an ambitious product to launch, or want to
            explore modern React & Next.js engineering? My inbox is always open.
          </p>
        </header>

        {/* ================= MAIN INTERACTION CANVAS ================= */}
        <div className={styles.interactionCanvas}>
          {/* ---------- LEFT COLUMN ---------- */}
          <div className={styles.channelsColumn}>
            <div
              className={`${styles.doubleBezel} ${styles.emailHeroCard}`}
              onMouseMove={handleSpotlight}
            >
              <div className={styles.bezelInner}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardEyebrow}>
                    <MailIcon className={styles.eyebrowIcon} />
                    <span>Direct Channel</span>
                  </div>
                  <span className={styles.responseBadge}>
                    Quick Response &lt; 24h
                  </span>
                </div>

                <div className={styles.emailBody}>
                  <p className={styles.emailPrompt}>Drop a line anytime:</p>
                  <a
                    href={`mailto:${emailAddress}`}
                    className={styles.emailDisplayLink}
                  >
                    {emailAddress}
                  </a>
                </div>

                <div className={styles.emailActions}>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`${styles.actionPillBtn} ${copied ? styles.actionPillCopied : ""}`}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className={styles.btnIcon} />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className={styles.btnIcon} />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMailApp}
                    className={styles.actionPillGhost}
                  >
                    <span>Open Mail App</span>
                    <ArrowUpRightIcon className={styles.btnIcon} />
                  </button>
                </div>
              </div>
            </div>

            <a
              href={getWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.doubleBezel} ${styles.githubCard} ${styles.waCard}`}
              onMouseMove={handleSpotlight}
              aria-label={`Chat on WhatsApp ${whatsappDisplay}`}
            >
              <div className={styles.bezelInner}>
                <div className={styles.githubLeft}>
                  <div className={styles.githubIconWrap} aria-hidden="true">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <div className={styles.githubEyebrow}>WhatsApp</div>
                    <h3 className={styles.githubHandle}>{whatsappDisplay}</h3>
                    <p className={styles.githubBio}>
                      Start a private chat with me directly
                    </p>
                  </div>
                </div>

                <div className={styles.githubArrowWrap} aria-hidden="true">
                  <ArrowUpRightIcon />
                </div>
              </div>
            </a>

            <div
              className={`${styles.doubleBezel} ${styles.locationCard}`}
              onMouseMove={handleSpotlight}
            >
              <div className={styles.bezelInner}>
                <div className={styles.locationLeft}>
                  <div className={styles.locationIconWrap} aria-hidden="true">
                    <PinIcon />
                  </div>
                  <div>
                    <div className={styles.cardEyebrow}>Base Location</div>
                    <h3 className={styles.locationTitle}>Egypt 🇪🇬</h3>
                    <p className={styles.locationDetail}>
                      Remote Worldwide • Open to Relocation
                    </p>
                  </div>
                </div>

                <div className={styles.locationBadge}>
                  <span
                    className={styles.locationBadgeDot}
                    aria-hidden="true"
                  />
                  <span>Available Worldwide</span>
                </div>
              </div>
            </div>

            <a
              href="https://github.com/M-Waleed-JR"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.doubleBezel} ${styles.githubCard}`}
              onMouseMove={handleSpotlight}
            >
              <div className={styles.bezelInner}>
                <div className={styles.githubLeft}>
                  <div className={styles.githubIconWrap} aria-hidden="true">
                    <GitHubIcon />
                  </div>
                  <div>
                    <div className={styles.githubEyebrow}>
                      Open Source & Projects
                    </div>
                    <h3 className={styles.githubHandle}>
                      github.com/M-Waleed-JR
                    </h3>
                    <p className={styles.githubBio}>
                      Explore codebases, components, and experiments
                    </p>
                  </div>
                </div>

                <div className={styles.githubArrowWrap} aria-hidden="true">
                  <ArrowUpRightIcon />
                </div>
              </div>
            </a>
          </div>

          {/* ---------- RIGHT COLUMN: FORM ---------- */}
          <div className={`${styles.doubleBezel} ${styles.terminalShell}`}>
            <div className={styles.bezelInner}>
              <div className={styles.terminalHeader}>
                <div>
                  <div className={styles.cardEyebrow}>
                    <SparklesIcon className={styles.eyebrowIcon} />
                    <span>Interactive Inquiry Studio</span>
                  </div>
                  <h3 className={styles.terminalHeading}>
                    Send a direct message
                  </h3>
                </div>
              </div>

              <div className={styles.intentSelector}>
                <p className={styles.intentLabel}>
                  What are you looking to collaborate on?
                </p>
                <div className={styles.intentPills} role="radiogroup">
                  {INQUIRY_INTENTS.map((intent) => {
                    const isSelected = selectedIntent === intent.id;
                    const IconComponent = intent.icon;
                    return (
                      <button
                        key={intent.id}
                        type="button"
                        disabled={isLoading}
                        onClick={() => setSelectedIntent(intent.id)}
                        className={`${styles.intentPill} ${isSelected ? styles.intentPillActive : ""}`}
                      >
                        <IconComponent className={styles.intentSvgIcon} />
                        <span>{intent.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.terminalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-name" className={styles.labelWrapper}>
                    <span className={styles.labelIndex}>01</span>
                    <span className={styles.labelText}>Your Name</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      disabled={isLoading}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Alex Morgan"
                      className={styles.textInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label
                    htmlFor="contact-email"
                    className={styles.labelWrapper}
                  >
                    <span className={styles.labelIndex}>02</span>
                    <span className={styles.labelText}>Email Address</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      disabled={isLoading}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alex@example.com"
                      className={styles.textInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label
                    htmlFor="contact-message"
                    className={styles.labelWrapper}
                  >
                    <span className={styles.labelIndex}>03</span>
                    <span className={styles.labelText}>Your Message</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      disabled={isLoading}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about the role, project goals, timeline..."
                      className={styles.textAreaInput}
                    />
                  </div>
                </div>

                {status.state === "success" && (
                  <div className={styles.bannerSuccess}>
                    <CheckCircleIcon />
                    <div>
                      <h4 className={styles.bannerHeading}>
                        Message Dispatched
                      </h4>
                      <p className={styles.bannerMessage}>{status.message}</p>
                    </div>
                  </div>
                )}

                {status.state === "error" && (
                  <div className={styles.bannerError}>
                    <AlertCircleIcon />
                    <div>
                      <h4 className={styles.bannerHeading}>
                        Transmission Notice
                      </h4>
                      <p className={styles.bannerMessage}>{status.message}</p>
                      <button
                        type="button"
                        onClick={handleOpenMailApp}
                        className={styles.bannerDirectLink}
                      >
                        Click here to open Gmail directly →
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.buttonInButtonCTA}
                >
                  <span className={styles.btnLabel}>
                    {isLoading ? "Transmitting Inquiry..." : "Send Message"}
                  </span>
                  <span className={styles.btnIconDisk}>
                    {isLoading ? (
                      <span className={styles.btnSpinner} />
                    ) : (
                      <SendIcon className={styles.btnSendArrow} />
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <footer className={styles.footer}>
          <div className={styles.footerBrand}>
            <span className={styles.footerName}>Mohamed Waleed</span>
            <span className={styles.footerRole}>
              Junior Front-End Developer
            </span>
            <span className={styles.footerLoc}>Al-Sharqia, Egypt</span>
          </div>

          <div className={styles.footerCenter}>
            <span className={styles.footerCopyright}>
              © {new Date().getFullYear()} Mohamed Waleed. All rights reserved.
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.toTopBtn}
          >
            <span>Back to top</span>
            <ArrowUpIcon />
          </button>
        </footer>
      </div>
    </section>
  );
}

/* ===================================================
   SVG Icons & Components
   =================================================== */

function BriefcaseIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CodeIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ZapIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function MessageIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SparklesIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function CopyIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
