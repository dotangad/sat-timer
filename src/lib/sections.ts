export const sections = [
  {
    name: "Reading Section",
    questions: 52,
    time: 65 * 60,
    pace: 60
    // buffer = time - questions * pace
  },
  {
    name: "Break",
    time: 10 * 60
  },
  {
    name: "Writing & Language Section",
    questions: 44,
    time: 35 * 60,
    pace: 40
  },
  {
    name: "Math Section (No Calculator)",
    questions: 20,
    time: 25 * 60,
    pace: 60
  },
  {
    name: "Break",
    time: 5 * 60
  },
  {
    name: "Math Section (Calculator)",
    questions: 38,
    time: 55 * 60,
    pace: 75
  }
].map((section) =>
  section.name === "Break"
    ? section
    : {
        ...section,
        buffer: section.time - section.questions * section.pace
      }
);

export const totalTime = sections.reduce((acc, curr) => acc + curr.time, 0);

export const currentSectionFromElapsed = (t: number) => {
  let endTime = 0,
    startTime = 0;

  for (let section of sections) {
    endTime += section.time;
    if (t < endTime && t > startTime) return section;
    startTime += section.time;
  }

  return null;
};

export const sectionStartTime = (currentSection: any) => {
  const sectionIdx = sections.indexOf(currentSection);
  return sections.reduce((acc, curr, i) => (i < sectionIdx ? acc + curr.time : acc), 0);
};

export const sectionEndTime = (currentSection: any) => {
  const sectionIdx = sections.indexOf(currentSection);
  return sections.reduce((acc, curr, i) => (i <= sectionIdx ? acc + curr.time : acc), 0);
};

export const showPace = (t: number) => {
  const section = currentSectionFromElapsed(t),
    sectionIdx = sections.indexOf(section);

  return null;
};
