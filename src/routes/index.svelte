<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import {
    currentSectionFromElapsed,
    sections,
    sectionStartTime,
    sectionEndTime,
    totalTime
  } from "../lib/sections";

  let timer = tweened(totalTime, { duration: 1000, easing: cubicOut });
  let paused = false;

  setInterval(() => {
    if (!paused && $timer > 0) $timer--;
  }, 1000);

  const doubleDig = (n: Number) => String(Math.floor(n)).padStart(2, "0");
  $: elapsed = totalTime - $timer;
  $: progress = 100 - ($timer / totalTime) * 100;
  $: hours = doubleDig($timer / (60 * 60));
  $: minutes = doubleDig(($timer % (60 * 60)) / 60);
  $: seconds = doubleDig($timer % 60);
  $: currentSection = currentSectionFromElapsed(elapsed);
  // $: console.log({ elapsed });
</script>

<div class="w-screen h-screen flex overflow-hidden">
  <div
    class="w-1/4 bg-slate-100/20 flex flex-col divide-y-2 divide-indigo-600/20 text-sm relative text-gray-900"
  >
    {#if $timer > 0}
      <div class="absolute top-0 left-0 w-[20px] bg-purple-600 z-50" style="height: {progress}%" />
    {/if}

    {#each sections as section}
      <div
        class="flex flex-col items-start justify-center relative"
        style="height: {(section.time / totalTime) * 100}%"
      >
        {#if section.questions}
          <div class="px-8 z-30">
            <div class="font-bold text-lg">{section.name}</div>
            <div class="text-gray-500 text-sm">
              {Math.floor(section.time / 60)} minutes, {section.questions} questions
            </div>
            <div class="text-gray-500 text-sm">{section.pace} seconds/question</div>
          </div>

          <div
            class="text-xs absolute bottom-0 bg-yellow-400/20 z-20 w-full flex items-center justify-center"
            style="height: {(section.buffer / section.time) * 100}%"
          >
            <!-- Buffer - {Math.floor(section.buffer / 60)} minutes -->
          </div>
        {:else}
          <div class="w-full text-xs text-center">
            {section.name} - {Math.floor(section.time / 60)} minutes
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="flex-1 p-6">
    <div class="w-full h-full flex flex-col justify-start items-stretch">
      <div>
        <img src="/sat.png" alt="SAT" class="h-20 w-auto block mx-auto" />
      </div>

      <div class="flex-1 flex flex-col items-center justify-center gap-y-10">
        {#if $timer > 0}
          <div class="text-[10rem] font-bold text-gray-700">
            {hours}:{minutes}:{seconds}
          </div>

          <div class="text-center">
            <div class="text-3xl font-bold text-gray-700">
              {currentSection?.name ?? ""}
            </div>
            <div class="text-xl font-bold text-gray-400">12/55 question / buffer</div>
          </div>
        {:else}
          <div class="text-[10rem] font-bold text-gray-700">Finished!</div>
        {/if}

        <div class="w-full max-w-xl h-[20px] rounded-full bg-slate-100 relative overflow-hidden">
          <div class="absolute top-0 left-0 bg-purple-600 h-full" style="width: {progress}%" />
        </div>

        <div class="flex items-stretch justify-center gap-x-3">
          <button
            class="p-3 bg-purple-600 text-white rounded-xl"
            on:click={() => {
              console.log("click");
              console.log({ time: sectionStartTime(currentSection) });
              $timer > 0
                ? timer.set(totalTime - sectionStartTime(currentSection))
                : timer.set(totalTime);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
              />
            </svg>
          </button>
          {#if $timer > 0}
            <button
              class="h-full px-6 flex items-center justify-center bg-purple-600 text-white text-sm uppercase font-bold tracking-wide rounded-xl hover:bg-purple-800 transition"
              on:click={() => (paused = !paused)}>{paused ? "Start" : "Pause"}</button
            >
          {:else}
            <button
              class="h-full px-6 flex items-center justify-center bg-purple-600 text-white text-sm uppercase font-bold tracking-wide rounded-xl hover:bg-purple-800 transition"
              on:click={() => ($timer = 0)}>Reset</button
            >
          {/if}
          <button
            class="p-3 bg-purple-600 text-white rounded-xl"
            on:click={() => ($timer > 0 ? timer.set(sectionEndTime(currentSection)) : null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="text-center">
        <a href="https://github.com/dotangad/sat-timer" class="text-gray-400 underline"
          >Star on Github</a
        >
      </div>
    </div>
  </div>
</div>
