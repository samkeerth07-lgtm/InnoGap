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
    <section className="relative mb-6 min-h-[340px] overflow-hidden bg-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-[5%] top-[-150px] h-[520px] w-[520px] rounded-full bg-blue-100/60 blur-3xl" />

      <div className="pointer-events-none absolute right-[20%] top-[20px] h-[360px] w-[360px] rounded-full bg-sky-100/40 blur-2xl" />

      <div className="relative grid min-h-[340px] items-center lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT CONTENT */}
        <div className="relative z-10 pb-8 pt-8 lg:py-10">
          {/* Welcome */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base">👋</span>

            <p className="text-base font-semibold text-slate-800">
              Welcome back, Samkeerth
            </p>
          </div>

          {/* Small description */}
          <p className="mb-5 text-sm text-slate-500">
            Turn your ideas into something greater with InnoGap.
          </p>

          {/* Main heading */}
          <h1 className="max-w-[620px] text-[42px] font-bold leading-[1.05] tracking-[-0.03em] text-[#102A56] xl:text-[46px]">
            Find what already exists.
            <br />
            <span className="text-blue-600">
              Build what doesn't.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[560px] text-[15px] leading-6 text-slate-500">
            InnoGap helps you discover existing solutions, research,
            projects and implementations before you build. Go beyond
            similarity — find the real gap.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartAnalysis}
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <span className="text-lg font-normal leading-none">
                +
              </span>

              Start New Analysis

              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-blue-50"
            >
              <Play
                className="h-4 w-4 fill-blue-500 text-blue-500"
              />

              How it works
            </button>
          </div>
        </div>

       {/* ================= EXACT RIGHT-SIDE VISUAL ================= */}
<div className="relative hidden h-[315px] w-[560px] lg:block">

  {/* Main soft blue circular glow */}
  <div
    className="
      absolute
      left-[125px]
      top-[-35px]
      h-[355px]
      w-[355px]
      rounded-full
      bg-[#e8f2ff]
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
      bg-[#eef6ff]
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
      border-white/80
      bg-white/25
      shadow-[0_20px_50px_rgba(59,130,246,0.08)]
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
      border-white/70
      bg-white/20
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
      border-[#dceafe]
      bg-white
      shadow-[0_10px_28px_rgba(30,64,175,0.10)]
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
        bg-[#eff6ff]
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[21px] w-[21px] text-[#1769e0]"
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

    <span className="text-[11px] font-semibold text-[#344b6b]">
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
      stroke="#73AEF7"
      strokeWidth="1.2"
    />

    <path
      d="M251 146 L258 150 L251 154"
      stroke="#73AEF7"
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
        border-[#dbeafe]
        bg-white
        px-[15px]
        shadow-[0_7px_18px_rgba(30,64,175,0.07)]
      "
    >
      <div
        className="
          flex
          h-[22px]
          w-[22px]
          items-center
          justify-center
          text-[#1769e0]
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

      <span className="text-[11px] font-semibold text-[#334155]">
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
        border-[#dbeafe]
        bg-white
        px-[15px]
        shadow-[0_7px_18px_rgba(30,64,175,0.07)]
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[20px] w-[20px] text-[#182b49]"
        fill="currentColor"
      >
        <path d="M12 .7a11.3 11.3 0 0 0-3.6 22c.57.1.78-.25.78-.55v-2.13c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.54-.29-5.2-1.27-5.2-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17A10.9 10.9 0 0 1 12 5.84c.97 0 1.94.13 2.85.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.12 3.02.73.8 1.18 1.82 1.18 3.07 0 4.4-2.67 5.36-5.22 5.64.41.35.78 1.04.78 2.1v3.12c0 .3.2.65.79.54A11.3 11.3 0 0 0 12 .7Z" />
      </svg>

      <span className="text-[11px] font-semibold text-[#334155]">
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
        border-[#dbeafe]
        bg-white
        px-[15px]
        shadow-[0_7px_18px_rgba(30,64,175,0.07)]
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
          bg-[#1769e0]
        "
      >
        <div className="h-[7px] w-[7px] rounded-[1px] bg-white" />
      </div>

      <span className="text-[11px] font-semibold text-[#334155]">
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
        border-[#dbeafe]
        bg-white
        shadow-[0_7px_18px_rgba(30,64,175,0.05)]
      "
    >
      <span className="text-[13px] tracking-[4px] text-[#60a5fa]">
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
      stroke="#79B3F6"
      strokeWidth="1.25"
    />

    {/* GitHub */}
    <path
      d="M408 113 C446 113 452 128 485 132"
      stroke="#79B3F6"
      strokeWidth="1.25"
    />

    {/* Projects */}
    <path
      d="M408 165 C445 165 450 150 485 148"
      stroke="#79B3F6"
      strokeWidth="1.25"
    />

    {/* Bottom dots */}
    <path
      d="M408 211 C448 211 451 175 485 163"
      stroke="#79B3F6"
      strokeWidth="1.25"
    />

    {/* Tiny endpoint dots */}
    <circle
      cx="485"
      cy="112"
      r="1.7"
      fill="#5EA2F3"
    />

    <circle
      cx="485"
      cy="132"
      r="1.7"
      fill="#5EA2F3"
    />

    <circle
      cx="485"
      cy="148"
      r="1.7"
      fill="#5EA2F3"
    />

    <circle
      cx="485"
      cy="163"
      r="1.7"
      fill="#5EA2F3"
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
      border-[#f4df99]
      bg-[#fff9e8]
      shadow-[0_12px_28px_rgba(245,158,11,0.09)]
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
        bg-white
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[20px] w-[20px] text-[#dfa000]"
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

    <span className="text-center text-[11px] font-bold leading-[1.35] text-[#334155]">
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