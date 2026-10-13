import {
  ArrowRight,
  Github,
  Lightbulb,
  Play,
  Search,
  Target,
} from 'lucide-react'

export default function PageHeader({ onStartAnalysis }) {
  return (
    <section className="relative mb-5 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-[var(--card-shadow)] backdrop-blur-sm sm:px-7 sm:py-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-[5%] top-[-170px] h-[320px] w-[440px] rounded-full bg-[var(--surface)] blur-3xl" />

      <div className="pointer-events-none absolute right-[20%] top-[20px] h-[220px] w-[260px] rounded-full bg-[var(--bg-edge)] blur-2xl" />

      <div className="relative flex min-h-[150px] items-center">
        {/* LEFT CONTENT */}
        <div className="relative z-10">
          {/* Welcome */}

          {/* Main heading */}
          <h1 className="max-w-[620px] text-[34px] font-medium leading-[1.08] text-[var(--ink)] sm:text-[40px]">
            Ideas into insight.
            <span className="text-[var(--text)]"> Make room for what's next.</span>
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-[560px] text-sm leading-6 text-[var(--text)]">
            InnoGap helps you discover existing solutions, research,
            projects and implementations before you build. Go beyond
            similarity — find the real gap.
          </p>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartAnalysis}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--on-accent)] shadow-[var(--card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Start New Analysis

              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>


          </div>
        </div>

       {/* ================= EXACT RIGHT-SIDE VISUAL ================= */}
<div className="hidden">

  {/* Main soft blue circular glow */}
  <div
    className="
      absolute
      left-[125px]
      top-[-35px]
      h-[355px]
      w-[355px]
      rounded-full
      bg-[var(--bg)]
    "
  />

  <div
    className="
      absolute
      left-[155px]
      top-[-5px]
      h-[290px]
      w-[290px]
      rounded-full
      bg-[var(--bg-edge)]
      blur-[1px]
    "
  />

  {/* =====================================================
      BACK / GLASS LAYERS
  ====================================================== */}

  <div
    className="
      absolute
      left-[70px]
      top-[45px]
      h-[225px]
      w-[380px]
      rounded-[18px]
      border
      border-[var(--border)]
      bg-[var(--surface)]
      shadow-[var(--card-shadow)]
      backdrop-blur-[2px]
    "
  />

  <div
    className="
      absolute
      left-[88px]
      top-[60px]
      h-[220px]
      w-[355px]
      rounded-[18px]
      border
      border-[var(--border)]
      bg-[var(--surface)]
    "
  />

  {/* =====================================================
      YOUR IDEA CARD
  ====================================================== */}

  <div
    className="
      absolute
      left-[83px]
      top-[90px]
      z-30
      flex
      h-[120px]
      w-[122px]
      flex-col
      items-center
      justify-center
      rounded-[13px]
      border
      border-[var(--border)]
      bg-[var(--surface)]
      shadow-[var(--card-shadow)]
    "
  >
    <div
      className="
        mb-[9px]
        flex
        h-[40px]
        w-[40px]
        items-center
        justify-center
        rounded-[11px]
        bg-[var(--icon-tile)]
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[21px] w-[21px] text-[var(--ink)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.74c.63.45 1 1.18 1 1.95V17h6v-.31c0-.77.37-1.5 1-1.95A7 7 0 0 0 12 2Z" />
      </svg>
    </div>

    <span className="text-[11px] font-semibold text-[var(--ink)]">
      Your Idea
    </span>
  </div>

  {/* =====================================================
      IDEA → SOURCES ARROW
  ====================================================== */}

  <svg
    className="pointer-events-none absolute inset-0 z-20"
    viewBox="0 0 560 315"
    fill="none"
  >
    <path
      d="M205 150 C228 150 235 150 257 150"
      stroke="var(--muted)"
      strokeWidth="1.2"
    />

    <path
      d="M251 146 L258 150 L251 154"
      stroke="var(--muted)"
      strokeWidth="1.2"
      fill="none"
    />
  </svg>

  {/* =====================================================
      SOURCE STACK
  ====================================================== */}

  <div
    className="
      absolute
      left-[270px]
      top-[38px]
      z-30
      flex
      flex-col
      gap-[7px]
    "
  >

    {/* Research */}
    <div
      className="
        flex
        h-[45px]
        w-[138px]
        items-center
        gap-[12px]
        rounded-[9px]
        border
        border-[var(--border)]
        bg-[var(--icon-tile)]
        px-[15px]
        shadow-[var(--card-shadow)]
      "
    >
      <div
        className="
          flex
          h-[22px]
          w-[22px]
          items-center
          justify-center
          text-[var(--ink)]
        "
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[20px] w-[20px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5Z" />
          <path d="M4 4.5v17" />
          <path d="M8 6h8" />
          <path d="M8 10h8" />
        </svg>
      </div>

      <span className="text-[11px] font-semibold text-[var(--ink)]">
        Research
      </span>
    </div>

    {/* GitHub */}
    <div
      className="
        flex
        h-[45px]
        w-[138px]
        items-center
        gap-[12px]
        rounded-[9px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        px-[15px]
        shadow-[var(--card-shadow)]
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[20px] w-[20px] text-[var(--ink)]"
        fill="currentColor"
      >
        <path d="M12 .7a11.3 11.3 0 0 0-3.6 22c.57.1.78-.25.78-.55v-2.13c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.54-.29-5.2-1.27-5.2-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17A10.9 10.9 0 0 1 12 5.84c.97 0 1.94.13 2.85.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.12 3.02.73.8 1.18 1.82 1.18 3.07 0 4.4-2.67 5.36-5.22 5.64.41.35.78 1.04.78 2.1v3.12c0 .3.2.65.79.54A11.3 11.3 0 0 0 12 .7Z" />
      </svg>

      <span className="text-[11px] font-semibold text-[var(--ink)]">
        GitHub
      </span>
    </div>

    {/* Projects */}
    <div
      className="
        flex
        h-[45px]
        w-[138px]
        items-center
        gap-[12px]
        rounded-[9px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        px-[15px]
        shadow-[var(--card-shadow)]
      "
    >
      <div
        className="
          flex
          h-[20px]
          w-[20px]
          items-center
          justify-center
          rounded-[4px]
          bg-[var(--ink)]
        "
      >
        <div className="h-[7px] w-[7px] rounded-[1px] bg-[var(--surface)]" />
      </div>

      <span className="text-[11px] font-semibold text-[var(--ink)]">
        Projects
      </span>
    </div>

    {/* Dots */}
    <div
      className="
        flex
        h-[39px]
        w-[138px]
        items-center
        justify-center
        rounded-[9px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-[var(--card-shadow)]
      "
    >
      <span className="text-[13px] tracking-[4px] text-[var(--muted)]">
        ...
      </span>
    </div>
  </div>

  {/* =====================================================
      SOURCE → GAP CONNECTIONS
  ====================================================== */}

  <svg
    className="pointer-events-none absolute inset-0 z-20"
    viewBox="0 0 560 315"
    fill="none"
  >
    {/* Research */}
    <path
      d="M408 61 C445 61 448 105 485 112"
      stroke="var(--muted)"
      strokeWidth="1.25"
    />

    {/* GitHub */}
    <path
      d="M408 113 C446 113 452 128 485 132"
      stroke="var(--muted)"
      strokeWidth="1.25"
    />

    {/* Projects */}
    <path
      d="M408 165 C445 165 450 150 485 148"
      stroke="var(--muted)"
      strokeWidth="1.25"
    />

    {/* Bottom dots */}
    <path
      d="M408 211 C448 211 451 175 485 163"
      stroke="var(--muted)"
      strokeWidth="1.25"
    />

    {/* Tiny endpoint dots */}
    <circle
      cx="485"
      cy="112"
      r="1.7"
      fill="var(--ink)"
    />

    <circle
      cx="485"
      cy="132"
      r="1.7"
      fill="var(--ink)"
    />

    <circle
      cx="485"
      cy="148"
      r="1.7"
      fill="var(--ink)"
    />

    <circle
      cx="485"
      cy="163"
      r="1.7"
      fill="var(--ink)"
    />
  </svg>

  {/* =====================================================
      POTENTIAL GAP CARD
  ====================================================== */}

  <div
    className="
      absolute
      right-[17px]
      top-[89px]
      z-30
      flex
      h-[122px]
      w-[91px]
      flex-col
      items-center
      justify-center
      rounded-[13px]
      border
      border-[var(--border)]
      bg-[var(--surface)]
      shadow-[var(--card-shadow)]
    "
  >
    <div
      className="
        mb-[9px]
        flex
        h-[38px]
        w-[38px]
        items-center
        justify-center
        rounded-[10px]
        bg-[var(--surface)]
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[20px] w-[20px] text-[var(--ink)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3.5v4" />
        <path d="M20.5 12h-4" />
        <path d="M12 20.5v-4" />
        <path d="M3.5 12h4" />
      </svg>
    </div>

    <span className="text-center text-[11px] font-bold leading-[1.35] text-[var(--ink)]">
      Potential
      <br />
      Gap
    </span>
  </div>

</div>
      </div>
    </section>
  )
}