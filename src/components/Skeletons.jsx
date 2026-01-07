export function SkelHero() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 md:pt-8">
      <div className="skel rounded-[30px] h-[430px] md:h-[540px]" />
    </div>
  );
}

export function SkelRow() {
  return (
    <section className="mt-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="skel h-7 w-44 rounded-xl" />
        <div className="skel h-6 w-28 rounded-xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-4 flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-[170px] shrink-0">
            <div className="skel rounded-[26px] aspect-[3/4]" />
            <div className="mt-2 skel h-4 w-[92%] rounded-lg" />
            <div className="mt-2 skel h-3 w-[70%] rounded-lg" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkelGrid() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mt-10">
      <div className="skel h-7 w-56 rounded-xl" />
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i}>
            <div className="skel rounded-[26px] aspect-[3/4]" />
            <div className="mt-2 skel h-4 w-[92%] rounded-lg" />
            <div className="mt-2 skel h-3 w-[70%] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkelSearchGrid() {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i}>
          <div className="skel rounded-[26px] aspect-[3/4]" />
          <div className="mt-2 skel h-4 w-[92%] rounded-lg" />
          <div className="mt-2 skel h-3 w-[70%] rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkelDetail() {
  return (
    <div className="pb-10">
      <div className="skel w-full h-[420px] md:h-[520px] rounded-none" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-24 relative z-10">
        <div className="skel h-10 w-[60%] rounded-2xl" />
        <div className="mt-3 skel h-4 w-40 rounded-lg" />
        <div className="mt-6 flex gap-3">
          <div className="skel h-12 w-44 rounded-2xl" />
          <div className="skel h-12 w-36 rounded-2xl" />
        </div>
        <div className="mt-6 skel h-40 rounded-3xl" />
        <div className="mt-6 skel h-36 rounded-3xl" />
        <div className="mt-6 skel h-52 rounded-3xl" />
      </div>
    </div>
  );
}

export function SkelEpisodeList() {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className="skel h-7 w-44 rounded-xl" />
        <div className="skel h-6 w-32 rounded-xl" />
      </div>
      <div className="mt-4 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="skel h-10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SkelPlayerSlide() {
  return (
    <div className="h-screen w-full bg-black relative">
      <div className="absolute inset-0 skel rounded-none opacity-20" />

      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <div className="skel h-9 w-32 rounded-full" />
        <div className="flex gap-2">
          <div className="skel h-9 w-28 rounded-full" />
          <div className="skel h-9 w-12 rounded-full" />
        </div>
      </div>

      <div className="absolute right-4 bottom-28 flex flex-col gap-3">
        <div className="skel w-12 h-12 rounded-2xl" />
        <div className="skel w-12 h-12 rounded-2xl" />
        <div className="skel w-12 h-12 rounded-2xl" />
      </div>

      <div className="absolute left-4 right-20 bottom-24">
        <div className="skel h-8 w-[60%] rounded-xl" />
        <div className="mt-3 skel h-4 w-[72%] rounded-lg" />
        <div className="mt-6 skel h-2 w-full rounded-full" />
        <div className="mt-3 flex gap-2">
          <div className="skel h-8 w-20 rounded-full" />
          <div className="skel h-8 w-20 rounded-full" />
          <div className="skel h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}